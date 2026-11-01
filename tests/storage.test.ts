import { test } from 'node:test';
import assert from 'node:assert/strict';
import type { LearningRecord } from '../src/contracts/generated/types.d.ts';
import { validateBackupPartStructure } from '../src/contracts/generated/validators.js';
import {
  findConflicts,
  patchRecord,
  recordKey,
  resolveEdits,
} from '../src/storage/records.ts';
import {
  backupPartBytes,
  checkBackupFiles,
  makeBackup,
} from '../src/storage/backup.ts';

const record: LearningRecord = {
  schemaVersion: 1,
  courseId: 'course',
  themeId: 'theme',
  lessonId: 'lesson',
  revision: 1,
  draftSql: 'SELECT 1;',
  inputMode: 'text',
  passed: false,
  viewedHintIds: [],
  reviewMarked: false,
};
test('record patches preserve passes, independent fields and puzzle/history data; conflicts require explicit choices', () => {
  const base = {
    ...record,
    passed: true,
    puzzleDraft: { cardOrder: ['select'], sql: 'SELECT' },
  };
  assert.deepEqual(patchRecord(base, { reviewMarked: true }), {
    ...base,
    reviewMarked: true,
  });
  assert.deepEqual(
    patchRecord(
      { ...base, viewedHintIds: ['idea'] },
      { viewedHintIds: ['syntax'] },
    ).viewedHintIds,
    ['idea', 'syntax'],
  );
  assert.throws(() => patchRecord(base, { draftSql: 'x'.repeat(20001) }));
  const snapshot = {
    metadata: { schemaVersion: 1, recordGeneration: 0, recordSetVersion: 2 },
    records: [{ ...record, draftSql: 'SELECT 2;' }],
  } satisfies import('../src/storage/records.ts').RecordSnapshot;
  const edits = [
    {
      base: record,
      generation: 0,
      patch: { draftSql: 'SELECT 3;', reviewMarked: true },
    },
  ];
  assert.equal(findConflicts(snapshot, edits).length, 1);
  assert.throws(() => resolveEdits(snapshot, edits, new Map()));
  const resolved = resolveEdits(
    snapshot,
    edits,
    new Map([[`${recordKey(record)}/draftSql`, 'stored']]),
  );
  assert.deepEqual(resolved[0]?.patch, { reviewMarked: true });
  const replaced = {
    ...snapshot,
    metadata: { ...snapshot.metadata, recordGeneration: 1 },
    records: [],
  };
  assert.equal(findConflicts(replaced, edits).length, 2);
  const afterClear = resolveEdits(
    replaced,
    edits,
    new Map([
      [`${recordKey(record)}/draftSql`, 'stored'],
      [`${recordKey(record)}/reviewMarked`, 'local'],
    ]),
  );
  const clearedEdit = afterClear[0];
  assert.ok(clearedEdit);
  assert.equal(patchRecord(clearedEdit.base, clearedEdit.patch).draftSql, '');
  assert.equal(patchRecord(clearedEdit.base, clearedEdit.patch).passed, false);
  assert.notEqual(recordKey(record), recordKey({ ...record, revision: 2 }));
  assert.notEqual(
    recordKey(record),
    recordKey({ ...record, themeId: 'other' }),
  );
});

test('fixed backup exports exceed 5 MiB in aggregate without truncation, retain unknown history and obey each final UTF-8 volume budget', () => {
  const records = Array.from({ length: 110 }, (_, index) => ({
    ...record,
    courseId: 'unknown-course',
    revision: index + 1,
    draftSql: '中'.repeat(20000),
  }));
  const texts = makeBackup(records);
  assert.ok(texts.length > 1);
  assert.ok(
    texts.reduce((sum, text) => sum + Buffer.byteLength(text), 0) >
      backupPartBytes,
  );
  const restored: LearningRecord[] = [];
  texts.forEach((text, index) => {
    assert.ok(Buffer.byteLength(text) <= backupPartBytes);
    const value: unknown = JSON.parse(text);
    assert.ok(validateBackupPartStructure(value));
    assert.equal(value.partIndex, index + 1);
    assert.equal(value.partCount, texts.length);
    restored.push(...value.records);
  });
  const first = records[0];
  if (!first) throw new Error('Missing test record');
  first.draftSql = 'changed after export';
  assert.equal(restored[0]?.draftSql, '中'.repeat(20000));
  assert.deepEqual(restored.slice(1), records.slice(1));
  assert.throws(() => makeBackup([record, record]));
  assert.equal(makeBackup([]).length, 1);
});

test('puzzle conflicts select an atomic sequence/SQL pair, not mismatched halves', () => {
  const base = {
    ...record,
    puzzleDraft: { cardOrder: ['one'], sql: 'SELECT 1' },
  };
  const stored = {
    ...base,
    puzzleDraft: { cardOrder: ['two'], sql: 'SELECT 2' },
  };
  const local = { cardOrder: ['three'], sql: 'SELECT 3' };
  const edits = [{ base, patch: { puzzleDraft: local }, generation: 0 }];
  const snapshot = {
    metadata: { schemaVersion: 1, recordGeneration: 0, recordSetVersion: 1 },
    records: [stored],
  } satisfies import('../src/storage/records.ts').RecordSnapshot;
  assert.equal(findConflicts(snapshot, edits)[0]?.field, 'puzzleDraft');
  assert.throws(() => resolveEdits(snapshot, edits, new Map()));
  const [resolved] = resolveEdits(
    snapshot,
    edits,
    new Map([[`${recordKey(base)}/puzzleDraft`, 'local']]),
  );
  assert.ok(resolved);
  assert.deepEqual(
    patchRecord(resolved.base, resolved.patch).puzzleDraft,
    local,
  );
  assert.equal(
    findConflicts({ ...snapshot, records: [structuredClone(base)] }, edits)
      .length,
    0,
  );
  assert.equal(
    findConflicts(
      {
        ...snapshot,
        records: [
          {
            ...base,
            puzzleDraft: { sql: local.sql, cardOrder: [...local.cardOrder] },
          },
        ],
      },
      edits,
    ).length,
    0,
  );
});

test('maximal legal draft escaping fits a volume and the file limit is per volume, never per set', () => {
  const text = makeBackup([
    {
      ...record,
      draftSql: '\u0000'.repeat(20000),
      inputMode: 'puzzle',
      puzzleDraft: { cardOrder: [], sql: '\u0001'.repeat(20000) },
    },
  ])[0];
  assert.ok(text);
  assert.ok(Buffer.byteLength(text) < backupPartBytes);
  const file = new Blob([' '.repeat(backupPartBytes)]);
  assert.equal(checkBackupFiles([file, file]), backupPartBytes * 2);
  assert.throws(() => checkBackupFiles([]));
  assert.throws(() => checkBackupFiles([new Blob([])]));
  assert.throws(() =>
    checkBackupFiles([new Blob([' '.repeat(backupPartBytes + 1)])]),
  );
});
