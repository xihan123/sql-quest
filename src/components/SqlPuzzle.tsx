import { useLayoutEffect, useRef, useState } from 'react';
import type { DragEvent } from 'react';
import type {
  PuzzleDraft,
  SqlPuzzle as Puzzle,
} from '../contracts/generated/types.d.ts';
import type { DeepReadonly } from '../content/checks.ts';
import { joinPuzzle } from '../content/semantics.ts';
import { Dialog } from './Dialog.tsx';
import styles from './SqlPuzzle.module.css';

const dragType = 'application/x-sql-quest-card';

export function SqlPuzzle({
  puzzle,
  draft,
  active,
  onChange,
  onFill,
}: {
  puzzle: DeepReadonly<Puzzle>;
  draft: PuzzleDraft;
  active: boolean;
  onChange: (draft: PuzzleDraft) => void;
  onFill: (sql: string) => void;
}) {
  const [undo, setUndo] = useState<string[][]>([]);
  const [selectedId, setSelectedId] = useState<string>();
  const [dragView, setDragView] = useState<{
    cardId: string;
    before: string | null | undefined;
  }>();
  const [lastActive, setLastActive] = useState(active);
  if (lastActive !== active) {
    setLastActive(active);
    setDragView(undefined);
  }
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [reference, setReference] = useState(false);
  const [replacement, setReplacement] = useState<'clear' | 'reference'>();
  const live = useRef(false);
  const drag = useRef<{ token: string; cardId: string; order: string } | null>(
    null,
  );
  const selected = useRef(new Map<string, HTMLButtonElement>());
  const area = useRef<HTMLElement>(null);
  const pendingFocus = useRef<{ cardId: string | undefined } | null>(null);
  const orderKey = JSON.stringify(draft.cardOrder);
  const selectedIndex = draft.cardOrder.indexOf(selectedId ?? '');
  useLayoutEffect(() => {
    live.current = active;
    drag.current = null;
    return () => {
      live.current = false;
      drag.current = null;
    };
  }, [active, orderKey]);
  useLayoutEffect(() => {
    const target = pendingFocus.current;
    if (!target || !active) return;
    pendingFocus.current = null;
    (target.cardId
      ? selected.current.get(target.cardId)
      : area.current
    )?.focus();
  });

  function change(
    order: string[],
    announcement: string,
    focusId?: string,
    isUndo = false,
  ) {
    if (!live.current) return;
    drag.current = null;
    setDragView(undefined);
    try {
      const sql = joinPuzzle(puzzle, order);
      if (JSON.stringify(order) === orderKey) return;
      // Bound UI-only undo history; the current atomic draft lives in RecordSession.
      setUndo(
        isUndo ? undo.slice(0, -1) : [...undo.slice(-99), [...draft.cardOrder]],
      );
      pendingFocus.current = { cardId: focusId };
      onChange({ cardOrder: order, sql });
      setSelectedId(focusId);
      setError('');
      setMessage(`${announcement}。拼接区共 ${order.length} 张卡片。`);
    } catch (error) {
      setError(
        `${error instanceof Error ? error.message : '无法拼接 SQL'}；原排列保留。`,
      );
    }
  }
  function select(cardId: string | undefined) {
    if (!live.current || !cardId) return;
    setSelectedId(cardId);
    selected.current.get(cardId)?.focus();
  }
  function removeSelected() {
    if (selectedIndex < 0) return;
    change(
      draft.cardOrder.filter((cardId) => cardId !== selectedId),
      `已移除第 ${selectedIndex + 1} 张卡片，放回卡片池`,
      draft.cardOrder[selectedIndex + 1] ?? draft.cardOrder[selectedIndex - 1],
    );
  }
  function move(index: number, offset: number) {
    const order = [...draft.cardOrder];
    const cardId = order[index];
    const destination = index + offset;
    if (!cardId || destination < 0 || destination >= order.length) return;
    order.splice(index, 1);
    order.splice(destination, 0, cardId);
    change(order, `已移到第 ${destination + 1} 位`, cardId);
  }
  function startDrag(event: DragEvent, cardId: string) {
    if (!live.current) {
      event.preventDefault();
      return;
    }
    const token = crypto.randomUUID();
    drag.current = { token, cardId, order: orderKey };
    setDragView({ cardId, before: undefined });
    event.dataTransfer.setData(dragType, token);
    event.dataTransfer.effectAllowed = 'move';
  }
  function drop(event: DragEvent, before?: string) {
    event.preventDefault();
    event.stopPropagation();
    const source = drag.current;
    // Accept only this mounted editor's unfinished drag, never IDs from a payload.
    if (
      !live.current ||
      !source ||
      source.order !== orderKey ||
      event.dataTransfer.getData(dragType) !== source.token
    )
      return;
    drag.current = null;
    setDragView(undefined);
    if (source.cardId === before) return;
    const order = draft.cardOrder.filter((cardId) => cardId !== source.cardId);
    const index = before ? order.indexOf(before) : order.length;
    if (index < 0) return;
    order.splice(index, 0, source.cardId);
    change(order, `已放置到第 ${index + 1} 位`, source.cardId);
  }
  function insertionPoint(event: DragEvent, index: number) {
    const box = event.currentTarget.getBoundingClientRect();
    return draft.cardOrder[
      event.clientX < box.left + box.width / 2 ? index : index + 1
    ];
  }
  function dragOver(event: DragEvent, before?: string) {
    if (!live.current || !drag.current) return;
    event.preventDefault();
    event.stopPropagation();
    event.dataTransfer.dropEffect = 'move';
    setDragView({ cardId: drag.current.cardId, before: before ?? null });
  }
  function endDrag() {
    // Browsers protect the drag payload at dragend, including cancelled drags.
    drag.current = null;
    setDragView(undefined);
  }
  const referenceSql =
    reference || replacement === 'reference'
      ? joinPuzzle(puzzle, puzzle.solutionOrder)
      : '';

  return (
    <div
      className={styles.puzzle}
      hidden={!active}
      onKeyDown={(event) => {
        if (event.key === 'Escape' && drag.current) {
          drag.current = null;
          setDragView(undefined);
          setMessage('已取消拖拽，排列未改变。');
        }
      }}
    >
      <p className={styles.help}>
        点选卡片加入拼图，或拖到想放的位置。按 SQL 书写顺序，从左到右组合。
      </p>
      <div className={styles.heading}>
        <h3>卡片池</h3>
        <span>点击添加 · 每张一次</span>
      </div>
      <ul className={styles.pool} aria-label="卡片池">
        {puzzle.cards.map((card, index) => {
          const used = draft.cardOrder.includes(card.id);
          return (
            <li key={card.id}>
              <button
                className={styles.piece}
                type="button"
                disabled={used}
                aria-label={`添加卡片 ${index + 1}：${card.sql}`}
                draggable={!used}
                onDragStart={(event) => startDrag(event, card.id)}
                onDragEnd={endDrag}
                data-dragging={dragView?.cardId === card.id && !used}
                onClick={() =>
                  change(
                    [...draft.cardOrder, card.id],
                    `已添加卡片 ${index + 1}`,
                    card.id,
                  )
                }
              >
                <code>{card.sql}</code>
                <span className={styles.pieceHint} aria-hidden="true">
                  {used ? '已用' : '+'}
                </span>
              </button>
            </li>
          );
        })}
      </ul>
      <section
        ref={area}
        tabIndex={-1}
        aria-label="有序拼接区"
        className={styles.assembly}
        data-drag-over={dragView?.before !== undefined}
        onDragOver={(event) => dragOver(event)}
        onDragLeave={(event) => {
          if (
            event.relatedTarget instanceof Node &&
            event.currentTarget.contains(event.relatedTarget)
          )
            return;
          setDragView((current) =>
            current ? { ...current, before: undefined } : current,
          );
        }}
        onDrop={(event) => drop(event)}
      >
        <div className={styles.heading}>
          <h3>拼接区</h3>
          <span>{draft.cardOrder.length} 张已放入</span>
        </div>
        {draft.cardOrder.length === 0 && (
          <div className={styles.empty}>
            <span className={styles.emptyPiece} aria-hidden="true">
              +
            </span>
            <p>把第一张卡片放到这里</p>
            <span>也可以直接点选上方卡片</span>
          </div>
        )}
        <ol className={styles.order} aria-label="已拼接卡片">
          {draft.cardOrder.map((cardId, index) => (
            <li
              key={cardId}
              data-drop-before={dragView?.before === cardId}
              data-drop-after={
                dragView?.before === null &&
                index === draft.cardOrder.length - 1
              }
              onDragOver={(event) =>
                dragOver(event, insertionPoint(event, index))
              }
              onDrop={(event) => drop(event, insertionPoint(event, index))}
            >
              <button
                type="button"
                className={styles.piece}
                aria-label={`选择第 ${index + 1} 张卡片：${puzzle.cards.find((card) => card.id === cardId)?.sql}`}
                aria-pressed={selectedId === cardId}
                ref={(node) => {
                  if (node) selected.current.set(cardId, node);
                  else selected.current.delete(cardId);
                }}
                draggable
                data-dragging={dragView?.cardId === cardId}
                onDragStart={(event) => startDrag(event, cardId)}
                onDragEnd={endDrag}
                onClick={() => select(cardId)}
                onKeyDown={(event) => {
                  let next: number;
                  if (event.key === 'ArrowLeft') next = Math.max(0, index - 1);
                  else if (event.key === 'ArrowRight')
                    next = Math.min(draft.cardOrder.length - 1, index + 1);
                  else if (event.key === 'Home') next = 0;
                  else if (event.key === 'End')
                    next = draft.cardOrder.length - 1;
                  else return;
                  event.preventDefault();
                  select(draft.cardOrder[next]);
                }}
              >
                <span className={styles.position} aria-hidden="true">
                  {index + 1}
                </span>
                <code>
                  {puzzle.cards.find((card) => card.id === cardId)?.sql}
                </code>
              </button>
            </li>
          ))}
        </ol>
        {draft.cardOrder.length > 0 && (
          <p className={styles.boardHint}>
            点选一块可调整位置；拖动时，蓝线标出插入位置。
          </p>
        )}
      </section>
      <div
        className={styles.selectionTools}
        role="group"
        aria-label="所选卡片操作"
      >
        <span className={styles.selectionLabel}>
          {selectedIndex < 0
            ? '点选拼接区的一张卡片'
            : `已选第 ${selectedIndex + 1} 张`}
        </span>
        <div className={styles.actions}>
          <button
            type="button"
            disabled={selectedIndex <= 0}
            aria-label={
              selectedIndex < 0
                ? '前移所选卡片'
                : `前移第 ${selectedIndex + 1} 张卡片`
            }
            onClick={() => move(selectedIndex, -1)}
          >
            <span aria-hidden="true">← </span>前移
          </button>
          <button
            type="button"
            disabled={
              selectedIndex < 0 || selectedIndex === draft.cardOrder.length - 1
            }
            aria-label={
              selectedIndex < 0
                ? '后移所选卡片'
                : `后移第 ${selectedIndex + 1} 张卡片`
            }
            onClick={() => move(selectedIndex, 1)}
          >
            后移<span aria-hidden="true"> →</span>
          </button>
          <button
            type="button"
            disabled={selectedIndex < 0}
            aria-label={
              selectedIndex < 0
                ? '移除所选卡片'
                : `移除第 ${selectedIndex + 1} 张卡片`
            }
            onClick={removeSelected}
          >
            移除
          </button>
        </div>
      </div>
      <div className={styles.actions}>
        <button
          type="button"
          disabled={!undo.length}
          onClick={() => {
            const order = undo[undo.length - 1];
            if (order)
              change(order, '已撤销上一步', order[order.length - 1], true);
          }}
        >
          撤销拼图操作
        </button>
        <button
          type="button"
          disabled={!draft.cardOrder.length}
          onClick={() => setReplacement('clear')}
        >
          清空拼图
        </button>
      </div>
      <p className={styles.status} role="status" aria-atomic="true">
        {message}
      </p>
      {error && <p role="alert">{error}</p>}
      <div className={styles.heading}>
        <h3>SQL 预览</h3>
        <span>只读 · 与执行内容一致</span>
      </div>
      <pre tabIndex={0} aria-label="拼图 SQL 预览">
        {draft.sql}
      </pre>
      <div className={styles.actions}>
        <button
          type="button"
          disabled={!draft.cardOrder.length}
          onClick={() => onFill(draft.sql)}
        >
          填入编辑器
        </button>
        <button
          type="button"
          aria-expanded={reference}
          onClick={() => setReference(!reference)}
        >
          {reference ? '收起参考拼法' : '查看参考拼法（不改草稿）'}
        </button>
      </div>
      <details className={styles.instructions}>
        <summary>操作说明与键盘快捷键</summary>
        <p>
          Tab 切换控件，Enter / 空格点选卡片。在拼接区用 ← / →、Home / End
          选择卡片，再用前移、后移、移除按钮操作。Escape 取消拖拽。支持撤销最近
          100 步。
        </p>
        <p>
          拼图形状只表示连接，不代表 SQL
          正确。预览只用一个空格连接原始片段，不重排、不补写；运行判题不覆盖文本草稿。
        </p>
      </details>
      {reference && (
        <section aria-label="参考拼法">
          <p>这只是一种可行拼法。判题比较查询结果，不要求与参考排列相同。</p>
          <ol className={styles.referenceOrder}>
            {puzzle.solutionOrder.map((cardId) => (
              <li key={cardId}>
                <code>
                  {puzzle.cards.find((card) => card.id === cardId)?.sql}
                </code>
              </li>
            ))}
          </ol>
          <pre>{referenceSql}</pre>
          <button type="button" onClick={() => setReplacement('reference')}>
            填入参考拼法
          </button>
        </section>
      )}
      {replacement && (
        <Dialog
          title={replacement === 'clear' ? '清空拼图' : '填入参考拼法'}
          onClose={() => setReplacement(undefined)}
        >
          <p>
            确认替换当前卡片排列？文本草稿不变；取消保留原排列，确认后可撤销，不会自动执行。
          </p>
          {replacement === 'reference' && <pre>{referenceSql}</pre>}
          <button
            type="button"
            onClick={() => {
              change(
                replacement === 'clear' ? [] : [...puzzle.solutionOrder],
                replacement === 'clear' ? '已清空拼图' : '已填入参考拼法',
              );
              setReplacement(undefined);
            }}
          >
            确认替换拼图
          </button>
        </Dialog>
      )}
    </div>
  );
}
