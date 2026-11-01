import sqlite3InitModule from '@sqlite.org/sqlite-wasm';

self.onmessage = async (event: MessageEvent<unknown>) => {
  try {
    const sqlite = await sqlite3InitModule();
    const { capi, wasm } = sqlite;
    const db = new sqlite.oo1.DB(':memory:');
    const handle = db.pointer;
    if (handle === undefined) throw new Error('SQLite database is not open');
    try {
      if (event.data === 'busy') {
        self.postMessage({ busy: true });
        db.exec(
          'WITH RECURSIVE n(x) AS (VALUES(1) UNION ALL SELECT x+1 FROM n) SELECT sum(x) FROM n;',
        );
        self.postMessage({ unexpected: 'completed' });
        return;
      }
      db.exec(
        'CREATE TABLE allowed(id INTEGER); CREATE TABLE hidden(id INTEGER); INSERT INTO allowed VALUES(1);',
      );
      capi.sqlite3_set_authorizer(
        handle,
        (_context, action, table, column, database) => {
          if (action === capi.SQLITE_SELECT) return capi.SQLITE_OK;
          if (action === capi.SQLITE_FUNCTION && column === 'count')
            return capi.SQLITE_OK;
          if (
            action === capi.SQLITE_READ &&
            (database === 'main' || (database === 0 && column === '')) &&
            table === 'allowed'
          )
            return capi.SQLITE_OK;
          return capi.SQLITE_DENY;
        },
        0,
      );
      const prepare = (sql: string) =>
        wasm.scopedAllocCall(() => {
          const [text, bytes] = wasm.scopedAllocCString(sql, true);
          const output = wasm.scopedAlloc(8);
          const tail = wasm.scopedAlloc(8);
          wasm.pokePtr(output, 0);
          wasm.pokePtr(tail, 0);
          const rc = capi.sqlite3_prepare_v3(
            handle,
            text,
            bytes + 1,
            0,
            output,
            tail,
          );
          const stmt = wasm.peekPtr(output);
          try {
            const rest = wasm.cstrToJs(wasm.peekPtr(tail));
            const step = stmt ? capi.sqlite3_step(stmt) : null;
            const integer =
              step === capi.SQLITE_ROW
                ? capi.sqlite3_column_int64(stmt, 0).toString()
                : null;
            return { rc, rest, integer };
          } finally {
            if (stmt) capi.sqlite3_finalize(stmt);
          }
        });
      self.postMessage({
        version: sqlite.version.libVersion,
        int64: prepare('SELECT 9223372036854775807; -- tail'),
        multiple: prepare('SELECT 1; SELECT 2;'),
        allowed: prepare('SELECT id FROM allowed;'),
        hidden: prepare('SELECT id FROM hidden;'),
        write: prepare('DELETE FROM allowed;'),
        pragma: prepare('PRAGMA user_version;'),
        function: prepare("SELECT load_extension('anything');"),
        count: prepare('SELECT COUNT(*) FROM allowed;'),
        authCode: capi.SQLITE_AUTH,
      });
    } finally {
      db.close();
    }
  } catch (error) {
    self.postMessage({ error: String(error) });
  }
};
