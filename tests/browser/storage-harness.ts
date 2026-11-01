import {
  databaseName,
  readRecords,
  writeRecords,
  replaceRecords,
  discardImport,
} from '../../src/storage/database.ts';
import type { ImportPreview } from '../../src/storage/database.ts';
import { makeBackup, stageBackup } from '../../src/storage/backup.ts';
import { RecordSession } from '../../src/storage/session.ts';
import type { EditContext } from '../../src/storage/session.ts';
import type {
  Lesson,
  RecordMetadata,
} from '../../src/contracts/generated/types.d.ts';
import type { RecordPatch } from '../../src/storage/records.ts';

const sessions = new Map<string, RecordSession>();
function session(id: string) {
  const value = sessions.get(id);
  if (!value) throw new Error('Missing session');
  return value;
}
const api = {
  read: readRecords,
  write: writeRecords,
  replace: replaceRecords,
  discard: discardImport,
  backup: makeBackup,
  stage: (texts: string[]) =>
    stageBackup(
      texts.map((text) => new Blob([text])),
      new AbortController().signal,
    ),
  capture: (id: string) => session(id).capture(),
  replaceSession: (
    id: string,
    expected: RecordMetadata,
    source: ImportPreview | null,
  ) => session(id).replace(expected, source),
  history: (id: string, lesson: Lesson) => session(id).history(lesson),
  async start(id: string) {
    const value = new RecordSession();
    sessions.set(id, value);
    await value.initialize();
  },
  state: (id: string) => session(id).getState(),
  change: (
    id: string,
    lesson: Lesson,
    patch: RecordPatch,
    context?: EditContext,
  ) => session(id).change(lesson, patch, context),
  record: (id: string, lesson: Lesson) => session(id).record(lesson),
  flush: (id: string) => session(id).flush(),
  inspect: (id: string) => session(id).inspect(),
  recover: (
    id: string,
    preview: Awaited<ReturnType<RecordSession['inspect']>>,
    choices: [string, 'local' | 'stored'][],
    mode: 'merge' | 'stored',
  ) =>
    session(id).recover(
      preview.snapshot,
      preview.edits,
      new Map(choices),
      mode,
    ),
  generation: (id: string) => session(id).generation(),
  local: (id: string) => session(id).localSnapshot(),
  // Simulate another version of the app replacing the set, including a missed broadcast.
  async replaceExternally(clear: boolean) {
    const snapshot = await readRecords();
    await new Promise<void>((resolve, reject) => {
      const request = indexedDB.open(databaseName);
      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        const db = request.result;
        const tx = db.transaction(['records', 'metadata'], 'readwrite');
        if (clear) tx.objectStore('records').clear();
        tx.objectStore('metadata').put(
          {
            ...snapshot.metadata,
            recordGeneration: snapshot.metadata.recordGeneration + 1,
            recordSetVersion: snapshot.metadata.recordSetVersion + 1,
          },
          'state',
        );
        tx.oncomplete = () => {
          db.close();
          resolve();
        };
        tx.onabort = () => {
          db.close();
          reject(tx.error);
        };
      };
    });
  },
};
declare global {
  interface Window {
    storageTest: typeof api;
  }
}
window.storageTest = api;
