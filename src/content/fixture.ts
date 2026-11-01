import type {
  Cell,
  Fixture,
  FixtureColumn,
} from '../contracts/generated/types.d.ts';
import { validateFixtureStructure } from '../contracts/generated/validators.js';
import {
  byteLength,
  limits,
  requireContent,
  structure,
  unique,
} from './checks.ts';

export function validateRowBudget(row: readonly Cell[]) {
  let bytes = 0;
  for (const value of row) {
    if (typeof value === 'number') {
      requireContent(
        Number.isFinite(value) &&
          (!Number.isInteger(value) || Number.isSafeInteger(value)),
        '数值超出安全范围',
      );
    }
    if (typeof value === 'string') {
      requireContent(
        !/[\uD800-\uDFFF]/u.test(value),
        '文本含不完整的 Unicode 字符',
      );
      const size = byteLength(value);
      requireContent(size <= limits.valueBytes, '单值超出字节预算');
      bytes += size;
    } else bytes += 8;
  }
  requireContent(bytes <= limits.valueBytes, '单行超出字节预算');
}

export function validateFixture(value: unknown): Fixture {
  const fixture = structure(value, validateFixtureStructure, '夹具');
  unique(
    fixture.tables.map((table) => table.name),
    '表名',
  );
  const namespace = [
    ...fixture.tables.map((table) => table.name),
    ...(fixture.indexes ?? []).map((index) => index.name),
  ];
  unique(namespace, '表 / 索引名');
  requireContent(
    namespace.every((name) => !name.startsWith('sqlite_')),
    '不能使用 SQLite 保留对象名',
  );
  requireContent(
    fixture.tables.reduce((sum, table) => sum + table.rows.length, 0) <=
      limits.fixtureRows,
    '夹具总行数超限',
  );
  const primaryValues = new Map<string, Set<Cell>>();
  for (const table of fixture.tables) {
    unique(
      table.columns.map((column) => column.name),
      `${table.name} 字段名`,
    );
    requireContent(
      table.columns.filter((column) => column.primaryKey).length <= 1,
      '仅支持单列主键',
    );
    const keys = new Set<Cell>();
    primaryValues.set(table.name, keys);
    for (const row of table.rows) {
      requireContent(
        row.length === table.columns.length,
        `${table.name} 行宽错误`,
      );
      validateRowBudget(row);
      table.columns.forEach((column, i) => {
        const cell = row[i];
        requireContent(cell !== undefined, '缺少单元格');
        if (cell === null) {
          requireContent(
            column.nullable === true && !column.primaryKey,
            `${table.name}.${column.name} 不可为空`,
          );
        } else if (column.type === 'TEXT') {
          requireContent(typeof cell === 'string', `${column.name} 需要文本`);
        } else {
          requireContent(typeof cell === 'number', `${column.name} 需要数值`);
          requireContent(
            column.type !== 'INTEGER' || Number.isSafeInteger(cell),
            `${column.name} 需要安全整数`,
          );
          requireContent(
            column.minimum === undefined || cell >= column.minimum,
            `${column.name} 低于下界`,
          );
        }
        if (column.primaryKey) {
          requireContent(!keys.has(cell), `${table.name} 主键重复`);
          keys.add(cell);
        }
      });
    }
  }
  // Validate relationships after every table has been collected, including cycles.
  for (const table of fixture.tables) {
    table.columns.forEach((column, i) => {
      if (!column.references) return;
      const target = fixture.tables.find(
        (item) => item.name === column.references?.table,
      );
      const key = target?.columns.find(
        (item) => item.name === column.references?.column,
      );
      requireContent(
        key?.primaryKey && key.type === column.type,
        '外键须指向同类型单列主键',
      );
      const keys = primaryValues.get(column.references.table);
      for (const row of table.rows) {
        const cell = row[i];
        requireContent(
          cell === null || (cell !== undefined && keys?.has(cell)),
          '外键记录不存在',
        );
      }
    });
  }
  for (const index of fixture.indexes ?? []) {
    const table = fixture.tables.find((item) => item.name === index.table);
    requireContent(table, '索引引用未知表');
    unique(
      index.columns.map((column) => column.name),
      '索引字段',
    );
    requireContent(
      index.columns.every((column) =>
        table.columns.some((item) => item.name === column.name),
      ),
      '索引引用未知字段',
    );
  }
  return fixture;
}

const identifier = (name: string) => `"${name.replaceAll('"', '""')}"`;

function literal(value: Cell): string {
  if (value === null) return 'NULL';
  if (typeof value === 'number') return String(value);
  // SQL source cannot contain NUL. A UTF-8 hex literal preserves it as TEXT.
  if (value.includes('\0'))
    return `CAST(X'${Array.from(new TextEncoder().encode(value), (byte) => byte.toString(16).padStart(2, '0')).join('')}' AS TEXT)`;
  return `'${value.replaceAll("'", "''")}'`;
}

function columnSql(column: FixtureColumn): string {
  const name = identifier(column.name);
  let sql = `${name} ${column.type}`;
  if (!column.nullable || column.primaryKey) sql += ' NOT NULL';
  if (column.primaryKey) sql += ' PRIMARY KEY';
  if (column.type !== 'TEXT' && column.minimum !== undefined)
    sql += ` CHECK (${name} >= ${literal(column.minimum)})`;
  if (column.references)
    sql += ` REFERENCES ${identifier(column.references.table)} (${identifier(column.references.column)}) DEFERRABLE INITIALLY DEFERRED`;
  return sql;
}

// Only for a fresh internal database, never concatenated with student SQL.
// Deferred keys are checked at COMMIT, after all tables and rows exist.
export function compileFixture(value: unknown): string {
  const fixture = validateFixture(value);
  const statements: string[] = [];
  let bytes = 0;
  const append = (sql: string) => {
    bytes += byteLength(sql) + 1;
    requireContent(bytes <= limits.sqlBytes, '夹具生成 SQL 超出 1 MiB');
    statements.push(sql);
  };
  append('PRAGMA foreign_keys = ON;');
  append('BEGIN;');
  for (const table of fixture.tables)
    append(
      `CREATE TABLE ${identifier(table.name)} (${table.columns.map(columnSql).join(', ')});`,
    );
  for (const table of fixture.tables) {
    const columns = table.columns
      .map((column) => identifier(column.name))
      .join(', ');
    for (const row of table.rows)
      append(
        `INSERT INTO ${identifier(table.name)} (${columns}) VALUES (${row.map(literal).join(', ')});`,
      );
  }
  for (const index of fixture.indexes ?? [])
    append(
      `CREATE INDEX ${identifier(index.name)} ON ${identifier(index.table)} (${index.columns.map((column) => `${identifier(column.name)} ${column.direction}`).join(', ')});`,
    );
  append('COMMIT;');
  return `${statements.join('\n')}\n`;
}
