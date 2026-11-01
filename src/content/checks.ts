import type { StructuralValidator } from '../contracts/generated/validators.js';

export const limits = Object.freeze({
  documentBytes: 1024 * 1024,
  fixtureBytes: 2 * 1024 * 1024,
  totalBytes: 32 * 1024 * 1024,
  requestMs: 10_000,
  loadMs: 60_000,
  concurrency: 4,
  fixtureRows: 5_000,
  sqlBytes: 1024 * 1024,
  valueBytes: 1024 * 1024,
  resultTextBytes: 4 * 1024 * 1024,
});

export class ContentError extends Error {
  override name = 'ContentError';
}

export function requireContent(
  condition: unknown,
  message: string,
): asserts condition {
  if (!condition) throw new ContentError(message);
}

export function structure<T>(
  value: unknown,
  validate: StructuralValidator<T>,
  label: string,
): T {
  requireContent(
    validate(value),
    `${label}格式错误：${validate.errors?.[0]?.instancePath ?? ''} ${validate.errors?.[0]?.message ?? ''}`,
  );
  return value;
}

export const byteLength = (text: string) =>
  new TextEncoder().encode(text).byteLength;

export function unique(values: readonly (string | number)[], label: string) {
  requireContent(new Set(values).size === values.length, `${label}重复`);
}

export function freeze<T>(value: T): T {
  if (value !== null && typeof value === 'object') {
    for (const child of Object.values(value)) freeze(child);
    Object.freeze(value);
  }
  return value;
}

export type DeepReadonly<T> = T extends object
  ? { readonly [Key in keyof T]: DeepReadonly<T[Key]> }
  : T;
