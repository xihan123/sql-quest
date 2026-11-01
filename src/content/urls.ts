import type { Course } from '../contracts/generated/types.d.ts';
import { validateContentPathStructure } from '../contracts/generated/validators.js';
import { requireContent } from './checks.ts';

export function resolveRootUrl(configured: string, appBaseUrl: string): URL {
  requireContent(!/[\\%?#\s]/u.test(configured), '根地址包含不允许的字符');
  requireContent(!configured.split('/').includes('..'), '根地址不能穿越目录');
  const base = new URL(appBaseUrl);
  const root = new URL(configured, base);
  requireContent(
    root.origin === base.origin && !root.username && !root.password,
    '根地址必须同源且无凭据',
  );
  const local = ['localhost', '127.0.0.1', '[::1]'].includes(root.hostname);
  requireContent(
    root.protocol === 'https:' || (root.protocol === 'http:' && local),
    '内容需要 HTTPS（本机预览可用 HTTP）',
  );
  requireContent(
    !root.search && !root.hash && root.pathname.endsWith('.json'),
    '根地址必须为无查询参数和片段的 JSON 地址',
  );
  return root;
}

export function resolveContentUrl(path: string, root: URL): URL {
  requireContent(validateContentPathStructure(path), '内容相对路径不合法');
  const directory = new URL('./', root);
  const url = new URL(path, directory);
  requireContent(
    url.origin === root.origin && url.pathname.startsWith(directory.pathname),
    '内容地址越过目录边界',
  );
  requireContent(url.href !== root.href, '内容不能引用根自身');
  return url;
}

export function registeredPaths(course: Course): string[] {
  return [
    ...course.themes.flatMap((theme) =>
      theme.chapters.flatMap((chapter) =>
        chapter.lessons.flatMap((lesson) =>
          lesson.path === null ? [] : [lesson.path],
        ),
      ),
    ),
    ...course.fixtures.map((fixture) => fixture.path),
  ];
}

export function validateAddresses(course: Course, root: URL) {
  const seen = new Set<string>();
  for (const path of registeredPaths(course)) {
    const url = resolveContentUrl(path, root);
    requireContent(
      path.startsWith(`releases/r${course.revision}/`),
      '内容地址不属于当前根的发布版本目录',
    );
    requireContent(!seen.has(url.href), '内容地址重复');
    seen.add(url.href);
  }
}
