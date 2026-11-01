import type {
  ExecutionMode,
  InputMode,
  PrepareRequest,
  QueryResult,
  WorkerErrorCode,
  WorkerRequest,
} from '../contracts/generated/types.d.ts';
import {
  validateCounterStructure,
  validateWorkerResponseStructure,
} from '../contracts/generated/validators.js';
import type { DeepReadonly } from '../content/checks.ts';
import { freeze } from '../content/checks.ts';
import type { ContentSnapshot } from '../content/loader.ts';
import { validateResult } from './compare.ts';
import { EngineError, requireEngine } from './errors.ts';
import {
  casesFor,
  executionLimits,
  identity,
  messageIdentity,
  sameIdentity,
  validatePrepare,
} from './protocol.ts';

export function createExecutionRequest(
  snapshot: ContentSnapshot,
  selection: {
    themeId: string;
    lessonId: string;
    mode: ExecutionMode;
    inputMode: InputMode;
    sql: string;
  },
): DeepReadonly<PrepareRequest> {
  const lesson = snapshot.lessons.find(
    (item) =>
      item.themeId === selection.themeId && item.id === selection.lessonId,
  );
  requireEngine(lesson, 'invalid-request', '当前课程快照中没有该关卡');
  const needed = new Set(
    lesson.tests
      .filter(
        (test) =>
          selection.mode === 'submit' ||
          test.fixtureId === lesson.previewFixtureId,
      )
      .map((test) => test.fixtureId),
  );
  return validatePrepare(
    structuredClone({
      ...selection,
      type: 'prepare',
      schemaVersion: 1,
      requestId: crypto.randomUUID(),
      contentToken: snapshot.contentToken,
      rootRevision: snapshot.course.revision,
      courseId: snapshot.course.id,
      lessonRevision: lesson.revision,
      lesson,
      fixtures: snapshot.fixtures.filter((fixture) => needed.has(fixture.id)),
    }),
  );
}

interface Context {
  readonly request: DeepReadonly<PrepareRequest>;
  readonly recordGeneration: number | null;
}
export type ExecutionOutcome =
  | (Context & {
      status: 'executed' | 'passed' | 'mismatch';
      result: DeepReadonly<QueryResult>;
      caseId: string;
      caseIndex: number;
    })
  | (Context & { status: 'error'; code: WorkerErrorCode; message: string })
  | (Context & {
      status: 'timeout';
      phase: 'prepare' | 'case';
      message: string;
    })
  | (Context & { status: 'cancelled' });
export type ExecutionState =
  | { status: 'idle' }
  | (Context & { status: 'preparing' })
  | (Context & { status: 'running'; caseId: string; caseIndex: number })
  | ExecutionOutcome;

// Only the transport is replaceable for protocol tests; SQL always lives in the real worker.
export interface EngineWorker {
  postMessage(message: WorkerRequest | DeepReadonly<PrepareRequest>): void;
  terminate(): void;
  onmessage: ((event: MessageEvent<unknown>) => void) | null;
  onerror: ((event: ErrorEvent) => void) | null;
  onmessageerror: ((event: MessageEvent<unknown>) => void) | null;
}
interface Active extends Context {
  worker: EngineWorker;
  phase: 'prepare' | 'case';
  position: number;
  deadline: number;
  timer: ReturnType<typeof setTimeout> | undefined;
  resolve: (outcome: ExecutionOutcome) => void;
  preview?: {
    result: DeepReadonly<QueryResult>;
    caseId: string;
    caseIndex: number;
  };
}

export class ExecutionClient {
  private state: ExecutionState = { status: 'idle' };
  private active: Active | undefined;
  private disposed = false;
  private listeners = new Set<() => void>();
  private readonly readRecordGeneration: () => number | null;
  private readonly createWorker: () => EngineWorker;

  constructor(
    readRecordGeneration: () => number | null,
    createWorker: () => EngineWorker = () =>
      new Worker(new URL('./worker.ts', import.meta.url), { type: 'module' }),
  ) {
    this.readRecordGeneration = readRecordGeneration;
    this.createWorker = createWorker;
  }
  getState = (): ExecutionState => this.state;
  subscribe = (listener: () => void) => {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  };
  private publish(state: ExecutionState) {
    this.state = freeze(state);
    for (const listener of this.listeners) listener();
  }
  private generation() {
    try {
      const value = this.readRecordGeneration();
      return validateCounterStructure(value) ? value : null;
    } catch {
      return null;
    }
  }
  private context(active: Active): Context {
    return {
      request: active.request,
      recordGeneration: active.recordGeneration,
    };
  }
  private finish(active: Active, outcome: ExecutionOutcome) {
    if (this.active !== active) return;
    this.active = undefined;
    clearTimeout(active.timer);
    active.worker.onmessage = null;
    active.worker.onerror = null;
    active.worker.onmessageerror = null;
    active.worker.terminate();
    active.resolve(freeze(outcome));
    this.publish(outcome);
  }
  private fail(active: Active, code: WorkerErrorCode, message: string) {
    this.finish(active, {
      ...this.context(active),
      status: 'error',
      code,
      message,
    });
  }
  private current(active: Active) {
    if (this.active !== active) return false;
    if (active.recordGeneration !== this.generation()) {
      this.cancel();
      return false;
    }
    return true;
  }
  private expired(active: Active) {
    if (performance.now() < active.deadline) return false;
    this.finish(active, {
      ...this.context(active),
      status: 'timeout',
      phase: active.phase,
      message:
        active.phase === 'prepare'
          ? '引擎加载与请求准备超过 15 秒'
          : '单个用例超过 3 秒，已终止执行',
    });
    return true;
  }
  private arm(active: Active, deadline: number) {
    clearTimeout(active.timer);
    active.deadline = deadline;
    const check = () => {
      if (!this.current(active) || this.expired(active)) return;
      active.timer = setTimeout(
        check,
        Math.max(1, active.deadline - performance.now()),
      );
    };
    active.timer = setTimeout(check, Math.max(0, deadline - performance.now()));
  }
  private dispatch(active: Active) {
    const current = casesFor(active.request)[active.position];
    if (!current) {
      this.fail(active, 'protocol', '没有可派发的用例');
      return;
    }
    active.phase = 'case';
    this.publish({
      ...this.context(active),
      status: 'running',
      caseId: current.test.id,
      caseIndex: current.index,
    });
    if (!this.current(active)) return;
    this.arm(active, performance.now() + executionLimits.caseMs);
    try {
      active.worker.postMessage({
        ...identity(active.request),
        type: 'run-case',
        caseId: current.test.id,
        caseIndex: current.index,
      });
    } catch {
      this.fail(active, 'protocol', '用例消息发送失败');
    }
  }
  private receive(active: Active, value: unknown) {
    if (!this.current(active)) return;
    if (
      typeof value === 'object' &&
      value !== null &&
      'requestId' in value &&
      typeof value.requestId === 'string' &&
      value.requestId !== active.request.requestId
    )
      return;
    const envelope = messageIdentity(value);
    if (envelope && !sameIdentity(envelope, active.request)) return;
    if (!validateWorkerResponseStructure(value)) {
      this.fail(active, 'protocol', 'Worker 返回了非法消息');
      return;
    }
    if (
      active.phase === 'case' &&
      (value.type === 'ready' ||
        (value.type === 'error' && value.phase === 'prepare'))
    )
      return;
    if (
      'caseIndex' in value &&
      casesFor(active.request)
        .slice(0, active.position)
        .some(
          ({ test, index }) =>
            test.id === value.caseId && index === value.caseIndex,
        )
    )
      return;
    if (this.expired(active)) return;
    if (active.phase === 'prepare') {
      if (value.type === 'ready') {
        this.dispatch(active);
        return;
      }
      if (value.type === 'error' && value.phase === 'prepare') {
        this.fail(active, value.code, value.message);
        return;
      }
      this.fail(active, 'protocol', '尚未 ready 就收到用例响应');
      return;
    }
    const current = casesFor(active.request)[active.position];
    if (
      !current ||
      !('caseIndex' in value) ||
      value.caseId !== current.test.id ||
      value.caseIndex !== current.index
    ) {
      this.fail(active, 'protocol', '用例响应身份或顺序不符');
      return;
    }
    if (value.type === 'error') {
      this.fail(active, value.code, value.message);
      return;
    }
    if (value.mode !== active.request.mode) {
      this.fail(active, 'protocol', '运行与提交响应混用');
      return;
    }
    try {
      validateResult(value.result);
    } catch {
      this.fail(active, 'protocol', 'Worker 返回的完整结果不合法');
      return;
    }
    if (!this.current(active) || this.expired(active)) return;
    if (current.test.fixtureId === active.request.lesson.previewFixtureId)
      active.preview = {
        result: value.result,
        caseId: value.caseId,
        caseIndex: value.caseIndex,
      };
    if (
      value.outcome === 'passed' &&
      active.position + 1 < casesFor(active.request).length
    ) {
      active.position++;
      this.dispatch(active);
    } else {
      // Show the actual preview output after all cases pass, not the last fixture's rows.
      const display =
        value.outcome === 'passed' && active.preview ? active.preview : value;
      this.finish(active, {
        ...this.context(active),
        status: value.outcome,
        result: display.result,
        caseId: display.caseId,
        caseIndex: display.caseIndex,
      });
    }
  }
  start(value: unknown): Promise<ExecutionOutcome> {
    requireEngine(!this.disposed, 'protocol', '执行客户端已销毁');
    // Invalid input leaves the currently running request untouched.
    const request = validatePrepare(structuredClone(value));
    this.cancel();
    const recordGeneration = this.generation();
    const started = performance.now();
    let worker: EngineWorker;
    try {
      worker = this.createWorker();
    } catch {
      const outcome: ExecutionOutcome = {
        request,
        recordGeneration,
        status: 'error',
        code: 'engine-load',
        message: '无法创建 SQL Worker',
      };
      this.publish(outcome);
      return Promise.resolve(outcome);
    }
    return new Promise((resolve) => {
      const active: Active = {
        request,
        recordGeneration,
        worker,
        resolve,
        phase: 'prepare',
        position: 0,
        deadline: started + executionLimits.prepareMs,
        timer: undefined,
      };
      this.active = active;
      worker.onmessage = (event) => this.receive(active, event.data);
      worker.onerror = (event) => {
        event.preventDefault();
        if (this.current(active))
          this.fail(
            active,
            active.phase === 'prepare' ? 'engine-load' : 'internal',
            'SQL Worker 执行失败',
          );
      };
      worker.onmessageerror = () => {
        if (this.current(active))
          this.fail(active, 'protocol', '无法解码 Worker 消息');
      };
      this.arm(active, active.deadline);
      this.publish({ request, recordGeneration, status: 'preparing' });
      if (!this.current(active) || this.expired(active)) return;
      try {
        worker.postMessage(request);
      } catch (error) {
        this.fail(
          active,
          error instanceof EngineError ? error.code : 'protocol',
          '执行请求发送失败',
        );
      }
    });
  }
  // Call on lesson/theme changes and confirmed record replacement/clear, before changing context.
  cancel() {
    if (this.active)
      this.finish(this.active, {
        ...this.context(this.active),
        status: 'cancelled',
      });
  }
  dispose() {
    this.disposed = true;
    this.cancel();
    this.listeners.clear();
  }
}
