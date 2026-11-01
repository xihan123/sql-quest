import { expect, test } from '@playwright/test';
import { joinPuzzle, validateContent } from '../../src/content/semantics.ts';
import { sourceContent, trickyFixture } from '../content-helpers.ts';
import { createExecutionRequest } from '../../src/engine/client.ts';
import { compareResults } from '../../src/engine/compare.ts';
import type {} from './harness.ts';
import type {} from './engine-harness.ts';

test('real browser loads the same snapshot from static JSON and API; rejects redirects and decompressed excess bytes', async ({
  page,
}) => {
  await page.goto('tests/browser/harness.html');
  await page.waitForFunction(() => Boolean(window.stageTwo));
  const staticState = await page.evaluate(() =>
    window.stageTwo.load('./content/course.json'),
  );
  const apiState = await page.evaluate(() =>
    window.stageTwo.load('./api/sql-quest/course.json'),
  );
  expect(staticState.status).toBe('ready');
  expect(apiState.status).toBe('ready');
  if (staticState.status !== 'ready' || apiState.status !== 'ready')
    throw new Error(JSON.stringify({ staticState, apiState }));
  expect(apiState.snapshot.lessons).toEqual(staticState.snapshot.lessons);
  expect(
    await page.evaluate(() =>
      window.stageTwo.network('/sql-quest/network-tests/gzip.json'),
    ),
  ).toContain('字节预算');
  expect(
    await page.evaluate(() =>
      window.stageTwo.network('/sql-quest/network-tests/redirect.json'),
    ),
  ).not.toBe('unexpected success');
});

test('fixture compiler executes in real SQLite WASM module Worker', async ({
  page,
}) => {
  await page.goto('tests/browser/harness.html');
  await page.waitForFunction(() => Boolean(window.stageTwo));
  const fixture = trickyFixture();
  const audit = await page.evaluate(
    ({ fixture }) =>
      window.stageTwo.fixture(fixture, [
        'SELECT id, parent_id, amount, note FROM child ORDER BY id;',
        'PRAGMA foreign_key_check;',
        "SELECT name FROM sqlite_master WHERE type = 'index' AND name = 'child_amount';",
      ]),
    { fixture },
  );
  expect(audit).toMatchObject({
    results: [
      {
        columns: ['id', 'parent_id', 'amount', 'note'],
        rows: fixture.tables[0]?.rows,
      },
      { rows: [] },
      { rows: [['child_amount']] },
    ],
  });
});

test('course solutions, misconceptions, flowcharts and reference puzzles use the shared read-only WASM entry', async ({
  page,
}) => {
  // 课程含多个主题后，全量审计的用例数随内容增长，预留更长超时。
  test.setTimeout(120_000);
  await page.goto('tests/browser/engine-harness.html');
  await page.waitForFunction(() => Boolean(window.engine));
  const { course, documents } = await sourceContent();
  const content = validateContent(course, documents);
  const snapshot = {
    ...content,
    contentToken: 'content-audit',
    rootUrl: 'http://127.0.0.1:4175/sql-quest/content/course.json',
  };
  for (const lesson of content.lessons) {
    const run = (
      sql: string,
      mode: 'run' | 'submit',
      previewFixtureId = lesson.previewFixtureId,
      inputMode: 'text' | 'puzzle' = 'text',
    ) =>
      page.evaluate(
        (request) => window.engine.run(request),
        createExecutionRequest(
          { ...snapshot, lessons: [{ ...lesson, previewFixtureId }] },
          {
            themeId: lesson.themeId,
            lessonId: lesson.id,
            inputMode,
            sql,
            mode,
          },
        ),
      );
    for (const solution of lesson.referenceSolutions)
      expect(
        (await run(solution.sql, 'submit')).status,
        `${lesson.id}: reference`,
      ).toBe('passed');
    for (const failure of lesson.expectedFailures) {
      let detected = false;
      for (const testCase of lesson.tests) {
        const outcome = await run(failure.sql, 'run', testCase.fixtureId);
        expect(
          outcome.status,
          `${lesson.id}: ${failure.id}/${testCase.id}`,
        ).toBe('executed');
        if (outcome.status !== 'executed')
          throw new Error('Misconception must be executable');
        if (
          !compareResults(outcome.result, testCase.expected, lesson.comparison)
        )
          detected = true;
      }
      expect(detected, `${lesson.id}: ${failure.id}`).toBe(true);
    }
    if (lesson.flowchart)
      expect(
        (await run(lesson.flowchart.exampleSql, 'run')).status,
        `${lesson.id}: flowchart`,
      ).toBe('executed');
    if (lesson.sqlPuzzle)
      expect(
        (
          await run(
            joinPuzzle(lesson.sqlPuzzle, lesson.sqlPuzzle.solutionOrder),
            'submit',
            lesson.previewFixtureId,
            'puzzle',
          )
        ).status,
        `${lesson.id}: reference puzzle`,
      ).toBe('passed');
  }
});

test('practice under a deployment subpath retains records and export access across content failure and retry', async ({
  page,
}) => {
  const errors: string[] = [];
  page.on('pageerror', (error) => errors.push(error.message));
  await page.goto('./');
  await expect(
    page.getByRole('heading', { name: '查看图书名称与价格' }),
  ).toBeVisible();
  await expect(page.getByRole('table')).toHaveCount(1);
  await expect(
    page.getByRole('button', { name: '选择图书字段' }),
  ).toHaveAttribute('aria-current', 'page');
  await page.getByRole('textbox', { name: 'SQL 编辑器' }).fill('SELECT 7;');
  await expect(page.getByText('已保存到本机', { exact: true })).toBeVisible();
  await page.route('**/content/releases/**/book-list.json', (route) =>
    route.fulfill({ status: 404, body: 'not found' }),
  );
  await page.reload();
  await expect(page.getByText(/未启用任何课程内容/)).toBeVisible();
  await expect(page.getByRole('table')).toHaveCount(0);
  await page
    .getByRole('button', { name: '学习记录：备份 / 导入 / 清除' })
    .click();
  await page.getByRole('button', { name: '生成分卷备份' }).click();
  await expect(
    page.getByRole('link', { name: '下载第 1 / 1 卷' }),
  ).toBeVisible();
  await page.keyboard.press('Escape');
  await page.unroute('**/content/releases/**/book-list.json');
  await page.getByRole('button', { name: '重试加载' }).click();
  await expect(page.getByRole('table')).toHaveCount(1);
  await expect(page.getByRole('textbox', { name: 'SQL 编辑器' })).toHaveText(
    'SELECT 7;',
  );
  expect(errors).toEqual([]);
});
