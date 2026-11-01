import type {
  Cell,
  Comparison,
  QueryResult,
  Tolerance,
} from '../contracts/generated/types.d.ts';
import {
  validateComparisonStructure,
  validateQueryResultStructure,
} from '../contracts/generated/validators.js';
import { byteLength, limits, structure, unique } from '../content/checks.ts';
import { validateRowBudget } from '../content/fixture.ts';
import { requireEngine } from './errors.ts';

export function validateResult(value: unknown): QueryResult {
  const result = structure(value, validateQueryResultStructure, '查询结果');
  let bytes = 0;
  for (const row of result.rows) {
    requireEngine(
      row.length === result.columns.length,
      'comparison',
      '结果行宽与列数不符',
    );
    validateRowBudget(row);
    for (const cell of row)
      if (typeof cell === 'string') bytes += byteLength(cell);
  }
  requireEngine(bytes <= limits.resultTextBytes, 'limit', '结果文本超过 4 MiB');
  return result;
}

function cellMatches(
  actual: Cell,
  expected: Cell,
  tolerance: Tolerance | undefined,
) {
  if (actual === expected) return true;
  if (typeof actual !== 'number' || typeof expected !== 'number' || !tolerance)
    return false;
  return (
    Math.abs(actual - expected) <=
    Math.max(
      tolerance.absTolerance,
      tolerance.relTolerance * Math.abs(expected),
    )
  );
}

// Exact rows are a multiset; tolerant rows need a full matching, not greedy pairing.
export function compareResults(
  actualValue: unknown,
  expectedValue: unknown,
  comparisonValue: unknown,
): boolean {
  const actual = validateResult(actualValue);
  const expected = validateResult(expectedValue);
  const comparison: Comparison = structure(
    comparisonValue,
    validateComparisonStructure,
    '比较规则',
  );
  const tolerances = new Map<number, Tolerance>();
  if (comparison.numbers === 'tolerant') {
    unique(
      comparison.tolerances.map((item) => item.column),
      '容差列',
    );
    for (const tolerance of comparison.tolerances) {
      requireEngine(
        tolerance.column < expected.columns.length &&
          expected.rows.every(
            (row) =>
              row[tolerance.column] === null ||
              typeof row[tolerance.column] === 'number',
          ),
        'comparison',
        '容差列必须是有效数值列',
      );
      tolerances.set(tolerance.column, tolerance);
    }
  }
  if (
    actual.columns.length !== expected.columns.length ||
    actual.columns.some((name, i) => name !== expected.columns[i]) ||
    actual.rows.length !== expected.rows.length
  )
    return false;
  const matches = (a: readonly Cell[], b: readonly Cell[]) =>
    a.every((cell, i) => {
      const other = b[i];
      return other !== undefined && cellMatches(cell, other, tolerances.get(i));
    });
  if (comparison.rowOrder === 'ordered')
    return actual.rows.every((row, i) => {
      const other = expected.rows[i];
      return other !== undefined && matches(row, other);
    });
  if (!tolerances.size) {
    const counts = new Map<string, number>();
    for (const row of expected.rows) {
      const key = JSON.stringify(row);
      counts.set(key, (counts.get(key) ?? 0) + 1);
    }
    for (const row of actual.rows) {
      const key = JSON.stringify(row);
      const count = counts.get(key);
      if (!count) return false;
      counts.set(key, count - 1);
    }
    return true;
  }
  const edges = actual.rows.map((row) =>
    expected.rows.flatMap((other, i) => (matches(row, other) ? [i] : [])),
  );
  const owner = new Map<number, number>();
  for (let start = 0; start < actual.rows.length; start++) {
    const queue = [start];
    const parent = new Map<number, { actual: number; expected: number }>();
    const seen = new Set<number>();
    let end: { actual: number; expected: number } | undefined;
    for (let i = 0; i < queue.length && !end; i++) {
      const row = queue[i];
      if (row === undefined) break;
      for (const column of edges[row] ?? []) {
        if (seen.has(column)) continue;
        seen.add(column);
        const previous = owner.get(column);
        if (previous === undefined) {
          end = { actual: row, expected: column };
          break;
        }
        parent.set(previous, { actual: row, expected: column });
        queue.push(previous);
      }
    }
    if (!end) return false;
    while (end) {
      owner.set(end.expected, end.actual);
      end = parent.get(end.actual);
    }
  }
  return true;
}
