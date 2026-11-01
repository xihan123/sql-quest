import { useEffect, useRef, useState, useSyncExternalStore } from 'react';
import type { RecordSession } from '../storage/session.ts';
import {
  findConflicts,
  patchRecord,
  recordKey,
  resolveEdits,
} from '../storage/records.ts';
import type { RecordEdit, RecordSnapshot } from '../storage/records.ts';
import {
  checkBackupFiles,
  makeBackup,
  stageBackup,
} from '../storage/backup.ts';
import { discardImport } from '../storage/database.ts';
import type { ImportPreview } from '../storage/database.ts';
import type { RecordMetadata } from '../contracts/generated/types.d.ts';
import { Dialog } from './Dialog.tsx';
import styles from '../app/App.module.css';

interface Preview {
  snapshot: RecordSnapshot;
  edits: RecordEdit[];
}
const fieldLabels = {
  draftSql: 'SQL 草稿',
  puzzleDraft: '拼图草稿（排列与 SQL 同次选择）',
  inputMode: '输入方式',
  reviewMarked: '复习标记',
};

function Downloads({ parts, partial }: { parts: string[]; partial: boolean }) {
  const container = useRef<HTMLElement>(null);
  useEffect(() => {
    const urls = parts.map((part) =>
      URL.createObjectURL(new Blob([part], { type: 'application/json' })),
    );
    container.current?.querySelectorAll('a').forEach((link, index) => {
      const url = urls[index];
      if (url) link.href = url;
    });
    return () => urls.forEach((url) => URL.revokeObjectURL(url));
  }, [parts]);
  return (
    <section ref={container} aria-label="导出文件">
      <p>
        {partial
          ? '存储不可读：仅导出本页已持有的记录和草稿，不是完整备份。'
          : '已固定完整记录快照，包含历史版本和本页修改。'}{' '}
        共 {parts.length}{' '}
        卷，请下载全部文件；恢复时一次选择这组全部分卷。之后的编辑不进入这份快照。
      </p>
      {parts.map((_, index) => (
        <a
          className={styles.download}
          key={index}
          download={`sql-quest-${partial ? 'page-' : ''}${index + 1}-of-${parts.length}.json`}
        >
          下载第 {index + 1} / {parts.length} 卷
        </a>
      ))}
    </section>
  );
}
export function RecordTools({
  session,
  invalidate,
}: {
  session: RecordSession;
  invalidate: () => void;
}) {
  const state = useSyncExternalStore(session.subscribe, session.getState);
  const [open, setOpen] = useState(false);
  const [preview, setPreview] = useState<Preview>();
  const [choices, setChoices] = useState(new Map<string, 'local' | 'stored'>());
  const [output, setOutput] = useState<{ parts: string[]; partial: boolean }>();
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const [importActive, setImportActive] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  const [fileBytes, setFileBytes] = useState(0);
  const [replacement, setReplacement] = useState<{
    expected: RecordMetadata;
    source: ImportPreview | null;
  }>();
  const staged = useRef<ImportPreview | undefined>(undefined);
  const importing = useRef<AbortController | undefined>(undefined);
  useEffect(
    () => () => {
      importing.current?.abort();
      if (staged.current)
        void discardImport(staged.current).catch(console.error);
    },
    [],
  );
  const conflicts = preview
    ? findConflicts(preview.snapshot, preview.edits)
    : [];
  const resolved = conflicts.every((item) =>
    choices.has(`${item.key}/${item.field}`),
  );
  async function inspect() {
    setOpen(true);
    setBusy(true);
    setError('');
    setPreview(undefined);
    setOutput(undefined);
    setChoices(new Map());
    setReplacement(undefined);
    try {
      await releaseStage();
      setPreview(await session.inspect());
    } catch (error) {
      setError(error instanceof Error ? error.message : '无法读取记录');
    } finally {
      setBusy(false);
    }
  }
  async function releaseStage() {
    if (staged.current) await discardImport(staged.current);
    staged.current = undefined;
  }
  function dismiss() {
    setReplacement(undefined);
    setFiles([]);
    setFileBytes(0);
    setOutput(undefined);
    setPreview(undefined);
    setOpen(false);
  }
  async function close() {
    if (busy) return;
    setBusy(true);
    try {
      await releaseStage();
      dismiss();
    } catch (error) {
      setError(
        error instanceof Error ? error.message : '临时区清理失败，请重试关闭',
      );
    } finally {
      setBusy(false);
    }
  }
  async function previewReplacement(kind: 'import' | 'clear') {
    setBusy(true);
    setError('');
    setReplacement(undefined);
    try {
      await releaseStage();
      if (kind === 'import') {
        const controller = new AbortController();
        importing.current = controller;
        setImportActive(true);
        staged.current = await stageBackup(files, controller.signal);
      }
      const fresh = await session.inspect();
      importing.current?.signal.throwIfAborted();
      setPreview(fresh);
      setChoices(new Map());
      setOutput(undefined);
      setReplacement({
        expected: fresh.snapshot.metadata,
        source: staged.current ?? null,
      });
    } catch (error) {
      setError(error instanceof Error ? error.message : '无法预览记录替换');
      try {
        await releaseStage();
      } catch {
        setError('导入未启用，临时区清理失败；请重试。正式记录未替换。');
      }
    } finally {
      importing.current = undefined;
      setImportActive(false);
      setBusy(false);
    }
  }
  async function replace() {
    if (!replacement) return;
    setBusy(true);
    setError('');
    try {
      await session.replace(
        replacement.expected,
        replacement.source,
        invalidate,
      );
      staged.current = undefined;
      invalidate();
      dismiss();
    } catch (error) {
      setError(
        `${error instanceof Error ? error.message : '记录替换失败'}。本页草稿保留，请重新预览或导出。`,
      );
      setReplacement(undefined);
    } finally {
      setBusy(false);
    }
  }
  function exportRecords() {
    try {
      if (!preview) {
        setOutput({
          parts: makeBackup(session.localSnapshot()),
          partial: true,
        });
        return;
      }
      const merged = new Map(
        preview.snapshot.records.map((record) => [recordKey(record), record]),
      );
      for (const edit of resolveEdits(preview.snapshot, preview.edits, choices))
        merged.set(recordKey(edit.base), patchRecord(edit.base, edit.patch));
      setOutput({ parts: makeBackup([...merged.values()]), partial: false });
    } catch (error) {
      setError(error instanceof Error ? error.message : '导出失败');
    }
  }
  async function recover(mode: 'merge' | 'stored') {
    if (!preview) return;
    setBusy(true);
    setError('');
    try {
      await releaseStage();
      await session.recover(
        preview.snapshot,
        preview.edits,
        choices,
        mode,
        invalidate,
      );
      invalidate();
      dismiss();
    } catch (error) {
      setError(error instanceof Error ? error.message : '记录处理失败');
      setPreview(undefined);
    } finally {
      setBusy(false);
    }
  }
  return (
    <>
      <div className={styles.recordStatus}>
        <span role="status">{state.message}</span>
        <button
          type="button"
          onClick={() => void inspect()}
          disabled={
            state.status === 'loading' || state.status === 'replacing' || busy
          }
        >
          {state.status === 'paused'
            ? '检查已存记录 / 导出'
            : '学习记录：备份 / 导入 / 清除'}
        </button>
      </div>
      {open && (
        <Dialog title="本地记录与备份" onClose={() => void close()}>
          {busy && <p role="status">正在校验或处理记录，请稍候…</p>}
          {busy && importActive && (
            <button
              type="button"
              onClick={() =>
                importing.current?.abort(
                  new Error('已取消导入校验，正式记录未替换'),
                )
              }
            >
              取消导入校验
            </button>
          )}
          {error && <p role="alert">{error}</p>}
          {preview && (
            <>
              <p>
                已存 {preview.snapshot.records.length} 个版本槽，本页{' '}
                {preview.edits.length}{' '}
                个未保存版本槽。导出不更改正式记录。合并保留已通过状态和已查看提示。
              </p>
              {conflicts.map((item) => (
                <fieldset key={`${item.key}/${item.field}`} disabled={busy}>
                  <legend>
                    <code>{item.key}</code> · {fieldLabels[item.field]}
                  </legend>
                  <p>已存内容</p>
                  <pre>
                    {item.stored === undefined
                      ? '（已存版本槽不存在）'
                      : typeof item.stored === 'object'
                        ? JSON.stringify(item.stored)
                        : String(item.stored)}
                  </pre>
                  <p>本页内容</p>
                  <pre>
                    {typeof item.local === 'object'
                      ? JSON.stringify(item.local)
                      : String(item.local)}
                  </pre>
                  <label>
                    选择保留的字段
                    <select
                      value={choices.get(`${item.key}/${item.field}`) ?? ''}
                      onChange={(event) => {
                        const value = event.target.value;
                        if (value === 'local' || value === 'stored')
                          setChoices(
                            new Map(choices).set(
                              `${item.key}/${item.field}`,
                              value,
                            ),
                          );
                      }}
                    >
                      <option value="" disabled>
                        请选择
                      </option>
                      <option value="local">本页内容</option>
                      <option value="stored">已存内容</option>
                    </select>
                  </label>
                </fieldset>
              ))}
            </>
          )}
          <div className={styles.actions}>
            <button
              type="button"
              disabled={busy || !resolved}
              onClick={exportRecords}
            >
              {preview ? '生成分卷备份' : '导出本页保留的草稿'}
            </button>
            {preview && state.status === 'paused' && !replacement && (
              <>
                <button
                  type="button"
                  disabled={busy || !resolved}
                  onClick={() => void recover('merge')}
                >
                  确认合并并保存本页修改
                </button>
                <button
                  type="button"
                  disabled={busy}
                  onClick={() => void recover('stored')}
                >
                  确认舍弃本页修改，读取已存版本
                </button>
              </>
            )}
            <button
              type="button"
              disabled={busy}
              onClick={() => void inspect()}
            >
              重新检查记录
            </button>
          </div>
          {output && <Downloads {...output} />}
          {preview && (
            <fieldset disabled={busy} className={styles.importTools}>
              <legend>整组导入与清除</legend>
              <p>
                操作范围是本站全部课程、历史版本及本页草稿，不只是当前关卡。建议先生成并下载备份。确认前不会替换记录或取消执行。
              </p>
              <label>
                选择整组备份文件（每卷至多 5 MiB）
                <input
                  type="file"
                  accept=".json,application/json"
                  multiple
                  onChange={(event) => {
                    const selected = Array.from(event.target.files ?? []);
                    setReplacement(undefined);
                    setFiles([]);
                    setFileBytes(0);
                    setError('');
                    try {
                      setFileBytes(checkBackupFiles(selected));
                      setFiles(selected);
                    } catch (error) {
                      setError(
                        error instanceof Error ? error.message : '文件选择无效',
                      );
                    }
                  }}
                />
              </label>
              {files.length > 0 && (
                <p>
                  已选 {files.length} 卷，共 {fileBytes.toLocaleString()}{' '}
                  字节。总量可以超过 5 MiB；逐卷校验到隔离临时区后才允许确认。
                </p>
              )}
              <div className={styles.actions}>
                <button
                  type="button"
                  disabled={!files.length}
                  onClick={() => void previewReplacement('import')}
                >
                  校验整组并预览
                </button>
                <button
                  type="button"
                  onClick={() => void previewReplacement('clear')}
                >
                  预览清除全部记录
                </button>
              </div>
              {replacement && (
                <section aria-label="记录替换预览">
                  <h3>{replacement.source ? '导入预览' : '清除预览'}</h3>
                  {replacement.source && (
                    <p>
                      备份时间：{replacement.source.exportedAt}。整组{' '}
                      {replacement.source.partCount} 卷，共{' '}
                      {replacement.source.recordCount}{' '}
                      个版本槽，包含全部历史及未知课程记录；SQL
                      仅作为数据恢复，不执行。
                    </p>
                  )}
                  <p>
                    将{replacement.source ? '完整替换' : '清除'}本站已存{' '}
                    {preview.snapshot.records.length} 个版本槽及本页{' '}
                    {preview.edits.length}{' '}
                    个未保存版本槽。确认后终止在途执行并取消待保存队列，无法撤销；取消保持原状。预览后有其他写入时会中止并要求重新预览。
                  </p>
                  <button type="button" onClick={() => void replace()}>
                    {replacement.source ? '确认整体替换' : '确认清除全部记录'}
                  </button>
                </section>
              )}
            </fieldset>
          )}
        </Dialog>
      )}
    </>
  );
}
