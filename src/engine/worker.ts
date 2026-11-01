import type {
  PrepareRequest,
  WorkerResponse,
} from '../contracts/generated/types.d.ts';
import { validateWorkerRequestStructure } from '../contracts/generated/validators.js';
import type { DeepReadonly } from '../content/checks.ts';
import { compareResults } from './compare.ts';
import { EngineError, requireEngine } from './errors.ts';
import {
  casesFor,
  identity,
  messageIdentity,
  sameIdentity,
  validatePrepare,
} from './protocol.ts';
import { executeQuery, loadSqlite } from './sqlite.ts';

let request: DeepReadonly<PrepareRequest> | undefined;
let sqlite: Awaited<ReturnType<typeof loadSqlite>> | undefined;
let phase: 'prepare' | 'case' | 'done' = 'prepare';
let next = 0;
const post = (response: WorkerResponse) => self.postMessage(response);

self.onmessage = async (event: MessageEvent<unknown>) => {
  const value = event.data;
  const envelope = messageIdentity(value);
  if (
    phase === 'done' ||
    (request && envelope && !sameIdentity(request, envelope))
  )
    return;
  try {
    requireEngine(
      validateWorkerRequestStructure(value),
      'invalid-request',
      'Worker 请求格式错误',
    );
    if (value.type === 'prepare') {
      if (request) return;
      request = validatePrepare(value);
      sqlite = await loadSqlite();
      // A protocol error during engine loading has already ended this worker session.
      if (phase !== 'prepare') return;
      phase = 'case';
      post({ ...identity(request), type: 'ready' });
      return;
    }
    requireEngine(
      request && sqlite && phase === 'case',
      'protocol',
      '尚未准备完成，不能执行用例',
    );
    const cases = casesFor(request);
    const previous = cases
      .slice(0, next)
      .some(
        ({ test, index }) =>
          test.id === value.caseId && index === value.caseIndex,
      );
    if (previous) return;
    const current = cases[next];
    requireEngine(
      current &&
        current.test.id === value.caseId &&
        current.index === value.caseIndex,
      'protocol',
      '用例身份或派发顺序不符',
    );
    const fixture = request.fixtures.find(
      (item) => item.id === current.test.fixtureId,
    );
    requireEngine(fixture, 'invalid-request', '执行夹具不存在');
    const result = executeQuery(
      sqlite,
      fixture,
      request.lesson.readableTables,
      request.sql,
    );
    const context = {
      ...identity(request),
      caseId: current.test.id,
      caseIndex: current.index,
    };
    if (request.mode === 'run') {
      phase = 'done';
      post({
        ...context,
        type: 'case-result',
        mode: 'run',
        outcome: 'executed',
        result,
      });
    } else {
      const passed = compareResults(
        result,
        current.test.expected,
        request.lesson.comparison,
      );
      next++;
      if (!passed || next === cases.length) phase = 'done';
      post({
        ...context,
        type: 'case-result',
        mode: 'submit',
        outcome: passed ? 'passed' : 'mismatch',
        result,
      });
    }
  } catch (error) {
    const context = request ? identity(request) : envelope;
    const code =
      error instanceof EngineError
        ? error.code
        : !request
          ? 'invalid-request'
          : !sqlite
            ? 'engine-load'
            : 'internal';
    const message =
      error instanceof Error ? error.message.slice(0, 2000) : '执行失败';
    const current =
      request && phase === 'case' ? casesFor(request)[next] : undefined;
    phase = 'done';
    if (!context) {
      self.reportError(new EngineError('protocol', 'Worker 消息缺少合法身份'));
      return;
    }
    if (current)
      post({
        ...context,
        type: 'error',
        phase: 'case',
        caseId: current.test.id,
        caseIndex: current.index,
        code,
        message,
      });
    else post({ ...context, type: 'error', phase: 'prepare', code, message });
  }
};

self.onmessageerror = () =>
  self.reportError(new EngineError('protocol', '无法解码执行请求'));
