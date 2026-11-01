import assert from 'node:assert/strict';
import { execFile } from 'node:child_process';
import { cp, mkdtemp, readFile, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { resolve, sep } from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';
import { promisify } from 'node:util';
import { publishContent } from '../scripts/publish-content.ts';
import { validateCourse } from '../src/content/semantics.ts';

test('local release is immutable, idempotent, root-last and preserves old resources on failed publication', async () => {
  const directory = await mkdtemp(resolve(tmpdir(), 'sql-quest-publication-'));
  const source = resolve(directory, 'content');
  const output = resolve(directory, 'output');
  try {
    await cp(new URL('../content/', import.meta.url), source, {
      recursive: true,
    });
    await writeFile(resolve(source, 'unregistered.json'), '{}');
    const result = await promisify(execFile)(
      process.execPath,
      [
        fileURLToPath(
          new URL('../scripts/publish-content.ts', import.meta.url),
        ),
        output,
      ],
      { cwd: directory },
    );
    assert.match(result.stdout, /未上传或部署/);
    const firstRoot = await readFile(resolve(output, 'course.json'), 'utf8');
    const root = validateCourse(JSON.parse(firstRoot));
    assert.equal(
      root.fixtures[0]?.path,
      `releases/r${root.revision}/themes/library/fixtures/library-basic-v1.json`,
    );
    await assert.rejects(
      readFile(resolve(output, `releases/r${root.revision}/unregistered.json`)),
    );
    await publishContent(source, output);
    const lessonPath = resolve(
      source,
      'themes/library/first-query/book-list.json',
    );
    const original = await readFile(lessonPath, 'utf8');
    await writeFile(
      lessonPath,
      original.replace('查看图书名称与价格', '新任务标题'),
    );
    await assert.rejects(publishContent(source, output), /关卡 revision/);
    assert.equal(
      await readFile(resolve(output, 'course.json'), 'utf8'),
      firstRoot,
    );
    await writeFile(lessonPath, original);
    const sourceRoot = validateCourse(
      JSON.parse(await readFile(resolve(source, 'course.json'), 'utf8')),
    );
    sourceRoot.revision = root.revision + 1;
    await writeFile(resolve(source, 'course.json'), JSON.stringify(sourceRoot));
    await publishContent(source, output);
    assert.equal(
      validateCourse(
        JSON.parse(await readFile(resolve(output, 'course.json'), 'utf8')),
      ).revision,
      root.revision + 1,
    );
    assert.equal(
      await readFile(
        resolve(output, `releases/r${root.revision}/_root.json`),
        'utf8',
      ),
      firstRoot,
    );
    const fixturePath = resolve(
      source,
      'themes/library/fixtures/library-basic-v1.json',
    );
    await writeFile(
      fixturePath,
      (await readFile(fixturePath, 'utf8')).replace('数据库入门', '数据库进阶'),
    );
    sourceRoot.revision = root.revision + 2;
    await writeFile(resolve(source, 'course.json'), JSON.stringify(sourceRoot));
    await assert.rejects(publishContent(source, output), /新夹具 ID/);
  } finally {
    // Only remove this test's freshly-created temp directory, never a computed project path.
    assert.ok(
      directory.startsWith(resolve(tmpdir()) + sep) &&
        directory.includes('sql-quest-publication-'),
    );
    await rm(directory, { recursive: true, force: true });
  }
});
