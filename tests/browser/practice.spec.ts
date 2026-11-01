import { expect, test } from '@playwright/test';
import type { Page } from '@playwright/test';
import { readFile } from 'node:fs/promises';
import { publishedContent } from '../content-helpers.ts';
import { validateContent } from '../../src/content/semantics.ts';
import { validateBackupPartStructure } from '../../src/contracts/generated/validators.js';
import type {} from './storage-harness.ts';

const solution = 'SELECT title, price FROM books;';
const editor = (page: Page) =>
  page.getByRole('textbox', { name: 'SQL 编辑器' });
async function ready(page: Page) {
  await page.goto('./');
  await expect(editor(page)).toBeVisible();
  await page.addScriptTag({
    type: 'module',
    url: '/sql-quest/tests/browser/storage-harness.ts',
  });
  await page.waitForFunction(() => Boolean(window.storageTest));
}
async function saved(page: Page) {
  await expect(page.getByText('已保存到本机', { exact: true })).toBeVisible();
}
async function multipleLessons(page: Page) {
  const { course, documents } = await publishedContent();
  const content = validateContent(course, documents);
  const lesson = content.lessons[0];
  const theme = course.themes[0];
  const chapter = theme?.chapters[0];
  if (!lesson || !theme || !chapter) throw new Error('Missing fixture');
  chapter.lessons.push({
    id: 'second-query',
    title: '另一关',
    prerequisites: [],
    path: `releases/r${course.revision}/second-query.json`,
  });
  documents.set(`releases/r${course.revision}/second-query.json`, {
    ...lesson,
    id: 'second-query',
    title: '另一关',
    introducedConcepts: [],
    starterSql: '-- 第二关模板\n',
  });
  course.themes.push({
    ...theme,
    id: 'other-theme',
    title: '另一主题',
    concepts: theme.concepts.filter(
      (concept) => concept.introducedAt === lesson.id,
    ),
    chapters: [
      {
        ...chapter,
        lessons: [
          {
            id: lesson.id,
            title: '同 ID 的另一主题关卡',
            prerequisites: [],
            path: `releases/r${course.revision}/other-theme.json`,
          },
        ],
      },
    ],
  });
  documents.set(`releases/r${course.revision}/other-theme.json`, {
    ...lesson,
    themeId: 'other-theme',
    title: '同 ID 的另一主题关卡',
    starterSql: '-- 另一主题模板\n',
  });
  validateContent(course, documents);
  await page.route('**/content/**/*.json', (route) => {
    const path = new URL(route.request().url()).pathname.split('/content/')[1];
    return route.fulfill({
      json: path === 'course.json' ? course : documents.get(path ?? ''),
    });
  });
}

test('one run grades all cases, shows actual preview rows and restores draft/pass/hints/review on refresh', async ({
  page,
}) => {
  const errors: string[] = [];
  page.on('pageerror', (error) => errors.push(error.message));
  await ready(page);
  await expect(page.getByRole('button', { name: /提交/ })).toHaveCount(0);
  await editor(page).fill(solution);
  await page.getByRole('button', { name: '运行', exact: true }).click();
  await expect(page.getByText(/运行通过，全部 2 个用例通过/)).toBeVisible();
  await expect(
    page
      .getByRole('region', { name: '实际结果 · 用例 1，可横向滚动' })
      .locator('tbody tr'),
  ).toHaveCount(3);
  await page.getByRole('button', { name: '查看第 1 层提示：思路' }).click();
  await page.getByRole('button', { name: '查看第 2 层提示：语法' }).click();
  await page.getByRole('button', { name: '查看第 3 层提示：骨架' }).click();
  await page.getByRole('button', { name: '标记待复习', exact: true }).click();
  await saved(page);
  expect(
    (await page.evaluate(() => window.storageTest.read())).records[0],
  ).toMatchObject({
    passed: true,
    draftSql: solution,
    viewedHintIds: ['idea', 'syntax', 'skeleton'],
    reviewMarked: true,
  });
  await page.reload();
  await expect(editor(page)).toHaveText(solution);
  await expect(page.getByText('当前版本已通过', { exact: true })).toBeVisible();
  await expect(
    page.getByRole('button', { name: '取消复习标记' }),
  ).toHaveAttribute('aria-pressed', 'true');
  await expect(page.getByRole('heading', { name: '3. 骨架' })).toBeVisible();
  await page.getByRole('button', { name: '恢复默认', exact: true }).click();
  await expect(page.getByRole('dialog')).toHaveCount(0);
  await expect(editor(page)).toContainText('-- 在下方查询图书名称和价格。');
  await expect(page.getByText('当前版本已通过', { exact: true })).toBeVisible();
  await saved(page);
  await page.reload();
  await expect(editor(page)).toContainText('-- 在下方查询图书名称和价格。');
  await expect(page.getByText('当前版本已通过', { exact: true })).toBeVisible();
  expect(errors).toEqual([]);
});

test('answers never silently change SQL; confirmation, Escape, focus and undo preserve edits', async ({
  page,
}) => {
  await ready(page);
  await editor(page).fill('SELECT 42;');
  await page.getByRole('button', { name: '查看参考答案（不改草稿）' }).click();
  await expect(editor(page)).toHaveText('SELECT 42;');
  const fill = page.getByRole('button', { name: '填入答案', exact: true });
  await fill.click();
  await expect(page.getByRole('dialog')).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(fill).toBeFocused();
  await expect(editor(page)).toHaveText('SELECT 42;');
  await fill.click();
  await page.getByRole('button', { name: '确认替换' }).click();
  await expect(editor(page)).toHaveText(solution);
  await editor(page).focus();
  await page.keyboard.press('Control+z');
  await expect(editor(page)).toHaveText('SELECT 42;');
  let workers = 0;
  page.on('worker', () => workers++);
  const reset = page.getByRole('button', { name: '恢复默认', exact: true });
  await reset.focus();
  await page.keyboard.press('Enter');
  await expect(reset).toBeFocused();
  await expect(page.getByRole('dialog')).toHaveCount(0);
  await expect(editor(page)).toContainText('-- 在下方查询图书名称和价格。');
  await editor(page).focus();
  await page.keyboard.press('Control+z');
  await expect(editor(page)).toHaveText('SELECT 42;');
  expect(workers).toBe(0);
  await editor(page).focus();
  await page.keyboard.press('Tab');
  await expect(
    page.getByRole('button', { name: '运行', exact: true }),
  ).toBeFocused();
});

test('real mismatches, SQL errors, cancellation and timeout are distinct and never pass a lesson', async ({
  page,
}) => {
  await ready(page);
  // This matches the preview exactly but ignores the empty-table case.
  await editor(page).fill(
    "SELECT '数据库入门' AS title, 39 AS price UNION ALL SELECT 'SQL 手册', 59 UNION ALL SELECT 'SQL 手册', 59;",
  );
  await page.getByRole('button', { name: '运行', exact: true }).click();
  await expect(page.getByText(/运行未通过：用例 2/)).toBeVisible();
  await expect(page.getByText('当前版本未通过', { exact: true })).toBeVisible();
  await expect(
    page.getByRole('region', { name: '参考结果 · 用例 2，可横向滚动' }),
  ).toContainText('空结果（0 行）');
  await saved(page);
  expect(
    (await page.evaluate(() => window.storageTest.read())).records[0]?.passed,
  ).toBe(false);
  await editor(page).fill('SELECT DISTINCT title, price FROM books;');
  await page.getByRole('button', { name: '运行', exact: true }).click();
  await expect(page.getByText(/运行未通过：用例 1/)).toBeVisible();
  await expect(
    page.getByRole('region', { name: '实际结果 · 用例 1，可横向滚动' }),
  ).toBeVisible();
  await expect(
    page.getByRole('region', { name: '参考结果 · 用例 1，可横向滚动' }),
  ).toBeVisible();
  await editor(page).fill('DELETE FROM books;');
  await page.getByRole('button', { name: '运行', exact: true }).click();
  await expect(page.getByText(/执行失败：/)).toBeVisible();
  await editor(page).fill(
    'WITH RECURSIVE n(x) AS (VALUES(1) UNION ALL SELECT x+1 FROM n) SELECT sum(x) FROM n;',
  );
  await page.getByRole('button', { name: '运行', exact: true }).click();
  await expect(
    page.getByText('运行：正在检查用例 1 / 2…', { exact: true }),
  ).toBeVisible();
  await page.getByRole('button', { name: '取消执行' }).click();
  await expect(
    page.getByText('执行已取消，不记录通关。', { exact: true }),
  ).toBeVisible();
  await page.getByRole('button', { name: '运行', exact: true }).click();
  await expect(page.getByText(/执行超时：/)).toBeVisible();
  await saved(page);
  expect(
    (await page.evaluate(() => window.storageTest.read())).records[0]?.passed,
  ).toBe(false);
});

test('edits during a delayed real WASM run retain the new draft, while lesson/theme switches cancel old requests', async ({
  page,
}) => {
  await multipleLessons(page);
  await ready(page);
  let release: () => void = () => {};
  let requested: () => void = () => {};
  const gate = new Promise<void>((resolve) => {
    release = resolve;
  });
  const arrival = new Promise<void>((resolve) => {
    requested = resolve;
  });
  await page.route('**/*.wasm', async (route) => {
    requested();
    await gate;
    await route.continue();
  });
  await editor(page).fill(solution);
  await page.getByRole('button', { name: '运行', exact: true }).click();
  await arrival;
  await expect(
    page.getByRole('button', { name: '运行', exact: true }),
  ).toBeDisabled();
  await editor(page).fill('SELECT 123;');
  release();
  await expect(page.getByText(/运行通过，全部 2 个用例通过/)).toBeVisible();
  await expect(page.getByText(/此结果对应上面的 SQL 快照/)).toBeVisible();
  await saved(page);
  expect(
    (await page.evaluate(() => window.storageTest.read())).records[0],
  ).toMatchObject({ draftSql: 'SELECT 123;', passed: true });
  await page.unroute('**/*.wasm');
  const endless =
    'WITH RECURSIVE n(x) AS (VALUES(1) UNION ALL SELECT x+1 FROM n) SELECT sum(x) FROM n;';
  await editor(page).fill(endless);
  await page.getByRole('button', { name: '运行', exact: true }).click();
  await expect(
    page.getByText('运行：正在检查用例 1 / 2…', { exact: true }),
  ).toBeVisible();
  await page.getByRole('button', { name: '另一关', exact: true }).click();
  await expect(editor(page)).toContainText('第二关模板');
  await expect(
    page.getByText(/正在查询预览数据|正在检查用例|运行通过|执行超时/),
  ).toHaveCount(0);
  await editor(page).fill('SELECT 99;');
  await page.getByLabel('练习主题').selectOption('other-theme');
  await expect(editor(page)).toContainText('另一主题模板');
  await editor(page).fill('SELECT 88;');
  await page.getByLabel('练习主题').selectOption('library');
  await expect(editor(page)).toHaveText(endless);
  await page.getByRole('button', { name: '另一关', exact: true }).click();
  await expect(editor(page)).toHaveText('SELECT 99;');
  await saved(page);
  const records = (await page.evaluate(() => window.storageTest.read()))
    .records;
  expect(
    records.find((record) => record.lessonId === 'second-query')?.passed,
  ).toBe(false);
  expect(
    records.find((record) => record.themeId === 'other-theme'),
  ).toMatchObject({ draftSql: 'SELECT 88;', passed: false });
});

test('write failure retains multiple drafts, exports them and only retries after explicit confirmation', async ({
  page,
}) => {
  await multipleLessons(page);
  await ready(page);
  await page.evaluate(() => {
    const original = IDBObjectStore.prototype.put;
    IDBObjectStore.prototype.put = function (...args) {
      if (
        this.name === 'records' &&
        sessionStorage.getItem('fail-writes') === 'yes'
      )
        throw new DOMException('测试：本机空间不足', 'QuotaExceededError');
      return original.apply(this, args);
    };
    sessionStorage.setItem('fail-writes', 'yes');
  });
  await editor(page).fill('SELECT 11;');
  await expect(page.getByText(/本页草稿仍保留/)).toBeVisible();
  await page.getByRole('button', { name: '另一关', exact: true }).click();
  await editor(page).fill('SELECT 22;');
  await page.getByRole('button', { name: '选择图书字段', exact: true }).click();
  await expect(editor(page)).toHaveText('SELECT 11;');
  await page.getByRole('button', { name: '检查已存记录 / 导出' }).click();
  await page.getByRole('button', { name: '生成分卷备份' }).click();
  const downloadEvent = page.waitForEvent('download');
  await page.getByRole('link', { name: '下载第 1 / 1 卷' }).click();
  const download = await downloadEvent;
  const path = await download.path();
  if (!path) throw new Error('Missing download');
  const backup: unknown = JSON.parse(await readFile(path, 'utf8'));
  expect(validateBackupPartStructure(backup)).toBe(true);
  if (!validateBackupPartStructure(backup)) throw new Error('Invalid backup');
  expect(backup.records.map((record) => record.draftSql).sort()).toEqual([
    'SELECT 11;',
    'SELECT 22;',
  ]);
  await page.evaluate(() => sessionStorage.removeItem('fail-writes'));
  expect(
    (await page.evaluate(() => window.storageTest.read())).records,
  ).toEqual([]);
  await page.getByRole('button', { name: '确认合并并保存本页修改' }).click();
  await expect(page.getByRole('dialog')).toHaveCount(0);
  expect(
    (await page.evaluate(() => window.storageTest.read())).records,
  ).toHaveLength(2);
});

test('missing metadata access still permits practice and a clearly partial page export', async ({
  page,
}) => {
  await page.addInitScript(() => {
    IDBFactory.prototype.open = () => {
      throw new DOMException('测试：记录不可读', 'SecurityError');
    };
  });
  await ready(page);
  await expect(page.getByText(/本页草稿仍保留/)).toBeVisible();
  await editor(page).fill(solution);
  await page.getByRole('button', { name: '运行', exact: true }).click();
  await expect(page.getByText(/本次通过未写入正式记录/)).toBeVisible();
  await page.getByRole('button', { name: '检查已存记录 / 导出' }).click();
  await page.getByRole('button', { name: '导出本页保留的草稿' }).click();
  await expect(page.getByText(/不是完整备份/)).toBeVisible();
});

test('two tabs pause on conflicts and require a choice for the conflicting SQL field', async ({
  page,
  context,
}) => {
  await ready(page);
  await editor(page).fill('SELECT 1;');
  await saved(page);
  const other = await context.newPage();
  await ready(other);
  await editor(page).fill('SELECT 2;');
  await saved(page);
  await expect(other.getByText(/收到其他页面/)).toBeVisible();
  await editor(other).fill('SELECT 3;');
  await other.getByRole('button', { name: '检查已存记录 / 导出' }).click();
  await expect(
    other.getByRole('button', { name: '确认合并并保存本页修改' }),
  ).toBeDisabled();
  await other.getByLabel('选择保留的字段').selectOption('local');
  await other.getByRole('button', { name: '确认合并并保存本页修改' }).click();
  await expect(other.getByRole('dialog')).toHaveCount(0);
  expect(
    (await other.evaluate(() => window.storageTest.read())).records[0]
      ?.draftSql,
  ).toBe('SELECT 3;');
  await expect(page.getByText(/收到其他页面/)).toBeVisible();
});

for (const operation of ['clear', 'import']) {
  test(`${operation}: preview and Escape preserve practice; confirmation terminates delayed real WASM and cannot resurrect records`, async ({
    page,
  }) => {
    await ready(page);
    await editor(page).fill(solution);
    await saved(page);
    const original = await page.evaluate(() => window.storageTest.read());
    let release: () => void = () => {};
    let arrive: () => void = () => {};
    const gate = new Promise<void>((resolve) => {
      release = resolve;
    });
    const arrival = new Promise<void>((resolve) => {
      arrive = resolve;
    });
    await page.route('**/*.wasm', async (route) => {
      arrive();
      await gate;
      await route.continue();
    });
    await page.getByRole('button', { name: '运行', exact: true }).click();
    await arrival;
    const tools = page.getByRole('button', {
      name: '学习记录：备份 / 导入 / 清除',
    });
    async function preview() {
      await tools.click();
      if (operation === 'clear') {
        await page.getByRole('button', { name: '预览清除全部记录' }).click();
        await expect(
          page.getByRole('heading', { name: '清除预览' }),
        ).toBeVisible();
      } else {
        const parts = await page.evaluate(
          (records) =>
            window.storageTest.backup(
              records.map((record) => ({
                ...record,
                draftSql: 'SELECT 888;',
                passed: false,
              })),
            ),
          original.records,
        );
        await page
          .getByLabel('选择整组备份文件（每卷至多 5 MiB）')
          .setInputFiles(
            parts.map((text, index) => ({
              name: `ignored-name-${index}.json`,
              mimeType: 'application/json',
              buffer: Buffer.from(text),
            })),
          );
        await page.getByRole('button', { name: '校验整组并预览' }).click();
        await expect(
          page.getByRole('heading', { name: '导入预览' }),
        ).toBeVisible();
      }
    }
    await preview();
    expect(await page.evaluate(() => window.storageTest.read())).toEqual(
      original,
    );
    await page.keyboard.press('Escape');
    await expect(page.getByRole('dialog')).toHaveCount(0);
    await expect(tools).toBeFocused();
    await expect(editor(page)).toHaveText(solution);
    await expect(
      page.getByText('正在加载 SQL 引擎并准备请求…', { exact: true }),
    ).toBeVisible();
    await preview();
    await page
      .getByRole('button', {
        name: operation === 'clear' ? '确认清除全部记录' : '确认整体替换',
        exact: true,
      })
      .click();
    await expect(page.getByRole('dialog')).toHaveCount(0);
    release();
    await page.waitForTimeout(600);
    const after = await page.evaluate(() => window.storageTest.read());
    expect(after.metadata.recordGeneration).toBe(
      original.metadata.recordGeneration + 1,
    );
    expect(after.metadata.recordSetVersion).toBe(
      original.metadata.recordSetVersion + 1,
    );
    if (operation === 'clear') expect(after.records).toEqual([]);
    else {
      expect(after.records[0]).toMatchObject({
        draftSql: 'SELECT 888;',
        passed: false,
      });
      await expect(editor(page)).toHaveText('SELECT 888;');
    }
    await expect(page.getByText(/运行通过|正在检查用例|执行超时/)).toHaveCount(
      0,
    );
  });
}

test('record tools fit mobile, support keyboard confirmation cancellation, and show real import errors without changing data', async ({
  page,
}) => {
  await ready(page);
  await editor(page).fill(solution);
  await saved(page);
  const before = await page.evaluate(() => window.storageTest.read());
  await page.setViewportSize({ width: 390, height: 844 });
  const tools = page.getByRole('button', {
    name: '学习记录：备份 / 导入 / 清除',
  });
  await tools.click();
  await page.getByLabel('选择整组备份文件（每卷至多 5 MiB）').setInputFiles({
    name: 'bad.json',
    mimeType: 'application/json',
    buffer: Buffer.from('{"records":[]}'),
  });
  await page.getByRole('button', { name: '校验整组并预览' }).click();
  await expect(page.getByRole('alert')).toContainText('格式无效');
  await expect(
    page.getByRole('button', { name: '确认整体替换', exact: true }),
  ).toHaveCount(0);
  await page.getByRole('button', { name: '预览清除全部记录' }).click();
  await expect(page.getByRole('heading', { name: '清除预览' })).toBeVisible();
  const confirm = page.getByRole('button', {
    name: '确认清除全部记录',
    exact: true,
  });
  await confirm.focus();
  await page.keyboard.press('Tab');
  await expect(page.getByRole('button', { name: '取消 / 关闭' })).toBeFocused();
  for (const width of [1440, 390, 320]) {
    await page.setViewportSize({ width, height: 900 });
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBe(true);
    const box = await page.getByRole('dialog').evaluate((dialog) => ({
      scroll: dialog.scrollWidth,
      width: dialog.clientWidth,
    }));
    expect(box.scroll).toBeLessThanOrEqual(box.width);
  }
  await page.screenshot({
    path: 'test-results/record-tools-mobile.png',
    fullPage: true,
  });
  await page.keyboard.press('Escape');
  await expect(tools).toBeFocused();
  expect(await page.evaluate(() => window.storageTest.read())).toEqual(before);
});

test('desktop editor stays usable beside lower table data and its results scroll independently', async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await ready(page);
  const data = page.getByRole('region', {
    name: 'books 预览数据，可横向滚动',
  });
  const run = page.getByRole('button', { name: '运行', exact: true });
  await data.evaluate((element) => element.scrollIntoView({ block: 'center' }));
  expect(await page.evaluate(() => scrollY)).toBeGreaterThan(0);
  await expect(data).toBeInViewport();
  await expect(editor(page)).toBeInViewport({ ratio: 1 });
  await expect(run).toBeInViewport({ ratio: 1 });
  const readingPosition = await page.evaluate(() => scrollY);
  await editor(page).fill('sel');
  await page.getByRole('button', { name: '补全（Ctrl+Space）' }).click();
  await expect(page.getByRole('listbox')).toBeInViewport({ ratio: 1 });
  await page.getByRole('listbox').getByRole('option').first().click();
  await expect(editor(page)).toHaveText('SELECT');
  await editor(page).fill(solution);
  await page.keyboard.press('Tab');
  await expect(run).toBeFocused();
  await page.keyboard.press('Enter');
  await expect(page.getByText(/运行通过，全部 2 个用例通过/)).toBeVisible();
  expect(await page.evaluate(() => scrollY)).toBe(readingPosition);
  await page.screenshot({
    path: 'test-results/practice-desktop-scrolled.png',
  });

  // A short viewport must still allow keyboard access to the entire result.
  await page.setViewportSize({ width: 1024, height: 480 });
  const result = page.getByRole('region', {
    name: '实际结果 · 用例 1，可横向滚动',
  });
  const beforeResultFocus = await page.evaluate(() => scrollY);
  await result.focus();
  await expect(result).toBeFocused();
  await expect(result.locator('tbody tr').last()).toBeInViewport();
  expect(await page.evaluate(() => scrollY)).toBe(beforeResultFocus);
  await page.screenshot({
    path: 'test-results/practice-desktop-short.png',
  });
  await editor(page).focus();
  await expect(editor(page)).toBeInViewport();
  await page.keyboard.press('Tab');
  await expect(run).toBeFocused();
  await expect(run).toBeInViewport({ ratio: 1 });
  expect(await page.evaluate(() => scrollY)).toBe(beforeResultFocus);
});

test('desktop and mobile panels, keyboard focus, SQL limits and long tables do not overflow the page', async ({
  page,
}) => {
  await ready(page);
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.screenshot({
    path: 'test-results/practice-desktop.png',
    fullPage: true,
  });
  const nav = await page
    .getByRole('navigation', { name: '课程目录' })
    .boundingBox();
  const task = await page.locator('#panel-0').boundingBox();
  const sql = await page.locator('#panel-2').boundingBox();
  expect(nav && task && sql && nav.x < task.x && task.x < sql.x).toBe(true);
  await editor(page).fill(`SELECT '${'x'.repeat(1200)}' AS long_text;`);
  await page.getByRole('button', { name: '运行', exact: true }).click();
  await expect(page.getByText(/运行未通过：用例 1/)).toBeVisible();
  for (const width of [1024, 768, 390, 320]) {
    await page.setViewportSize({ width, height: 900 });
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBe(true);
  }
  await page.setViewportSize({ width: 390, height: 844 });
  await page.getByRole('tab', { name: '题目', exact: true }).click();
  await page.keyboard.press('ArrowRight');
  await expect(
    page.getByRole('tab', { name: '数据', exact: true }),
  ).toBeFocused();
  await expect(
    page.getByRole('heading', { name: '数据与表结构' }),
  ).toBeVisible();
  await expect(editor(page)).toBeHidden();
  await page.keyboard.press('End');
  await expect(
    page.getByRole('tab', { name: '结果', exact: true }),
  ).toBeFocused();
  await page.keyboard.press('Home');
  await expect(
    page.getByRole('tab', { name: '题目', exact: true }),
  ).toBeFocused();
  await page.screenshot({
    path: 'test-results/practice-mobile-task.png',
    fullPage: true,
  });
  await page.getByRole('tab', { name: 'SQL', exact: true }).click();
  await editor(page).fill(solution);
  await editor(page).focus();
  await page.keyboard.press('Tab');
  await expect(
    page.getByRole('button', { name: '运行', exact: true }),
  ).toBeFocused();
  expect(
    await page
      .getByRole('button', { name: '运行', exact: true })
      .evaluate((element) => getComputedStyle(element).outlineStyle),
  ).not.toBe('none');
  expect(
    await editor(page).evaluate(
      (element) => getComputedStyle(element).fontSize,
    ),
  ).toBe('16px');
  await editor(page).fill('x'.repeat(20001));
  await expect(page.getByRole('alert')).toContainText('本次超限修改未应用');
  await expect(editor(page)).toHaveText(solution);
  await page.screenshot({
    path: 'test-results/practice-mobile-sql.png',
    fullPage: true,
  });
  await page.getByRole('button', { name: '运行', exact: true }).click();
  await expect(
    page.getByRole('tab', { name: '结果', exact: true }),
  ).toBeFocused();
  await expect(page.getByText(/运行通过，全部 2 个用例通过/)).toBeVisible();
  await page.getByRole('tab', { name: 'SQL', exact: true }).click();
  await page.getByRole('button', { name: '恢复默认', exact: true }).click();
  await expect(page.getByRole('dialog')).toHaveCount(0);
  await expect(editor(page)).toContainText('-- 在下方查询图书名称和价格。');
  const sizes = await page
    .locator('button:visible, select:visible, summary:visible')
    .evaluateAll((elements) =>
      elements.map((element) => element.getBoundingClientRect().height),
    );
  expect(sizes.every((height) => height >= 44)).toBe(true);
});
