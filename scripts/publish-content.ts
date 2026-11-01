import {
  mkdir,
  readFile,
  readdir,
  rename,
  realpath,
  stat,
  writeFile,
} from 'node:fs/promises';
import { dirname, isAbsolute, relative, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';
import { byteLength, limits, requireContent } from '../src/content/checks.ts';
import { validateContent, validateCourse } from '../src/content/semantics.ts';
import {
  registeredPaths,
  resolveContentUrl,
  validateAddresses,
} from '../src/content/urls.ts';

const json = (value: unknown) => `${JSON.stringify(value, null, 2)}\n`;

async function exists(path: string) {
  try {
    await stat(path);
    return true;
  } catch (error) {
    if (error instanceof Error && 'code' in error && error.code === 'ENOENT')
      return false;
    throw error;
  }
}

export async function publishContent(source: string, output: string) {
  const sourceRoot = await realpath(source);
  const readSource = async (path: string, limit: number) => {
    const target = await realpath(resolve(sourceRoot, path));
    const rel = relative(sourceRoot, target);
    requireContent(
      rel !== '..' && !rel.startsWith(`..${sep}`) && !isAbsolute(rel),
      '源内容不能通过符号链接越界',
    );
    requireContent((await stat(target)).size <= limit, '源内容文件超限');
    const bytes = await readFile(target);
    requireContent(bytes.byteLength <= limit, '源内容文件超限');
    const value: unknown = JSON.parse(
      new TextDecoder('utf-8', { fatal: true }).decode(bytes),
    );
    return value;
  };
  const course = validateCourse(
    await readSource('course.json', limits.documentBytes),
  );
  const documents = new Map<string, unknown>();
  const sourceUrl = new URL('https://local.invalid/content/course.json');
  const fixturePaths = new Set(course.fixtures.map((fixture) => fixture.path));
  for (const path of registeredPaths(course)) {
    resolveContentUrl(path, sourceUrl);
    requireContent(!path.startsWith('releases/'), '源路径不能含发布前缀');
    requireContent(path !== '_root.json', '源路径与发布清单保留名冲突');
    documents.set(
      path,
      await readSource(
        path,
        fixturePaths.has(path) ? limits.fixtureBytes : limits.documentBytes,
      ),
    );
  }
  const content = validateContent(course, documents);
  const prefix = `releases/r${course.revision}/`;
  const published = structuredClone(course);
  for (const theme of published.themes)
    for (const chapter of theme.chapters)
      for (const lesson of chapter.lessons)
        if (lesson.path !== null) lesson.path = prefix + lesson.path;
  for (const fixture of published.fixtures)
    fixture.path = prefix + fixture.path;
  validateAddresses(published, sourceUrl);
  const files = new Map(
    [...documents].map(([path, value]) => [path, json(value)]),
  );
  const rootText = json(published);
  requireContent(
    byteLength(rootText) <= limits.documentBytes,
    '发布根正文超限',
  );
  let total = byteLength(rootText);
  for (const [path, text] of files) {
    const bytes = byteLength(text);
    requireContent(
      bytes <=
        (fixturePaths.has(path) ? limits.fixtureBytes : limits.documentBytes),
      '发布正文超限',
    );
    total += bytes;
  }
  requireContent(total <= limits.totalBytes, '发布总正文超限');

  const releases = resolve(output, 'releases');
  await mkdir(releases, { recursive: true });
  for (const entry of await readdir(releases, { withFileTypes: true })) {
    if (!entry.isDirectory() || !/^r[1-9][0-9]*$/u.test(entry.name)) continue;
    const prior = validateCourse(
      JSON.parse(
        await readFile(resolve(releases, entry.name, '_root.json'), 'utf8'),
      ),
    );
    validateAddresses(prior, sourceUrl);
    requireContent(prior.id === course.id, '发布目录已属于另一课程');
    requireContent(
      prior.revision <= course.revision,
      '生成器不覆盖较新发布；回滚应显式切换完整旧根',
    );
    for (const index of prior.fixtures) {
      const current = content.fixtures.find(
        (fixture) => fixture.id === index.id,
      );
      if (current)
        requireContent(
          json(current) ===
            (await readFile(resolve(output, index.path), 'utf8')),
          '已发布夹具不可修改，请使用新夹具 ID',
        );
    }
    for (const theme of prior.themes)
      for (const chapter of theme.chapters)
        for (const index of chapter.lessons) {
          if (index.path === null) continue;
          const current = content.lessons.find(
            (lesson) => lesson.themeId === theme.id && lesson.id === index.id,
          );
          if (!current) continue;
          const oldText = await readFile(resolve(output, index.path), 'utf8');
          const oldValue: unknown = JSON.parse(oldText);
          // Existing resources were validated on publication, but never trust a disk cast.
          const oldRevision =
            typeof oldValue === 'object' &&
            oldValue !== null &&
            'revision' in oldValue
              ? oldValue.revision
              : undefined;
          requireContent(typeof oldRevision === 'number', '旧关卡版本无效');
          requireContent(
            json(current) === oldText || current.revision > oldRevision,
            '关卡内容变化须递增关卡 revision',
          );
        }
  }

  files.set('_root.json', rootText);
  const destination = resolve(output, prefix);
  if (await exists(destination)) {
    for (const [path, text] of files)
      requireContent(
        (await readFile(resolve(destination, path), 'utf8')) === text,
        '发布版本目录不可变，请递增根 revision',
      );
  } else {
    const staging = resolve(releases, `.staging-${crypto.randomUUID()}`);
    await mkdir(staging);
    for (const [path, text] of files) {
      const target = resolve(staging, path);
      await mkdir(dirname(target), { recursive: true });
      await writeFile(target, text, { flag: 'wx' });
    }
    requireContent(
      staging.startsWith(releases + sep) &&
        destination.startsWith(releases + sep),
      '发布目录移动越界',
    );
    await rename(staging, destination);
  }
  // Resources become visible first; readers see either the complete old or new root.
  const temporaryRoot = resolve(output, `.root-${crypto.randomUUID()}.json`);
  await writeFile(temporaryRoot, rootText, { flag: 'wx' });
  await rename(temporaryRoot, resolve(output, 'course.json'));
  return {
    revision: course.revision,
    lessons: content.lessons.length,
    fixtures: content.fixtures.length,
  };
}

if (
  process.argv[1] &&
  resolve(process.argv[1]) === fileURLToPath(import.meta.url)
) {
  requireContent(process.argv.length <= 3, '只接受一个可选的本地输出目录');
  const result = await publishContent(
    resolve('content'),
    resolve(process.argv[2] ?? 'public/content'),
  );
  console.log(
    `本地内容 r${result.revision}：${result.lessons} 个开放关卡，${result.fixtures} 个夹具。未上传或部署。`,
  );
}
