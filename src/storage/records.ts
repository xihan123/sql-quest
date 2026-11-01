import type {
  LearningRecord,
  RecordMetadata,
  SqlPuzzle,
} from '../contracts/generated/types.d.ts';
import type { DeepReadonly } from '../content/checks.ts';
import { joinPuzzle } from '../content/semantics.ts';
import {
  validateLearningRecordStructure,
  validateRecordMetadataStructure,
} from '../contracts/generated/validators.js';

export type RecordPatch = Partial<
  Pick<
    LearningRecord,
    'draftSql' | 'puzzleDraft' | 'inputMode' | 'viewedHintIds' | 'reviewMarked'
  >
> & { passed?: true };
export interface RecordEdit {
  base: LearningRecord;
  patch: RecordPatch;
  generation: number | null;
}
export interface RecordSnapshot {
  metadata: RecordMetadata;
  records: LearningRecord[];
}
export function recordKey(
  record: Pick<
    LearningRecord,
    'courseId' | 'themeId' | 'lessonId' | 'revision'
  >,
) {
  return `${record.courseId}/${record.themeId}/${record.lessonId}/${record.revision}`;
}
export function checkRecord(value: unknown): LearningRecord {
  if (!validateLearningRecordStructure(value))
    throw new Error('学习记录格式无效，未覆盖原数据');
  return value;
}
export function checkMetadata(value: unknown): RecordMetadata {
  if (!validateRecordMetadataStructure(value))
    throw new Error('无法读取有效的记录元数据，持久化已暂停');
  return value;
}
// Call only with the configuration from this record's exact revision.
// Import validation deliberately retains unknown/historical puzzles unchanged.
export function puzzleDraftError(
  puzzle: DeepReadonly<SqlPuzzle> | undefined,
  draft: LearningRecord['puzzleDraft'],
): string | undefined {
  if (!draft) return;
  if (!puzzle) return '本版本没有对应的拼图配置';
  try {
    if (joinPuzzle(puzzle, draft.cardOrder) !== draft.sql)
      return '保存的 SQL 快照与本版本卡片排列不一致';
  } catch (error) {
    return error instanceof Error ? error.message : '无法核对拼图草稿';
  }
}
export function sameMetadata(a: RecordMetadata, b: RecordMetadata) {
  return (
    a.recordGeneration === b.recordGeneration &&
    a.recordSetVersion === b.recordSetVersion
  );
}
export function patchRecord(
  base: LearningRecord,
  patch: RecordPatch,
): LearningRecord {
  return checkRecord({
    ...base,
    ...patch,
    passed: base.passed || patch.passed === true,
    viewedHintIds: [
      ...new Set([...base.viewedHintIds, ...(patch.viewedHintIds ?? [])]),
    ],
  });
}

export interface RecordConflict {
  key: string;
  field: 'draftSql' | 'puzzleDraft' | 'inputMode' | 'reviewMarked';
  stored: string | boolean | LearningRecord['puzzleDraft'];
  local: string | boolean | NonNullable<LearningRecord['puzzleDraft']>;
}
function sameField(a: RecordConflict['stored'], b: RecordConflict['stored']) {
  if (typeof a === 'object' && typeof b === 'object')
    return (
      a.sql === b.sql &&
      JSON.stringify(a.cardOrder) === JSON.stringify(b.cardOrder)
    );
  return a === b;
}
export function findConflicts(
  snapshot: RecordSnapshot,
  edits: readonly RecordEdit[],
): RecordConflict[] {
  const conflicts: RecordConflict[] = [];
  for (const edit of edits) {
    const stored = snapshot.records.find(
      (record) => recordKey(record) === recordKey(edit.base),
    );
    for (const field of [
      'draftSql',
      'puzzleDraft',
      'inputMode',
      'reviewMarked',
    ] satisfies RecordConflict['field'][]) {
      const local = edit.patch[field];
      if (
        local !== undefined &&
        !sameField(local, stored?.[field]) &&
        (edit.generation !== snapshot.metadata.recordGeneration ||
          (stored !== undefined && !sameField(stored[field], edit.base[field])))
      )
        conflicts.push({
          key: recordKey(edit.base),
          field,
          stored: stored?.[field],
          local,
        });
    }
  }
  return conflicts;
}

// A fresh generation is bound only after the learner explicitly confirms this merge.
export function resolveEdits(
  snapshot: RecordSnapshot,
  edits: readonly RecordEdit[],
  choices: ReadonlyMap<string, 'local' | 'stored'>,
): RecordEdit[] {
  const conflicts = findConflicts(snapshot, edits);
  return edits
    .map((edit) => {
      const patch = { ...edit.patch };
      for (const conflict of conflicts.filter(
        (item) => item.key === recordKey(edit.base),
      )) {
        const choice = choices.get(`${conflict.key}/${conflict.field}`);
        if (!choice) throw new Error('请逐项选择冲突字段');
        if (choice === 'stored') delete patch[conflict.field];
      }
      const stored = snapshot.records.find(
        (record) => recordKey(record) === recordKey(edit.base),
      );
      const { courseId, themeId, lessonId, revision } = edit.base;
      const absentBase: LearningRecord = {
        schemaVersion: 1,
        courseId,
        themeId,
        lessonId,
        revision,
        draftSql: '',
        inputMode: 'text',
        passed: false,
        viewedHintIds: [],
        reviewMarked: false,
      };
      const resolved = {
        // A cleared slot must not resurrect untouched fields from its old generation.
        base:
          stored ??
          (edit.generation === snapshot.metadata.recordGeneration
            ? edit.base
            : absentBase),
        patch,
        generation: snapshot.metadata.recordGeneration,
      };
      patchRecord(resolved.base, resolved.patch);
      return resolved;
    })
    .filter((edit) => Object.keys(edit.patch).length > 0);
}
