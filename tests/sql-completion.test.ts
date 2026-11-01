import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { test } from 'node:test';
import { EditorState } from '@codemirror/state';
import { CompletionContext } from '@codemirror/autocomplete';
import { sql } from '@codemirror/lang-sql';
import { validateFixture } from '../src/content/fixture.ts';
import {
  createSqlCompletionSource,
  sqliteDialect,
} from '../src/components/sqlCompletion.ts';

const fixture = validateFixture(
  JSON.parse(
    await readFile(new URL('fixtures/fixture.json', import.meta.url), 'utf8'),
  ),
);
fixture.tables.push(
  {
    name: 'authors',
    description: 'Authors',
    columns: [
      { name: 'id', type: 'INTEGER', description: 'Author ID' },
      { name: 'author_name', type: 'TEXT', description: 'Author name' },
    ],
    rows: [[1, 'data_only_marker']],
  },
  {
    name: 'private_table',
    description: 'Private',
    columns: [
      { name: 'private_column', type: 'TEXT', description: 'Must not appear' },
    ],
    rows: [],
  },
);
const source = createSqlCompletionSource(['books', 'authors'], fixture);
async function complete(marked: string, explicit = true) {
  const pos = marked.indexOf('|');
  assert.notEqual(pos, -1);
  const state = EditorState.create({
    doc: marked.replace('|', ''),
    selection: { anchor: pos },
    extensions: [sql({ dialect: sqliteDialect })],
  });
  return source(new CompletionContext(state, pos, explicit));
}
const fields = async (marked: string) =>
  (await complete(marked))?.options.filter(
    (item) => item.type === 'property',
  ) ?? [];

test('only readable preview schema and uppercase read-only keywords, never data or hidden tables', async () => {
  const result = await complete('|');
  assert.ok(result);
  const serialized = JSON.stringify(result.options);
  for (const forbidden of [
    'private_table',
    'private_column',
    'data_only_marker',
    '数据库入门',
    'INSERT',
    'UPDATE',
    'DELETE',
    'DROP',
    'PRAGMA',
    'ATTACH',
    'EXPLAIN',
    'SHELL',
  ])
    assert.ok(!serialized.includes(forbidden), forbidden);
  for (const keyword of [
    'SELECT',
    'FROM',
    'JOIN',
    'GROUP',
    'BY',
    'ORDER',
    'WHERE',
  ])
    assert.ok(
      result.options.some(
        (item) => item.type === 'keyword' && item.label === keyword,
      ),
    );
  const title = result.options.find((item) => item.label === 'title');
  assert.equal(title?.info, '图书名称');
  assert.match(title?.detail ?? '', /books.*TEXT.*尚未绑定/);
  const empty = createSqlCompletionSource([], fixture);
  const state = EditorState.create({
    extensions: [sql({ dialect: sqliteDialect })],
  });
  assert.ok(
    (await empty(new CompletionContext(state, 0, true)))?.options.every(
      (item) => item.type === 'keyword',
    ),
  );
});

test('single table and JOIN scopes resolve before/after cursor, with/without AS and case-insensitive qualifiers', async () => {
  for (const marked of [
    'SELECT b.t| FROM books AS b;',
    'SELECT B.t| FROM BOOKS b;',
    'SELECT b.t| FROM books /* alias */ AS b JOIN authors a ON b.id = a.id;',
    'SELECT b.t| FROM books b LEFT JOIN authors AS a ON b.id = a.id;',
    'SELECT b.t| FROM books b, authors a;',
    'SELECT b.t| FROM books AS "b";',
    'SELECT `b`.t| FROM books `b`;',
    'SELECT [b].t| FROM books [b];',
    'SELECT books.t| FROM books;',
    'SELECT id FROM authors; SELECT b.t| FROM books b;',
    'SELECT b.t| FROM books b; SELECT id FROM authors;',
  ]) {
    const options = await fields(marked);
    assert.deepEqual(
      options.map((item) => item.label),
      ['id', 'title', 'price'],
      marked,
    );
    assert.ok(options.every((item) => item.detail?.includes('books')));
  }
  assert.ok(
    (await fields('SELECT | FROM books')).every((item) =>
      item.detail?.includes('books'),
    ),
  );
  assert.ok(
    (
      await fields('SELECT a.| FROM books b JOIN authors a ON a.id = b.id')
    ).every((item) => item.detail?.includes('authors')),
  );
});

test('duplicate columns insert/display unambiguous aliases, including self joins', async () => {
  const options = await fields(
    'SELECT i| FROM books b JOIN authors AS a ON b.id = a.id',
  );
  assert.deepEqual(
    options
      .filter((item) => item.label === 'id')
      .map((item) => item.displayLabel),
    ['b.id', 'a.id'],
  );
  assert.equal(
    options.find((item) => item.label === 'title')?.displayLabel,
    'title',
  );
  assert.deepEqual(
    (await fields('SELECT t| FROM books b JOIN books c ON b.id = c.id'))
      .filter((item) => item.label === 'title')
      .map((item) => item.displayLabel),
    ['b.title', 'c.title'],
  );
});

test('unresolved qualifiers and complex scopes never borrow bindings', async () => {
  for (const marked of [
    'SELECT mystery.| FROM books b',
    'SELECT private_table.|',
    'SELECT books.| FROM books b',
    'SELECT b.| FROM authors b',
    'SELECT b.| FROM books b JOIN authors b ON b.id = b.id',
    'SELECT b.| FROM (SELECT id FROM books b) q',
    'WITH b AS (SELECT id FROM books) SELECT b.| FROM b',
    'SELECT | FROM books b WHERE EXISTS (SELECT id FROM authors a)',
    'SELECT | FROM books UNION SELECT id FROM authors',
    'SELECT main.books.| FROM books',
    'SELECT | FROM books INDEXED BY books_price',
  ]) {
    const options = await fields(marked);
    if (marked === 'SELECT b.| FROM authors b')
      assert.ok(options.every((item) => item.detail?.includes('authors')));
    else assert.deepEqual(options, [], marked);
  }
  assert.deepEqual(
    await fields('SELECT b.id FROM books b; SELECT b.| FROM authors a'),
    [],
  );
});

test('strings/comments/parameters/numbers suppress completion, including unfinished tokens', async () => {
  for (const marked of [
    "SELECT 'ti|tle' FROM books",
    "SELECT 'ti|",
    "SELECT 'it''s ti|'",
    'SELECT -- ti|\nFROM books',
    'SELECT /* ti| */ title FROM books',
    'SELECT /* ti|',
    'SELECT 12|',
    'SELECT :ti|',
  ])
    assert.equal(await complete(marked), null, marked);
  assert.equal(await complete('SELECT |', false), null);
  assert.ok(await complete('SELECT books.|', false));
});

test('middle identifiers keep a prefix filtering range and invalidate it after any change', async () => {
  for (const marked of [
    'SELECT b.t|itle FROM books AS b;',
    'SELECT b."t|itle" FROM books AS b;',
    'SELECT b.|title FROM books AS b;',
  ]) {
    const result = await complete(marked);
    assert.ok(result);
    assert.equal(result.to, marked.indexOf('|'));
    assert.equal(result.from, marked.indexOf('.') + 1);
    assert.equal(result.validFor, undefined);
    assert.ok(result.map);
  }
  const from = await complete('SELECT title FROM bo|oks');
  assert.ok(from?.options.some((item) => item.label === 'books'));
  assert.ok(from?.options.every((item) => item.type !== 'property'));
});
