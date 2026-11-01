import assert from 'node:assert/strict';
import { test } from 'node:test';
import { ExecutionClient } from '../src/engine/client.ts';
import type { EngineWorker } from '../src/engine/client.ts';
import type {
  PrepareRequest,
  WorkerResponse,
} from '../src/contracts/generated/types.d.ts';
import { identity } from '../src/engine/protocol.ts';
import { engineRequest } from './engine-helpers.ts';

class Transport implements EngineWorker {
  sent: unknown[] = [];
  terminated = false;
  onmessage: EngineWorker['onmessage'] = null;
  onerror: EngineWorker['onerror'] = null;
  onmessageerror: EngineWorker['onmessageerror'] = null;
  postMessage(value: unknown) {
    this.sent.push(value);
  }
  terminate() {
    this.terminated = true;
  }
  emit(value: unknown) {
    this.onmessage?.(new MessageEvent('message', { data: value }));
  }
}
const ready = (request: PrepareRequest): WorkerResponse => ({
  ...identity(request),
  type: 'ready',
});
function result(request: PrepareRequest, index: number): WorkerResponse {
  const current = request.lesson.tests[index];
  if (!current) throw new Error('Missing case');
  return {
    ...identity(request),
    type: 'case-result',
    mode: 'submit',
    outcome: 'passed',
    caseId: current.id,
    caseIndex: index,
    result: current.expected,
  };
}

test('client timers are per-case and duplicates/stale identities cannot advance or clear the current timer', async (t) => {
  const request = await engineRequest();
  t.mock.timers.enable({ apis: ['setTimeout'] });
  let now = 0;
  t.mock.method(performance, 'now', () => now);
  const worker = new Transport();
  const client = new ExecutionClient(
    () => 1,
    () => worker,
  );
  const pending = client.start(request);
  worker.emit(ready(request));
  assert.equal(worker.sent.length, 2);
  now = 2000;
  t.mock.timers.tick(2000);
  worker.emit(result(request, 0));
  assert.equal(worker.sent.length, 3);
  worker.emit(ready(request));
  worker.emit(result(request, 0));
  for (const mismatch of [
    { contentToken: 'old-content' },
    { rootRevision: request.rootRevision + 1 },
    { courseId: 'other' },
    { themeId: 'other' },
    { lessonId: 'other' },
    { lessonRevision: request.lessonRevision + 1 },
  ])
    worker.emit({ ...result(request, 1), ...mismatch });
  worker.emit({ requestId: 'old-request', nonsense: true });
  assert.equal(worker.sent.length, 3);
  now = 4000;
  t.mock.timers.tick(2000);
  assert.equal(client.getState().status, 'running');
  worker.emit(result(request, 1));
  const outcome = await pending;
  assert.equal(outcome.status, 'passed');
  if (outcome.status !== 'passed') throw new Error('Expected pass');
  assert.equal(outcome.caseId, 'basic');
  assert.equal(outcome.caseIndex, 0);
  assert.deepEqual(outcome.result, request.lesson.tests[0]?.expected);
  assert.equal(worker.terminated, true);
  assert.equal(worker.onmessage, null);
});

test('all-case success keeps actual preview output at either test position; a later mismatch shows its own result', async () => {
  for (const reverse of [false, true]) {
    for (const failLast of [false, true]) {
      const request = await engineRequest();
      if (reverse) request.lesson.tests.reverse();
      const previewIndex = request.lesson.tests.findIndex(
        (testCase) => testCase.fixtureId === request.lesson.previewFixtureId,
      );
      const preview = request.lesson.tests[previewIndex];
      if (!preview) throw new Error('Missing preview');
      const actualPreview = {
        columns: preview.expected.columns,
        rows: [...preview.expected.rows].reverse(),
      };
      const worker = new Transport();
      const client = new ExecutionClient(
        () => 1,
        () => worker,
      );
      const pending = client.start(request);
      worker.emit(ready(request));
      for (let index = 0; index < request.lesson.tests.length; index++) {
        worker.emit({
          ...result(request, index),
          ...(index === previewIndex ? { result: actualPreview } : {}),
          ...(failLast && index === request.lesson.tests.length - 1
            ? {
                outcome: 'mismatch',
                result: { columns: ['wrong'], rows: [[42]] },
              }
            : {}),
        });
      }
      const outcome = await pending;
      assert.equal(outcome.status, failLast ? 'mismatch' : 'passed');
      if (outcome.status !== 'mismatch' && outcome.status !== 'passed')
        throw new Error('Expected comparison');
      assert.equal(
        outcome.caseIndex,
        failLast ? request.lesson.tests.length - 1 : previewIndex,
      );
      assert.deepEqual(
        outcome.result,
        failLast ? { columns: ['wrong'], rows: [[42]] } : actualPreview,
      );
      client.dispose();
    }
  }
});

test('late responses fail by monotonic deadline even when the timer callback has not run; creation counts toward prepare deadline', async (t) => {
  const request = await engineRequest();
  t.mock.timers.enable({ apis: ['setTimeout'] });
  let now = 0;
  t.mock.method(performance, 'now', () => now);
  for (const phase of ['prepare', 'case']) {
    const worker = new Transport();
    const client = new ExecutionClient(
      () => 0,
      () => worker,
    );
    const pending = client.start(request);
    if (phase === 'case') worker.emit(ready(request));
    now += phase === 'case' ? 3001 : 15001;
    worker.emit(phase === 'case' ? result(request, 0) : ready(request));
    assert.equal((await pending).status, 'timeout');
    assert.equal(worker.terminated, true);
  }
  const worker = new Transport();
  const client = new ExecutionClient(
    () => 0,
    () => {
      now += 15001;
      return worker;
    },
  );
  assert.equal((await client.start(request)).status, 'timeout');
  assert.equal(worker.sent.length, 0);
});

test('duplicate ready/case-result never stops a busy case timer; next request recreates worker', async (t) => {
  const request = await engineRequest();
  t.mock.timers.enable({ apis: ['setTimeout'] });
  let now = 0;
  t.mock.method(performance, 'now', () => now);
  const workers: Transport[] = [];
  const client = new ExecutionClient(
    () => 4,
    () => {
      const worker = new Transport();
      workers.push(worker);
      return worker;
    },
  );
  const pending = client.start(request);
  const first = workers[0];
  if (!first) throw new Error('No worker');
  first.emit(ready(request));
  first.emit(result(request, 0));
  now = 2999;
  t.mock.timers.tick(2999);
  first.emit(ready(request));
  first.emit(result(request, 0));
  now = 3000;
  t.mock.timers.tick(1);
  assert.equal((await pending).status, 'timeout');
  const next = client.start(request);
  const second = workers[1];
  if (!second) throw new Error('No replacement worker');
  second.emit(ready(request));
  second.emit(result(request, 0));
  second.emit(result(request, 1));
  assert.equal((await next).status, 'passed');
});

test('cancel, replacement, dispose and record-generation changes invalidate callbacks, without putting metadata on the wire', async () => {
  const request = await engineRequest();
  let generation: number | null = 1;
  const workers: Transport[] = [];
  const client = new ExecutionClient(
    () => generation,
    () => {
      const worker = new Transport();
      workers.push(worker);
      return worker;
    },
  );
  const first = client.start(request);
  const oldWorker = workers[0];
  if (!oldWorker) throw new Error('No worker');
  const oldHandler = oldWorker.onmessage;
  const second = client.start(request);
  assert.equal((await first).status, 'cancelled');
  oldHandler?.(new MessageEvent('message', { data: ready(request) }));
  const current = workers[1];
  if (!current) throw new Error('No worker');
  assert.equal(current.sent.length, 1);
  current.emit(ready(request));
  generation = 2;
  current.emit(result(request, 0));
  assert.equal((await second).status, 'cancelled');
  assert.equal(current.sent.length, 2);
  generation = null;
  const third = client.start(request);
  const missingMetadata = workers[2];
  if (!missingMetadata) throw new Error('No worker');
  assert.equal('recordGeneration' in Object(missingMetadata.sent[0]), false);
  missingMetadata.emit(ready(request));
  missingMetadata.emit(result(request, 0));
  missingMetadata.emit(result(request, 1));
  const outcome = await third;
  assert.equal(outcome.status, 'passed');
  assert.equal(outcome.recordGeneration, null);
  const fourth = client.start(request);
  client.dispose();
  assert.equal((await fourth).status, 'cancelled');
  assert.throws(() => client.start(request));
});

test('current malformed, out-of-order, wrong-mode, bad-result and decode messages are protocol errors', async () => {
  const request = await engineRequest();
  for (const invalid of [
    { ...ready(request), extra: true },
    result(request, 1),
    { ...result(request, 0), caseId: 'wrong' },
    { ...result(request, 0), mode: 'run', outcome: 'executed' },
    { ...result(request, 0), result: { columns: ['x'], rows: [[1, 2]] } },
  ]) {
    const worker = new Transport();
    const client = new ExecutionClient(
      () => 1,
      () => worker,
    );
    const pending = client.start(request);
    worker.emit(ready(request));
    worker.emit(invalid);
    const outcome = await pending;
    assert.equal(outcome.status, 'error');
    if (outcome.status === 'error') assert.equal(outcome.code, 'protocol');
  }
  const worker = new Transport();
  const client = new ExecutionClient(
    () => 1,
    () => worker,
  );
  const pending = client.start(request);
  worker.onmessageerror?.(new MessageEvent('messageerror'));
  assert.equal((await pending).status, 'error');
});

test('run dispatches the preview case by its original test index and freezes the submitted SQL', async () => {
  const request = await engineRequest('SELECT title, price FROM books;', 'run');
  request.lesson.tests.reverse();
  const worker = new Transport();
  const client = new ExecutionClient(
    () => 1,
    () => worker,
  );
  const pending = client.start(request);
  request.sql = 'DELETE FROM books;';
  worker.emit(ready(request));
  assert.deepEqual(worker.sent[1], {
    ...identity(request),
    type: 'run-case',
    caseId: 'basic',
    caseIndex: 1,
  });
  const expected = request.lesson.tests[1]?.expected;
  worker.emit({
    ...identity(request),
    type: 'case-result',
    mode: 'run',
    outcome: 'executed',
    caseId: 'basic',
    caseIndex: 1,
    result: expected,
  });
  const outcome = await pending;
  assert.equal(outcome.status, 'executed');
  assert.equal(outcome.request.sql, 'SELECT title, price FROM books;');
});
