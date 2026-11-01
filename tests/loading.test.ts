import assert from 'node:assert/strict';
import { setImmediate } from 'node:timers/promises';
import test from 'node:test';
import { limits } from '../src/content/checks.ts';
import { fetchJson } from '../src/content/http.ts';
import { ContentLoader } from '../src/content/loader.ts';
import { registeredPaths } from '../src/content/urls.ts';
import { validateContent } from '../src/content/semantics.ts';
import { publishedContent } from './content-helpers.ts';

const response = (value: unknown) =>
  new Response(JSON.stringify(value), {
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
  });

test('static and same-shaped API use one GET pipeline and a deeply frozen complete snapshot', async () => {
  const { course, documents } = await publishedContent();
  const content = validateContent(course, documents);
  for (const base of ['/sql-quest/content/', '/api/sql-quest/']) {
    const calls: string[] = [];
    const fetcher: typeof fetch = async (input, init) => {
      const url = new URL(String(input));
      calls.push(url.pathname);
      assert.equal(init?.method, 'GET');
      assert.equal(init.credentials, 'omit');
      assert.equal(init.redirect, 'error');
      assert.equal(init.body, undefined);
      assert.equal(new Headers(init.headers).get('Accept'), 'application/json');
      return response(
        url.pathname === `${base}course.json`
          ? course
          : documents.get(url.pathname.slice(base.length)),
      );
    };
    const loader = new ContentLoader(
      `${base}course.json`,
      'https://example.test/sql-quest/',
      fetcher,
    );
    await loader.load();
    const state = loader.getState();
    assert.equal(state.status, 'ready');
    if (state.status !== 'ready') throw new Error('No snapshot');
    const expectedPaths = ['course.json', ...registeredPaths(course)].map(
      (path) => base + path,
    );
    assert.deepEqual([...calls].sort(), expectedPaths.sort());
    assert.deepEqual(state.snapshot.lessons, content.lessons);
    assert.ok(
      Object.isFrozen(state.snapshot.lessons[0]?.tests[0]?.expected.rows),
    );
    await loader.load();
    assert.equal(calls.length, expectedPaths.length);
    loader.dispose();
  }
});

test('null is unopened, unregistered files are never fetched, missing non-null paths fail the entire load', async () => {
  const { course, documents } = await publishedContent();
  const index = course.themes[0]?.chapters[0]?.lessons[0];
  assert.ok(index);
  const unopenedPath = index.path;
  index.path = null;
  const requests: string[] = [];
  const loader = new ContentLoader(
    './course.json',
    'https://example.test/content/',
    async (input) => {
      const path = new URL(String(input)).pathname.replace('/content/', '');
      requests.push(path);
      return response(path === 'course.json' ? course : documents.get(path));
    },
  );
  await loader.load();
  const state = loader.getState();
  assert.equal(state.status, 'ready');
  assert.deepEqual(
    requests.sort(),
    ['course.json', ...registeredPaths(course)].sort(),
  );
  assert.ok(!requests.includes(unopenedPath ?? ''));
  if (state.status === 'ready')
    assert.ok(!state.snapshot.lessons.some((lesson) => lesson.id === index.id));
  index.path = `releases/r${course.revision}/missing.json`;
  const missing = new ContentLoader(
    './course.json',
    'https://example.test/content/',
    async (input) =>
      String(input).endsWith('course.json')
        ? response(course)
        : new Response('', { status: 404 }),
  );
  await missing.load();
  assert.equal(missing.getState().status, 'error');
  loader.dispose();
  missing.dispose();
});

test('failure aborts other requests, never exposes partial state, retry and dispose ignore late responses', async () => {
  const { course, documents } = await publishedContent();
  const signals: AbortSignal[] = [];
  let fail = true;
  const loader = new ContentLoader(
    './course.json',
    'https://example.test/content/',
    async (input, init) => {
      if (String(input).endsWith('course.json')) return response(course);
      if (init?.signal) signals.push(init.signal);
      if (fail) {
        if (String(input).endsWith('book-list.json'))
          return new Response('', { status: 500 });
        return new Promise<Response>(() => undefined);
      }
      return response(
        documents.get(new URL(String(input)).pathname.replace('/content/', '')),
      );
    },
  );
  await loader.load();
  assert.equal(loader.getState().status, 'error');
  assert.ok(signals.every((signal) => signal.aborted));
  fail = false;
  await loader.load();
  assert.equal(loader.getState().status, 'ready');
  loader.dispose();

  let resolveOld: ((response: Response) => void) | undefined;
  let first = true;
  const stale = new ContentLoader(
    './course.json',
    'https://example.test/content/',
    async (input) => {
      if (first) {
        first = false;
        return new Promise<Response>((resolve) => {
          resolveOld = resolve;
        });
      }
      return response(
        String(input).endsWith('course.json')
          ? course
          : documents.get(
              new URL(String(input)).pathname.replace('/content/', ''),
            ),
      );
    },
  );
  const old = stale.load();
  await stale.load();
  const ready = stale.getState();
  assert.equal(ready.status, 'ready');
  resolveOld?.(response({ invalid: true }));
  await old;
  await setImmediate();
  assert.equal(stale.getState(), ready);
  stale.dispose();
  await stale.load();
  assert.equal(stale.getState().status, 'cancelled');

  let finishDisposed: ((response: Response) => void) | undefined;
  const disposed = new ContentLoader(
    './course.json',
    'https://example.test/content/',
    () =>
      new Promise<Response>((resolve) => {
        finishDisposed = resolve;
      }),
  );
  const pending = disposed.load();
  disposed.dispose();
  finishDisposed?.(response(course));
  await pending;
  assert.equal(disposed.getState().status, 'cancelled');
});

test('at most four concurrent requests, including body reading', async () => {
  const { course } = await publishedContent();
  course.fixtures = Array.from({ length: 10 }, (_, i) => ({
    id: `fixture-${i}`,
    path: `releases/r${course.revision}/fixture-${i}.json`,
  }));
  let active = 0;
  let maximum = 0;
  const loader = new ContentLoader(
    './course.json',
    'https://example.test/content/',
    async (input) => {
      if (String(input).endsWith('course.json')) return response(course);
      active++;
      maximum = Math.max(active, maximum);
      return new Response(
        new ReadableStream<Uint8Array>({
          async start(controller) {
            await setImmediate();
            active--;
            controller.enqueue(new TextEncoder().encode('{}'));
            controller.close();
          },
        }),
        { headers: { 'Content-Type': 'application/json' } },
      );
    },
  );
  await loader.load();
  assert.equal(maximum, 4);
  assert.equal(loader.getState().status, 'error');
  loader.dispose();
});

test('HTTP input rejects wrong status/MIME/redirect/UTF-8/JSON and counts actual bytes rather than Content-Length', async () => {
  const url = new URL('https://example.test/course.json');
  const signal = new AbortController().signal;
  for (const result of [
    new Response('{}', { status: 201 }),
    new Response('<html>', { headers: { 'Content-Type': 'text/html' } }),
    new Response('{', { headers: { 'Content-Type': 'application/json' } }),
    new Response(new Uint8Array([0xff]), {
      headers: { 'Content-Type': 'application/json' },
    }),
  ]) {
    await assert.rejects(
      fetchJson(
        url,
        limits.documentBytes,
        { used: 0 },
        signal,
        async () => result,
      ),
    );
  }
  const redirected = response({});
  Object.defineProperty(redirected, 'redirected', { value: true });
  await assert.rejects(
    fetchJson(
      url,
      limits.documentBytes,
      { used: 0 },
      signal,
      async () => redirected,
    ),
    /重定向/,
  );
  let cancelled = false;
  const over = new Response(
    new ReadableStream<Uint8Array>({
      start(controller) {
        controller.enqueue(new Uint8Array(limits.documentBytes + 1));
      },
      cancel() {
        cancelled = true;
      },
    }),
    { headers: { 'Content-Type': 'application/json', 'Content-Length': '1' } },
  );
  await assert.rejects(
    fetchJson(url, limits.documentBytes, { used: 0 }, signal, async () => over),
    /字节预算/,
  );
  assert.ok(cancelled);
  await assert.rejects(
    fetchJson(
      url,
      limits.documentBytes,
      { used: limits.totalBytes - 1 },
      signal,
      async () => response({}),
    ),
    /字节预算/,
  );
  const cancelledRequest = new AbortController();
  cancelledRequest.abort();
  await assert.rejects(
    fetchJson(
      url,
      limits.documentBytes,
      { used: 0 },
      cancelledRequest.signal,
      async () => {
        throw new Error('Should not fetch');
      },
    ),
    { name: 'AbortError' },
  );
});

test('request deadline includes stalled body reads, full load deadline cancels active work', async (t) => {
  t.mock.timers.enable({ apis: ['setTimeout'] });
  const reading = fetchJson(
    new URL('https://example.test/course.json'),
    limits.documentBytes,
    { used: 0 },
    new AbortController().signal,
    async () =>
      new Response(new ReadableStream<Uint8Array>({}), {
        headers: { 'Content-Type': 'application/json' },
      }),
  );
  const rejected = assert.rejects(reading, /10 秒/);
  await setImmediate();
  t.mock.timers.tick(10_000);
  await rejected;
  const { course } = await publishedContent();
  course.fixtures = Array.from({ length: 40 }, (_, i) => ({
    id: `fixture-${i}`,
    path: `releases/r${course.revision}/fixture-${i}.json`,
  }));
  const loader = new ContentLoader(
    './course.json',
    'https://example.test/content/',
    async (input) => {
      if (String(input).endsWith('course.json')) return response(course);
      await new Promise<void>((resolve) => setTimeout(resolve, 9_000));
      return response({});
    },
  );
  const loading = loader.load();
  await setImmediate();
  for (let i = 0; i < 7; i++) {
    t.mock.timers.tick(9_000);
    await setImmediate();
  }
  await loading;
  const state = loader.getState();
  assert.equal(state.status, 'error');
  if (state.status === 'error') assert.match(state.message, /60 秒/);
  loader.dispose();
  t.mock.timers.reset();
});
