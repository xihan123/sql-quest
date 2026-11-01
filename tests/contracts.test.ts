import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';
import type {
  BackupPart,
  Flowchart,
  LearningRecord,
  PrepareRequest,
  SqlPuzzle,
  WorkerMessage,
} from '../src/contracts/generated/types.d.ts';
import {
  validateBackupPartStructure,
  validateComparisonStructure,
  validateContentPathStructure,
  validateCourseStructure,
  validateFixtureColumnStructure,
  validateFixtureStructure,
  validateFlowchartStructure,
  validateLearningRecordStructure,
  validateLessonStructure,
  validatePuzzleDraftStructure,
  validateQueryResultStructure,
  validateRecordMetadataStructure,
  validateSqlPuzzleStructure,
  validateWorkerMessageStructure,
} from '../src/contracts/generated/validators.js';
import type { StructuralValidator } from '../src/contracts/generated/validators.js';

async function sample<T>(name: string, validate: StructuralValidator<T>) {
  const value: unknown = JSON.parse(
    await readFile(new URL(`fixtures/${name}.json`, import.meta.url), 'utf8'),
  );
  assert.ok(validate(value), JSON.stringify(validate.errors));
  return value;
}

const course = await sample('course', validateCourseStructure);
const lesson = await sample('lesson', validateLessonStructure);
const fixture = await sample('fixture', validateFixtureStructure);
const flowchart: Flowchart = {
  exampleSql: 'SELECT title, price FROM books;',
  nodes: [
    { id: 'source', label: 'FROM', description: 'Read books.' },
    {
      id: 'projection',
      label: 'SELECT',
      description: 'Select title and price.',
    },
  ],
  edges: [{ from: 'source', to: 'projection' }],
};
const sqlPuzzle: SqlPuzzle = {
  cards: [
    { id: 'projection', sql: 'SELECT title, price' },
    { id: 'source', sql: 'FROM books;' },
  ],
  solutionOrder: ['projection', 'source'],
};
const record: LearningRecord = {
  schemaVersion: 1,
  courseId: 'sql-quest',
  themeId: 'library',
  lessonId: 'book-list',
  revision: 1,
  draftSql: '',
  inputMode: 'text',
  passed: false,
  viewedHintIds: [],
  reviewMarked: false,
};
const backup: BackupPart = {
  schemaVersion: 1,
  exportedAt: '2026-11-01T00:00:00.000Z',
  backupId: 'backup-test',
  partIndex: 1,
  partCount: 1,
  records: [record],
};
const identity = {
  schemaVersion: 1,
  requestId: 'request-test',
  contentToken: 'content-test',
  rootRevision: 1,
  courseId: 'sql-quest',
  themeId: 'library',
  lessonId: 'book-list',
  lessonRevision: 1,
} satisfies Omit<
  PrepareRequest,
  'type' | 'mode' | 'inputMode' | 'sql' | 'lesson' | 'fixtures'
>;

function without(value: object, key: string) {
  return Object.fromEntries(
    Object.entries(value).filter(([name]) => name !== key),
  );
}

test('design examples and optional teaching aids have valid structures', () => {
  assert.ok(validateCourseStructure(course));
  assert.ok(validateLessonStructure(lesson));
  assert.ok(validateFixtureStructure(fixture));
  assert.ok(validateLessonStructure({ ...lesson, flowchart, sqlPuzzle }));
  assert.ok(validateLearningRecordStructure(record));
  assert.ok(validateBackupPartStructure(backup));
});

test('required fields, unknown fields, versions and mode enums fail closed', () => {
  for (const value of [
    without(lesson, 'tests'),
    without(lesson, 'readableTables'),
    { ...lesson, schemaVersion: 2 },
    { ...lesson, revision: 0 },
    { ...lesson, revision: 1.5 },
    { ...lesson, revision: Number.MAX_SAFE_INTEGER + 1 },
    { ...lesson, revision: '1' },
    { ...lesson, mode: 'run' },
    { ...lesson, dialect: 'postgres' },
    { ...lesson, readableTables: ['books', 'books'] },
    { ...lesson, previewRows: [] },
    { ...lesson, statement: '   ' },
    { ...lesson, hints: [...lesson.hints].reverse() },
    { ...lesson, hints: lesson.hints.slice(1) },
  ]) {
    assert.equal(validateLessonStructure(value), false);
    assert.ok(validateLessonStructure.errors?.length);
  }
  assert.equal(validateCourseStructure({ ...course, themes: [] }), false);
  assert.equal(validateCourseStructure({ ...course, schemaVersion: 2 }), false);
  assert.equal(
    validateFixtureStructure({ ...fixture, initSql: 'DROP TABLE books;' }),
    false,
  );
  assert.equal(validateFixtureStructure({ ...fixture, tables: [] }), false);
});

test('content paths allow nested JSON only, including no trailing line break', () => {
  for (const path of [
    'themes/library/book-list.json',
    'releases/r1/a_b.json',
  ]) {
    assert.ok(validateContentPathStructure(path));
  }
  for (const path of [
    '../a.json',
    './a.json',
    'a/../b.json',
    '/a.json',
    '//host/a.json',
    'https://host/a.json',
    'a\\b.json',
    '%2e%2e/a.json',
    'a%2fb.json',
    'a.json?x=1',
    'a.json#x',
    'A.json',
    'a//b.json',
    'a.json\n',
    'a.json\r\n',
    'a.json\0',
    '',
    'a.txt',
  ]) {
    assert.equal(validateContentPathStructure(path), false, path);
  }
  const theme = course.themes[0];
  assert.ok(theme);
  const chapter = theme.chapters[0];
  assert.ok(chapter);
  const index = chapter.lessons[0];
  assert.ok(index);
  const closedCourse = {
    ...course,
    themes: [
      {
        ...theme,
        chapters: [{ ...chapter, lessons: [{ ...index, path: null }] }],
      },
    ],
  };
  assert.ok(validateCourseStructure(closedCourse));
  assert.equal(
    validateCourseStructure({
      ...course,
      fixtures: [{ id: 'f-v1', path: null }],
    }),
    false,
  );
});

test('fixture columns constrain types, minima, primary keys and index directions', () => {
  const column = { name: 'id', type: 'INTEGER', description: 'Stable ID.' };
  assert.ok(validateFixtureColumnStructure(column));
  assert.ok(validateFixtureColumnStructure({ ...column, primaryKey: true }));
  assert.ok(
    validateFixtureColumnStructure({
      ...column,
      references: { table: 'categories', column: 'id' },
    }),
  );
  for (const value of [
    { ...column, type: 'BLOB' },
    { ...column, minimum: 0.5 },
    { ...column, type: 'TEXT', minimum: 0 },
    { ...column, primaryKey: true, nullable: true },
    { ...column, check: 'id > 0' },
    {
      ...column,
      references: { table: 'x', column: 'id', onDelete: 'CASCADE' },
    },
  ])
    assert.equal(validateFixtureColumnStructure(value), false);
  const index = {
    name: 'books_price',
    table: 'books',
    columns: [{ name: 'price', direction: 'ASC' }],
  };
  assert.ok(validateFixtureStructure({ ...fixture, indexes: [index] }));
  assert.equal(
    validateFixtureStructure({
      ...fixture,
      indexes: [
        { ...index, columns: [{ name: 'price', direction: 'random' }] },
      ],
    }),
    false,
  );
});

test('result values preserve NULL, text and duplicates, rejecting unsupported numbers', () => {
  assert.ok(
    validateQueryResultStructure({
      columns: ['v'],
      rows: [[null], [''], ['NULL'], [0], [0]],
    }),
  );
  assert.ok(validateQueryResultStructure({ columns: ['v'], rows: [] }));
  for (const value of [
    NaN,
    Infinity,
    -Infinity,
    Number.MAX_SAFE_INTEGER + 1,
    true,
    {},
    1n,
  ]) {
    assert.equal(
      validateQueryResultStructure({ columns: ['v'], rows: [[value]] }),
      false,
    );
  }
  assert.equal(validateQueryResultStructure({ columns: [], rows: [] }), false);
  assert.equal(
    validateQueryResultStructure({
      columns: ['v'],
      rows: Array.from({ length: 1001 }, () => [0]),
    }),
    false,
  );
  assert.equal(
    validateQueryResultStructure({ columns: Array(101).fill('v'), rows: [] }),
    false,
  );
});

test('tolerance is an explicit per-column alternative to exact comparison', () => {
  const exact = {
    rowOrder: 'unordered',
    columnNames: 'exact',
    numbers: 'exact',
  };
  const tolerance = { column: 0, absTolerance: 0.001, relTolerance: 0.001 };
  assert.ok(validateComparisonStructure(exact));
  assert.ok(
    validateComparisonStructure({
      ...exact,
      numbers: 'tolerant',
      tolerances: [tolerance],
    }),
  );
  for (const value of [
    { ...exact, tolerances: [tolerance] },
    { ...exact, numbers: 'tolerant' },
    { ...exact, numbers: 'tolerant', tolerances: [] },
    {
      ...exact,
      numbers: 'tolerant',
      tolerances: [{ ...tolerance, column: 100 }],
    },
    {
      ...exact,
      numbers: 'tolerant',
      tolerances: [{ ...tolerance, absTolerance: -1 }],
    },
    {
      ...exact,
      numbers: 'tolerant',
      tolerances: [{ ...tolerance, relTolerance: Infinity }],
    },
  ])
    assert.equal(validateComparisonStructure(value), false);
});

test('flowchart and puzzle reject empty, oversized or executable extension shapes', () => {
  assert.ok(validateFlowchartStructure(flowchart));
  assert.ok(validateSqlPuzzleStructure(sqlPuzzle));
  for (const value of [
    { ...flowchart, nodes: [] },
    { ...flowchart, nodes: Array(21).fill(flowchart.nodes[0]) },
    { ...flowchart, edges: Array(33).fill(flowchart.edges[0]) },
    { ...flowchart, mermaid: 'graph TD;' },
    { ...flowchart, html: '<div>graph</div>' },
    { ...flowchart, svg: '<svg />' },
    { ...flowchart, script: 'alert(1)' },
    { ...flowchart, exampleSql: 'x'.repeat(20001) },
    { ...flowchart, nodes: [{ ...flowchart.nodes[0], style: 'color:red' }] },
    {
      ...flowchart,
      nodes: [{ ...flowchart.nodes[0], label: 'x'.repeat(257) }],
    },
    {
      ...flowchart,
      nodes: [{ ...flowchart.nodes[0], description: 'x'.repeat(2001) }],
    },
    {
      ...flowchart,
      edges: [{ ...flowchart.edges[0], label: 'x'.repeat(257) }],
    },
    { ...flowchart, edges: [{ ...flowchart.edges[0], onClick: 'run()' }] },
  ])
    assert.equal(validateFlowchartStructure(value), false);
  for (const value of [
    { ...sqlPuzzle, cards: [] },
    { ...sqlPuzzle, cards: [sqlPuzzle.cards[0]] },
    { ...sqlPuzzle, cards: Array(41).fill(sqlPuzzle.cards[0]) },
    { ...sqlPuzzle, cards: [{ id: 'a', sql: ' ' }, sqlPuzzle.cards[1]] },
    {
      ...sqlPuzzle,
      cards: [{ id: 'a', sql: 'x'.repeat(1001) }, sqlPuzzle.cards[1]],
    },
    { ...sqlPuzzle, solutionOrder: [] },
    { ...sqlPuzzle, solutionOrder: ['source', 'source'] },
    {
      ...sqlPuzzle,
      cards: [
        { id: 'a', sql: 'SELECT', component: 'custom' },
        sqlPuzzle.cards[1],
      ],
    },
  ])
    assert.equal(validateSqlPuzzleStructure(value), false);
});

test('Worker messages carry complete identities and distinguish every protocol shape', () => {
  const caseIdentity = { caseId: 'basic', caseIndex: 0 };
  const result = { columns: ['title'], rows: [] };
  const messages: WorkerMessage[] = [
    {
      type: 'prepare',
      ...identity,
      mode: 'submit',
      inputMode: 'text',
      sql: 'SELECT title FROM books;',
      lesson,
      fixtures: [fixture],
    },
    { type: 'ready', ...identity },
    { type: 'run-case', ...identity, ...caseIdentity },
    {
      type: 'case-result',
      ...identity,
      ...caseIdentity,
      mode: 'run',
      outcome: 'executed',
      result,
    },
    {
      type: 'case-result',
      ...identity,
      ...caseIdentity,
      mode: 'submit',
      outcome: 'passed',
      result,
    },
    {
      type: 'case-result',
      ...identity,
      ...caseIdentity,
      mode: 'submit',
      outcome: 'mismatch',
      result,
    },
    {
      type: 'error',
      ...identity,
      phase: 'prepare',
      code: 'engine-load',
      message: 'Engine unavailable.',
    },
    {
      type: 'error',
      ...identity,
      ...caseIdentity,
      phase: 'case',
      code: 'sql',
      message: 'Invalid SQL.',
    },
  ];
  for (const message of messages) {
    assert.ok(validateWorkerMessageStructure(message));
    for (const key of Object.keys(identity)) {
      assert.equal(
        validateWorkerMessageStructure(without(message, key)),
        false,
        key,
      );
    }
    assert.equal(
      validateWorkerMessageStructure({ ...message, recordGeneration: 1 }),
      false,
    );
  }
  const prepare = messages[0];
  assert.ok(prepare?.type === 'prepare');
  for (const value of [
    { ...prepare, mode: 'guided' },
    { ...prepare, inputMode: 'submit' },
    { ...prepare, sql: 'x'.repeat(20001) },
    { ...prepare, fixtures: [] },
    { ...prepare, contentUrl: '/content/course.json' },
    { ...messages[1], result },
    without(messages[2] ?? {}, 'caseIndex'),
    { ...messages[2], caseIndex: -1 },
    { ...messages[3], outcome: 'passed' },
    { ...messages[6], caseId: 'basic' },
    without(messages[7] ?? {}, 'caseId'),
  ])
    assert.equal(validateWorkerMessageStructure(value), false);
});

test('record slots and backups share draft limits and preserve unrelated history', () => {
  const puzzleDraft = {
    cardOrder: ['projection', 'source'],
    sql: 'SELECT title, price FROM books;',
  };
  const historical = {
    ...record,
    courseId: 'unknown-course',
    revision: 12,
    inputMode: 'puzzle',
    puzzleDraft,
  };
  assert.ok(validateLearningRecordStructure(historical));
  assert.ok(
    validateBackupPartStructure({ ...backup, records: [record, historical] }),
  );
  assert.ok(validatePuzzleDraftStructure({ cardOrder: [], sql: '' }));
  for (const value of [
    { ...record, draftSql: 'x'.repeat(20001) },
    { ...record, puzzleDraft: { ...puzzleDraft, sql: 'x'.repeat(20001) } },
    {
      ...record,
      puzzleDraft: { ...puzzleDraft, cardOrder: ['source', 'source'] },
    },
    { ...record, puzzleDraft: { cardOrder: [] } },
    { ...record, inputMode: 'puzzle' },
    { ...record, inputMode: 'run' },
    { ...record, passed: 'true' },
    { ...record, viewedHintIds: ['idea', 'idea'] },
    { ...record, database: 'snapshot' },
  ]) {
    assert.equal(validateLearningRecordStructure(value), false);
    assert.equal(
      validateBackupPartStructure({ ...backup, records: [value] }),
      false,
    );
  }
});

test('metadata and backup headers reject invalid versions, counters and timestamps', () => {
  const metadata = {
    schemaVersion: 1,
    recordSetVersion: 0,
    recordGeneration: 0,
  };
  assert.ok(validateRecordMetadataStructure(metadata));
  assert.equal(
    validateRecordMetadataStructure({ ...metadata, recordGeneration: -1 }),
    false,
  );
  assert.equal(
    validateRecordMetadataStructure({
      ...metadata,
      recordSetVersion: Number.MAX_SAFE_INTEGER + 1,
    }),
    false,
  );
  for (const value of [
    { ...backup, schemaVersion: 2 },
    { ...backup, partIndex: 0 },
    { ...backup, partCount: 0 },
    { ...backup, exportedAt: '2026-02-30T00:00:00.000Z' },
    { ...backup, exportedAt: '2026-11-01' },
    { ...backup, recordGeneration: 0 },
    { ...backup, records: Array(10001).fill(record) },
  ])
    assert.equal(validateBackupPartStructure(value), false);
});

test('even worst-case legal draft strings fit one backup volume without truncation', () => {
  // JSON control-character escaping costs six bytes per code point, more than UTF-8.
  const largestSlot: LearningRecord = {
    ...record,
    courseId: 'a'.repeat(64),
    themeId: 'b'.repeat(64),
    lessonId: 'c'.repeat(64),
    revision: Number.MAX_SAFE_INTEGER,
    draftSql: '\u0000'.repeat(20000),
    puzzleDraft: {
      cardOrder: Array.from(
        { length: 40 },
        (_, i) => `card-${i}-${'x'.repeat(55)}`,
      ),
      sql: '\u0000'.repeat(20000),
    },
    inputMode: 'puzzle',
    viewedHintIds: ['idea', 'syntax', 'skeleton'],
  };
  const part = {
    ...backup,
    backupId: 'b'.repeat(128),
    partIndex: Number.MAX_SAFE_INTEGER,
    partCount: Number.MAX_SAFE_INTEGER,
    records: [largestSlot],
  };
  assert.ok(validateBackupPartStructure(part));
  assert.ok(Buffer.byteLength(JSON.stringify(part), 'utf8') < 5 * 1024 * 1024);
  const maxSql = 'x'.repeat(20000);
  assert.ok(validateLearningRecordStructure({ ...record, draftSql: maxSql }));
});

test('structural validation neither mutates input nor claims semantic or SQL safety', () => {
  const original = structuredClone(fixture);
  assert.ok(validateFixtureStructure(fixture));
  assert.deepEqual(fixture, original);
  const invalid = { ...lesson, schemaVersion: '1', extra: 'keep' };
  const before = structuredClone(invalid);
  assert.equal(validateLessonStructure(invalid), false);
  assert.deepEqual(invalid, before);
  // These shapes intentionally need a separate semantic pass, not weaker defaults.
  assert.ok(
    validateLessonStructure({ ...lesson, previewFixtureId: 'unknown-v1' }),
  );
  assert.ok(
    validateFlowchartStructure({
      ...flowchart,
      edges: [{ from: 'missing', to: 'source' }],
    }),
  );
  assert.ok(
    validateSqlPuzzleStructure({ ...sqlPuzzle, solutionOrder: ['missing'] }),
  );
  assert.ok(validateQueryResultStructure({ columns: ['a', 'b'], rows: [[1]] }));
  assert.ok(
    validateBackupPartStructure({ ...backup, partIndex: 2, partCount: 1 }),
  );
  assert.ok(
    validateLessonStructure({
      ...lesson,
      referenceSolutions: [
        {
          sql: 'DROP TABLE books;',
          explanation: 'Not authorized by structural validation.',
        },
      ],
    }),
  );
});
