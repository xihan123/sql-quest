import sqlite3InitModule from '@sqlite.org/sqlite-wasm';
import { compileFixture } from '../../src/content/fixture.ts';
import { requireContent } from '../../src/content/checks.ts';

// Test-only authoring audit, not the application's future student execution entry.
self.onmessage = async (event: MessageEvent<unknown>) => {
  try {
    const request = event.data;
    requireContent(
      typeof request === 'object' &&
        request !== null &&
        'fixture' in request &&
        'queries' in request,
      'Invalid test request',
    );
    requireContent(
      Array.isArray(request.queries) &&
        request.queries.every((sql: unknown) => typeof sql === 'string'),
      'Invalid audit queries',
    );
    const sql = compileFixture(request.fixture);
    const sqlite = await sqlite3InitModule();
    const results: unknown[] = [];
    for (const query of request.queries) {
      const db = new sqlite.oo1.DB(':memory:');
      try {
        db.exec(sql);
        const columns: string[] = [];
        const rows = db.exec(query, {
          rowMode: 'array',
          returnValue: 'resultRows',
          columnNames: columns,
        });
        results.push({ columns, rows });
      } finally {
        db.close();
      }
    }
    self.postMessage({ results, version: sqlite.version.libVersion });
  } catch (error) {
    self.postMessage({
      error: error instanceof Error ? error.message : 'Audit failed',
    });
  }
};
