import type { WorkerErrorCode } from '../contracts/generated/types.d.ts';

export class EngineError extends Error {
  override name = 'EngineError';
  readonly code: WorkerErrorCode;
  constructor(code: WorkerErrorCode, message: string) {
    super(message);
    this.code = code;
  }
}

export function requireEngine(
  condition: unknown,
  code: WorkerErrorCode,
  message: string,
): asserts condition {
  if (!condition) throw new EngineError(code, message);
}
