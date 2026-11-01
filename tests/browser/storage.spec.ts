import { expect, test } from '@playwright/test';
import { engineRequest } from '../engine-helpers.ts';
import type {} from './storage-harness.ts';

test.beforeEach(async ({ page }) => {
  await page.goto('tests/browser/storage-harness.html');
  await page.waitForFunction(() => Boolean(window.storageTest));
});

test('real IndexedDB patches preserve revisions and unrelated fields; stale version and generation abort atomically', async ({
  page,
}) => {
  const lesson = (await engineRequest()).lesson;
  const result = await page.evaluate(async (lesson) => {
    const api = window.storageTest;
    await api.start('a');
    api.change(
      'a',
      { ...lesson, revision: lesson.revision + 1 },
      { draftSql: 'SELECT 2;', passed: true },
    );
    await api.flush('a');
    api.change('a', lesson, { draftSql: 'SELECT 1;', passed: true });
    await api.flush('a');
    const snapshot = await api.read();
    const base = snapshot.records[0];
    if (!base) throw new Error('Missing record');
    const edit = {
      base,
      patch: { reviewMarked: true },
      generation: snapshot.metadata.recordGeneration,
    };
    await api.write(snapshot.metadata, [edit]);
    let versionRejected = false;
    try {
      await api.write(snapshot.metadata, [
        { ...edit, patch: { draftSql: 'stale' } },
      ]);
    } catch {
      versionRejected = true;
    }
    const beforeReplace = await api.read();
    await api.replaceExternally(true);
    let generationRejected = false;
    try {
      await api.write(beforeReplace.metadata, [edit]);
    } catch {
      generationRejected = true;
    }
    return {
      snapshot,
      versionRejected,
      generationRejected,
      after: await api.read(),
    };
  }, lesson);
  expect(
    result.snapshot.records.map((record) => [
      record.revision,
      record.passed,
      record.draftSql,
    ]),
  ).toEqual([
    [lesson.revision, true, 'SELECT 1;'],
    [lesson.revision + 1, true, 'SELECT 2;'],
  ]);
  expect(result.versionRejected).toBe(true);
  expect(result.generationRejected).toBe(true);
  expect(result.after.records).toEqual([]);
  expect(result.after.metadata.recordGeneration).toBe(1);
});

test('missed replacement notification rejects a captured debounce; multiple page drafts remain available', async ({
  page,
}) => {
  const lesson = (await engineRequest()).lesson;
  const result = await page.evaluate(async (lesson) => {
    const api = window.storageTest;
    await api.start('a');
    api.change('a', lesson, { draftSql: 'old generation' });
    api.change(
      'a',
      { ...lesson, themeId: 'another-theme' },
      { draftSql: 'other draft' },
    );
    await api.replaceExternally(true);
    await api.flush('a');
    const snapshot = await api.inspect('a');
    return {
      state: api.state('a'),
      generation: api.generation('a'),
      local: api.local('a'),
      stored: snapshot.snapshot.records,
      captured: snapshot.edits.map((edit) => edit.generation),
    };
  }, lesson);
  expect(result.state.status).toBe('paused');
  expect(result.generation).toBeNull();
  expect(result.local.map((record) => record.draftSql)).toEqual([
    'old generation',
    'other draft',
  ]);
  expect(result.stored).toEqual([]);
  expect(result.captured).toEqual([0, 0]);
});

test('a failed multi-slot save rolls back every put and retains page buffers', async ({
  page,
}) => {
  const lesson = (await engineRequest()).lesson;
  const result = await page.evaluate(async (lesson) => {
    const api = window.storageTest;
    await api.start('a');
    api.change('a', lesson, { draftSql: 'first' });
    api.change(
      'a',
      { ...lesson, revision: lesson.revision + 1 },
      { draftSql: 'second' },
    );
    const original = IDBObjectStore.prototype.put;
    let puts = 0;
    IDBObjectStore.prototype.put = function (...args) {
      if (this.name === 'records' && ++puts === 2)
        throw new DOMException('Test quota exhausted', 'QuotaExceededError');
      return original.apply(this, args);
    };
    await api.flush('a');
    IDBObjectStore.prototype.put = original;
    return {
      state: api.state('a'),
      local: api.local('a'),
      stored: await api.read(),
    };
  }, lesson);
  expect(result.state.status).toBe('paused');
  expect(result.local).toHaveLength(2);
  expect(result.stored.records).toEqual([]);
  expect(result.stored.metadata.recordSetVersion).toBe(0);
});

test('recovery rejects changed previews without dropping buffered edits or newer stored records', async ({
  page,
}) => {
  const lesson = (await engineRequest()).lesson;
  const result = await page.evaluate(async (lesson) => {
    const api = window.storageTest;
    await api.start('a');
    api.change('a', lesson, { draftSql: 'buffer' });
    await api.replaceExternally(true);
    await api.flush('a');
    const preview = await api.inspect('a');
    await api.replaceExternally(false);
    let rejected = false;
    try {
      await api.recover('a', preview, [], 'stored');
    } catch {
      rejected = true;
    }
    const fresh = await api.inspect('a');
    api.change('a', lesson, { draftSql: 'edited after preview' });
    let localRejected = false;
    try {
      await api.recover('a', fresh, [], 'stored');
    } catch {
      localRejected = true;
    }
    return {
      rejected,
      localRejected,
      local: api.local('a'),
      stored: await api.read(),
    };
  }, lesson);
  expect(result.rejected).toBe(true);
  expect(result.localRejected).toBe(true);
  expect(result.local[0]?.draftSql).toBe('edited after preview');
  expect(result.stored.records).toEqual([]);
  expect(result.stored.metadata.recordGeneration).toBe(2);
});

test('over 5 MiB round-trips through isolated staging and one atomic replacement, including unknown courses and both drafts', async ({
  page,
}) => {
  const lesson = (await engineRequest()).lesson;
  const result = await page.evaluate(async (lesson) => {
    const api = window.storageTest;
    await api.start('a');
    for (let revision = 1; revision <= 115; revision++) {
      api.change(
        'a',
        { ...lesson, courseId: 'unknown-course', revision },
        {
          draftSql: '中'.repeat(20000),
          puzzleDraft: {
            cardOrder: ['historical-card'],
            sql: `SELECT ${revision}`,
          },
          inputMode: 'puzzle',
          passed: true,
        },
      );
    }
    await api.flush('a');
    const original = await api.read();
    const texts = api.backup(original.records);
    const staged = await api.stage(texts.toReversed());
    const afterStaging = await api.read();
    const cleared = await api.replace(original.metadata, null);
    const empty = await api.read();
    await api.replace(cleared, staged);
    const restored = await api.read();
    let reused = false;
    try {
      await api.replace(restored.metadata, staged);
    } catch {
      reused = true;
    }
    return {
      sizes: texts.map((text) => new Blob([text]).size),
      unchanged: JSON.stringify(original) === JSON.stringify(afterStaging),
      empty: empty.records.length,
      equal:
        JSON.stringify(original.records) === JSON.stringify(restored.records),
      metadata: restored.metadata,
      reused,
    };
  }, lesson);
  expect(result.sizes.length).toBeGreaterThan(1);
  expect(result.sizes.every((size) => size <= 5 * 1024 * 1024)).toBe(true);
  expect(result.sizes.reduce((a, b) => a + b, 0)).toBeGreaterThan(
    5 * 1024 * 1024,
  );
  expect(result.unchanged).toBe(true);
  expect(result.empty).toBe(0);
  expect(result.equal).toBe(true);
  expect(result.metadata).toMatchObject({
    recordGeneration: 2,
    recordSetVersion: 3,
  });
  expect(result.reused).toBe(true);
});

test('missing, mixed, repeated, invalid, non-UTF8 and oversize volumes reject the entire group; cancelled staging changes nothing', async ({
  page,
}) => {
  const lesson = (await engineRequest()).lesson;
  const result = await page.evaluate(async (lesson) => {
    const api = window.storageTest;
    await api.start('a');
    api.change('a', lesson, { draftSql: 'original' });
    await api.flush('a');
    const before = await api.read();
    const base = before.records[0];
    if (!base) throw new Error('Missing record');
    const header = {
      schemaVersion: 1,
      backupId: 'test-group',
      exportedAt: '2026-11-01T00:00:00.000Z',
      partCount: 2,
    };
    const a = { ...header, partIndex: 1, records: [base] };
    const b = {
      ...header,
      partIndex: 2,
      records: [{ ...base, revision: base.revision + 1 }],
    };
    const groups = [
      [a],
      [a, a],
      [a, { ...b, backupId: 'another-group' }],
      [a, { ...b, exportedAt: '2026-11-02T00:00:00.000Z' }],
      [a, { ...b, partIndex: 3 }],
      [a, { ...b, records: [base] }],
      [a, { ...b, records: [{ ...base, passed: 'true' }] }],
      [a, { ...b, records: [{ ...base, draftSql: 'x'.repeat(20001) }] }],
      [a, { ...b, records: [{ ...base, extra: 'not allowed' }] }],
    ];
    let rejected = 0;
    for (const group of groups) {
      try {
        await api.stage(group.map((part) => JSON.stringify(part)));
      } catch {
        rejected++;
      }
    }
    const { stageBackup } = await import('../../src/storage/backup.ts');
    for (const files of [
      [],
      [new Blob([' '.repeat(5 * 1024 * 1024 + 1)])],
      [new Blob([new Uint8Array([255])])],
      [new Blob(['{'])],
    ]) {
      try {
        await stageBackup(files, new AbortController().signal);
      } catch {
        rejected++;
      }
    }
    const controller = new AbortController();
    const originalAdd = IDBObjectStore.prototype.add;
    IDBObjectStore.prototype.add = function (...args) {
      if (this.name === 'importRecords') controller.abort();
      return originalAdd.apply(this, args);
    };
    try {
      await stageBackup(
        [a, b].map((part) => new Blob([JSON.stringify(part)])),
        controller.signal,
      );
    } catch {
      rejected++;
    } finally {
      IDBObjectStore.prototype.add = originalAdd;
    }
    const counts = await new Promise<number[]>((resolve, reject) => {
      const open = indexedDB.open('sql-quest-learning');
      open.onerror = () => reject(open.error);
      open.onsuccess = () => {
        const db = open.result;
        const tx = db.transaction(['imports', 'importRecords']);
        const imports = tx.objectStore('imports').count();
        const records = tx.objectStore('importRecords').count();
        tx.oncomplete = () => {
          db.close();
          resolve([imports.result, records.result]);
        };
      };
    });
    return {
      rejected,
      expected: groups.length + 5,
      counts,
      unchanged: JSON.stringify(before) === JSON.stringify(await api.read()),
    };
  }, lesson);
  expect(result.rejected).toBe(result.expected);
  expect(result.counts).toEqual([0, 0]);
  expect(result.unchanged).toBe(true);
});

test('import copy failure and metadata failure roll back clear, all records and counters; page drafts survive without automatic replay', async ({
  page,
}) => {
  const lesson = (await engineRequest()).lesson;
  const result = await page.evaluate(async (lesson) => {
    const api = window.storageTest;
    await api.start('a');
    api.change('a', lesson, { draftSql: 'stored' });
    await api.flush('a');
    const original = await api.read();
    const base = original.records[0];
    if (!base) throw new Error('Missing record');
    const stage = await api.stage(
      api.backup([base, { ...base, revision: base.revision + 1 }]),
    );
    api.change('a', lesson, { draftSql: 'buffer must survive' });
    const oldContext = api.capture('a');
    const originalAdd = IDBObjectStore.prototype.add;
    let count = 0;
    IDBObjectStore.prototype.add = function (...args) {
      if (this.name === 'records' && ++count === 2)
        throw new DOMException('Test import quota', 'QuotaExceededError');
      return originalAdd.apply(this, args);
    };
    let copyFailed = false;
    try {
      await api.replaceSession('a', original.metadata, stage);
    } catch {
      copyFailed = true;
    } finally {
      IDBObjectStore.prototype.add = originalAdd;
    }
    api.change(
      'a',
      lesson,
      { draftSql: 'late old callback', passed: true },
      oldContext,
    );
    await api.flush('a');
    const retained = api.local('a');
    const afterCopy = await api.read();
    const originalPut = IDBObjectStore.prototype.put;
    IDBObjectStore.prototype.put = function (...args) {
      if (this.name === 'metadata')
        throw new DOMException('Test metadata failure', 'QuotaExceededError');
      return originalPut.apply(this, args);
    };
    let clearFailed = false;
    try {
      await api.replaceSession('a', original.metadata, null);
    } catch {
      clearFailed = true;
    } finally {
      IDBObjectStore.prototype.put = originalPut;
    }
    return {
      copyFailed,
      clearFailed,
      retained,
      state: api.state('a'),
      copyUnchanged: JSON.stringify(original) === JSON.stringify(afterCopy),
      clearUnchanged:
        JSON.stringify(original) === JSON.stringify(await api.read()),
    };
  }, lesson);
  expect(result.copyFailed).toBe(true);
  expect(result.clearFailed).toBe(true);
  expect(result.copyUnchanged).toBe(true);
  expect(result.clearUnchanged).toBe(true);
  expect(result.retained[0]).toMatchObject({
    draftSql: 'buffer must survive',
    passed: false,
  });
  expect(result.state.status).toBe('paused');
});

test('successful clear/replacement invalidate captured edits and debounce, and stale previews cannot overwrite a newer tab', async ({
  page,
}) => {
  const lesson = (await engineRequest()).lesson;
  const result = await page.evaluate(async (lesson) => {
    const api = window.storageTest;
    await api.start('a');
    const empty = await api.read();
    const old = api.capture('a');
    api.change('a', lesson, { draftSql: 'pending clear' });
    await api.replaceSession('a', empty.metadata, null);
    api.change('a', lesson, { passed: true, draftSql: 'late' }, old);
    await api.flush('a');
    const cleared = await api.read();
    const current = api.capture('a');
    api.change('a', lesson, { draftSql: 'pending import' });
    const imported = { ...api.record('a', lesson), draftSql: 'imported' };
    const stage = await api.stage(api.backup([imported]));
    await api.replaceSession('a', cleared.metadata, stage);
    api.change('a', lesson, { passed: true, draftSql: 'late import' }, current);
    await api.flush('a');
    const replaced = await api.read();
    await api.write(replaced.metadata, [
      {
        base: imported,
        patch: { reviewMarked: true },
        generation: replaced.metadata.recordGeneration,
      },
    ]);
    let stale = false;
    try {
      await api.replaceSession('a', replaced.metadata, null);
    } catch {
      stale = true;
    }
    return { cleared, replaced, stale, final: await api.read() };
  }, lesson);
  expect(result.cleared.records).toEqual([]);
  expect(result.replaced.records[0]).toMatchObject({
    draftSql: 'imported',
    passed: false,
  });
  expect(result.replaced.metadata.recordGeneration).toBe(2);
  expect(result.stale).toBe(true);
  expect(result.final.records[0]?.reviewMarked).toBe(true);
  expect(result.final.metadata.recordGeneration).toBe(2);
});

test('an already-started save finishes before replacement; a changed preview aborts instead of losing the write', async ({
  page,
}) => {
  const lesson = (await engineRequest()).lesson;
  const result = await page.evaluate(async (lesson) => {
    const api = window.storageTest;
    await api.start('a');
    const before = await api.read();
    api.change('a', lesson, { draftSql: 'in-flight save' });
    const saving = api.flush('a');
    let rejected = false;
    try {
      await api.replaceSession('a', before.metadata, null);
    } catch {
      rejected = true;
    }
    await saving;
    return { rejected, stored: await api.read(), state: api.state('a') };
  }, lesson);
  expect(result.rejected).toBe(true);
  expect(result.stored.records[0]?.draftSql).toBe('in-flight save');
  expect(result.stored.metadata.recordGeneration).toBe(0);
  expect(result.state.status).toBe('paused');
});

test('revision history includes unsaved drafts and no old-version pass or hint overwrites the newer slot', async ({
  page,
}) => {
  const lesson = (await engineRequest()).lesson;
  const result = await page.evaluate(async (lesson) => {
    const api = window.storageTest;
    await api.start('a');
    const puzzleDraft = { cardOrder: ['one'], sql: 'SELECT 1' };
    api.change(
      'a',
      { ...lesson, revision: lesson.revision + 1 },
      {
        draftSql: 'new draft',
        passed: true,
        viewedHintIds: ['syntax'],
        puzzleDraft,
      },
    );
    puzzleDraft.cardOrder.push('later');
    puzzleDraft.sql = 'SELECT 2';
    const history = api.history('a', lesson);
    await api.flush('a');
    api.change('a', lesson, {
      draftSql: 'old draft',
      passed: true,
      viewedHintIds: ['idea'],
    });
    await api.flush('a');
    api.change(
      'a',
      { ...lesson, revision: lesson.revision + 1 },
      { reviewMarked: true },
    );
    await api.flush('a');
    return { history, stored: await api.read() };
  }, lesson);
  expect(result.history[0]?.draftSql).toBe('new draft');
  expect(result.stored.records).toMatchObject([
    {
      revision: lesson.revision,
      draftSql: 'old draft',
      passed: true,
      viewedHintIds: ['idea'],
    },
    {
      revision: lesson.revision + 1,
      draftSql: 'new draft',
      passed: true,
      viewedHintIds: ['syntax'],
      reviewMarked: true,
      puzzleDraft: { cardOrder: ['one'], sql: 'SELECT 1' },
    },
  ]);
});

test('upgrading the existing v1 database preserves records and counters; temporary imports stay isolated and expired areas cannot replace', async ({
  page,
}) => {
  const lesson = (await engineRequest()).lesson;
  const result = await page.evaluate(async (lesson) => {
    const base = {
      schemaVersion: 1,
      courseId: lesson.courseId,
      themeId: lesson.themeId,
      lessonId: lesson.id,
      revision: 1,
      draftSql: 'legacy draft',
      inputMode: 'text',
      passed: true,
      viewedHintIds: [],
      reviewMarked: true,
    };
    await new Promise<void>((resolve, reject) => {
      const request = indexedDB.open('sql-quest-learning', 1);
      request.onupgradeneeded = () => {
        request.result
          .createObjectStore('records', {
            keyPath: ['courseId', 'themeId', 'lessonId', 'revision'],
          })
          .add(base);
        request.result
          .createObjectStore('metadata')
          .put(
            { schemaVersion: 1, recordGeneration: 4, recordSetVersion: 17 },
            'state',
          );
      };
      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        request.result.close();
        resolve();
      };
    });
    const api = window.storageTest;
    const upgraded = await api.read();
    const first = await api.stage(api.backup(upgraded.records));
    const second = await api.stage(api.backup([]));
    await api.discard(first);
    let discarded = false;
    try {
      await api.replace(upgraded.metadata, first);
    } catch {
      discarded = true;
    }
    const { cleanupExpiredImports, stageRecords, finishImport } =
      await import('../../src/storage/database.ts');
    const expired = { ...first, createdAt: Date.now() - 25 * 60 * 60 * 1000 };
    await stageRecords(expired, upgraded.records);
    await finishImport(expired);
    await cleanupExpiredImports();
    let expiredRejected = false;
    try {
      await api.replace(upgraded.metadata, expired);
    } catch {
      expiredRejected = true;
    }
    const beforeReplace = await api.read();
    await api.replace(upgraded.metadata, second);
    return {
      upgraded,
      beforeReplace,
      discarded,
      expiredRejected,
      after: await api.read(),
    };
  }, lesson);
  expect(result.upgraded.records[0]).toMatchObject({
    draftSql: 'legacy draft',
    passed: true,
    reviewMarked: true,
  });
  expect(result.upgraded.metadata).toMatchObject({
    recordGeneration: 4,
    recordSetVersion: 17,
  });
  expect(result.beforeReplace).toEqual(result.upgraded);
  expect(result.discarded).toBe(true);
  expect(result.expiredRejected).toBe(true);
  expect(result.after.records).toEqual([]);
  expect(result.after.metadata).toMatchObject({
    recordGeneration: 5,
    recordSetVersion: 18,
  });
});

test('unreadable metadata never invents a generation or replays drafts when storage returns; explicit recovery resolves conflicts', async ({
  page,
}) => {
  const lesson = (await engineRequest()).lesson;
  const result = await page.evaluate(async (lesson) => {
    const api = window.storageTest;
    await api.start('stored');
    api.change('stored', lesson, { draftSql: 'disk' });
    await api.flush('stored');
    const originalOpen = IDBFactory.prototype.open;
    IDBFactory.prototype.open = () => {
      throw new DOMException('Test unavailable', 'SecurityError');
    };
    await api.start('offline');
    api.change('offline', lesson, { draftSql: 'offline' });
    const generation = api.generation('offline');
    const local = api.local('offline');
    IDBFactory.prototype.open = originalOpen;
    await api.flush('offline');
    const before = await api.read();
    const preview = await api.inspect('offline');
    const { recordKey } = await import('../../src/storage/records.ts');
    const draft = local[0];
    if (!draft) throw new Error('Missing draft');
    await api.recover(
      'offline',
      preview,
      [[`${recordKey(draft)}/draftSql`, 'local']],
      'merge',
    );
    return {
      generation,
      before,
      after: await api.read(),
      captured: preview.edits[0]?.generation,
    };
  }, lesson);
  expect(result.generation).toBeNull();
  expect(result.captured).toBeNull();
  expect(result.before.records[0]?.draftSql).toBe('disk');
  expect(result.after.records[0]?.draftSql).toBe('offline');
});

test('read failure after a committed replacement is reported as such, not as rollback or a retry of old drafts', async ({
  page,
}) => {
  const lesson = (await engineRequest()).lesson;
  const result = await page.evaluate(async (lesson) => {
    const api = window.storageTest;
    await api.start('a');
    const before = await api.read();
    api.change('a', lesson, { draftSql: 'old buffer' });
    const stage = await api.stage(
      api.backup([{ ...api.record('a', lesson), draftSql: 'restored' }]),
    );
    const getAll = IDBObjectStore.prototype.getAll;
    IDBObjectStore.prototype.getAll = () => {
      throw new DOMException('Test read failure', 'UnknownError');
    };
    try {
      await api.replaceSession('a', before.metadata, stage);
    } finally {
      IDBObjectStore.prototype.getAll = getAll;
    }
    await api.flush('a');
    return {
      state: api.state('a'),
      local: api.local('a'),
      stored: await api.read(),
    };
  }, lesson);
  expect(result.state.status).toBe('paused');
  expect(result.state.message).toContain('记录替换已成功');
  expect(result.local).toEqual([]);
  expect(result.stored.records[0]?.draftSql).toBe('restored');
  expect(result.stored.metadata.recordGeneration).toBe(1);
});
