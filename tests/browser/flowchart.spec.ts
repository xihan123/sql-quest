import { expect, test } from '@playwright/test';
import type { Page } from '@playwright/test';
import type { Flowchart } from '../../src/contracts/generated/types.d.ts';
import { validateContent } from '../../src/content/semantics.ts';
import { publishedContent } from '../content-helpers.ts';
import type {} from './storage-harness.ts';

const trigger = (page: Page) =>
  page.getByRole('button', { name: '思维导图（含示例 SQL）', exact: true });
const editor = (page: Page) =>
  page.getByRole('textbox', { name: 'SQL 编辑器' });
const graph = (page: Page) =>
  page.getByRole('region', { name: '教学思维导图，可在容器内滚动' });
const nodes = (page: Page) =>
  page.getByRole('group', { name: '知识节点' }).getByRole('button');
const caption = '逻辑处理过程（教学示意，非真实执行计划）';

async function withChart(page: Page, flowchart: Flowchart) {
  const { course, documents } = await publishedContent();
  const lesson = validateContent(course, documents).lessons[0];
  if (!lesson) throw new Error('Missing lesson');
  lesson.flowchart = flowchart;
  validateContent(course, documents);
  await page.route('**/book-list.json', (route) =>
    route.fulfill({ json: lesson }),
  );
}

test('opening and selecting are keyboard accessible, read-only and independent of student SQL', async ({
  page,
}, testInfo) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  const errors: string[] = [];
  page.on('pageerror', (error) => errors.push(error.message));
  let workers = 0;
  page.on('worker', () => workers++);
  await page.goto('./');
  await editor(page).fill('SELECT 42;');
  await expect(page.getByText('已保存到本机', { exact: true })).toBeVisible();
  await page.addScriptTag({
    type: 'module',
    url: '/sql-quest/tests/browser/storage-harness.ts',
  });
  await page.waitForFunction(() => Boolean(window.storageTest));
  const before = await page.evaluate(() => window.storageTest.read());
  const requests: string[] = [];
  page.on('request', (request) => requests.push(request.url()));
  await expect(page.getByText(caption, { exact: true })).toHaveCount(0);
  await trigger(page).focus();
  await page.keyboard.press('Enter');
  await expect(trigger(page)).toHaveAttribute('aria-expanded', 'true');
  await expect(page.getByText(caption, { exact: true })).toBeVisible();
  await expect(graph(page).locator('svg > path')).toHaveCount(4);
  await expect(graph(page).locator('svg > path').first()).toHaveAttribute(
    'd',
    /^M .+ C /,
  );
  await expect(graph(page).locator('marker')).toHaveCount(0);
  const [root, ...branches] = await nodes(page).evaluateAll((elements) =>
    elements.map((el) => {
      const box = el.getBoundingClientRect();
      return {
        left: box.left,
        right: box.right,
        top: box.top,
        bottom: box.bottom,
      };
    }),
  );
  if (!root || !branches[0] || !branches[3])
    throw new Error('Missing mind map branches');
  expect(branches.every((branch) => branch.left > root.right)).toBe(true);
  expect(root.top).toBeGreaterThan(branches[0].top);
  expect(root.bottom).toBeLessThan(branches[3].bottom);
  await expect(nodes(page).first()).toHaveText('读懂这条查询');
  const firstEdge = graph(page).locator('svg > path').first();
  const initialPath = await firstEdge.getAttribute('d');
  await nodes(page)
    .first()
    .evaluate((el) => {
      el.style.width = '100px';
    });
  await expect(firstEdge).not.toHaveAttribute('d', initialPath ?? '');
  await nodes(page)
    .first()
    .evaluate((el) => {
      el.style.removeProperty('width');
    });
  await expect(firstEdge).toHaveAttribute('d', initialPath ?? '');
  await page.keyboard.press('Tab');
  await expect(graph(page)).toBeFocused();
  await page.keyboard.press('Tab');
  await expect(nodes(page).first()).toBeFocused();
  await page.keyboard.press('Space');
  await expect(nodes(page).first()).toHaveAttribute('aria-pressed', 'true');
  await page.keyboard.press('Tab');
  await page.keyboard.press('Enter');
  await expect(nodes(page).nth(1)).toHaveAttribute('aria-pressed', 'true');
  await expect(
    page.getByRole('heading', { name: '完整文字说明' }),
  ).toBeVisible();
  await expect(page.getByText(/逻辑上先确定数据来源/).last()).toBeVisible();
  await expect(editor(page)).toHaveText('SELECT 42;');
  expect(await page.evaluate(() => window.storageTest.read())).toEqual(before);
  expect(workers).toBe(0);
  expect(
    requests.filter((url) => /\/content\/|\.wasm|worker/i.test(url)),
  ).toEqual([]);
  await page.screenshot({
    path: testInfo.outputPath('flowchart-desktop.png'),
    fullPage: true,
  });
  await graph(page).screenshot({ path: testInfo.outputPath('mindmap.png') });
  await page.keyboard.press('Escape');
  await expect(trigger(page)).toBeFocused();
  await expect(graph(page)).toHaveCount(0);
  await page.keyboard.press('Enter');
  await expect(
    page.getByText('尚未选择节点。也可直接阅读完整文字说明。'),
  ).toBeVisible();
  await editor(page).fill('SELECT 99;');
  await page.getByRole('button', { name: '运行', exact: true }).click();
  await expect(page.getByText(/运行未通过：用例 1/)).toBeVisible();
  await expect(page.locator('#panel-0 pre')).toHaveText(
    'SELECT title, price FROM books;',
  );
  await expect(nodes(page)).toHaveCount(5);
  await page.setViewportSize({ width: 390, height: 844 });
  await page.getByRole('tab', { name: '题目', exact: true }).click();
  await graph(page).scrollIntoViewIfNeeded();
  expect(
    await graph(page).evaluate((el) => el.scrollWidth <= el.clientWidth),
  ).toBe(true);
  await page.screenshot({ path: testInfo.outputPath('flowchart-mobile.png') });
  expect(errors).toEqual([]);
});

test('lesson/theme switches clear the old graph and selection; missing configuration has no entry', async ({
  page,
}) => {
  const { course, documents } = await publishedContent();
  const lesson = validateContent(course, documents).lessons[0];
  const theme = course.themes[0];
  const chapter = theme?.chapters[0];
  if (!lesson || !chapter || !theme) throw new Error('Missing content');
  const secondPath = `releases/r${course.revision}/second.json`;
  chapter.lessons.push({
    id: 'second',
    title: '另一张图',
    path: secondPath,
    prerequisites: [],
  });
  documents.set(secondPath, {
    ...lesson,
    id: 'second',
    title: '另一张图',
    introducedConcepts: [],
    flowchart: {
      exampleSql: 'SELECT title FROM books;',
      nodes: [
        {
          id: 'source',
          label: '另一节点',
          description: '另一个固定示例的说明。',
        },
      ],
      edges: [],
    },
  });
  const otherPath = `releases/r${course.revision}/other.json`;
  const other = { ...lesson, themeId: 'other' };
  delete other.flowchart;
  documents.set(otherPath, other);
  course.themes.push({
    ...theme,
    id: 'other',
    title: '无图主题',
    concepts: theme.concepts.filter(
      (concept) => concept.introducedAt === lesson.id,
    ),
    chapters: [
      {
        ...chapter,
        lessons: [
          {
            id: lesson.id,
            title: '无图关卡',
            path: otherPath,
            prerequisites: [],
          },
        ],
      },
    ],
  });
  validateContent(course, documents);
  await page.route('**/content/**/*.json', (route) => {
    const path = new URL(route.request().url()).pathname.split('/content/')[1];
    return route.fulfill({
      json: path === 'course.json' ? course : documents.get(path ?? ''),
    });
  });
  await page.goto('./');
  await trigger(page).click();
  await nodes(page).first().click();
  await page.getByRole('button', { name: '另一张图', exact: true }).click();
  await expect(trigger(page)).toHaveAttribute('aria-expanded', 'false');
  await expect(graph(page)).toHaveCount(0);
  await trigger(page).click();
  await expect(nodes(page)).toHaveCount(1);
  await expect(nodes(page).first()).toHaveAttribute('aria-pressed', 'false');
  await expect(page.getByText('本图没有连线。')).toBeVisible();
  await nodes(page).first().click();
  await page.getByLabel('练习主题').selectOption('other');
  await expect(trigger(page)).toHaveCount(0);
  await expect(page.getByText('另一节点', { exact: true })).toHaveCount(0);
  await page.getByLabel('练习主题').selectOption('library');
  await expect(trigger(page)).toHaveAttribute('aria-expanded', 'false');
  await trigger(page).click();
  await expect(nodes(page)).toHaveCount(5);
  await expect(nodes(page).first()).toHaveAttribute('aria-pressed', 'false');
});

test('maximum graph and plain-text markup stay readable on mobile without page overflow', async ({
  browser,
}, testInfo) => {
  const context = await browser.newContext({
    viewport: { width: 390, height: 844 },
    isMobile: true,
    hasTouch: true,
    reducedMotion: 'reduce',
  });
  const page = await context.newPage();
  try {
    const label = '<svg onload="alert(1)">' + '长字段'.repeat(60);
    const chart: Flowchart = {
      exampleSql: 'SELECT title, price FROM books;',
      nodes: Array.from({ length: 20 }, (_, i) => ({
        id: `node-${i}`,
        label: i === 0 ? label : `教学节点 ${i}`,
        description: `${i}：纯文本说明。${'说明'.repeat(150)}`,
      })),
      edges: [
        ...Array.from({ length: 19 }, (_, i) => ({
          from: `node-${i}`,
          to: `node-${i + 1}`,
          label: `连接 ${i}`,
        })),
        ...Array.from({ length: 13 }, (_, i) => ({
          from: `node-${i}`,
          to: `node-${i + 2}`,
        })),
      ],
    };
    await withChart(page, chart);
    await page.goto('http://127.0.0.1:4175/sql-quest/');
    await trigger(page).tap();
    await expect(nodes(page)).toHaveCount(20);
    await expect(graph(page).locator('svg > path')).toHaveCount(32);
    await expect(nodes(page).first()).toContainText(label);
    await expect(nodes(page).first().locator('svg')).toHaveCount(0);
    await page.evaluate(() => document.fonts.ready);
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= window.innerWidth,
      ),
    ).toBe(true);
    const dimensions = await graph(page).evaluate((el) => ({
      width: el.clientWidth,
      scrollWidth: el.scrollWidth,
      height: el.clientHeight,
      scrollHeight: el.scrollHeight,
    }));
    expect(dimensions.scrollWidth).toBeGreaterThan(dimensions.width);
    expect(dimensions.scrollHeight).toBeGreaterThan(dimensions.height);
    await graph(page).focus();
    await page.keyboard.press('ArrowRight');
    await expect
      .poll(() => graph(page).evaluate((el) => el.scrollLeft))
      .toBeGreaterThan(0);
    await nodes(page).last().focus();
    await page.keyboard.press('Enter');
    await expect(nodes(page).last()).toHaveAttribute('aria-pressed', 'true');
    await expect
      .poll(() => graph(page).evaluate((el) => el.scrollLeft))
      .toBeGreaterThan(dimensions.width);
    await graph(page).focus();
    await page.keyboard.press('ArrowDown');
    await expect
      .poll(() => graph(page).evaluate((el) => el.scrollTop))
      .toBeGreaterThan(0);
    const metrics = await nodes(page)
      .first()
      .evaluate((el) => ({
        height: el.getBoundingClientRect().height,
        width: el.getBoundingClientRect().width,
        font: getComputedStyle(el).fontFamily,
        size: getComputedStyle(el).fontSize,
      }));
    expect(metrics.height).toBeGreaterThanOrEqual(44);
    expect(metrics.width).toBeGreaterThanOrEqual(44);
    expect(metrics.font).toContain('Noto Sans SC');
    expect(metrics.size).toBe('16px');
    await page.screenshot({
      path: testInfo.outputPath('flowchart-mobile-large.png'),
    });
    await page.keyboard.press('Escape');
    await expect(trigger(page)).toBeFocused();
    await page.getByRole('tab', { name: 'SQL', exact: true }).tap();
    await expect(editor(page)).toBeVisible();
  } finally {
    await context.close();
  }
});

for (const phase of ['setup', 'measurement'])
  test(`${phase} failure preserves the real error, text and editor, and disconnects the graph observer`, async ({
    page,
  }) => {
    await page.goto('./');
    await expect(trigger(page)).toBeVisible();
    await page.evaluate((phase) => {
      const observe = ResizeObserver.prototype.observe;
      const disconnect = ResizeObserver.prototype.disconnect;
      const graphObservers = new WeakSet<ResizeObserver>();
      ResizeObserver.prototype.disconnect = function () {
        if (graphObservers.has(this))
          document.documentElement.dataset.graphDisconnected = 'true';
        disconnect.call(this);
      };
      ResizeObserver.prototype.observe = function (target, options) {
        if (
          target.parentElement?.getAttribute('aria-label') ===
          '教学思维导图，可在容器内滚动'
        ) {
          graphObservers.add(this);
          if (phase === 'setup') throw new Error('测试：布局测量不可用');
          const button = target.querySelector('button');
          if (!button) throw new Error('Missing node');
          Object.defineProperty(button, 'offsetLeft', {
            get() {
              throw new Error('测试：布局测量不可用');
            },
          });
        }
        return observe.call(this, target, options);
      };
    }, phase);
    await trigger(page).click();
    await expect(page.getByRole('alert')).toContainText(
      '思维导图渲染失败：测试：布局测量不可用',
    );
    await expect(page.getByText(caption, { exact: true })).toBeVisible();
    await expect(
      page.getByRole('heading', { name: '完整文字说明' }),
    ).toBeVisible();
    await expect(page.getByText(/逻辑上先确定数据来源/)).toBeVisible();
    await expect(page.locator('#panel-0 pre')).toHaveText(
      'SELECT title, price FROM books;',
    );
    await editor(page).fill('SELECT 123;');
    await expect(editor(page)).toHaveText('SELECT 123;');
    await expect(page.locator('html')).toHaveAttribute(
      'data-graph-disconnected',
      'true',
    );
  });

test('invalid flowchart configuration fails content loading instead of hiding the aid', async ({
  page,
}) => {
  const { course, documents } = await publishedContent();
  const lesson = validateContent(course, documents).lessons[0];
  if (!lesson?.flowchart) throw new Error('Missing chart');
  lesson.flowchart.edges.push({ from: 'projection', to: 'query' });
  await page.route('**/book-list.json', (route) =>
    route.fulfill({ json: lesson }),
  );
  await page.goto('./');
  await expect(page.getByText(/流程图有向环/)).toBeVisible();
  await expect(trigger(page)).toHaveCount(0);
  await expect(editor(page)).toHaveCount(0);
  await expect(
    page.getByRole('button', { name: '学习记录：备份 / 导入 / 清除' }),
  ).toBeVisible();
});
