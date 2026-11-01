import { expect, test } from '@playwright/test';
import type { Page } from '@playwright/test';
import { readFile } from 'node:fs/promises';
import { publishedContent } from '../content-helpers.ts';
import { joinPuzzle, validateContent } from '../../src/content/semantics.ts';
import { validateBackupPartStructure } from '../../src/contracts/generated/validators.js';
import type {} from './storage-harness.ts';

const editor = (page: Page) =>
  page.getByRole('textbox', { name: 'SQL 编辑器' });
const mode = (page: Page, name: string) =>
  page
    .getByRole('group', { name: 'SQL 输入方式' })
    .getByRole('button', { name, exact: true });
const preview = (page: Page) =>
  page.getByLabel('拼图 SQL 预览', { exact: true });
const area = (page: Page) =>
  page.getByRole('region', { name: '有序拼接区', exact: true });
const add = (page: Page, index: number) =>
  page.getByRole('button', { name: new RegExp(`^添加卡片 ${index}：`) });
const piece = (page: Page, index: number) =>
  page.getByRole('button', { name: new RegExp(`^选择第 ${index} 张卡片：`) });
const saved = (page: Page) =>
  expect(page.getByText('已保存到本机', { exact: true })).toBeVisible();

async function ready(page: Page) {
  await page.goto('./');
  await expect(
    page.getByRole('heading', { name: '查看图书名称与价格' }),
  ).toBeVisible();
  await page.addScriptTag({
    type: 'module',
    url: '/sql-quest/tests/browser/storage-harness.ts',
  });
  await page.waitForFunction(() => Boolean(window.storageTest));
}
async function reference(page: Page) {
  await page.getByRole('button', { name: '查看参考拼法（不改草稿）' }).click();
  await page.getByRole('button', { name: '填入参考拼法', exact: true }).click();
  await page.getByRole('button', { name: '确认替换拼图' }).click();
}
async function multiLesson(page: Page) {
  const { course, documents } = await publishedContent();
  const lesson = validateContent(course, documents).lessons[0];
  const chapter = course.themes[0]?.chapters[0];
  if (!lesson || !chapter) throw new Error('Missing lesson');
  const path = `releases/r${course.revision}/second.json`;
  chapter.lessons.push({
    id: 'second-query',
    title: '另一关',
    prerequisites: [],
    path,
  });
  documents.set(path, {
    ...lesson,
    id: 'second-query',
    title: '另一关',
    introducedConcepts: [],
  });
  validateContent(course, documents);
  await page.route('**/content/**/*.json', (route) => {
    const path = new URL(route.request().url()).pathname.split('/content/')[1];
    return route.fulfill({
      json: path === 'course.json' ? course : documents.get(path ?? ''),
    });
  });
}
async function tools(page: Page) {
  await page
    .getByRole('button', { name: /学习记录：备份|检查已存记录/ })
    .click();
}
async function startDrag(page: Page) {
  const dataTransfer = await page.evaluateHandle(() => new DataTransfer());
  await page
    .getByRole('list', { name: '卡片池', exact: true })
    .getByRole('button')
    .last()
    .dispatchEvent('dragstart', { dataTransfer });
  return dataTransfer;
}

test('keyboard card actions, confirmations and independent undo survive mode switches and reload', async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  const errors: string[] = [];
  page.on('pageerror', (error) => errors.push(error.message));
  await ready(page);
  await editor(page).fill('SEL');
  await page.keyboard.press('Control+Space');
  await expect(page.getByRole('listbox')).toBeVisible();
  await mode(page, '拼图').click();
  await expect(page.getByRole('listbox')).toHaveCount(0);
  await mode(page, '文本').click();
  await editor(page).fill('SELECT 42;');
  await mode(page, '拼图').click();
  await expect(preview(page)).toHaveText('');
  await add(page, 1).focus();
  await page.keyboard.press('Enter');
  await expect(piece(page, 1)).toBeFocused();
  await add(page, 3).click();
  await page.keyboard.press('Tab');
  await expect(
    page.getByRole('button', { name: '前移第 2 张卡片' }),
  ).toBeFocused();
  await page.keyboard.press('Space');
  await expect(preview(page)).toHaveText('SELECT FROM books');
  await expect(piece(page, 1)).toBeFocused();
  await page.getByRole('button', { name: '后移第 1 张卡片' }).click();
  await expect(preview(page)).toHaveText('FROM books SELECT');
  await piece(page, 1).click();
  await page.getByRole('button', { name: '移除第 1 张卡片' }).click();
  await expect(preview(page)).toHaveText('SELECT');
  await expect(piece(page, 1)).toBeFocused();
  await page.getByRole('button', { name: '撤销拼图操作' }).click();
  await expect(preview(page)).toHaveText('FROM books SELECT');
  await page.getByRole('button', { name: '查看参考拼法（不改草稿）' }).click();
  await expect(preview(page)).toHaveText('FROM books SELECT');
  const fillReference = page.getByRole('button', {
    name: '填入参考拼法',
    exact: true,
  });
  await fillReference.click();
  await page.keyboard.press('Escape');
  await expect(fillReference).toBeFocused();
  await expect(preview(page)).toHaveText('FROM books SELECT');
  await fillReference.click();
  await page.getByRole('button', { name: '确认替换拼图' }).click();
  const sql = await preview(page).textContent();
  expect(sql).toBe('SELECT title , price FROM books ;');
  await page.getByRole('button', { name: '清空拼图', exact: true }).click();
  await page.getByRole('button', { name: '取消 / 关闭' }).click();
  await expect(preview(page)).toHaveText(sql ?? '');
  await page.getByRole('button', { name: '清空拼图', exact: true }).click();
  await page.getByRole('button', { name: '确认替换拼图' }).click();
  await expect(preview(page)).toHaveText('');
  await expect(area(page)).toBeFocused();
  await mode(page, '文本').click();
  await expect(editor(page)).toHaveText('SELECT 42;');
  await mode(page, '拼图').click();
  await page.getByRole('button', { name: '撤销拼图操作' }).click();
  await expect(preview(page)).toHaveText(sql ?? '');
  await page.getByRole('button', { name: '填入编辑器', exact: true }).click();
  await page.keyboard.press('Escape');
  await expect(mode(page, '拼图')).toHaveAttribute('aria-pressed', 'true');
  await mode(page, '文本').click();
  await expect(editor(page)).toHaveText('SELECT 42;');
  await mode(page, '拼图').click();
  await page.getByRole('button', { name: '填入编辑器', exact: true }).click();
  await page.getByRole('button', { name: '确认替换', exact: true }).click();
  await expect(editor(page)).toHaveText(sql ?? '');
  await expect(editor(page)).toBeFocused();
  await page.keyboard.press('Control+z');
  await expect(editor(page)).toHaveText('SELECT 42;');
  await mode(page, '拼图').click();
  await expect(preview(page)).toHaveText(sql ?? '');
  await saved(page);
  await page.getByRole('button', { name: '收起参考拼法', exact: true }).click();
  await piece(page, 2).click();
  await page
    .locator('#panel-2')
    .screenshot({ path: 'test-results/puzzle-workbench.png' });
  await page.screenshot({
    path: 'test-results/puzzle-desktop.png',
    fullPage: true,
  });
  await page.reload();
  await expect(mode(page, '拼图')).toHaveAttribute('aria-pressed', 'true');
  await expect(preview(page)).toHaveText(sql ?? '');
  await mode(page, '文本').click();
  await expect(editor(page)).toHaveText('SELECT 42;');
  expect(errors).toEqual([]);
});

test('whole pieces add once and keyboard selection changes focus, not the saved SQL or undo history', async ({
  page,
}) => {
  await ready(page);
  await mode(page, '拼图').click();
  const pool = page.getByRole('list', { name: '卡片池', exact: true });
  for (const sql of ['SELECT', 'title', 'price'])
    await pool.getByText(sql, { exact: true }).click();
  await expect(add(page, 3)).toBeDisabled();
  await expect(add(page, 4)).toBeDisabled();
  await expect(add(page, 2)).toBeDisabled();
  await saved(page);
  const before = await page.evaluate(() => window.storageTest.read());
  await piece(page, 2).click();
  for (const [key, position] of [
    ['End', 3],
    ['Home', 1],
    ['ArrowRight', 2],
    ['ArrowLeft', 1],
  ] as const) {
    await page.keyboard.press(key);
    await expect(piece(page, position)).toBeFocused();
    await expect(piece(page, position)).toHaveAttribute('aria-pressed', 'true');
    await expect(preview(page)).toHaveText('SELECT title price');
  }
  expect(
    await piece(page, 1).evaluate((element) => ({
      style: getComputedStyle(element).outlineStyle,
      width: getComputedStyle(element).outlineWidth,
    })),
  ).toEqual({ style: 'solid', width: '2px' });
  await saved(page);
  expect(await page.evaluate(() => window.storageTest.read())).toEqual(before);
  await page.getByRole('button', { name: '撤销拼图操作' }).click();
  await expect(preview(page)).toHaveText('SELECT title');
  await expect(add(page, 2)).toBeEnabled();
});

test('native drags reorder on either half of a piece and show insertion cues that clear on drop or cancel', async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 1200 });
  await ready(page);
  await mode(page, '拼图').click();
  await reference(page);
  await page.getByRole('button', { name: '收起参考拼法', exact: true }).click();
  await piece(page, 5).dragTo(piece(page, 2), {
    targetPosition: { x: 3, y: 26 },
  });
  await expect(preview(page)).toHaveText('SELECT FROM books title , price ;');
  await expect(piece(page, 2)).toBeFocused();
  const price = await piece(page, 5).boundingBox();
  if (!price) throw new Error('Missing target piece');
  await piece(page, 2).dragTo(piece(page, 5), {
    targetPosition: { x: price.width - 3, y: 26 },
  });
  const sql = 'SELECT title , price FROM books ;';
  await expect(preview(page)).toHaveText(sql);
  await add(page, 7).scrollIntoViewIfNeeded();
  const source = await add(page, 7).boundingBox();
  const target = await piece(page, 1).boundingBox();
  if (!source || !target) throw new Error('Missing drag pieces');
  await page.mouse.move(source.x + source.width / 2, source.y + 26);
  await page.mouse.down();
  await page.mouse.move(target.x + 3, target.y + 26, { steps: 10 });
  await page.mouse.move(target.x + 4, target.y + 26);
  await expect(area(page)).toHaveAttribute('data-drag-over', 'true');
  await expect(add(page, 7)).toHaveAttribute('data-dragging', 'true');
  const marker = area(page).locator('[data-drop-before="true"]');
  await expect(marker).toHaveCount(1);
  expect(
    await marker.evaluate((element) =>
      getComputedStyle(element, '::before').getPropertyValue('width'),
    ),
  ).toBe('3px');
  await page.mouse.up();
  await expect(preview(page)).toHaveText(`id ${sql}`);
  await expect(area(page)).toHaveAttribute('data-drag-over', 'false');
  await expect(marker).toHaveCount(0);
  await page.getByRole('button', { name: '撤销拼图操作' }).click();
  await expect(preview(page)).toHaveText(sql);
  await add(page, 7).dragTo(mode(page, '拼图'));
  await expect(add(page, 7)).toHaveAttribute('data-dragging', 'false');
  await expect(preview(page)).toHaveText(sql);

  const cancelled = await startDrag(page);
  await area(page).dispatchEvent('dragover', { dataTransfer: cancelled });
  await expect(area(page).locator('[data-drop-after="true"]')).toHaveCount(1);
  // dragend cannot read the token in a browser's protected drag data store.
  const protectedData = await page.evaluateHandle(() => new DataTransfer());
  await add(page, 7).dispatchEvent('dragend', { dataTransfer: protectedData });
  await expect(area(page)).toHaveAttribute('data-drag-over', 'false');
  await expect(add(page, 7)).toHaveAttribute('data-dragging', 'false');
  await area(page).dispatchEvent('drop', { dataTransfer: cancelled });
  await expect(preview(page)).toHaveText(sql);
});

test('real WASM grades a different equivalent sequence and freezes preview SQL and source while cards change', async ({
  page,
}) => {
  await ready(page);
  await editor(page).fill('SELECT 42;');
  await mode(page, '拼图').click();
  await reference(page);
  await piece(page, 6).click();
  await page.getByRole('button', { name: '移除第 6 张卡片' }).click();
  const sql = await preview(page).textContent();
  expect(sql).toBe('SELECT title , price FROM books');
  let release: () => void = () => {};
  let arrived: () => void = () => {};
  const gate = new Promise<void>((resolve) => {
    release = resolve;
  });
  const arrival = new Promise<void>((resolve) => {
    arrived = resolve;
  });
  await page.route('**/*.wasm', async (route) => {
    arrived();
    await gate;
    await route.continue();
  });
  await page.getByRole('button', { name: '运行', exact: true }).click();
  await arrival;
  await piece(page, 1).click();
  await page.getByRole('button', { name: '移除第 1 张卡片' }).click();
  await mode(page, '文本').click();
  await expect(editor(page)).toHaveText('SELECT 42;');
  release();
  await expect(page.getByText(/运行通过，全部 2 个用例通过/)).toBeVisible();
  await page.getByText('本次运行的 SQL 快照（拼图）', { exact: true }).click();
  expect(
    await page
      .locator('details')
      .filter({
        has: page.getByText('本次运行的 SQL 快照（拼图）', { exact: true }),
      })
      .locator('pre')
      .textContent(),
  ).toBe(sql);
  await expect(page.getByText(/草稿或输入方式已修改/)).toBeVisible();
  await saved(page);
  const records = (await page.evaluate(() => window.storageTest.read()))
    .records;
  expect(records[0]).toMatchObject({
    passed: true,
    draftSql: 'SELECT 42;',
    puzzleDraft: { sql: 'title , price FROM books' },
  });
});

test('dragging works, and old payloads after mode, lesson and record replacement cannot alter the new context', async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 1200 });
  await multiLesson(page);
  await ready(page);
  await mode(page, '拼图').click();
  const pool = page.getByRole('list', { name: '卡片池', exact: true });
  await pool.getByRole('button').first().dragTo(area(page));
  await expect(preview(page)).toHaveText('FROM books');
  const oldMode = await startDrag(page);
  await mode(page, '文本').click();
  await mode(page, '拼图').click();
  await area(page).dispatchEvent('drop', { dataTransfer: oldMode });
  await expect(preview(page)).toHaveText('FROM books');
  const oldLesson = await startDrag(page);
  await page.getByRole('button', { name: '另一关', exact: true }).click();
  await mode(page, '拼图').click();
  await area(page).dispatchEvent('drop', { dataTransfer: oldLesson });
  await expect(preview(page)).toHaveText('');
  await page.getByRole('button', { name: '选择图书字段', exact: true }).click();
  await expect(preview(page)).toHaveText('FROM books');
  await saved(page);
  const backup = await page.evaluate(async () =>
    window.storageTest.backup((await window.storageTest.read()).records),
  );
  for (const operation of ['clear', 'import']) {
    const old = await startDrag(page);
    await tools(page);
    if (operation === 'clear')
      await page.getByRole('button', { name: '预览清除全部记录' }).click();
    else {
      await page.getByLabel('选择整组备份文件（每卷至多 5 MiB）').setInputFiles(
        backup.map((text, index) => ({
          name: `${index}.json`,
          mimeType: 'application/json',
          buffer: Buffer.from(text),
        })),
      );
      await page.getByRole('button', { name: '校验整组并预览' }).click();
    }
    await page
      .getByRole('button', {
        name: operation === 'clear' ? '确认清除全部记录' : '确认整体替换',
        exact: true,
      })
      .click();
    await expect(page.getByRole('dialog')).toHaveCount(0);
    await mode(page, '拼图').click();
    const expected = operation === 'clear' ? '' : 'FROM books';
    // Even a new valid drag must not be consumed by the stale payload.
    const fresh = await startDrag(page);
    await area(page).dispatchEvent('drop', { dataTransfer: old });
    await expect(preview(page)).toHaveText(expected);
    await area(page).dispatchEvent('drop', { dataTransfer: fresh });
    await expect(preview(page)).toHaveText(expected ? `${expected} id` : 'id');
    await page.getByRole('button', { name: '撤销拼图操作' }).click();
    await expect(preview(page)).toHaveText(expected);
    await saved(page);
  }
});

test('failed saves retain both drafts across lessons and restore the exported atomic pairs', async ({
  page,
}) => {
  await multiLesson(page);
  await ready(page);
  await page.evaluate(() => {
    const original = IDBObjectStore.prototype.put;
    const originalAdd = IDBObjectStore.prototype.add;
    IDBObjectStore.prototype.put = function (...args) {
      if (
        this.name === 'records' &&
        sessionStorage.getItem('fail-writes') === 'yes'
      )
        throw new DOMException('测试：本机空间不足', 'QuotaExceededError');
      return original.apply(this, args);
    };
    IDBObjectStore.prototype.add = function (...args) {
      if (
        this.name === 'records' &&
        sessionStorage.getItem('fail-writes') === 'yes'
      )
        throw new DOMException('测试：本机空间不足', 'QuotaExceededError');
      return originalAdd.apply(this, args);
    };
    sessionStorage.setItem('fail-writes', 'yes');
  });
  await editor(page).fill('SELECT 11;');
  await mode(page, '拼图').click();
  await add(page, 3).click();
  await expect(page.getByText(/本页草稿仍保留/)).toBeVisible();
  await page.getByRole('button', { name: '另一关', exact: true }).click();
  await editor(page).fill('SELECT 22;');
  await mode(page, '拼图').click();
  await add(page, 1).click();
  await page.getByRole('button', { name: '选择图书字段', exact: true }).click();
  await expect(preview(page)).toHaveText('SELECT');
  await mode(page, '文本').click();
  await expect(editor(page)).toHaveText('SELECT 11;');
  await tools(page);
  await page.getByRole('button', { name: '生成分卷备份' }).click();
  const downloadEvent = page.waitForEvent('download');
  await page.getByRole('link', { name: '下载第 1 / 1 卷' }).click();
  const path = await (await downloadEvent).path();
  if (!path) throw new Error('Missing backup');
  const backup: unknown = JSON.parse(await readFile(path, 'utf8'));
  if (!validateBackupPartStructure(backup)) throw new Error('Invalid backup');
  expect(
    backup.records.map((record) => [record.draftSql, record.puzzleDraft]),
  ).toEqual([
    ['SELECT 11;', { cardOrder: ['select'], sql: 'SELECT' }],
    ['SELECT 22;', { cardOrder: ['source'], sql: 'FROM books' }],
  ]);
  expect(
    (await page.evaluate(() => window.storageTest.read())).records,
  ).toEqual([]);
  await page
    .getByLabel('选择整组备份文件（每卷至多 5 MiB）')
    .setInputFiles(path);
  await page.getByRole('button', { name: '校验整组并预览' }).click();
  await page.getByRole('button', { name: '确认整体替换', exact: true }).click();
  await expect(
    page.getByText(/记录替换失败|本页草稿保留，请重新预览/),
  ).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(editor(page)).toHaveText('SELECT 11;');
  await mode(page, '拼图').click();
  await expect(preview(page)).toHaveText('SELECT');
  await page.evaluate(() => sessionStorage.removeItem('fail-writes'));
  await tools(page);
  await page
    .getByLabel('选择整组备份文件（每卷至多 5 MiB）')
    .setInputFiles(path);
  await page.getByRole('button', { name: '校验整组并预览' }).click();
  await page.getByRole('button', { name: '确认整体替换', exact: true }).click();
  await expect(page.getByRole('dialog')).toHaveCount(0);
  expect(
    (await page.evaluate(() => window.storageTest.read())).records,
  ).toEqual(backup.records);
  await expect(editor(page)).toHaveText('SELECT 11;');
  await mode(page, '拼图').click();
  await expect(preview(page)).toHaveText('SELECT');
  await page.getByRole('button', { name: '另一关', exact: true }).click();
  await expect(preview(page)).toHaveText('FROM books');
  await mode(page, '文本').click();
  await expect(editor(page)).toHaveText('SELECT 22;');
});

test('cross-page conflicts choose the entire puzzle pair without overwriting the independent text draft', async ({
  page,
  context,
}) => {
  await ready(page);
  await editor(page).fill('SELECT 1;');
  await mode(page, '拼图').click();
  await add(page, 3).click();
  await saved(page);
  const other = await context.newPage();
  await ready(other);
  await expect(preview(other)).toHaveText('SELECT');
  await add(page, 1).click();
  await saved(page);
  await expect(other.getByText(/收到其他页面/)).toBeVisible();
  await piece(other, 1).click();
  await other.getByRole('button', { name: '移除第 1 张卡片' }).click();
  await add(other, 2).click();
  await mode(other, '文本').click();
  await editor(other).fill('SELECT 2;');
  await mode(other, '拼图').click();
  await tools(other);
  await expect(
    other.getByText(/拼图草稿（排列与 SQL 同次选择）/),
  ).toBeVisible();
  await expect(
    other.getByRole('button', { name: '确认合并并保存本页修改' }),
  ).toBeDisabled();
  await other.getByLabel('选择保留的字段').selectOption('local');
  await other.getByRole('button', { name: '确认合并并保存本页修改' }).click();
  await expect(other.getByRole('dialog')).toHaveCount(0);
  await expect(preview(other)).toHaveText('price');
  expect(
    (await other.evaluate(() => window.storageTest.read())).records[0],
  ).toMatchObject({
    draftSql: 'SELECT 2;',
    inputMode: 'puzzle',
    puzzleDraft: { cardOrder: ['price'], sql: 'price' },
  });
  await mode(other, '文本').click();
  await expect(editor(other)).toHaveText('SELECT 2;');
});

for (const problem of ['missing-config', 'unknown-card', 'sql-mismatch']) {
  test(`${problem}: historical puzzle data stays viewable and exportable but cannot run against new cards`, async ({
    page,
  }) => {
    await ready(page);
    await editor(page).fill('SELECT 42;');
    await saved(page);
    const { course, documents } = await publishedContent();
    const lesson = validateContent(course, documents).lessons[0];
    if (!lesson?.sqlPuzzle) throw new Error('Missing puzzle');
    const puzzleDraft =
      problem === 'unknown-card'
        ? { cardOrder: ['old-card'], sql: 'SELECT 17;' }
        : {
            cardOrder: [...lesson.sqlPuzzle.solutionOrder],
            sql:
              problem === 'sql-mismatch'
                ? 'SELECT 99;'
                : joinPuzzle(lesson.sqlPuzzle, lesson.sqlPuzzle.solutionOrder),
          };
    await page.evaluate(async (puzzleDraft) => {
      const snapshot = await window.storageTest.read();
      const base = snapshot.records[0];
      if (!base) throw new Error('Missing record');
      const texts = window.storageTest.backup([
        { ...base, inputMode: 'puzzle', puzzleDraft },
        {
          ...base,
          revision: base.revision - 1,
          inputMode: 'puzzle',
          puzzleDraft: { cardOrder: ['history'], sql: 'SELECT 18;' },
        },
      ]);
      const stage = await window.storageTest.stage(texts);
      await window.storageTest.replace(snapshot.metadata, stage);
    }, puzzleDraft);
    if (problem === 'missing-config') {
      delete lesson.sqlPuzzle;
      await page.route('**/book-list.json', (route) =>
        route.fulfill({ json: lesson }),
      );
    }
    await page.reload();
    await expect(editor(page)).toHaveText('SELECT 42;');
    await expect(page.getByText(/原排列与 SQL 保留供查看/)).toBeVisible();
    if (problem === 'missing-config')
      await expect(mode(page, '拼图')).toHaveCount(0);
    else await expect(mode(page, '拼图')).toBeDisabled();
    await page
      .getByText('保留的拼图草稿（仅查看 / 导出）', { exact: true })
      .click();
    await expect(
      page.getByText(puzzleDraft.sql, { exact: true }),
    ).toBeVisible();
    await page.getByText('历史版本草稿（原版本保留）', { exact: true }).click();
    await expect(page.getByText('SELECT 18;', { exact: true })).toBeVisible();
    await tools(page);
    await page.getByRole('button', { name: '生成分卷备份' }).click();
    const link = page.getByRole('link', { name: '下载第 1 / 1 卷' });
    const text = await link.evaluate(async (element) => {
      if (!(element instanceof HTMLAnchorElement))
        throw new Error('Missing link');
      return (await fetch(element.href)).text();
    });
    const backup: unknown = JSON.parse(text);
    if (!validateBackupPartStructure(backup)) throw new Error('Invalid backup');
    expect(
      backup.records.find((record) => record.revision === lesson.revision)
        ?.puzzleDraft,
    ).toEqual(puzzleDraft);
    expect(backup.records).toHaveLength(2);
  });
}

test.describe('touch puzzle', () => {
  test.use({
    viewport: { width: 390, height: 844 },
    isMobile: true,
    hasTouch: true,
  });
  test('all operations work without dragging at narrow widths, with visible focus and no page overflow', async ({
    page,
  }) => {
    await ready(page);
    await page.getByRole('tab', { name: 'SQL', exact: true }).tap();
    await mode(page, '拼图').tap();
    await add(page, 1).tap();
    await add(page, 3).tap();
    await page.getByRole('button', { name: '前移第 2 张卡片' }).tap();
    await expect(preview(page)).toHaveText('SELECT FROM books');
    await page.getByRole('button', { name: '后移第 1 张卡片' }).tap();
    await piece(page, 1).tap();
    await page.getByRole('button', { name: '移除第 1 张卡片' }).tap();
    await page.getByRole('button', { name: '撤销拼图操作' }).tap();
    await expect(preview(page)).toHaveText('FROM books SELECT');
    for (const width of [390, 320]) {
      await page.setViewportSize({ width, height: 700 });
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth,
        ),
      ).toBe(true);
      const boxes = await page
        .locator('button:visible, summary:visible')
        .evaluateAll((elements) =>
          elements.map((element) => ({
            width: element.getBoundingClientRect().width,
            height: element.getBoundingClientRect().height,
          })),
        );
      expect(boxes.every((box) => box.width >= 44 && box.height >= 44)).toBe(
        true,
      );
      expect(
        await preview(page).evaluate(
          (element) => getComputedStyle(element).fontSize,
        ),
      ).toBe('16px');
      await page.screenshot({
        path: `test-results/puzzle-mobile-${width}.png`,
        fullPage: true,
      });
    }
    await page.getByRole('tab', { name: 'SQL', exact: true }).focus();
    await page.keyboard.press('End');
    await expect(
      page.getByRole('tab', { name: '结果', exact: true }),
    ).toBeFocused();
    await page.keyboard.press('Home');
    await expect(
      page.getByRole('tab', { name: '题目', exact: true }),
    ).toBeFocused();
  });
});
