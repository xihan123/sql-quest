import sqlite3InitModule from '@sqlite.org/sqlite-wasm';
import type { Sqlite3Static } from '@sqlite.org/sqlite-wasm';
import type { Cell, QueryResult } from '../contracts/generated/types.d.ts';
import { byteLength, limits } from '../content/checks.ts';
import { compileFixture } from '../content/fixture.ts';
import { EngineError, requireEngine } from './errors.ts';
import { executionLimits } from './protocol.ts';
import { validateResult } from './compare.ts';

// A positive allowlist: no extension, host, file, PRAGMA or stateful functions.
const functions = new Set(
  `abs sign round min max count sum total avg group_concat string_agg
  coalesce ifnull nullif iif if typeof length octet_length lower upper trim ltrim rtrim
  substr substring instr replace char unicode hex unhex quote printf format concat concat_ws
  like glob likelihood likely unlikely
  ceil ceiling floor trunc mod pow power sqrt exp ln log log10 log2
  acos acosh asin asinh atan atan2 atanh cos cosh sin sinh tan tanh degrees radians pi
  row_number rank dense_rank percent_rank cume_dist ntile lag lead first_value last_value nth_value`.split(
    /\s+/u,
  ),
);

export async function loadSqlite(): Promise<Sqlite3Static> {
  Object.assign(globalThis, {
    sqlite3ApiConfig: {
      disable: {
        vfs: {
          opfs: true,
          'opfs-vfs': true,
          'opfs-sahpool': true,
          'opfs-wl': true,
          kvvfs: true,
        },
      },
    },
  });
  const sqlite = await sqlite3InitModule();
  requireEngine(
    typeof sqlite.capi.sqlite3_prepare_v3 === 'function' &&
      typeof sqlite.capi.sqlite3_set_authorizer === 'function' &&
      typeof sqlite.capi.sqlite3_column_int64 === 'function',
    'engine-load',
    'SQLite 缺少必要的安全接口',
  );
  return sqlite;
}

export function executeQuery(
  sqlite: Sqlite3Static,
  fixture: unknown,
  readableTables: readonly string[],
  sql: string,
): QueryResult {
  requireEngine(
    Array.from(sql).length <= 20_000,
    'limit',
    'SQL 超过 20,000 字符',
  );
  requireEngine(
    !sql.includes('\0') && !/[\uD800-\uDFFF]/u.test(sql),
    'sql',
    'SQL 含 NUL 或不完整的 Unicode 字符',
  );
  const initialization = compileFixture(fixture);
  const { capi, wasm } = sqlite;
  const db = new sqlite.oo1.DB(':memory:');
  const handle = db.pointer;
  if (handle === undefined) throw new Error('SQLite database is not open');
  let denied = false;
  const check = (rc: number) => {
    if (rc === capi.SQLITE_OK) return;
    if (denied || rc === capi.SQLITE_AUTH)
      throw new EngineError(
        'forbidden',
        '只允许读取本关授权表及使用允许的纯计算函数',
      );
    if (rc === capi.SQLITE_TOOBIG || rc === capi.SQLITE_NOMEM)
      throw new EngineError('limit', '查询超过 SQLite 资源预算');
    throw new EngineError(
      'sql',
      `SQL 执行失败：${capi.sqlite3_errmsg(handle)}`.slice(0, 2000),
    );
  };
  try {
    capi.sqlite3_limit(handle, capi.SQLITE_LIMIT_LENGTH, limits.valueBytes);
    capi.sqlite3_limit(handle, capi.SQLITE_LIMIT_SQL_LENGTH, limits.sqlBytes);
    capi.sqlite3_limit(handle, capi.SQLITE_LIMIT_ATTACHED, 0);
    capi.sqlite3_limit(handle, capi.SQLITE_LIMIT_WORKER_THREADS, 0);
    db.exec('PRAGMA temp_store = MEMORY; PRAGMA trusted_schema = OFF;');
    db.exec(initialization);
    db.exec('PRAGMA query_only = ON;');
    capi.sqlite3_limit(
      handle,
      capi.SQLITE_LIMIT_COLUMN,
      executionLimits.columns,
    );
    capi.sqlite3_limit(handle, capi.SQLITE_LIMIT_SQL_LENGTH, 80_000);
    const readable = new Set(readableTables);
    check(
      capi.sqlite3_set_authorizer(
        handle,
        (_context, action, arg1, arg2, database) => {
          if (action === capi.SQLITE_SELECT || action === capi.SQLITE_RECURSIVE)
            return capi.SQLITE_OK;
          // SQLite reports COUNT(*)/column-free reads with a null database and empty column.
          // Only fixture tables exist: temp tables and ATTACH are never permitted.
          if (
            action === capi.SQLITE_READ &&
            (database === 'main' || (database === 0 && arg2 === '')) &&
            typeof arg1 === 'string' &&
            readable.has(arg1)
          )
            return capi.SQLITE_OK;
          if (
            action === capi.SQLITE_FUNCTION &&
            typeof arg2 === 'string' &&
            functions.has(arg2.toLowerCase())
          )
            return capi.SQLITE_OK;
          denied = true;
          return capi.SQLITE_DENY;
        },
        0,
      ),
    );
    return wasm.scopedAllocCall(() => {
      const [text, bytes] = wasm.scopedAllocCString(sql, true);
      // Eight bytes also fit a 64-bit pointer; the package's scopedAllocPt type is a typo.
      const output = wasm.scopedAlloc(8);
      const tail = wasm.scopedAlloc(8);
      let cursor = text;
      let statement = 0;
      try {
        while (cursor < text + bytes) {
          wasm.pokePtr(output, 0);
          wasm.pokePtr(tail, 0);
          const rc = capi.sqlite3_prepare_v3(
            handle,
            cursor,
            text + bytes - cursor + 1,
            capi.SQLITE_PREPARE_NO_VTAB,
            output,
            tail,
          );
          const nextStatement = wasm.peekPtr(output);
          if (rc !== capi.SQLITE_OK) {
            if (nextStatement) capi.sqlite3_finalize(nextStatement);
            check(rc);
          }
          if (nextStatement) {
            if (statement) {
              capi.sqlite3_finalize(nextStatement);
              throw new EngineError(
                'forbidden',
                '只允许一条查询，不能包含多条 SQL 语句',
              );
            }
            statement = nextStatement;
          }
          const next = wasm.peekPtr(tail);
          requireEngine(
            next > cursor && next <= text + bytes,
            'sql',
            'SQL 尾部无法完整解析',
          );
          cursor = next;
        }
        requireEngine(
          statement !== 0,
          'sql',
          '请输入一条查询，不能只有注释或空语句',
        );
        requireEngine(
          capi.sqlite3_stmt_readonly(statement) !== 0 &&
            capi.sqlite3_stmt_isexplain(statement) === 0,
          'forbidden',
          '只允许只读查询，不允许 EXPLAIN',
        );
        requireEngine(
          capi.sqlite3_bind_parameter_count(statement) === 0,
          'sql',
          '请在查询中填写值，不能使用未绑定参数',
        );
        const count = capi.sqlite3_column_count(statement);
        requireEngine(
          count > 0 && count <= executionLimits.columns,
          'limit',
          '结果列数须为 1 至 100',
        );
        const columns = Array.from({ length: count }, (_, i) =>
          capi.sqlite3_column_name(statement, i),
        );
        const rows: Cell[][] = [];
        let textBytes = 0;
        const decoder = new TextDecoder('utf-8', {
          fatal: true,
          ignoreBOM: true,
        });
        for (;;) {
          const rc = capi.sqlite3_step(statement);
          if (rc === capi.SQLITE_DONE) break;
          if (rc !== capi.SQLITE_ROW) check(rc);
          requireEngine(
            rows.length < executionLimits.rows,
            'limit',
            '完整结果超过 1,000 行',
          );
          const row: Cell[] = [];
          let rowBytes = 0;
          for (let i = 0; i < count; i++) {
            const type = capi.sqlite3_column_type(statement, i);
            let value: Cell;
            if (type === capi.SQLITE_NULL) value = null;
            else if (type === capi.SQLITE_INTEGER) {
              const integer = capi.sqlite3_column_int64(statement, i);
              requireEngine(
                integer >= BigInt(Number.MIN_SAFE_INTEGER) &&
                  integer <= BigInt(Number.MAX_SAFE_INTEGER),
                'limit',
                '整数超出 JavaScript 安全整数范围',
              );
              value = Number(integer);
            } else if (type === capi.SQLITE_FLOAT) {
              value = capi.sqlite3_column_double(statement, i);
              requireEngine(
                Number.isFinite(value) &&
                  (!Number.isInteger(value) || Number.isSafeInteger(value)),
                'limit',
                '数值不是有限安全数',
              );
            } else if (type === capi.SQLITE_TEXT) {
              // The convenience string binding stops at NUL. Read the exact UTF-8 bytes instead.
              const pointer: unknown = wasm.xCall(
                'sqlite3_column_text',
                statement,
                i,
              );
              requireEngine(
                typeof pointer === 'number' && pointer > 0,
                'internal',
                '无法读取 SQLite 文本',
              );
              const length = capi.sqlite3_column_bytes(statement, i);
              textBytes += length;
              requireEngine(
                length <= limits.valueBytes &&
                  textBytes <= limits.resultTextBytes,
                'limit',
                '结果文本超过单值或 4 MiB 总预算',
              );
              try {
                value = decoder.decode(
                  wasm.heap8u().subarray(pointer, pointer + length),
                );
              } catch {
                throw new EngineError('sql', '结果文本不是有效的 UTF-8');
              }
            } else throw new EngineError('sql', '结果包含不支持的 BLOB 值');
            rowBytes += typeof value === 'string' ? byteLength(value) : 8;
            requireEngine(
              rowBytes <= limits.valueBytes,
              'limit',
              '结果行超过 1 MiB',
            );
            row.push(value);
          }
          rows.push(row);
        }
        try {
          return validateResult({ columns, rows });
        } catch (error) {
          if (error instanceof EngineError) throw error;
          throw new EngineError(
            'sql',
            '查询结果不符合列名、类型或完整结果预算要求',
          );
        }
      } finally {
        if (statement) capi.sqlite3_finalize(statement);
      }
    });
  } catch (error) {
    if (error instanceof sqlite.SQLite3Error) check(error.resultCode);
    if (error instanceof sqlite.WasmAllocError)
      throw new EngineError('limit', 'SQLite 内存分配失败');
    throw error;
  } finally {
    db.close();
  }
}
