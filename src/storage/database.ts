import {
  checkMetadata,
  checkRecord,
  patchRecord,
  sameMetadata,
} from './records.ts';
import type { RecordEdit, RecordSnapshot } from './records.ts';
import type {
  BackupPart,
  LearningRecord,
  RecordMetadata,
} from '../contracts/generated/types.d.ts';

export const databaseName = 'sql-quest-learning';
export class RecordConflictError extends Error {
  constructor() {
    super(
      '其他页面已更改学习记录，已暂停覆盖。请检查已存记录后选择如何处理本页修改。',
    );
  }
}
function openDatabase(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(databaseName, 2);
    let expired = false;
    const timer = setTimeout(() => {
      expired = true;
      reject(new Error('记录数据库打开超时，请关闭占用数据库的旧页面后重试'));
    }, 3000);
    request.onupgradeneeded = () => {
      if (expired) {
        request.transaction?.abort();
        return;
      }
      const db = request.result;
      if (!db.objectStoreNames.contains('records')) {
        db.createObjectStore('records', {
          keyPath: ['courseId', 'themeId', 'lessonId', 'revision'],
        });
        db.createObjectStore('metadata').put(
          { schemaVersion: 1, recordSetVersion: 0, recordGeneration: 0 },
          'state',
        );
      }
      db.createObjectStore('importRecords');
      db.createObjectStore('imports');
    };
    request.onsuccess = () => {
      clearTimeout(timer);
      if (expired) request.result.close();
      else {
        request.result.onversionchange = () => request.result.close();
        resolve(request.result);
      }
    };
    request.onerror = () => {
      clearTimeout(timer);
      reject(request.error);
    };
  });
}
function readRequest<T>(request: IDBRequest<T>): Promise<unknown> {
  return new Promise((resolve, reject) => {
    request.onsuccess = () => {
      const value: unknown = request.result;
      resolve(value);
    };
    request.onerror = () => reject(request.error);
  });
}
async function transaction<T>(
  mode: IDBTransactionMode,
  action: (tx: IDBTransaction) => Promise<T>,
  stores = ['metadata', 'records'],
): Promise<T> {
  const db = await openDatabase();
  try {
    const tx = db.transaction(stores, mode);
    const done = new Promise<DOMException | null>((resolve) => {
      tx.oncomplete = () => resolve(null);
      tx.onabort = () =>
        resolve(tx.error ?? new DOMException('记录事务已中止', 'AbortError'));
    });
    try {
      const value = await action(tx);
      const error = await done;
      if (error) throw error;
      return value;
    } catch (error) {
      try {
        tx.abort();
      } catch {
        /* The transaction may already have aborted. */
      }
      await done;
      throw error;
    }
  } finally {
    db.close();
  }
}

export interface ImportArea {
  id: string;
  createdAt: number;
}
export interface ImportPreview
  extends
    ImportArea,
    Pick<
      BackupPart,
      'schemaVersion' | 'backupId' | 'exportedAt' | 'partCount'
    > {
  recordCount: number;
  totalBytes: number;
}
function importRange(area: ImportArea) {
  return IDBKeyRange.bound(
    [area.createdAt, area.id],
    [area.createdAt, area.id, []],
  );
}
export function discardImport(area: ImportArea) {
  return transaction(
    'readwrite',
    async (tx) => {
      await readRequest(
        tx.objectStore('importRecords').delete(importRange(area)),
      );
      await readRequest(
        tx.objectStore('imports').delete([area.createdAt, area.id]),
      );
    },
    ['imports', 'importRecords'],
  );
}
export function cleanupExpiredImports() {
  // Interrupted pages leave only isolated data. Active previews expire after one day.
  const range = IDBKeyRange.upperBound([Date.now() - 24 * 60 * 60 * 1000]);
  return transaction(
    'readwrite',
    async (tx) => {
      await readRequest(tx.objectStore('importRecords').delete(range));
      await readRequest(tx.objectStore('imports').delete(range));
    },
    ['imports', 'importRecords'],
  );
}
export function stageRecords(
  area: ImportArea,
  records: readonly LearningRecord[],
) {
  return transaction(
    'readwrite',
    async (tx) => {
      const store = tx.objectStore('importRecords');
      for (const record of records) {
        checkRecord(record);
        const { courseId, themeId, lessonId, revision } = record;
        // add (not put) rejects duplicate slots within and across volumes.
        await readRequest(
          store.add(record, [
            area.createdAt,
            area.id,
            courseId,
            themeId,
            lessonId,
            revision,
          ]),
        );
      }
    },
    ['importRecords'],
  );
}
export function finishImport(preview: ImportPreview) {
  return transaction(
    'readwrite',
    async (tx) => {
      const count = await readRequest(
        tx.objectStore('importRecords').count(importRange(preview)),
      );
      if (count !== preview.recordCount)
        throw new Error('导入临时区不完整，请重新选择整组文件');
      await readRequest(
        tx.objectStore('imports').add(preview, [preview.createdAt, preview.id]),
      );
    },
    ['imports', 'importRecords'],
  );
}

export function replaceRecords(
  expected: RecordMetadata,
  inputSource: ImportPreview | null,
): Promise<RecordMetadata> {
  expected = structuredClone(expected);
  const source = structuredClone(inputSource);
  return transaction(
    'readwrite',
    async (tx) => {
      const metaStore = tx.objectStore('metadata');
      const metadata = checkMetadata(await readRequest(metaStore.get('state')));
      if (!sameMetadata(expected, metadata)) throw new RecordConflictError();
      if (source) {
        const manifest = await readRequest(
          tx.objectStore('imports').get([source.createdAt, source.id]),
        );
        if (JSON.stringify(manifest) !== JSON.stringify(source))
          throw new Error('导入临时区已失效，请重新选择整组文件');
      }
      const next = checkMetadata({
        ...metadata,
        recordSetVersion: metadata.recordSetVersion + 1,
        recordGeneration: metadata.recordGeneration + 1,
      });
      const store = tx.objectStore('records');
      await readRequest(store.clear());
      if (source) {
        // Cursor copying keeps the complete backup out of an unbounded import array.
        await new Promise<void>((resolve, reject) => {
          let count = 0;
          const request = tx
            .objectStore('importRecords')
            .openCursor(importRange(source));
          request.onerror = () => reject(request.error);
          request.onsuccess = () => {
            try {
              const cursor = request.result;
              if (!cursor) {
                if (count !== source.recordCount)
                  throw new Error('导入临时记录缺失');
                resolve();
                return;
              }
              const value: unknown = cursor.value;
              store.add(checkRecord(value));
              count++;
              cursor.continue();
            } catch (error) {
              reject(error);
            }
          };
        });
        await readRequest(
          tx.objectStore('importRecords').delete(importRange(source)),
        );
        await readRequest(
          tx.objectStore('imports').delete([source.createdAt, source.id]),
        );
      }
      await readRequest(metaStore.put(next, 'state'));
      return next;
    },
    ['metadata', 'records', 'imports', 'importRecords'],
  );
}
export function readRecords(): Promise<RecordSnapshot> {
  return transaction('readonly', async (tx) => {
    const metadataRequest = tx.objectStore('metadata').get('state');
    const recordsRequest = tx.objectStore('records').getAll();
    const [metadata, values] = await Promise.all([
      readRequest(metadataRequest),
      readRequest(recordsRequest),
    ]);
    if (!Array.isArray(values)) throw new Error('无法读取学习记录');
    const records: unknown[] = values;
    return {
      metadata: checkMetadata(metadata),
      records: records.map(checkRecord),
    };
  });
}
export function writeRecords(
  expected: RecordMetadata,
  edits: readonly RecordEdit[],
): Promise<RecordSnapshot> {
  expected = structuredClone(expected);
  edits = structuredClone(edits);
  return transaction('readwrite', async (tx) => {
    const metaStore = tx.objectStore('metadata');
    const metadata = checkMetadata(await readRequest(metaStore.get('state')));
    if (
      !sameMetadata(metadata, expected) ||
      edits.some((edit) => edit.generation !== metadata.recordGeneration)
    )
      throw new RecordConflictError();
    const store = tx.objectStore('records');
    const records = [];
    for (const edit of edits) {
      checkRecord(edit.base);
      const { courseId, themeId, lessonId, revision } = edit.base;
      const value = await readRequest(
        store.get([courseId, themeId, lessonId, revision]),
      );
      const record = patchRecord(
        value === undefined ? edit.base : checkRecord(value),
        edit.patch,
      );
      await readRequest(store.put(record));
      records.push(record);
    }
    const next = checkMetadata({
      ...metadata,
      recordSetVersion: metadata.recordSetVersion + 1,
    });
    await readRequest(metaStore.put(next, 'state'));
    return { metadata: next, records };
  });
}
