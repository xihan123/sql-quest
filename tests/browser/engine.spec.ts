import { expect, test } from '@playwright/test';
import { engineRequest } from '../engine-helpers.ts';
import { identity } from '../../src/engine/protocol.ts';
import type {} from './engine-harness.ts';

test.beforeEach(async ({ page }) => {
  await page.goto('tests/browser/engine-harness.html');
  await page.waitForFunction(() => Boolean(window.engine));
});

test('real worker executes equivalent SQL and all actual lesson cases; keeps run separate from submit', async ({
  page,
}) => {
  const base = await engineRequest();
  const preview = base.lesson.tests.find(
    (testCase) => testCase.fixtureId === base.lesson.previewFixtureId,
  );
  if (!preview) throw new Error('Missing preview');
  for (const sql of [
    ...base.lesson.referenceSolutions.map((item) => item.sql),
    ' /* SELECT is not required as a prefix */ SELECT b.title, b.price FROM books AS b ORDER BY b.id DESC; ; -- tail',
    'WITH b AS (SELECT title, price FROM books) SELECT title, price FROM b;',
  ]) {
    expect(
      await page.evaluate((request) => window.engine.run(request), {
        ...base,
        sql,
      }),
    ).toMatchObject({
      status: 'passed',
      caseId: preview.id,
      recordGeneration: 7,
      result: {
        columns: ['title', 'price'],
        rows: sql.includes('ORDER BY b.id DESC')
          ? [...preview.expected.rows].reverse()
          : preview.expected.rows,
      },
    });
  }
  for (const failure of base.lesson.expectedFailures)
    expect(
      await page.evaluate((request) => window.engine.run(request), {
        ...base,
        sql: failure.sql,
      }),
    ).toMatchObject({ status: 'mismatch', caseId: 'basic' });
  expect(
    await page.evaluate(
      (request) => window.engine.run(request),
      await engineRequest('SELECT COUNT(*) AS count FROM books;', 'run'),
    ),
  ).toMatchObject({
    status: 'executed',
    caseId: 'basic',
    result: { columns: ['count'], rows: [[3]] },
  });
});

test('read-only authorization rejects writes, hidden/schema reads, pragmas, functions and multiple statements', async ({
  page,
}) => {
  const base = await engineRequest('', 'run');
  base.fixtures[0]?.tables.push({
    name: 'hidden',
    description: 'Not readable',
    columns: [{ name: 'id', type: 'INTEGER', description: 'ID' }],
    rows: [[42]],
  });
  const forbidden = [
    'DELETE FROM books;',
    'UPDATE books SET price=0;',
    "INSERT INTO books VALUES(9,'x',0);",
    'CREATE TABLE x(a);',
    'DROP TABLE books;',
    'ALTER TABLE books ADD COLUMN x;',
    "ATTACH DATABASE ':memory:' AS other;",
    'DETACH DATABASE main;',
    'BEGIN;',
    'COMMIT;',
    'SAVEPOINT x;',
    'VACUUM;',
    'ANALYZE;',
    'REINDEX;',
    'PRAGMA table_info(books);',
    'PRAGMA query_only=OFF;',
    'SELECT * FROM hidden;',
    'SELECT COUNT(*) FROM hidden;',
    'SELECT * FROM sqlite_schema;',
    'SELECT * FROM sqlite_master;',
    "SELECT * FROM pragma_table_info('books');",
    "SELECT load_extension('x');",
    "SELECT readfile('x');",
    "SELECT writefile('x','y');",
    'SELECT random();',
    'SELECT changes();',
    'SELECT 1; SELECT 2;',
    'SELECT 1; DELETE FROM books;',
    'SELECT 1; /* comment */ VALUES(2);',
    'EXPLAIN SELECT title FROM books;',
  ];
  for (const sql of forbidden) {
    const outcome = await page.evaluate(
      (request) => window.engine.run(request),
      { ...base, sql },
    );
    expect(outcome.status, sql).toBe('error');
  }
  for (const sql of [
    '-- only comment',
    '; ;',
    'SELECT ?;',
    'SELECT 1; nonsense',
  ])
    expect(
      (
        await page.evaluate((request) => window.engine.run(request), {
          ...base,
          sql,
        })
      ).status,
      sql,
    ).toBe('error');
  expect(
    await page.evaluate((request) => window.engine.run(request), {
      ...base,
      sql: "SELECT ';DELETE FROM books;' AS text, (SELECT COUNT(*) FROM books) AS count; /* trailing ; */",
    }),
  ).toMatchObject({
    status: 'executed',
    result: { rows: [[';DELETE FROM books;', 3]] },
  });
});

test('real SQLite preserves NULL/text/NUL, integer boundaries and rejects unsupported or over-budget results', async ({
  page,
}) => {
  const base = await engineRequest('', 'run');
  const run = (sql: string) =>
    page.evaluate((request) => window.engine.run(request), { ...base, sql });
  expect(
    await run(
      "SELECT NULL AS n, '' AS empty, 'NULL' AS text, char(97,0,98) AS nul, 9007199254740991 AS high, -9007199254740991 AS low, 1.25 AS real;",
    ),
  ).toMatchObject({
    status: 'executed',
    result: {
      rows: [
        [
          null,
          '',
          'NULL',
          'a\0b',
          Number.MAX_SAFE_INTEGER,
          Number.MIN_SAFE_INTEGER,
          1.25,
        ],
      ],
    },
  });
  expect(await run('SELECT title, price FROM books WHERE 0;')).toMatchObject({
    status: 'executed',
    result: { columns: ['title', 'price'], rows: [] },
  });
  for (const sql of [
    'SELECT 9223372036854775807;',
    'SELECT -9223372036854775808;',
    'SELECT 9007199254740992;',
    'SELECT 1e999;',
    "SELECT X'00';",
    "SELECT CAST(X'ff' AS TEXT);",
    'WITH RECURSIVE n(x) AS (VALUES(1) UNION ALL SELECT x+1 FROM n WHERE x<1001) SELECT x FROM n;',
    `SELECT ${Array.from({ length: 101 }, (_, i) => `${i} AS c${i}`).join(',')};`,
    "SELECT printf('%.*c',1048577,'x');",
    "SELECT printf('%.*c',600000,'x'),printf('%.*c',600000,'y');",
    "WITH RECURSIVE n(x) AS (VALUES(1) UNION ALL SELECT x+1 FROM n WHERE x<5) SELECT printf('%.*c',900000,'x') FROM n;",
  ])
    expect((await run(sql)).status, sql).toBe('error');
  expect(await run('SELECT COUNT(*) AS count FROM books;')).toMatchObject({
    status: 'executed',
    result: { rows: [[3]] },
  });
});

test('ordered, tolerant and non-greedy comparisons run against real SQLite results', async ({
  page,
}) => {
  const request = await engineRequest(
    'SELECT 1 AS value UNION ALL SELECT 0;',
    'submit',
  );
  request.lesson.tests.forEach((item) => {
    item.expected = { columns: ['value'], rows: [[0], [2]] };
  });
  request.lesson.comparison = {
    rowOrder: 'unordered',
    numbers: 'tolerant',
    columnNames: 'exact',
    tolerances: [{ column: 0, absTolerance: 1, relTolerance: 0 }],
  };
  expect(
    (await page.evaluate((value) => window.engine.run(value), request)).status,
  ).toBe('passed');
  request.lesson.comparison.rowOrder = 'ordered';
  expect(
    (await page.evaluate((value) => window.engine.run(value), request)).status,
  ).toBe('mismatch');
});

test('real worker validates the execution closure and only runs explicitly dispatched cases in order', async ({
  page,
}) => {
  const request = await engineRequest();
  const send = (value: unknown) =>
    page.evaluate((value) => window.engine.rawSend(value), value);
  const start = () => page.evaluate(() => window.engine.rawStart());
  const wait = (length: number) =>
    page.waitForFunction(
      (length) => window.engine.rawMessages.length >= length,
      length,
    );
  const runCase = (index: number) => ({
    ...identity(request),
    type: 'run-case',
    caseId: request.lesson.tests[index]?.id,
    caseIndex: index,
  });
  await start();
  await send(request);
  await wait(1);
  expect(await page.evaluate(() => window.engine.rawMessages)).toEqual([
    { ...identity(request), type: 'ready' },
  ]);
  await send(request);
  await send(runCase(0));
  await wait(2);
  await send(runCase(0));
  await send({ ...runCase(1), contentToken: 'stale' });
  await send(runCase(1));
  await wait(3);
  expect(await page.evaluate(() => window.engine.rawMessages)).toMatchObject([
    { type: 'ready' },
    { type: 'case-result', caseId: 'basic', outcome: 'passed' },
    { type: 'case-result', caseId: 'empty', outcome: 'passed' },
  ]);
  for (const bad of [runCase(1), { ...runCase(0), extra: true }]) {
    await start();
    await send(request);
    await wait(1);
    await send(bad);
    await wait(2);
    expect(
      await page.evaluate(() => window.engine.rawMessages[1]),
    ).toMatchObject({ type: 'error', phase: 'case', caseId: 'basic' });
  }
  await start();
  await send({ ...request, fixtures: request.fixtures.slice(0, 1) });
  await wait(1);
  expect(await page.evaluate(() => window.engine.rawMessages[0])).toMatchObject(
    { type: 'error', phase: 'prepare', code: 'invalid-request' },
  );
  await start();
  await send({ nonsense: true });
  await wait(1);
  expect(
    await page.evaluate(() => window.engine.rawMessages[0]),
  ).toHaveProperty('workerError');
  await page.evaluate(() => window.engine.rawStop());
});

test('engine-load failure is explicit and a subsequent real worker recovers', async ({
  page,
}) => {
  await page.route('**/*.wasm', (route) => route.abort());
  const request = await engineRequest();
  expect(
    await page.evaluate((value) => window.engine.run(value), request),
  ).toMatchObject({ status: 'error', code: 'engine-load' });
  await page.unroute('**/*.wasm');
  expect(
    (await page.evaluate((value) => window.engine.run(value), request)).status,
  ).toBe('passed');
});

test('production module Worker and WASM load under a subpath without unsafe-eval, content fetches or OPFS', async ({
  page,
}) => {
  const errors: string[] = [];
  const resources: string[] = [];
  page.on('pageerror', (error) => errors.push(error.message));
  page.on('request', (request) => resources.push(request.url()));
  await page.goto('engine-build/tests/browser/engine-harness.html');
  await page.waitForFunction(() => Boolean(window.engine));
  expect(
    (
      await page.evaluate(
        (value) => window.engine.run(value),
        await engineRequest(),
      )
    ).status,
  ).toBe('passed');
  expect(resources.some((url) => url.endsWith('.wasm'))).toBe(true);
  expect(resources.some((url) => /opfs|content\/|api\//u.test(url))).toBe(
    false,
  );
  expect(errors).toEqual([]);
});

test('real CPU-bound cases each get 3 seconds, not one shared deadline; timeout and cancel recover', async ({
  page,
}) => {
  test.setTimeout(60_000);
  const request = await engineRequest();
  const query = (n: number) =>
    `WITH RECURSIVE n(x) AS (VALUES(1) UNION ALL SELECT x+1 FROM n WHERE x<${n}) SELECT sum(x) AS total FROM n;`;
  let count = 250_000;
  // Calibrate actual SQLite work to this machine; no sleep, fake clock or mock result.
  for (let attempt = 0; attempt < 6; attempt++) {
    const probe = await engineRequest(query(count), 'run');
    expect(
      (await page.evaluate((value) => window.engine.run(value), probe)).status,
    ).toBe('executed');
    const elapsed = await page.evaluate(() => window.engine.durations[0]);
    if (!elapsed) throw new Error('Missing real case timing');
    if (elapsed >= 1700 && elapsed < 2500) break;
    count = Math.max(1, Math.floor((count * 1950) / elapsed));
  }
  request.sql = query(count);
  request.lesson.tests.forEach((item) => {
    item.expected = { columns: ['total'], rows: [[(count * (count + 1)) / 2]] };
  });
  const outcome = await page.evaluate(
    (value) => window.engine.run(value),
    request,
  );
  const durations = await page.evaluate(() => window.engine.durations);
  expect(outcome.status, JSON.stringify(durations)).toBe('passed');
  expect(durations).toHaveLength(2);
  expect(durations.every((ms) => ms < 3000)).toBe(true);
  expect(durations.reduce((a, b) => a + b, 0)).toBeGreaterThan(3000);
  const infinite = await engineRequest(
    'WITH RECURSIVE n(x) AS (VALUES(1) UNION ALL SELECT x+1 FROM n) SELECT sum(x) FROM n;',
    'run',
  );
  expect(
    await page.evaluate((value) => window.engine.run(value), infinite),
  ).toMatchObject({ status: 'timeout', phase: 'case' });
  const laterTimeout = await engineRequest(
    'WITH RECURSIVE n(x) AS (VALUES(1) UNION ALL SELECT x+1 FROM n WHERE (SELECT COUNT(*) FROM books)=0) SELECT sum(x) AS total FROM n;',
  );
  laterTimeout.lesson.tests.forEach((item) => {
    item.expected = { columns: ['total'], rows: [[1]] };
  });
  expect(
    await page.evaluate((value) => window.engine.run(value), laterTimeout),
  ).toMatchObject({ status: 'timeout', phase: 'case' });
  expect(await page.evaluate(() => window.engine.durations.length)).toBe(2);
  expect(
    (
      await page.evaluate(
        (value) => window.engine.run(value),
        await engineRequest(),
      )
    ).status,
  ).toBe('passed');
  const pending = page.evaluate((value) => window.engine.run(value), infinite);
  await page.waitForFunction(() => window.engine.state().status === 'running');
  await page.evaluate(() => window.engine.cancel());
  expect((await pending).status).toBe('cancelled');
  expect(
    (
      await page.evaluate(
        (value) => window.engine.run(value),
        await engineRequest(),
      )
    ).status,
  ).toBe('passed');
  console.log(
    'Real per-case durations (ms):',
    durations.map(Math.round).join(', '),
  );
});
