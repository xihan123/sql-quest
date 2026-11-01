import type {
  PrepareRequest,
  ReadyResponse,
} from '../contracts/generated/types.d.ts';
import {
  validatePrepareRequestStructure,
  validateReadyResponseStructure,
} from '../contracts/generated/validators.js';
import {
  byteLength,
  freeze,
  limits,
  structure,
  unique,
} from '../content/checks.ts';
import type { DeepReadonly } from '../content/checks.ts';
import { compileFixture } from '../content/fixture.ts';
import { validateLessonFixtures } from '../content/semantics.ts';
import { requireEngine } from './errors.ts';

export const executionLimits = Object.freeze({
  prepareMs: 15_000,
  caseMs: 3_000,
  rows: 1_000,
  columns: 100,
});
export type Identity = Omit<ReadyResponse, 'type'>;

export function identity(request: Identity): Identity {
  return {
    schemaVersion: request.schemaVersion,
    requestId: request.requestId,
    contentToken: request.contentToken,
    rootRevision: request.rootRevision,
    courseId: request.courseId,
    themeId: request.themeId,
    lessonId: request.lessonId,
    lessonRevision: request.lessonRevision,
  };
}

export function sameIdentity(left: Identity, right: Identity) {
  return (
    left.schemaVersion === right.schemaVersion &&
    left.requestId === right.requestId &&
    left.contentToken === right.contentToken &&
    left.rootRevision === right.rootRevision &&
    left.courseId === right.courseId &&
    left.themeId === right.themeId &&
    left.lessonId === right.lessonId &&
    left.lessonRevision === right.lessonRevision
  );
}

// Read only envelope fields here, so malformed current messages can still be reported.
export function messageIdentity(value: unknown): Identity | undefined {
  if (typeof value !== 'object' || value === null) return undefined;
  const envelope = {
    type: 'ready',
    schemaVersion: 'schemaVersion' in value ? value.schemaVersion : undefined,
    requestId: 'requestId' in value ? value.requestId : undefined,
    contentToken: 'contentToken' in value ? value.contentToken : undefined,
    rootRevision: 'rootRevision' in value ? value.rootRevision : undefined,
    courseId: 'courseId' in value ? value.courseId : undefined,
    themeId: 'themeId' in value ? value.themeId : undefined,
    lessonId: 'lessonId' in value ? value.lessonId : undefined,
    lessonRevision:
      'lessonRevision' in value ? value.lessonRevision : undefined,
  };
  return validateReadyResponseStructure(envelope)
    ? identity(envelope)
    : undefined;
}

export function casesFor(request: DeepReadonly<PrepareRequest>) {
  return request.lesson.tests.flatMap((test, index) =>
    request.mode === 'submit' ||
    test.fixtureId === request.lesson.previewFixtureId
      ? [{ test, index }]
      : [],
  );
}

export function validatePrepare(value: unknown): DeepReadonly<PrepareRequest> {
  const request = structure(value, validatePrepareRequestStructure, '执行请求');
  const { lesson } = request;
  requireEngine(
    request.courseId === lesson.courseId &&
      request.themeId === lesson.themeId &&
      request.lessonId === lesson.id &&
      request.lessonRevision === lesson.revision,
    'invalid-request',
    '请求与关卡身份不符',
  );
  requireEngine(
    !request.sql.includes('\0') && !/[\uD800-\uDFFF]/u.test(request.sql),
    'sql',
    'SQL 含 NUL 或不完整的 Unicode 字符',
  );
  const needed = new Set(casesFor(request).map(({ test }) => test.fixtureId));
  unique(
    request.fixtures.map((fixture) => fixture.id),
    '执行夹具 ID',
  );
  requireEngine(
    needed.size === request.fixtures.length &&
      request.fixtures.every((fixture) => needed.has(fixture.id)),
    'invalid-request',
    '执行夹具必须恰好覆盖当前模式的用例',
  );
  let bytes = byteLength(JSON.stringify(lesson));
  requireEngine(bytes <= limits.documentBytes, 'limit', '关卡正文超过字节预算');
  for (const fixture of request.fixtures) {
    const size = byteLength(JSON.stringify(fixture));
    requireEngine(size <= limits.fixtureBytes, 'limit', '夹具正文超过字节预算');
    bytes += size;
    requireEngine(
      bytes <= limits.totalBytes,
      'limit',
      '执行内容超过总字节预算',
    );
    compileFixture(fixture);
  }
  validateLessonFixtures(lesson, request.fixtures, request.mode);
  return freeze(request);
}
