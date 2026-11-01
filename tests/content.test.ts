import assert from 'node:assert/strict';
import { DatabaseSync } from 'node:sqlite';
import test from 'node:test';
import { compileFixture, validateFixture } from '../src/content/fixture.ts';
import {
  joinPuzzle,
  validateContent,
  validateCourse,
} from '../src/content/semantics.ts';
import { limits } from '../src/content/checks.ts';
import { compareResults } from '../src/engine/compare.ts';
import { layoutFlowNodes } from '../src/components/flowchartLayout.ts';
import {
  resolveContentUrl,
  resolveRootUrl,
  validateAddresses,
} from '../src/content/urls.ts';
import {
  sourceContent,
  publishedContent,
  trickyFixture,
} from './content-helpers.ts';

test('root URLs respect app base, origin and HTTPS; references reject traversal and wrong release', async () => {
  const root = resolveRootUrl(
    './content/course.json',
    'https://example.test/sql-quest/',
  );
  assert.equal(root.href, 'https://example.test/sql-quest/content/course.json');
  for (const path of [
    '../course.json',
    'https://elsewhere.test/course.json',
    '//elsewhere.test/a.json',
    'https://user:pass@example.test/a.json',
    './a.json?',
    './a.json#',
    './%61.json',
    './a\\b.json',
  ])
    assert.throws(() =>
      resolveRootUrl(path, 'https://example.test/sql-quest/'),
    );
  assert.throws(() => resolveRootUrl('./course.json', 'http://example.test/'));
  assert.doesNotThrow(() =>
    resolveRootUrl('./course.json', 'http://127.0.0.1:5173/'),
  );
  for (const path of [
    '../x.json',
    'x/../a.json',
    '/a.json',
    '%2e%2e/a.json',
    'a\\b.json',
    'https://evil.test/a.json',
    'a.json?q',
    'a.json#x',
    'a.json\n',
    'course.json',
  ])
    assert.throws(() => resolveContentUrl(path, root));
  const { course } = await publishedContent();
  validateAddresses(course, root);
  course.revision++;
  assert.throws(() => validateAddresses(course, root), /发布版本/);
});

test('root identities, earlier prerequisites and concept registration are validated', async () => {
  const { course } = await sourceContent();
  const theme = course.themes[0];
  assert.ok(theme);
  const chapter = theme.chapters[0];
  assert.ok(chapter);
  const lesson = chapter.lessons[0];
  assert.ok(lesson);
  lesson.prerequisites = [lesson.id];
  assert.throws(() => validateCourse(course), /先修/);
  lesson.prerequisites = [];
  chapter.lessons.push({ ...lesson, path: null });
  assert.throws(() => validateCourse(course), /关卡 ID/);
  chapter.lessons.pop();
  theme.concepts.push({
    id: 'unknown',
    title: 'Unknown',
    introducedAt: 'missing',
  });
  assert.throws(() => validateCourse(course), /首次教授/);
});

test('exact registrations, identities, compatible readable tables and expected result semantics', async () => {
  const { course, documents } = await sourceContent();
  const content = validateContent(course, documents);
  const lesson = content.lessons[0];
  const fixture = content.fixtures[1];
  assert.ok(lesson && fixture);
  documents.set('unregistered.json', {});
  assert.throws(() => validateContent(course, documents), /完整且仅/);
  documents.delete('unregistered.json');
  lesson.themeId = 'wrong';
  assert.throws(() => validateContent(course, documents), /身份/);
  lesson.themeId = 'library';
  lesson.introducedConcepts = [];
  assert.throws(() => validateContent(course, documents), /首次教授/);
  lesson.introducedConcepts = ['select'];
  lesson.tests.push({
    id: 'duplicate-preview',
    fixtureId: lesson.previewFixtureId,
    expected: { columns: ['title', 'price'], rows: [] },
  });
  assert.throws(() => validateContent(course, documents), /恰好/);
  lesson.tests.pop();
  const price = fixture.tables[0]?.columns[2];
  assert.ok(price);
  price.nullable = true;
  assert.throws(() => validateContent(course, documents), /不兼容/);
  price.nullable = false;
  lesson.comparison = {
    rowOrder: 'unordered',
    columnNames: 'exact',
    numbers: 'tolerant',
    tolerances: [{ column: 0, absTolerance: 1, relTolerance: 0 }],
  };
  assert.throws(() => validateContent(course, documents), /数值输出/);
  lesson.comparison = {
    rowOrder: 'unordered',
    columnNames: 'exact',
    numbers: 'exact',
  };
  const row = lesson.tests[0]?.expected.rows[0];
  assert.ok(row);
  row.pop();
  assert.throws(() => validateContent(course, documents), /行宽/);
});

test('flowchart references, duplicate nodes/edges, self-loops and cycles fail closed; layout follows edges', async () => {
  const { course, documents } = await sourceContent();
  const lesson = validateContent(course, documents).lessons[0];
  assert.ok(lesson);
  const flowchart = {
    exampleSql: 'SELECT title FROM books;',
    nodes: [
      ...['d', 'b', 'c', 'a', 'isolated'].map((id) => ({
        id,
        label: id,
        description: id,
      })),
    ],
    edges: [
      { from: 'a', to: 'b' },
      { from: 'a', to: 'c' },
      { from: 'b', to: 'd' },
      { from: 'c', to: 'd' },
    ],
  };
  lesson.flowchart = flowchart;
  validateContent(course, documents);
  assert.deepEqual(
    layoutFlowNodes(flowchart).map((level) => level.map((node) => node.id)),
    [['a', 'isolated'], ['b', 'c'], ['d']],
  );
  const withShortcut = {
    ...flowchart,
    edges: [...flowchart.edges, { from: 'a', to: 'd' }],
  };
  assert.deepEqual(layoutFlowNodes(withShortcut), layoutFlowNodes(flowchart));
  for (const edges of [
    [...flowchart.edges, { from: 'missing', to: 'a' }],
    [...flowchart.edges, { from: 'a', to: 'missing' }],
    [...flowchart.edges, { from: 'a', to: 'a' }],
    [
      ...flowchart.edges,
      { from: 'a', to: 'b', label: 'Duplicate with a different label' },
    ],
    [...flowchart.edges, { from: 'd', to: 'a' }],
  ]) {
    lesson.flowchart = { ...flowchart, edges };
    assert.throws(() => validateContent(course, documents), /流程/);
  }
  const cyclic = lesson.flowchart;
  assert.ok(cyclic);
  assert.throws(() => layoutFlowNodes(cyclic), /排列顺序/);
  lesson.flowchart = {
    ...flowchart,
    nodes: [
      ...flowchart.nodes,
      { id: 'a', label: 'Other A', description: 'Duplicate' },
    ],
  };
  assert.throws(() => validateContent(course, documents), /节点 ID/);
  const firstNode = flowchart.nodes[0];
  assert.ok(firstNode);
  lesson.flowchart = { ...flowchart, nodes: [firstNode], edges: [] };
  validateContent(course, documents);
  assert.deepEqual(layoutFlowNodes(lesson.flowchart), [[firstNode]]);
});

test('optional puzzles fail closed on unknown cards and broken literal boundaries', async () => {
  const { course, documents } = await sourceContent();
  const lesson = validateContent(course, documents).lessons[0];
  assert.ok(lesson);
  lesson.sqlPuzzle = {
    cards: [
      { id: 'a', sql: 'SELECT title' },
      { id: 'b', sql: 'FROM books;' },
    ],
    solutionOrder: ['a', 'missing'],
  };
  assert.throws(() => validateContent(course, documents), /未知卡片/);
  lesson.sqlPuzzle.solutionOrder = ['a', 'b'];
  const card = lesson.sqlPuzzle.cards[0];
  assert.ok(card);
  card.sql = "SELECT 'unfinished";
  assert.throws(() => validateContent(course, documents), /引号/);
});

test('fixture compiler preserves types, NULL, quotes, NUL, foreign keys, minima and indexes in native SQLite', () => {
  const fixture = trickyFixture();
  const sql = compileFixture(fixture);
  assert.ok(Buffer.byteLength(sql) <= limits.sqlBytes);
  const db = new DatabaseSync(':memory:');
  try {
    db.exec(sql);
    const stmt = db.prepare(
      'SELECT id, parent_id, amount, note FROM child ORDER BY id',
    );
    stmt.setReturnArrays(true);
    assert.deepEqual(stmt.all(), fixture.tables[0]?.rows);
    assert.equal(db.prepare('PRAGMA foreign_key_check').all().length, 0);
    assert.equal(
      db
        .prepare(
          "SELECT name FROM sqlite_master WHERE type = 'index' AND name = 'child_amount'",
        )
        .all().length,
      1,
    );
    assert.throws(
      () => db.exec('INSERT INTO child VALUES (6, NULL, -2, NULL)'),
      /CHECK/,
    );
    assert.throws(
      () => db.exec("INSERT INTO child VALUES (6, 'missing', 0, NULL)"),
      /FOREIGN KEY/,
    );
  } finally {
    db.close();
  }
});

test('fixture validation rejects invalid widths, types, keys, references, indexes and aggregate budgets', () => {
  const mutations: ((fixture: ReturnType<typeof trickyFixture>) => void)[] = [
    (f) => f.tables.push(...f.tables),
    (f) => {
      f.tables[0]?.rows.push([1]);
    },
    (f) => {
      f.tables[0]?.rows.push([6, null, '2', null]);
    },
    (f) => {
      f.tables[0]?.rows.push([1, null, 0, null]);
    },
    (f) => {
      f.tables[0]?.rows.push([6, 'missing', 0, null]);
    },
    (f) => {
      f.tables[0]?.rows.push([6, null, -2, null]);
    },
    (f) => {
      f.tables[0]?.rows.push([6.5, null, 0, null]);
    },
    (f) => {
      f.tables[0]?.rows.push([6, null, Number.MAX_SAFE_INTEGER + 1, null]);
    },
    (f) => {
      f.indexes = [
        {
          name: 'parent',
          table: 'child',
          columns: [{ name: 'id', direction: 'ASC' }],
        },
      ];
    },
    (f) => {
      f.indexes = [
        {
          name: 'bad',
          table: 'child',
          columns: [{ name: 'missing', direction: 'ASC' }],
        },
      ];
    },
  ];
  for (const mutate of mutations) {
    const fixture = trickyFixture();
    mutate(fixture);
    assert.throws(() => validateFixture(fixture));
  }
  const large = trickyFixture();
  large.tables[0]?.rows.push([6, null, 1, "'".repeat(600_000)]);
  assert.throws(() => compileFixture(large), /生成 SQL/);
  const many = trickyFixture();
  for (let i = 6; i <= 5000; i++) many.tables[0]?.rows.push([i, null, 0, null]);
  assert.throws(() => validateFixture(many), /总行数/);
});

test('all registered references and executable misconceptions are checked in native SQLite with the declared comparison', async () => {
  const { course, documents } = await sourceContent();
  const { lessons, fixtures } = validateContent(course, documents);
  for (const lesson of lessons) {
    const detected = new Set<string>();
    for (const testCase of lesson.tests) {
      const fixture = fixtures.find((item) => item.id === testCase.fixtureId);
      assert.ok(fixture);
      const db = new DatabaseSync(':memory:');
      try {
        db.exec(compileFixture(fixture));
        if (
          lesson.flowchart &&
          testCase.fixtureId === lesson.previewFixtureId
        ) {
          db.prepare(lesson.flowchart.exampleSql).all();
        }
        const solutions = lesson.referenceSolutions.map(
          (solution) => solution.sql,
        );
        if (lesson.sqlPuzzle)
          solutions.push(
            joinPuzzle(lesson.sqlPuzzle, lesson.sqlPuzzle.solutionOrder),
          );
        for (const sql of solutions) {
          const statement = db.prepare(sql);
          statement.setReturnArrays(true);
          assert.ok(
            compareResults(
              {
                columns: statement.columns().map((column) => column.name),
                rows: statement.all(),
              },
              testCase.expected,
              lesson.comparison,
            ),
            `${lesson.themeId}/${lesson.id}/${testCase.id}: ${sql}`,
          );
        }
        for (const failure of lesson.expectedFailures) {
          const statement = db.prepare(failure.sql);
          statement.setReturnArrays(true);
          if (
            !compareResults(
              {
                columns: statement.columns().map((column) => column.name),
                rows: statement.all(),
              },
              testCase.expected,
              lesson.comparison,
            )
          )
            detected.add(failure.id);
        }
      } finally {
        db.close();
      }
    }
    assert.deepEqual(
      lesson.expectedFailures.filter((failure) => !detected.has(failure.id)),
      [],
      `${lesson.themeId}/${lesson.id}: undetected misconceptions`,
    );
  }
});
