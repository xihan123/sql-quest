import assert from 'node:assert/strict';
import { test } from 'node:test';
import { compareResults, validateResult } from '../src/engine/compare.ts';
import { createExecutionRequest } from '../src/engine/client.ts';
import { validatePrepare } from '../src/engine/protocol.ts';
import { engineRequest } from './engine-helpers.ts';

const exact = { rowOrder: 'unordered', columnNames: 'exact', numbers: 'exact' };
const result = (rows: unknown[]) => ({ columns: ['value'], rows });

test('comparison preserves column metadata, types, NULL, duplicates and ordering', () => {
  assert.equal(compareResults(result([]), result([]), exact), true);
  assert.equal(
    compareResults(result([]), { columns: ['other'], rows: [] }, exact),
    false,
  );
  assert.equal(
    compareResults(result([[1], [1], [2]]), result([[2], [1], [1]]), exact),
    true,
  );
  assert.equal(
    compareResults(result([[1], [2], [2]]), result([[2], [1], [1]]), exact),
    false,
  );
  for (const value of ['', 'NULL', 0, '0', ' ', 'a\0b']) {
    assert.equal(
      compareResults(result([[null]]), result([[value]]), exact),
      false,
    );
  }
  assert.equal(compareResults(result([['1']]), result([[1]]), exact), false);
  assert.equal(compareResults(result([['x ']]), result([['x']]), exact), false);
  assert.equal(
    compareResults(result([[2], [1]]), result([[1], [2]]), {
      ...exact,
      rowOrder: 'ordered',
    }),
    false,
  );
  assert.equal(
    compareResults(result([[1.00001]]), result([[1]]), exact),
    false,
  );
  assert.equal(
    compareResults(
      { columns: ['a', 'b'], rows: [] },
      { columns: ['b', 'a'], rows: [] },
      exact,
    ),
    false,
  );
});

test('per-column absolute/relative tolerances use non-greedy one-to-one matching', () => {
  const tolerant = {
    ...exact,
    numbers: 'tolerant',
    tolerances: [{ column: 0, absTolerance: 1, relTolerance: 0 }],
  };
  assert.equal(
    compareResults(result([[1], [0]]), result([[0], [2]]), tolerant),
    true,
  );
  assert.equal(
    compareResults(result([[0], [0]]), result([[0], [2]]), tolerant),
    false,
  );
  assert.equal(
    compareResults(result([[null]]), result([[0]]), tolerant),
    false,
  );
  assert.equal(compareResults(result([['1']]), result([[1]]), tolerant), false);
  const expected = { columns: ['average', 'count'], rows: [[100, 2]] };
  assert.equal(
    compareResults({ ...expected, rows: [[101, 2]] }, expected, {
      ...tolerant,
      tolerances: [{ column: 0, absTolerance: 0, relTolerance: 0.01 }],
    }),
    true,
  );
  assert.equal(
    compareResults({ ...expected, rows: [[100, 2.01]] }, expected, tolerant),
    false,
  );
  assert.throws(() =>
    compareResults(result([[1]]), result([[1]]), {
      ...tolerant,
      tolerances: [{ column: 1, absTolerance: 1, relTolerance: 0 }],
    }),
  );
  // Duplicate values still consume distinct expected rows, including at the result budget.
  assert.equal(
    compareResults(
      result(Array.from({ length: 1000 }, () => [1])),
      result(Array.from({ length: 1000 }, () => [1])),
      tolerant,
    ),
    true,
  );
});

test('result validation rejects unsafe numbers, invalid text, rows and budgets', () => {
  for (const value of [
    Infinity,
    NaN,
    Number.MAX_SAFE_INTEGER + 1,
    new Uint8Array([1]),
    '\uD800',
  ])
    assert.throws(() => validateResult(result([[value]])));
  validateResult(
    result([
      [Number.MIN_SAFE_INTEGER],
      [Number.MAX_SAFE_INTEGER],
      [null],
      ['a\0b'],
    ]),
  );
  assert.throws(() => validateResult(result([[1, 2]])));
  assert.throws(() =>
    validateResult(result(Array.from({ length: 1001 }, () => [1]))),
  );
  assert.throws(() =>
    validateResult(
      result(Array.from({ length: 5 }, () => ['a'.repeat(900_000)])),
    ),
  );
});

test('request closure is exact and immutable, run only carries preview fixtures', async () => {
  const original = await engineRequest();
  const frozen = validatePrepare(structuredClone(original));
  assert.ok(Object.isFrozen(frozen.lesson.tests[0]?.expected.rows));
  assert.throws(() =>
    validatePrepare({
      ...original,
      lessonRevision: original.lessonRevision + 1,
    }),
  );
  assert.throws(() => validatePrepare({ ...original, recordGeneration: 1 }));
  assert.throws(() =>
    validatePrepare({ ...original, fixtures: original.fixtures.slice(0, 1) }),
  );
  assert.throws(() =>
    validatePrepare({
      ...original,
      fixtures: [...original.fixtures, original.fixtures[0]],
    }),
  );
  assert.throws(() =>
    validatePrepare({ ...original, sql: 'SELECT 1;\0SELECT 2;' }),
  );
  assert.throws(() =>
    validatePrepare({ ...original, sql: ' '.repeat(20_000) + '1' }),
  );
  const run = await engineRequest('SELECT title, price FROM books;', 'run');
  assert.equal(validatePrepare(run).fixtures.length, 1);
  assert.throws(() => validatePrepare({ ...run, fixtures: original.fixtures }));
  const incompatible = structuredClone(original);
  const table = incompatible.fixtures[1]?.tables[0];
  if (!table) throw new Error('Missing table');
  table.columns.reverse();
  assert.throws(() => validatePrepare(incompatible));
  const { sourceContent } = await import('./content-helpers.ts');
  const { validateContent } = await import('../src/content/semantics.ts');
  const { course, documents } = await sourceContent();
  const snapshot = {
    ...validateContent(course, documents),
    contentToken: 'snapshot',
    rootUrl: 'http://localhost/content/course.json',
  };
  const request = createExecutionRequest(snapshot, {
    themeId: original.themeId,
    lessonId: original.lessonId,
    sql: original.sql,
    inputMode: 'text',
    mode: 'run',
  });
  const lesson = snapshot.lessons[0];
  if (!lesson) throw new Error('Missing lesson');
  lesson.starterSql = 'changed';
  assert.notEqual(request.lesson.starterSql, 'changed');
  assert.equal(request.fixtures.length, 1);
  assert.equal('rootUrl' in request, false);
});
