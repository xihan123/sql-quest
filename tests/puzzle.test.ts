import assert from 'node:assert/strict';
import test from 'node:test';
import { joinPuzzle } from '../src/content/semantics.ts';
import { puzzleDraftError } from '../src/storage/records.ts';
import type { SqlPuzzle } from '../src/contracts/generated/types.d.ts';

const puzzle: SqlPuzzle = {
  cards: [
    { id: 'select', sql: ' SELECT\n1 ' },
    { id: 'end', sql: ';' },
  ],
  solutionOrder: ['select', 'end'],
};

test('shared join preserves raw fragments and student order; rejects unknown IDs, reuse and excess SQL, never truncates', () => {
  assert.equal(joinPuzzle(puzzle, []), '');
  assert.equal(joinPuzzle(puzzle, ['select', 'end']), ' SELECT\n1  ;');
  assert.equal(joinPuzzle(puzzle, ['end', 'select']), ';  SELECT\n1 ');
  assert.throws(() => joinPuzzle(puzzle, ['unknown']), /未知/);
  assert.throws(() => joinPuzzle(puzzle, ['select', 'select']), /重复/);
  const cards = Array.from({ length: 21 }, (_, index) => ({
    id: `card-${index}`,
    sql: 'x'.repeat(1000),
  }));
  const large = { cards, solutionOrder: [cards[0]?.id ?? ''] };
  assert.throws(
    () =>
      joinPuzzle(
        large,
        cards.map((card) => card.id),
      ),
    /字符预算/,
  );
});

test('restoration checks only matching configuration and retains incompatible drafts without repair', () => {
  const draft = { cardOrder: ['select', 'end'], sql: ' SELECT\n1  ;' };
  assert.equal(puzzleDraftError(puzzle, draft), undefined);
  assert.equal(puzzleDraftError(puzzle, undefined), undefined);
  assert.equal(puzzleDraftError(puzzle, { cardOrder: [], sql: '' }), undefined);
  for (const [config, value] of [
    [undefined, draft],
    [puzzle, { ...draft, sql: 'SELECT 1;' }],
    [puzzle, { cardOrder: ['missing'], sql: 'SELECT 1;' }],
    [puzzle, { cardOrder: ['select', 'select'], sql: 'SELECT 1;' }],
  ] satisfies [SqlPuzzle | undefined, typeof draft][]) {
    const before = structuredClone(value);
    assert.equal(typeof puzzleDraftError(config, value), 'string');
    assert.deepEqual(value, before);
  }
});
