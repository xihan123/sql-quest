import type {
  LearningRecord,
  Lesson,
  RecordMetadata,
} from '../contracts/generated/types.d.ts';
import type { DeepReadonly } from '../content/checks.ts';
import { readRecords, replaceRecords, writeRecords } from './database.ts';
import type { ImportPreview } from './database.ts';
import {
  patchRecord,
  recordKey,
  resolveEdits,
  sameMetadata,
} from './records.ts';
import type { RecordEdit, RecordPatch, RecordSnapshot } from './records.ts';

export interface SessionState {
  status: 'loading' | 'saved' | 'pending' | 'saving' | 'paused' | 'replacing';
  message: string;
}
export interface EditContext {
  readonly generation: number | null;
  readonly epoch: number;
}
export class RecordSession {
  private records = new Map<string, LearningRecord>();
  private edits = new Map<string, RecordEdit>();
  private metadata: RecordMetadata | undefined;
  private state: SessionState = {
    status: 'loading',
    message: '正在读取本地记录…',
  };
  private listeners = new Set<() => void>();
  private timer: ReturnType<typeof setTimeout> | undefined;
  private saving: Promise<void> | undefined;
  private disposed = false;
  private loadToken = 0;
  private channel: BroadcastChannel | undefined;
  private epoch = 0;
  private locked = false;
  getState = () => this.state;
  subscribe = (listener: () => void) => {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  };
  generation = () =>
    this.state.status === 'paused' || this.locked
      ? null
      : (this.metadata?.recordGeneration ?? null);
  hasUnsaved = () => this.edits.size > 0;
  capture = (): EditContext => ({
    generation: this.metadata?.recordGeneration ?? null,
    epoch: this.epoch,
  });
  private publish(status: SessionState['status'], message: string) {
    this.state = { status, message };
    if (!this.disposed) for (const listener of this.listeners) listener();
  }
  private pause(error: unknown) {
    clearTimeout(this.timer);
    this.publish(
      'paused',
      `${error instanceof Error ? error.message : '本地记录保存失败'}。本页草稿仍保留，刷新前请导出。`,
    );
  }
  async initialize() {
    this.disposed = false;
    const token = ++this.loadToken;
    try {
      const snapshot = await readRecords();
      if (this.disposed || token !== this.loadToken) return;
      this.adopt(snapshot);
      if (typeof BroadcastChannel !== 'undefined') {
        this.channel = new BroadcastChannel('sql-quest-records');
        this.channel.onmessage = () => {
          if (!this.locked)
            this.pause(new Error('收到其他页面的记录变更通知，已暂停保存'));
        };
      }
    } catch (error) {
      if (!this.disposed && token === this.loadToken) this.pause(error);
    }
  }
  private adopt(snapshot: RecordSnapshot) {
    this.records = new Map(
      snapshot.records.map((record) => [recordKey(record), record]),
    );
    this.metadata = snapshot.metadata;
    this.publish('saved', '本地记录已就绪');
  }
  record(lesson: DeepReadonly<Lesson>): LearningRecord {
    const identity = {
      courseId: lesson.courseId,
      themeId: lesson.themeId,
      lessonId: lesson.id,
      revision: lesson.revision,
    };
    const key = recordKey(identity);
    const edit = this.edits.get(key);
    if (edit) return patchRecord(edit.base, edit.patch);
    return (
      this.records.get(key) ?? {
        ...identity,
        schemaVersion: 1,
        draftSql: lesson.starterSql,
        inputMode: 'text',
        passed: false,
        viewedHintIds: [],
        reviewMarked: false,
      }
    );
  }
  history(lesson: DeepReadonly<Lesson>) {
    const matches = (record: LearningRecord) =>
      record.courseId === lesson.courseId &&
      record.themeId === lesson.themeId &&
      record.lessonId === lesson.id &&
      record.revision !== lesson.revision;
    const history = new Map(
      [...this.records].filter(([, record]) => matches(record)),
    );
    for (const [key, edit] of this.edits)
      if (matches(edit.base))
        history.set(key, patchRecord(edit.base, edit.patch));
    return [...history.values()].sort((a, b) => b.revision - a.revision);
  }
  change(
    lesson: DeepReadonly<Lesson>,
    patch: RecordPatch,
    context = this.capture(),
  ) {
    if (
      this.disposed ||
      this.locked ||
      context.epoch !== this.epoch ||
      context.generation !== (this.metadata?.recordGeneration ?? null)
    )
      return;
    patch = structuredClone(patch);
    const current = this.record(lesson);
    const next = patchRecord(current, patch);
    const key = recordKey(current);
    const previous = this.edits.get(key);
    this.edits.set(key, {
      base: previous?.base ?? current,
      patch: {
        ...previous?.patch,
        ...patch,
        ...(patch.viewedHintIds ? { viewedHintIds: next.viewedHintIds } : {}),
      },
      generation: previous ? previous.generation : context.generation,
    });
    if (this.state.status === 'paused')
      this.publish('paused', this.state.message);
    else {
      this.publish('pending', '本页有未保存修改');
      clearTimeout(this.timer);
      this.timer = setTimeout(() => {
        void this.flush();
      }, 350);
    }
  }
  async flush(): Promise<void> {
    clearTimeout(this.timer);
    if (this.saving) {
      await this.saving;
      return this.flush();
    }
    if (
      this.disposed ||
      this.locked ||
      this.state.status === 'paused' ||
      !this.metadata ||
      !this.edits.size
    )
      return;
    const edits = [...this.edits.entries()];
    const expected = { ...this.metadata };
    this.publish('saving', '正在保存到本机…');
    this.saving = (async () => {
      try {
        const result = await writeRecords(
          expected,
          edits.map(([, edit]) => edit),
        );
        this.metadata = result.metadata;
        for (const record of result.records)
          this.records.set(recordKey(record), record);
        for (const [key, edit] of edits)
          if (this.edits.get(key) === edit) this.edits.delete(key);
        this.notify(result.metadata);
        if (this.state.status !== 'paused' && !this.locked && !this.disposed)
          this.publish(
            this.edits.size ? 'pending' : 'saved',
            this.edits.size ? '本页有未保存修改' : '已保存到本机',
          );
      } catch (error) {
        if (!this.locked && !this.disposed) this.pause(error);
      }
    })();
    await this.saving;
    this.saving = undefined;
    if (this.edits.size && this.getState().status !== 'paused' && !this.locked)
      await this.flush();
  }
  async inspect(): Promise<{ snapshot: RecordSnapshot; edits: RecordEdit[] }> {
    await this.flush();
    try {
      const snapshot = await readRecords();
      if (!this.metadata || !sameMetadata(snapshot.metadata, this.metadata))
        this.pause(new Error('已存记录与本页快照不同，请确认处理方式'));
      return { snapshot, edits: structuredClone([...this.edits.values()]) };
    } catch (error) {
      this.pause(error);
      throw error;
    }
  }
  async recover(
    snapshot: RecordSnapshot,
    edits: RecordEdit[],
    choices: ReadonlyMap<string, 'local' | 'stored'>,
    mode: 'merge' | 'stored',
    invalidate: () => void = () => {},
  ) {
    await this.protect(invalidate, async () => {
      if (JSON.stringify([...this.edits.values()]) !== JSON.stringify(edits))
        throw new Error('本页修改在预览后发生变化，请重新检查记录');
      const next =
        mode === 'merge' ? resolveEdits(snapshot, edits, choices) : [];
      // Even a read-stored choice verifies the preview hasn't changed in another tab.
      const result = await writeRecords(snapshot.metadata, next);
      const records = new Map(
        snapshot.records.map((record) => [recordKey(record), record]),
      );
      for (const record of result.records)
        records.set(recordKey(record), record);
      this.edits.clear();
      this.adopt({ metadata: result.metadata, records: [...records.values()] });
      this.notify(result.metadata);
    });
  }
  private notify(metadata: RecordMetadata) {
    try {
      this.channel?.postMessage(metadata);
    } catch {
      // Notifications are optional; a committed transaction remains successful.
      this.channel?.close();
      this.channel = undefined;
    }
  }
  private async protect(invalidate: () => void, action: () => Promise<void>) {
    if (this.locked || this.disposed)
      throw new Error('记录操作正在进行或页面已关闭');
    this.locked = true;
    this.epoch++;
    clearTimeout(this.timer);
    this.publish('replacing', '正在保护并更新记录，练习与普通保存已暂停…');
    try {
      invalidate();
      if (this.saving) await this.saving;
      if (this.disposed) throw new Error('页面已关闭，未开始替换');
      await action();
    } catch (error) {
      this.pause(error);
      throw error;
    } finally {
      this.locked = false;
      if (!this.disposed) for (const listener of this.listeners) listener();
    }
  }
  async replace(
    expected: RecordMetadata,
    source: ImportPreview | null,
    invalidate: () => void = () => {},
  ) {
    await this.protect(invalidate, async () => {
      const metadata = await replaceRecords(expected, source);
      // Only a committed replacement may discard the old page buffers.
      this.edits.clear();
      this.records.clear();
      this.metadata = metadata;
      this.notify(metadata);
      try {
        const snapshot = await readRecords();
        if (!sameMetadata(metadata, snapshot.metadata))
          throw new Error('替换后另一页面又修改了记录，请重新检查');
        this.adopt(snapshot);
        this.publish('saved', source ? '已完整导入学习记录' : '已清除学习记录');
      } catch (error) {
        this.pause(
          new Error('记录替换已成功，但重新读取失败，请检查已存记录', {
            cause: error,
          }),
        );
      }
    });
  }
  localSnapshot(): LearningRecord[] {
    const records = new Map(this.records);
    for (const [key, edit] of this.edits)
      records.set(key, patchRecord(edit.base, edit.patch));
    return structuredClone([...records.values()]);
  }
  dispose() {
    this.disposed = true;
    this.epoch++;
    this.loadToken++;
    clearTimeout(this.timer);
    this.channel?.close();
    this.listeners.clear();
  }
}
