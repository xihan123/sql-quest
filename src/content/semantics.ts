import type {
  Course,
  ExecutionMode,
  Fixture,
  FixtureColumn,
  Lesson,
  SqlPuzzle,
} from '../contracts/generated/types.d.ts';
import {
  validateCourseStructure,
  validateLessonStructure,
  validateSqlStructure,
} from '../contracts/generated/validators.js';
import {
  byteLength,
  limits,
  requireContent,
  structure,
  unique,
} from './checks.ts';
import {
  compileFixture,
  validateFixture,
  validateRowBudget,
} from './fixture.ts';
import { registeredPaths } from './urls.ts';
import type { DeepReadonly } from './checks.ts';

export function validateCourse(value: unknown): Course {
  const course = structure(value, validateCourseStructure, '根配置');
  unique(
    course.themes.map((theme) => theme.id),
    '主题 ID',
  );
  unique(
    course.fixtures.map((fixture) => fixture.id),
    '夹具 ID',
  );
  unique(registeredPaths(course), '内容地址');
  for (const theme of course.themes) {
    unique(
      theme.chapters.map((chapter) => chapter.id),
      '章节 ID',
    );
    unique(
      theme.concepts.map((concept) => concept.id),
      '知识点 ID',
    );
    const lessons = theme.chapters.flatMap((chapter) => chapter.lessons);
    unique(
      lessons.map((lesson) => lesson.id),
      '关卡 ID',
    );
    const earlier = new Set<string>();
    for (const lesson of lessons) {
      requireContent(
        lesson.prerequisites.every((id) => earlier.has(id)),
        '先修须指向本主题更早关卡',
      );
      earlier.add(lesson.id);
    }
    requireContent(
      theme.concepts.every((concept) => earlier.has(concept.introducedAt)),
      '知识点首次教授位置不存在',
    );
  }
  return course;
}

function sameSet(left: readonly string[], right: readonly string[]) {
  return (
    left.length === right.length && left.every((item) => right.includes(item))
  );
}

function columnShape(column: FixtureColumn) {
  return [
    column.name,
    column.type,
    column.nullable ?? false,
    column.primaryKey ?? false,
    column.type === 'TEXT' ? null : (column.minimum ?? null),
    column.references?.table ?? null,
    column.references?.column ?? null,
  ];
}

// This checks card boundaries, not SQL safety or executability.
function validateCardBoundary(sql: string) {
  let quote = '';
  let comment: 'line' | 'block' | '' = '';
  for (let i = 0; i < sql.length; i++) {
    const char = sql[i];
    const next = sql[i + 1];
    if (comment === 'line') {
      if (char === '\n') comment = '';
      continue;
    }
    if (comment === 'block') {
      if (char === '*' && next === '/') {
        comment = '';
        i++;
      }
      continue;
    }
    if (quote) {
      if (char === quote) {
        if (next === quote && quote !== ']') i++;
        else quote = '';
      }
    } else if (char === '-' && next === '-') {
      comment = 'line';
      i++;
    } else if (char === '/' && next === '*') {
      comment = 'block';
      i++;
    } else if (char === "'" || char === '"' || char === '`') quote = char;
    else if (char === '[') quote = ']';
  }
  requireContent(
    !quote && !comment,
    '拼图卡片不能拆开引号或注释；行注释需换行结束',
  );
}

export function joinPuzzle(
  puzzle: DeepReadonly<SqlPuzzle>,
  order: readonly string[],
): string {
  unique(order, '拼图选中卡片');
  const sql = order
    .map((id) => {
      const card = puzzle.cards.find((item) => item.id === id);
      requireContent(card, '拼图引用未知卡片');
      return card.sql;
    })
    .join(' ');
  requireContent(Array.from(sql).length <= 20_000, '拼图 SQL 超出字符预算');
  return sql;
}

function validateAids(lesson: Lesson) {
  if (lesson.flowchart) {
    const { nodes, edges } = lesson.flowchart;
    unique(
      nodes.map((node) => node.id),
      '流程节点 ID',
    );
    unique(
      edges.map((edge) => `${edge.from}/${edge.to}`),
      '流程连线',
    );
    const ids = new Set(nodes.map((node) => node.id));
    requireContent(
      edges.every(
        (edge) =>
          ids.has(edge.from) && ids.has(edge.to) && edge.from !== edge.to,
      ),
      '流程连线引用错误或自环',
    );
    const active = new Set<string>();
    const done = new Set<string>();
    const visit = (id: string) => {
      requireContent(!active.has(id), '流程图有向环');
      if (done.has(id)) return;
      active.add(id);
      for (const edge of edges.filter((item) => item.from === id))
        visit(edge.to);
      active.delete(id);
      done.add(id);
    };
    for (const id of ids) visit(id);
  }
  if (lesson.sqlPuzzle) {
    unique(
      lesson.sqlPuzzle.cards.map((card) => card.id),
      '拼图卡片 ID',
    );
    for (const card of lesson.sqlPuzzle.cards) validateCardBoundary(card.sql);
    const sql = joinPuzzle(lesson.sqlPuzzle, lesson.sqlPuzzle.solutionOrder);
    requireContent(validateSqlStructure(sql), '参考拼法 SQL 不合法');
  }
}

export function validateLessonFixtures(
  lesson: Lesson,
  fixtures: readonly Fixture[],
  mode: ExecutionMode = 'submit',
) {
  unique(
    lesson.tests.map((test) => test.id),
    '用例 ID',
  );
  unique(
    lesson.expectedFailures.map((failure) => failure.id),
    '错误解法 ID',
  );
  requireContent(
    lesson.tests.filter((test) => test.fixtureId === lesson.previewFixtureId)
      .length === 1,
    '预览夹具须恰好对应一个用例',
  );
  const preview = fixtures.find(
    (fixture) => fixture.id === lesson.previewFixtureId,
  );
  requireContent(preview, '预览夹具未登记');
  const readable = lesson.readableTables.map((name) => {
    const table = preview.tables.find((item) => item.name === name);
    requireContent(table, '预览夹具缺少可读表');
    return table;
  });
  const expectedColumns = lesson.tests[0]?.expected.columns;
  requireContent(expectedColumns, '缺少预期列');
  for (const test of lesson.tests) {
    if (mode === 'submit' || test.fixtureId === lesson.previewFixtureId) {
      const fixture = fixtures.find((item) => item.id === test.fixtureId);
      requireContent(fixture, '用例夹具未登记');
      for (const table of readable) {
        const other = fixture.tables.find((item) => item.name === table.name);
        requireContent(
          other &&
            JSON.stringify(other.columns.map(columnShape)) ===
              JSON.stringify(table.columns.map(columnShape)),
          '用例可读表结构不兼容',
        );
      }
    }
    requireContent(
      JSON.stringify(test.expected.columns) === JSON.stringify(expectedColumns),
      '用例输出列不一致',
    );
    let textBytes = 0;
    for (const row of test.expected.rows) {
      requireContent(row.length === expectedColumns.length, '预期结果行宽错误');
      validateRowBudget(row);
      for (const cell of row)
        if (typeof cell === 'string') textBytes += byteLength(cell);
    }
    requireContent(textBytes <= limits.resultTextBytes, '预期结果文本超限');
  }
  if (lesson.comparison.numbers === 'tolerant') {
    unique(
      lesson.comparison.tolerances.map((item) => item.column),
      '容差列',
    );
    for (const tolerance of lesson.comparison.tolerances) {
      requireContent(tolerance.column < expectedColumns.length, '容差列越界');
      requireContent(
        lesson.tests.every((test) =>
          test.expected.rows.every(
            (row) =>
              row[tolerance.column] === null ||
              typeof row[tolerance.column] === 'number',
          ),
        ),
        '容差只能用于数值输出列',
      );
    }
  }
  validateAids(lesson);
}

export function validateContent(
  course: Course,
  documents: ReadonlyMap<string, unknown>,
) {
  const paths = registeredPaths(course);
  requireContent(
    documents.size === paths.length &&
      paths.every((path) => documents.has(path)),
    '内容必须完整且仅来自根登记',
  );
  const fixtures = course.fixtures.map((index) => {
    const fixture = validateFixture(documents.get(index.path));
    requireContent(fixture.id === index.id, '夹具身份与索引不符');
    compileFixture(fixture);
    return fixture;
  });
  const lessons: Lesson[] = [];
  for (const theme of course.themes) {
    const order = theme.chapters.flatMap((chapter) =>
      chapter.lessons.map((lesson) => lesson.id),
    );
    for (const chapter of theme.chapters)
      for (const index of chapter.lessons) {
        if (index.path === null) continue;
        const lesson = structure(
          documents.get(index.path),
          validateLessonStructure,
          '关卡',
        );
        requireContent(
          lesson.courseId === course.id &&
            lesson.themeId === theme.id &&
            lesson.chapterId === chapter.id &&
            lesson.id === index.id,
          '关卡身份与索引不符',
        );
        requireContent(
          sameSet(lesson.prerequisites, index.prerequisites),
          '关卡先修与索引不符',
        );
        const introduced = theme.concepts
          .filter((concept) => concept.introducedAt === lesson.id)
          .map((concept) => concept.id);
        requireContent(
          sameSet(introduced, lesson.introducedConcepts) &&
            introduced.every((id) => lesson.concepts.includes(id)),
          '关卡首次教授知识点与根不符',
        );
        requireContent(
          lesson.concepts.every((id) => {
            const concept = theme.concepts.find((item) => item.id === id);
            return (
              concept &&
              order.indexOf(concept.introducedAt) <= order.indexOf(lesson.id)
            );
          }),
          '使用了未教授或未知知识点',
        );
        validateLessonFixtures(lesson, fixtures);
        lessons.push(lesson);
      }
  }
  return { course, lessons, fixtures };
}
