import { expect, test } from '@playwright/test';
import type { Page } from '@playwright/test';
import { publishedContent } from '../content-helpers.ts';
import { validateContent } from '../../src/content/semantics.ts';
import type {} from './editor-harness.ts';

const editor = (page: Page) =>
  page.getByRole('textbox', { name: 'SQL 编辑器' });
const menu = (page: Page) => page.getByRole('listbox');
const trigger = (page: Page) =>
  page.getByRole('button', { name: '补全（Ctrl+Space）', exact: true });
async function ready(page: Page) {
  await page.goto('./');
  await expect(page.locator('.cm-content')).toBeAttached();
  await page.addScriptTag({
    type: 'module',
    url: '/sql-quest/tests/browser/editor-harness.ts',
  });
  await page.waitForFunction(() => Boolean(window.editorTest));
}
async function write(page: Page, marked: string) {
  await editor(page).fill(marked.replace('|', ''));
  const pos = marked.indexOf('|');
  await page.evaluate(
    (pos) => window.editorTest.cursor(pos),
    pos === -1 ? marked.length : pos,
  );
}
async function open(page: Page) {
  await page.keyboard.press('Control+Space');
  await expect(menu(page)).toBeVisible();
  // CodeMirror intentionally delays keyboard selection for 75 ms after opening.
  await page.waitForTimeout(100);
}
async function extraContent(page: Page) {
  const { course, documents } = await publishedContent();
  const content = validateContent(course, documents);
  const lesson = content.lessons[0];
  const theme = course.themes[0];
  const chapter = theme?.chapters[0];
  if (!lesson || !theme || !chapter) throw new Error('Missing content');
  lesson.readableTables.push('authors');
  for (const fixture of content.fixtures) {
    const books = fixture.tables.find((table) => table.name === 'books');
    // 其他主题（如校园选课）的夹具没有 books 表，不参与本用例的改造。
    if (!books) continue;
    books.columns.push({
      name: 'returning',
      type: 'INTEGER',
      description: 'Reserved identifier',
    });
    for (const row of books.rows) row.push(1);
    if (!fixture.tables.some((table) => table.name === 'authors'))
      fixture.tables.push({ ...books, name: 'authors' });
    fixture.tables.push({
      name: 'private_table',
      description: 'Do not suggest',
      columns: [
        { name: 'private_column', type: 'TEXT', description: 'Hidden' },
      ],
      rows: [['private_row']],
    });
  }
  chapter.lessons.push({
    id: 'other-query',
    title: '另一关',
    prerequisites: [],
    path: `releases/r${course.revision}/other-query.json`,
  });
  const other = {
    ...lesson,
    id: 'other-query',
    title: '另一关',
    readableTables: ['authors'],
    introducedConcepts: [],
    starterSql: '-- 另一关模板\n',
    referenceSolutions: lesson.referenceSolutions.map((item) => ({
      ...item,
      sql: item.sql.replaceAll('books', 'authors'),
    })),
    expectedFailures: lesson.expectedFailures.map((item) => ({
      ...item,
      sql: item.sql.replaceAll('books', 'authors'),
    })),
  };
  documents.set(`releases/r${course.revision}/other-query.json`, other);
  course.themes.push({
    ...theme,
    id: 'other-theme',
    title: '另一主题',
    chapters: [
      {
        ...chapter,
        lessons: [
          {
            id: 'other-query',
            title: '另一关',
            prerequisites: [],
            path: `releases/r${course.revision}/other-theme.json`,
          },
        ],
      },
    ],
    concepts: [],
  });
  documents.set(`releases/r${course.revision}/other-theme.json`, {
    ...other,
    themeId: 'other-theme',
    concepts: [],
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

test('uppercase keyword selection, escape, Tab focus, suffix-only acceptance and isolated undo; no automatic execution', async ({
  page,
}) => {
  const workers: string[] = [];
  page.on('worker', (worker) => workers.push(worker.url()));
  await ready(page);
  await write(page, '|');
  await editor(page).pressSequentially('sel');
  await expect(menu(page)).toBeVisible();
  await expect(menu(page).getByRole('option').first()).toContainText('SELECT');
  await page.waitForTimeout(100);
  await page.keyboard.press('Enter');
  await expect(editor(page)).toHaveText('SELECT');
  await page.keyboard.press('Control+z');
  await expect(editor(page)).toHaveText('sel');
  await write(page, 'SELECT | FROM books');
  await open(page);
  const first = await editor(page).getAttribute('aria-activedescendant');
  await page.keyboard.press('ArrowDown');
  expect(await editor(page).getAttribute('aria-activedescendant')).not.toBe(
    first,
  );
  await page.keyboard.press('ArrowUp');
  expect(await editor(page).getAttribute('aria-activedescendant')).toBe(first);
  await page.keyboard.press('Escape');
  await expect(menu(page)).toHaveCount(0);
  await expect(editor(page)).toHaveText('SELECT  FROM books');
  await write(page, 'SELECT b.t|itle FROM books AS b;');
  await open(page);
  await expect(menu(page).getByRole('option').first()).toContainText(
    '字段 · books · TEXT',
  );
  await expect(menu(page).getByRole('option').first()).toContainText(
    '图书名称',
  );
  await page.keyboard.press('Enter');
  await expect(editor(page)).toHaveText('SELECT b.title FROM books AS b;');
  await page.keyboard.press('Control+z');
  await expect(editor(page)).toHaveText('SELECT b.title FROM books AS b;');
  // Use an incorrect suffix as well: matching only the prefix must still find title.
  await write(page, 'SELECT b.t|wrong FROM books AS b;');
  await open(page);
  await page.keyboard.press('Enter');
  await expect(editor(page)).toHaveText('SELECT b.title FROM books AS b;');
  await page.keyboard.press('Control+z');
  await expect(editor(page)).toHaveText('SELECT b.twrong FROM books AS b;');
  await page.keyboard.press('Control+Shift+z');
  await expect(editor(page)).toHaveText('SELECT b.title FROM books AS b;');
  await write(page, 'SELECT b.t| FROM books b;');
  await open(page);
  await page.keyboard.press('Tab');
  await expect(
    page.getByRole('button', { name: '运行', exact: true }),
  ).toBeFocused();
  await expect(menu(page)).toHaveCount(0);
  await expect(editor(page)).toHaveText('SELECT b.t FROM books b;');
  await editor(page).focus();
  await open(page);
  await page.keyboard.press('Shift+Tab');
  await expect(trigger(page)).toBeFocused();
  expect(workers).toEqual([]);
  await write(page, 'SELECT b.t| FROM books b;');
  await open(page);
  await page.keyboard.press('Enter');
  await page.getByRole('button', { name: '运行', exact: true }).click();
  await expect(page.getByText(/运行未通过：用例 1/)).toBeVisible();
  expect(workers.length).toBe(1);
});

test('JOIN duplicate names are qualified, quoted identifiers work, private schema and rows never appear', async ({
  page,
}) => {
  await extraContent(page);
  await ready(page);
  await write(page, 'SELECT i| FROM books b JOIN authors AS a ON b.id = a.id;');
  await open(page);
  const option = menu(page).getByRole('option').filter({ hasText: 'b.id' });
  await expect(option).toHaveCount(1);
  await expect(
    menu(page).getByRole('option').filter({ hasText: 'a.id' }),
  ).toHaveCount(1);
  await option.click();
  await expect(editor(page)).toHaveText(
    'SELECT b.id FROM books b JOIN authors AS a ON b.id = a.id;',
  );
  await page.keyboard.press('Control+z');
  await expect(editor(page)).toHaveText(
    'SELECT i FROM books b JOIN authors AS a ON b.id = a.id;',
  );
  for (const marked of [
    'SELECT B.t| FROM books AS B;',
    'SELECT b."t|itle" FROM books b;',
    'SELECT [b].t| FROM books [b];',
    'SELECT b.|twrong FROM books b;',
  ]) {
    await write(page, marked);
    await open(page);
    await menu(page)
      .getByRole('option')
      .filter({ hasText: '图书名称' })
      .click();
    await expect(editor(page)).toContainText('.title FROM');
    await expect(editor(page)).toBeFocused();
  }
  await write(page, '|');
  await open(page);
  const text = await menu(page).textContent();
  for (const hidden of [
    'private_table',
    'private_column',
    'private_row',
    '数据库入门',
    'SQL 手册',
    'PRAGMA',
    'INSERT',
  ])
    expect(text).not.toContain(hidden);
  await page.screenshot({
    path: 'test-results/completion-desktop.png',
    fullPage: true,
  });
  await write(page, 'SELECT b.re|turning FROM books b;');
  await open(page);
  await page.keyboard.press('Enter');
  await expect(editor(page)).toHaveText('SELECT b."returning" FROM books b;');
  await page.getByRole('button', { name: '运行', exact: true }).click();
  await expect(page.getByText(/运行未通过：用例 1/)).toBeVisible();
});

test('string/comment suppression and synthetic IME lifecycle do not steal composition keys', async ({
  page,
}) => {
  await ready(page);
  for (const marked of [
    "SELECT 'ti|'",
    'SELECT -- ti|',
    'SELECT /* ti| */ title FROM books',
    'SELECT :ti|',
  ]) {
    await write(page, marked);
    await trigger(page).click();
    await page.waitForTimeout(200);
    await expect(menu(page)).toHaveCount(0);
  }
  await write(page, 'SELECT b.t| FROM books b');
  await open(page);
  await editor(page).dispatchEvent('compositionstart', { data: '' });
  await expect(menu(page)).toHaveCount(0);
  const prevented = await editor(page).evaluate((element) =>
    ['Enter', 'ArrowDown', 'Escape', ' '].map((key) => {
      const event = new KeyboardEvent('keydown', {
        key,
        code: key === ' ' ? 'Space' : key,
        ctrlKey: key === ' ',
        isComposing: true,
        bubbles: true,
        cancelable: true,
      });
      element.dispatchEvent(event);
      return event.defaultPrevented;
    }),
  );
  expect(prevented).toEqual([false, false, false, false]);
  await page.keyboard.press('Control+Space');
  await page.waitForTimeout(200);
  await expect(menu(page)).toHaveCount(0);
  await expect(editor(page)).toHaveText('SELECT b.t FROM books b');
  await editor(page).dispatchEvent('compositionend', { data: '图' });
  await open(page);
  await page.keyboard.press('Escape');
  await editor(page).pressSequentially('i');
  await expect(menu(page)).toBeVisible();
  await expect(editor(page)).toHaveText('SELECT b.ti FROM books b');
});

test('ordinary changes, replacements, lesson/theme switches and record reset invalidate old candidates', async ({
  page,
}) => {
  await extraContent(page);
  await ready(page);
  await write(page, 'SELECT b.t| FROM books b');
  await open(page);
  await page.evaluate(() => window.editorTest.capture('title'));
  await write(page, 'SELECT a.| FROM authors a');
  await page.evaluate(() => window.editorTest.applyStale());
  await expect(editor(page)).toHaveText('SELECT a. FROM authors a');
  await write(page, 'SELECT b.t| FROM books b');
  await open(page);
  await page.evaluate(() => window.editorTest.capture('title'));
  await page.getByRole('button', { name: '恢复默认', exact: true }).click();
  await expect(page.getByRole('dialog')).toHaveCount(0);
  await expect(menu(page)).toHaveCount(0);
  await page.evaluate(() => window.editorTest.applyStale());
  await expect(editor(page)).toContainText('-- 在下方');
  await editor(page).focus();
  await page.keyboard.press('Control+z');
  await expect(editor(page)).toHaveText('SELECT b.t FROM books b');
  await write(page, 'SELECT b.t| FROM books b');
  await open(page);
  await page.evaluate(() => window.editorTest.capture('title'));
  await page.getByRole('button', { name: '另一关', exact: true }).click();
  await page.evaluate(() => window.editorTest.applyStale());
  await expect(editor(page)).toContainText('另一关模板');
  await write(page, '|');
  await open(page);
  await expect(menu(page)).not.toContainText('books');
  await write(page, 'SELECT a.t| FROM authors a');
  await open(page);
  await page.evaluate(() => window.editorTest.capture('title'));
  await page.getByLabel('练习主题').selectOption('other-theme');
  await page.evaluate(() => window.editorTest.applyStale());
  await expect(editor(page)).toContainText('另一主题模板');
  await write(page, 'SELECT a.t| FROM authors a');
  await open(page);
  await page.evaluate(() => window.editorTest.capture('title'));
  await page
    .getByRole('button', { name: '学习记录：备份 / 导入 / 清除' })
    .click();
  await page.getByRole('button', { name: '预览清除全部记录' }).click();
  await page
    .getByRole('button', { name: '确认清除全部记录', exact: true })
    .click();
  await expect(page.getByRole('dialog')).toHaveCount(0);
  await page.evaluate(() => window.editorTest.applyStale());
  await expect(editor(page)).toContainText('另一主题模板');
  await expect(menu(page)).toHaveCount(0);
  // Empty Text documents can be shared internally; the view identity must also match.
  await write(page, '|');
  await open(page);
  await page.evaluate(() => window.editorTest.capture('title'));
  await page.getByLabel('练习主题').selectOption('library');
  await write(page, '|');
  await page.evaluate(() => window.editorTest.applyStale());
  await expect(editor(page)).toHaveText('');
});

test.describe('touch completion', () => {
  test.use({
    viewport: { width: 390, height: 844 },
    hasTouch: true,
    isMobile: true,
  });
  test('clickable entry and touch acceptance fit small viewports and return editor focus', async ({
    page,
  }) => {
    await ready(page);
    await page.getByRole('tab', { name: 'SQL', exact: true }).tap();
    for (const width of [390, 320]) {
      await page.setViewportSize({ width, height: 600 });
      await write(page, 'SELECT b.t| FROM books b;');
      await trigger(page).tap();
      await expect(menu(page)).toBeVisible();
      const option = menu(page).getByRole('option').first();
      const box = await option.boundingBox();
      expect(box && box.width >= 44 && box.height >= 44).toBe(true);
      const bounds = await menu(page).boundingBox();
      expect(
        bounds &&
          bounds.x >= 0 &&
          bounds.x + bounds.width <= width &&
          bounds.y >= 0 &&
          bounds.y + bounds.height <= 600,
      ).toBe(true);
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth,
        ),
      ).toBe(true);
      await page.screenshot({
        path: `test-results/completion-mobile-${width}.png`,
        fullPage: true,
      });
      await option.tap();
      await expect(editor(page)).toHaveText('SELECT b.title FROM books b;');
      await expect(editor(page)).toBeFocused();
      await expect(menu(page)).toHaveCount(0);
      await page.keyboard.press('Control+z');
      await expect(editor(page)).toHaveText('SELECT b.t FROM books b;');
    }
  });
});
