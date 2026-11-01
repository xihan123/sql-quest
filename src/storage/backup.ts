import type {
  BackupPart,
  LearningRecord,
} from '../contracts/generated/types.d.ts';
import { validateBackupPartStructure } from '../contracts/generated/validators.js';
import { checkRecord, recordKey } from './records.ts';
import {
  cleanupExpiredImports,
  discardImport,
  finishImport,
  stageRecords,
} from './database.ts';
import type { ImportPreview } from './database.ts';

export const backupPartBytes = 5 * 1024 * 1024;

export function checkBackupFiles(files: readonly Blob[]): number {
  if (!files.length) throw new Error('请选择完整的一组备份文件');
  let total = 0;
  for (const file of files) {
    if (!file.size || file.size > backupPartBytes)
      throw new Error('每卷必须非空且不超过 5 MiB，未导入任何记录');
    total += file.size;
    if (!Number.isSafeInteger(total))
      throw new Error('备份总字节数超出安全范围');
  }
  return total;
}
export async function stageBackup(
  files: readonly Blob[],
  signal: AbortSignal,
): Promise<ImportPreview> {
  const totalBytes = checkBackupFiles(files);
  const area = { id: crypto.randomUUID(), createdAt: Date.now() };
  let header: Omit<BackupPart, 'records' | 'partIndex'> | undefined;
  const parts = new Set<number>();
  let recordCount = 0;
  try {
    signal.throwIfAborted();
    await cleanupExpiredImports();
    for (const file of files) {
      signal.throwIfAborted();
      const bytes = await file.arrayBuffer();
      signal.throwIfAborted();
      if (bytes.byteLength > backupPartBytes || bytes.byteLength !== file.size)
        throw new Error('备份正文大小不符');
      const value: unknown = JSON.parse(
        new TextDecoder('utf-8', { fatal: true }).decode(bytes),
      );
      if (!validateBackupPartStructure(value))
        throw new Error('备份分卷或学习记录格式无效');
      if (value.partCount !== files.length || value.partIndex > value.partCount)
        throw new Error('备份缺卷或卷数不符，请一次选择完整的一组文件');
      if (parts.has(value.partIndex)) throw new Error('备份存在重复卷');
      if (
        header &&
        (header.backupId !== value.backupId ||
          header.exportedAt !== value.exportedAt ||
          header.schemaVersion !== value.schemaVersion)
      )
        throw new Error('混入了不同组的备份文件');
      header = {
        schemaVersion: value.schemaVersion,
        backupId: value.backupId,
        exportedAt: value.exportedAt,
        partCount: value.partCount,
      };
      parts.add(value.partIndex);
      await stageRecords(area, value.records);
      recordCount += value.records.length;
      if (!Number.isSafeInteger(recordCount))
        throw new Error('备份记录数超出安全范围');
    }
    signal.throwIfAborted();
    if (!header || parts.size !== header.partCount)
      throw new Error('备份分卷不连续');
    const preview = { ...area, ...header, recordCount, totalBytes };
    await finishImport(preview);
    signal.throwIfAborted();
    return Object.freeze(preview);
  } catch (error) {
    try {
      await discardImport(area);
    } catch {
      throw new Error(
        '导入失败且临时区清理失败；正式记录未更改。存储恢复后过期临时区会清理。',
        { cause: error },
      );
    }
    if (error instanceof DOMException && error.name === 'ConstraintError')
      throw new Error('备份中存在重复的关卡版本槽，已拒绝整组', {
        cause: error,
      });
    throw error;
  }
}
export function makeBackup(records: readonly LearningRecord[]): string[] {
  const header = {
    schemaVersion: 1,
    exportedAt: new Date().toISOString(),
    backupId: crypto.randomUUID(),
  };
  const seen = new Set<string>();
  const groups: LearningRecord[][] = [[]];
  let group = groups[0];
  if (!group) throw new Error('无法创建备份');
  let bytes = 512;
  for (const record of records) {
    checkRecord(record);
    const key = recordKey(record);
    if (seen.has(key)) throw new Error('备份存在重复版本槽');
    seen.add(key);
    const size =
      new TextEncoder().encode(JSON.stringify(record)).byteLength + 1;
    if (size + 512 > backupPartBytes) throw new Error('单条记录超过备份预算');
    if (bytes + size > backupPartBytes || group.length === 10000) {
      group = [];
      groups.push(group);
      bytes = 512;
    }
    group.push(record);
    bytes += size;
  }
  return groups.map((records, index) => {
    const part: unknown = {
      ...header,
      partIndex: index + 1,
      partCount: groups.length,
      records,
    };
    if (!validateBackupPartStructure(part)) throw new Error('备份格式校验失败');
    const text = JSON.stringify(part satisfies BackupPart);
    if (new TextEncoder().encode(text).byteLength > backupPartBytes)
      throw new Error('备份分卷超过预算');
    return text;
  });
}
