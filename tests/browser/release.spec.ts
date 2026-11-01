import { expect, test } from '@playwright/test';
import { createHash } from 'node:crypto';
import { cp, mkdir, readFile, readdir, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { build, preview } from 'vite';
import { publishContent } from '../../scripts/publish-content.ts';
import { validateContent } from '../../src/content/semantics.ts';
import { sourceContent } from '../content-helpers.ts';

test('production SPA at a subpath loads local assets and new immutable JSON without rebuilding or replacing an open snapshot', async ({
  page,
}) => {
  test.setTimeout(90_000);
  const output = resolve('test-results/release-build');
  const source = resolve('test-results/release-source');
  await build({ build: { outDir: output, emptyOutDir: false } });
  const server = await preview({
    base: '/sql-quest/',
    build: { outDir: output },
    preview: {
      host: '127.0.0.1',
      port: 4176,
      strictPort: true,
      headers: {
        'Content-Security-Policy':
          "default-src 'self'; script-src 'self' 'wasm-unsafe-eval'; style-src 'self' 'unsafe-inline'; worker-src 'self'; connect-src 'self'; font-src 'self'; object-src 'none'; base-uri 'self'",
      },
    },
  });
  try {
    const fingerprint = async () => {
      const paths = [
        'index.html',
        ...(await readdir(resolve(output, 'assets'))).map(
          (name) => `assets/${name}`,
        ),
      ];
      return Promise.all(
        paths.sort().map(async (path) => [
          path,
          createHash('sha256')
            .update(await readFile(resolve(output, path)))
            .digest('hex'),
        ]),
      );
    };
    const before = await fingerprint();
    const requests: string[] = [];
    const errors: string[] = [];
    page.on('request', (request) => requests.push(request.url()));
    page.on('pageerror', (error) => errors.push(error.message));
    page.on('console', (message) => {
      if (message.type() === 'error') errors.push(message.text());
    });
    page.on('response', (response) => {
      if (response.status() >= 400)
        errors.push(`${response.status()} ${response.url()}`);
    });
    const address = 'http://127.0.0.1:4176/sql-quest/';
    await page.goto(address);
    const editor = page.getByRole('textbox', { name: 'SQL 编辑器' });
    await expect(editor).toBeVisible();
    const { course, documents } = await sourceContent();
    const content = validateContent(course, documents);
    const contentRequests = () =>
      requests.filter((url) => url.includes('/content/'));
    const initialRequests = contentRequests().length;
    for (const lesson of content.lessons) {
      await page.getByLabel('练习主题').selectOption(lesson.themeId);
      const index = course.themes
        .find((theme) => theme.id === lesson.themeId)
        ?.chapters.flatMap((chapter) => chapter.lessons)
        .find((item) => item.id === lesson.id);
      const solution = lesson.referenceSolutions[0];
      if (!index || !solution)
        throw new Error('Missing registered lesson or solution');
      await page
        .getByRole('button', { name: index.title, exact: true })
        .click();
      await editor.fill(solution.sql);
      await page.getByRole('button', { name: '运行', exact: true }).click();
      await expect(
        page.getByText(`运行通过，全部 ${lesson.tests.length} 个用例通过。`, {
          exact: false,
        }),
      ).toBeVisible();
      await expect(
        page.getByText('已保存到本机', { exact: true }),
      ).toBeVisible();
    }
    expect(contentRequests()).toHaveLength(initialRequests);
    await page.evaluate(() => document.fonts.ready);
    expect(
      await page.evaluate(
        () =>
          document.fonts.check('16px "Noto Sans SC"') &&
          document.fonts.check('14px "IBM Plex Mono"'),
      ),
    ).toBe(true);
    expect(requests.some((url) => url.endsWith('.wasm'))).toBe(true);
    expect(requests.some((url) => /\/worker-[^/]+\.js$/u.test(url))).toBe(true);
    expect(
      requests.some(
        (url) => url.includes('noto-sans-sc') && url.endsWith('.woff2'),
      ),
    ).toBe(true);
    expect(
      requests.some(
        (url) => url.includes('ibm-plex-mono') && url.endsWith('.woff2'),
      ),
    ).toBe(true);
    expect(requests.every((url) => url.startsWith(address))).toBe(true);
    expect(requests.some((url) => /opfs|tests\/browser/u.test(url))).toBe(
      false,
    );
    for (const [license, dependency] of [
      ['Noto-Sans-SC-LICENSE.txt', 'noto-sans-sc'],
      ['IBM-Plex-Mono-LICENSE.txt', 'ibm-plex-mono'],
    ]) {
      const response = await page.request.get(`${address}fonts/${license}`);
      expect(response.status()).toBe(200);
      expect(await response.text()).toBe(
        await readFile(
          resolve(`node_modules/@fontsource/${dependency}/LICENSE`),
          'utf8',
        ),
      );
    }
    await page.screenshot({
      path: 'test-results/release-desktop.png',
      fullPage: true,
    });

    // Publish only JSON into the isolated build copy. The application's bytes stay fixed.
    await cp(resolve('content'), source, { recursive: true });
    const theme = structuredClone(course.themes[0]);
    const lesson = structuredClone(content.lessons[0]);
    if (!theme || !lesson) throw new Error('Missing source theme');
    const sourceThemeId = theme.id;
    const index = theme.chapters[0]?.lessons[0];
    if (!index) throw new Error('Missing source index');
    theme.id = 'release-check';
    theme.title = '本地新增主题';
    lesson.themeId = theme.id;
    lesson.title = '仅发布 JSON 的新关卡';
    index.title = lesson.title;
    course.themes.push(theme);
    course.revision++;
    await mkdir(resolve(source, 'themes/release-check'), { recursive: true });
    // 克隆主题保留全部关卡，避免与原主题的登记地址重复。
    for (const chapter of theme.chapters) {
      for (const lessonIndex of chapter.lessons) {
        const sourceLesson = structuredClone(
          content.lessons.find(
            (item) =>
              item.themeId === sourceThemeId && item.id === lessonIndex.id,
          ),
        );
        if (!sourceLesson) throw new Error('Missing source lesson');
        sourceLesson.themeId = theme.id;
        if (lessonIndex === index) sourceLesson.title = lesson.title;
        lessonIndex.path = `themes/release-check/${lessonIndex.id}.json`;
        await writeFile(
          resolve(source, lessonIndex.path),
          JSON.stringify(sourceLesson),
        );
      }
    }
    await writeFile(resolve(source, 'course.json'), JSON.stringify(course));
    const oldRoot = await readFile(
      resolve(output, 'content/course.json'),
      'utf8',
    );
    await publishContent(source, resolve(output, 'content'));
    expect(await fingerprint()).toEqual(before);
    expect(
      await readFile(
        resolve(output, `content/releases/r${course.revision - 1}/_root.json`),
        'utf8',
      ),
    ).toBe(oldRoot);
    await expect(page.getByRole('option', { name: theme.title })).toHaveCount(
      0,
    );
    expect(contentRequests()).toHaveLength(initialRequests);

    await page.reload();
    await expect(editor).toBeVisible();
    await page.getByLabel('练习主题').selectOption(theme.id);
    await expect(
      page.getByRole('heading', { name: lesson.title }),
    ).toBeVisible();
    await expect(editor).toHaveText(lesson.starterSql.trim());
    await editor.fill('SEL');
    await page.getByRole('button', { name: '补全（Ctrl+Space）' }).click();
    await expect(page.getByRole('option', { name: /SELECT/ })).toBeVisible();
    await page.keyboard.press('Escape');
    await editor.fill('SELECT title, price FROM books;');
    await page.getByRole('button', { name: '运行', exact: true }).click();
    await expect(page.getByText(/运行通过，全部 2 个用例通过/)).toBeVisible();
    await expect(page.getByText('已保存到本机', { exact: true })).toBeVisible();
    await page.setViewportSize({ width: 390, height: 844 });
    await page.getByRole('tab', { name: 'SQL', exact: true }).click();
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBe(true);
    await page.screenshot({
      path: 'test-results/release-mobile.png',
      fullPage: true,
    });
    expect(errors).toEqual([]);
  } finally {
    await new Promise<void>((done, reject) =>
      server.httpServer.close((error) => (error ? reject(error) : done())),
    );
  }
});
