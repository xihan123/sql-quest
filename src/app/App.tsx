import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  useSyncExternalStore,
} from 'react';
import type { RefObject } from 'react';
import { ContentLoader } from '../content/loader.ts';
import type { ContentSnapshot, LoadState } from '../content/loader.ts';
import type { DeepReadonly } from '../content/checks.ts';
import type { InputMode, Lesson } from '../contracts/generated/types.d.ts';
import { createExecutionRequest, ExecutionClient } from '../engine/client.ts';
import type { ExecutionState } from '../engine/client.ts';
import { RecordSession } from '../storage/session.ts';
import { puzzleDraftError, recordKey } from '../storage/records.ts';
import { joinPuzzle } from '../content/semantics.ts';
import { SqlEditor } from '../components/SqlEditor.tsx';
import { SqlPuzzle } from '../components/SqlPuzzle.tsx';
import { ResultTable } from '../components/ResultTable.tsx';
import { Dialog } from '../components/Dialog.tsx';
import { RecordTools } from '../components/RecordTools.tsx';
import { TeachingFlowchart } from '../components/TeachingFlowchart.tsx';
import styles from './App.module.css';

const phaseLabels = {
  root: '读取根配置',
  content: '读取登记内容',
  validation: '校验完整课程',
};
const panels = ['题目', '数据', 'SQL', '结果'];
const hintLabels = { idea: '思路', syntax: '语法', skeleton: '骨架' };
const mobileQuery = '(max-width: 760px)';
function subscribeMobile(listener: () => void) {
  const query = window.matchMedia(mobileQuery);
  query.addEventListener('change', listener);
  return () => query.removeEventListener('change', listener);
}
const isMobile = () => window.matchMedia(mobileQuery).matches;

function Feedback({
  state,
  currentSql,
  inputMode,
  session,
}: {
  state: ExecutionState;
  currentSql: string;
  inputMode: InputMode;
  session: RecordSession;
}) {
  if (state.status === 'idle')
    return (
      <p className={styles.muted}>
        运行会检查全部用例，结果全部正确后自动记录通过。
      </p>
    );
  let message: string;
  switch (state.status) {
    case 'preparing':
      message = '正在加载 SQL 引擎并准备请求…';
      break;
    case 'running':
      message =
        state.request.mode === 'run'
          ? '正在查询预览数据…'
          : `运行：正在检查用例 ${state.caseIndex + 1} / ${state.request.lesson.tests.length}…`;
      break;
    case 'executed':
      message = '运行完成，不记录通关。';
      break;
    case 'passed':
      message = `运行通过，全部 ${state.request.lesson.tests.length} 个用例通过。${state.recordGeneration === null ? '存储当前不可用，本次通过未写入正式记录。' : state.recordGeneration !== session.generation() ? '保存状态有异常，请检查本地记录。' : '通过状态已交由本地保存，请查看保存状态。'}`;
      break;
    case 'mismatch':
      message = `运行未通过：用例 ${state.caseIndex + 1} 的实际结果与参考结果不符。`;
      break;
    case 'cancelled':
      message = '执行已取消，不记录通关。';
      break;
    case 'timeout':
      message = `执行超时：${state.message}。不记录通关。`;
      break;
    case 'error':
      message = `执行失败：${state.message}。不记录通关。`;
      break;
  }
  const expected =
    'caseIndex' in state
      ? state.request.lesson.tests[state.caseIndex]?.expected
      : undefined;
  return (
    <>
      <p
        role="status"
        className={state.status === 'passed' ? styles.success : undefined}
      >
        {message}
      </p>
      <details className={styles.snapshot}>
        <summary>
          本次运行的 SQL 快照（
          {state.request.inputMode === 'puzzle' ? '拼图' : '文本'}）
        </summary>
        <pre>{state.request.sql}</pre>
      </details>
      {(state.request.sql !== currentSql ||
        state.request.inputMode !== inputMode) && (
        <p className={styles.notice}>
          草稿或输入方式已修改；此结果对应上面的 SQL 快照，不是当前草稿。
        </p>
      )}
      {'result' in state && (
        <ResultTable
          result={state.result}
          label={`实际结果 · 用例 ${state.caseIndex + 1}`}
        />
      )}
      {state.status === 'mismatch' && expected && (
        <ResultTable
          result={expected}
          label={`参考结果 · 用例 ${state.caseIndex + 1}`}
        />
      )}
    </>
  );
}

function LessonWorkspace({
  snapshot,
  lesson,
  session,
  engineRef,
  resetToken,
}: {
  snapshot: ContentSnapshot;
  lesson: DeepReadonly<Lesson>;
  session: RecordSession;
  engineRef: RefObject<ExecutionClient | null>;
  resetToken: number;
}) {
  useSyncExternalStore(session.subscribe, session.getState);
  const mobile = useSyncExternalStore(subscribeMobile, isMobile);
  const record = session.record(lesson);
  const puzzleError = puzzleDraftError(lesson.sqlPuzzle, record.puzzleDraft);
  const inputMode =
    lesson.sqlPuzzle && !puzzleError ? record.inputMode : 'text';
  const puzzleDraft = record.puzzleDraft ?? { cardOrder: [], sql: '' };
  const currentSql = inputMode === 'puzzle' ? puzzleDraft.sql : record.draftSql;
  const [editContext] = useState(() => session.capture());
  const [panel, setPanel] = useState(0);
  const [execution, setExecution] = useState<ExecutionState>({
    status: 'idle',
  });
  const [error, setError] = useState('');
  const [answer, setAnswer] = useState(false);
  const [replacement, setReplacement] = useState<{
    title: string;
    sql: string;
  }>();
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  const valid = useRef(true);
  const editorHost = useRef<HTMLDivElement>(null);
  const focusText = useRef(false);
  const preview = snapshot.fixtures.find(
    (fixture) => fixture.id === lesson.previewFixtureId,
  );
  const previewTest = lesson.tests.find(
    (item) => item.fixtureId === lesson.previewFixtureId,
  );
  const history = session.history(lesson);
  const earlierPass = history.some(
    (item) => item.revision < lesson.revision && item.passed,
  );
  const changeSql = useCallback(
    (sql: string) => {
      if (valid.current) session.change(lesson, { draftSql: sql }, editContext);
    },
    [lesson, session, editContext],
  );
  function switchMode(mode: InputMode) {
    if (
      !valid.current ||
      (mode === 'puzzle' && (!lesson.sqlPuzzle || puzzleError))
    )
      return;
    session.change(
      lesson,
      {
        inputMode: mode,
        ...(mode === 'puzzle' && !record.puzzleDraft ? { puzzleDraft } : {}),
      },
      editContext,
    );
  }
  useLayoutEffect(() => {
    valid.current = true;
    return () => {
      valid.current = false;
    };
  }, []);
  useLayoutEffect(() => {
    if (focusText.current && inputMode === 'text') {
      focusText.current = false;
      editorHost.current
        ?.querySelector<HTMLElement>('[contenteditable="true"]')
        ?.focus();
    }
  });
  useEffect(() => {
    const client = new ExecutionClient(session.generation);
    engineRef.current = client;
    const unsubscribe = client.subscribe(() => setExecution(client.getState()));
    const unsubscribeRecords = session.subscribe(() => {
      const state = client.getState();
      if (
        (state.status === 'preparing' || state.status === 'running') &&
        state.recordGeneration !== session.generation()
      )
        client.cancel();
    });
    return () => {
      unsubscribe();
      unsubscribeRecords();
      client.dispose();
      if (engineRef.current === client) engineRef.current = null;
    };
  }, [session, engineRef]);
  const busy =
    execution.status === 'preparing' || execution.status === 'running';
  async function execute() {
    const client = engineRef.current;
    if (!valid.current || !client || busy) return;
    setError('');
    try {
      const request = createExecutionRequest(snapshot, {
        themeId: lesson.themeId,
        lessonId: lesson.id,
        mode: 'submit',
        inputMode,
        sql:
          inputMode === 'puzzle' && lesson.sqlPuzzle
            ? joinPuzzle(lesson.sqlPuzzle, puzzleDraft.cardOrder)
            : currentSql,
      });
      const generation = session.generation();
      const promise = client.start(request);
      setPanel(3);
      if (mobile) tabs.current[3]?.focus();
      const outcome = await promise;
      if (
        valid.current &&
        engineRef.current === client &&
        outcome.status === 'passed' &&
        outcome.recordGeneration !== null &&
        outcome.recordGeneration === generation &&
        generation === session.generation()
      )
        session.change(lesson, { passed: true }, editContext);
    } catch (error) {
      setError(error instanceof Error ? error.message : '无法开始执行');
    }
  }
  return (
    <div className={styles.workspace}>
      <div className={styles.mobileTabs} role="tablist" aria-label="练习区域">
        {panels.map((name, index) => (
          <button
            key={name}
            ref={(node) => {
              tabs.current[index] = node;
            }}
            id={`tab-${index}`}
            type="button"
            role="tab"
            aria-selected={panel === index}
            aria-controls={`panel-${index}`}
            tabIndex={panel === index ? 0 : -1}
            onClick={() => setPanel(index)}
            onKeyDown={(event) => {
              let next: number;
              if (event.key === 'ArrowRight')
                next = (index + 1) % panels.length;
              else if (event.key === 'ArrowLeft')
                next = (index + panels.length - 1) % panels.length;
              else if (event.key === 'Home') next = 0;
              else if (event.key === 'End') next = panels.length - 1;
              else return;
              event.preventDefault();
              setPanel(next);
              tabs.current[next]?.focus();
            }}
          >
            {name}
          </button>
        ))}
      </div>
      <div className={styles.readColumn}>
        <section
          className={styles.panel}
          id="panel-0"
          data-active={panel === 0}
          role={mobile ? 'tabpanel' : undefined}
          aria-labelledby={mobile ? 'tab-0' : 'lesson-title'}
        >
          <p className={styles.eyebrow}>
            当前关卡 · 版本 <code>{lesson.revision}</code>
          </p>
          <h2 id="lesson-title">{lesson.title}</h2>
          <div className={styles.actions}>
            <span className={record.passed ? styles.badge : styles.muted}>
              {record.passed ? '当前版本已通过' : '当前版本未通过'}
            </span>
            <button
              type="button"
              aria-pressed={record.reviewMarked}
              onClick={() =>
                session.change(
                  lesson,
                  { reviewMarked: !record.reviewMarked },
                  editContext,
                )
              }
            >
              {record.reviewMarked ? '取消复习标记' : '标记待复习'}
            </button>
          </div>
          {earlierPass && !record.passed && (
            <p className={styles.notice}>
              内容已更新，建议重做。历史通过记录仍保留。
            </p>
          )}
          <p className={styles.objective}>{lesson.objective}</p>
          <h3>任务</h3>
          <p className={styles.prose}>{lesson.statement}</p>
          {lesson.prerequisites.length > 0 && (
            <p className={styles.muted}>
              建议先学：
              {lesson.prerequisites
                .map(
                  (id) =>
                    snapshot.lessons.find(
                      (item) =>
                        item.themeId === lesson.themeId && item.id === id,
                    )?.title ?? id,
                )
                .join('、')}
              。可自由跳关。
            </p>
          )}
          <h3>必要知识</h3>
          <ul>
            {lesson.knowledge.map((text, index) => (
              <li key={index}>{text}</li>
            ))}
          </ul>
          {lesson.flowchart && (
            <TeachingFlowchart flowchart={lesson.flowchart} />
          )}
          <h3>三层提示</h3>
          {lesson.hints.map((hint, index) =>
            record.viewedHintIds.includes(hint.id) ? (
              <div className={styles.hint} key={hint.id}>
                <h4>
                  {index + 1}. {hintLabels[hint.id]}
                </h4>
                <p className={styles.prose}>{hint.text}</p>
              </div>
            ) : (
              (index === 0 ||
                record.viewedHintIds.includes(
                  lesson.hints[index - 1]?.id ?? 'idea',
                )) && (
                <button
                  type="button"
                  key={hint.id}
                  onClick={() =>
                    session.change(
                      lesson,
                      {
                        viewedHintIds: [...record.viewedHintIds, hint.id],
                      },
                      editContext,
                    )
                  }
                >
                  查看第 {index + 1} 层提示：{hintLabels[hint.id]}
                </button>
              )
            ),
          )}
          <h3>参考答案</h3>
          <button
            type="button"
            aria-expanded={answer}
            onClick={() => setAnswer(!answer)}
          >
            {answer ? '收起参考答案' : '查看参考答案（不改草稿）'}
          </button>
          {answer &&
            lesson.referenceSolutions.map((solution, index) => (
              <div className={styles.hint} key={index}>
                <pre>{solution.sql}</pre>
                <p>{solution.explanation}</p>
                <button
                  type="button"
                  onClick={() =>
                    setReplacement({ title: '填入参考答案', sql: solution.sql })
                  }
                >
                  填入答案
                  {lesson.referenceSolutions.length > 1 ? ` ${index + 1}` : ''}
                </button>
              </div>
            ))}
        </section>
        <section
          className={styles.panel}
          id="panel-1"
          data-active={panel === 1}
          role={mobile ? 'tabpanel' : undefined}
          aria-labelledby={mobile ? 'tab-1' : 'data-title'}
        >
          <h2 id="data-title">数据与表结构</h2>
          <p className={styles.muted}>
            仅列出本关可读表。文本以引号显示，以区分空串、文本 NULL 与 SQL
            NULL。
          </p>
          {preview?.tables
            .filter((table) => lesson.readableTables.includes(table.name))
            .map((table) => (
              <section className={styles.dataTable} key={table.name}>
                <h3>
                  <code>{table.name}</code>
                </h3>
                <p>{table.description}</p>
                <dl>
                  {table.columns.map((column) => (
                    <div key={column.name}>
                      <dt>
                        <code>
                          {column.name} · {column.type}
                        </code>
                        {column.primaryKey ? ' · 主键' : ''}
                        {column.nullable ? ' · 可空' : ' · 非空'}
                        {'minimum' in column ? ` · ≥ ${column.minimum}` : ''}
                        {column.references
                          ? ` · 外键 → ${column.references.table}.${column.references.column}`
                          : ''}
                      </dt>
                      <dd>{column.description}</dd>
                    </div>
                  ))}
                </dl>
                <ResultTable
                  label={`${table.name} 预览数据`}
                  result={{
                    columns: table.columns.map((column) => column.name),
                    rows: table.rows,
                  }}
                />
              </section>
            ))}
          {previewTest && (
            <details>
              <summary>查看预览数据的参考输出</summary>
              <ResultTable
                result={previewTest.expected}
                label="参考输出 · 预览用例"
              />
            </details>
          )}
        </section>
      </div>
      <div className={styles.editColumn}>
        <section
          className={styles.panel}
          id="panel-2"
          data-active={panel === 2}
          role={mobile ? 'tabpanel' : undefined}
          aria-labelledby={mobile ? 'tab-2' : 'sql-title'}
        >
          <div className={styles.sectionHeading}>
            <h2 id="sql-title">SQL 编辑器</h2>
            <span className={styles.eyebrow}>SQLite · 只读查询</span>
          </div>
          {lesson.sqlPuzzle && (
            <div
              className={styles.actions}
              role="group"
              aria-label="SQL 输入方式"
            >
              <button
                type="button"
                aria-pressed={inputMode === 'text'}
                onClick={() => switchMode('text')}
              >
                文本
              </button>
              <button
                type="button"
                aria-pressed={inputMode === 'puzzle'}
                disabled={Boolean(puzzleError)}
                onClick={() => switchMode('puzzle')}
              >
                拼图
              </button>
            </div>
          )}
          <div hidden={inputMode !== 'text'} ref={editorHost}>
            <p id="editor-help" className={styles.muted}>
              Ctrl+Space 或“补全”查看候选；↑ / ↓ 选择，Enter 接受，Escape
              关闭。Tab 移到下一个控件；Ctrl / ⌘ + Z 撤销。最多 20,000 字符。
            </p>
            <div className={styles.editor}>
              <SqlEditor
                key={resetToken}
                value={record.draftSql}
                onChange={changeSql}
                readableTables={lesson.readableTables}
                preview={preview}
                active={inputMode === 'text'}
              />
            </div>
          </div>
          {lesson.sqlPuzzle && !puzzleError && (
            <SqlPuzzle
              puzzle={lesson.sqlPuzzle}
              draft={puzzleDraft}
              active={inputMode === 'puzzle'}
              onChange={(draft) => {
                if (valid.current)
                  session.change(lesson, { puzzleDraft: draft }, editContext);
              }}
              onFill={(sql) =>
                setReplacement({ title: '将拼图填入编辑器', sql })
              }
            />
          )}
          <div className={styles.actions}>
            <button
              className={styles.primary}
              type="button"
              disabled={busy}
              onClick={() => void execute()}
            >
              运行
            </button>
            <button
              type="button"
              hidden={inputMode !== 'text'}
              onClick={() => changeSql(lesson.starterSql)}
            >
              恢复默认
            </button>
          </div>
          {error && <p role="alert">{error}</p>}
          {history.length > 0 && (
            <details>
              <summary>历史版本草稿（原版本保留）</summary>
              {history.map((item) => (
                <div key={item.revision}>
                  <p>
                    版本 {item.revision}
                    {item.passed ? ' · 已通过' : ''}
                  </p>
                  <pre>{item.draftSql}</pre>
                  {item.puzzleDraft && (
                    <>
                      <p>历史拼图排列（仅查看 / 导出，不套用当前卡片）</p>
                      <pre>{JSON.stringify(item.puzzleDraft.cardOrder)}</pre>
                      <pre>{item.puzzleDraft.sql}</pre>
                    </>
                  )}
                  <button
                    type="button"
                    onClick={() =>
                      setReplacement({
                        title: `将版本 ${item.revision} 草稿复制到当前版本`,
                        sql: item.draftSql,
                      })
                    }
                  >
                    复制历史草稿
                  </button>
                </div>
              ))}
            </details>
          )}
          {puzzleError && record.puzzleDraft && (
            <>
              <p className={styles.notice}>
                {puzzleError}。使用文本入口；原排列与 SQL
                保留供查看、导出，不会自动执行或套用新卡片。
              </p>
              <details>
                <summary>保留的拼图草稿（仅查看 / 导出）</summary>
                <pre>{JSON.stringify(record.puzzleDraft.cardOrder)}</pre>
                <pre>{record.puzzleDraft.sql}</pre>
              </details>
            </>
          )}
        </section>
        <section
          className={styles.panel}
          id="panel-3"
          data-active={panel === 3}
          role={mobile ? 'tabpanel' : undefined}
          aria-labelledby={mobile ? 'tab-3' : 'result-title'}
        >
          <h2 id="result-title">执行与结果</h2>
          <Feedback
            state={execution}
            currentSql={currentSql}
            inputMode={inputMode}
            session={session}
          />
          {busy && (
            <button type="button" onClick={() => engineRef.current?.cancel()}>
              取消执行
            </button>
          )}
        </section>
      </div>
      {replacement && (
        <Dialog
          title={replacement.title}
          onClose={() => setReplacement(undefined)}
        >
          <p>
            确认替换当前
            SQL？取消会保留现有修改；替换后可在编辑器撤销，不会自动执行。
          </p>
          <pre>{replacement.sql}</pre>
          <button
            type="button"
            onClick={() => {
              if (!valid.current) return;
              focusText.current = true;
              changeSql(replacement.sql);
              switchMode('text');
              setPanel(2);
              setReplacement(undefined);
            }}
          >
            确认替换
          </button>
        </Dialog>
      )}
    </div>
  );
}

function Practice({
  snapshot,
  session,
  engineRef,
  resetToken,
}: {
  snapshot: ContentSnapshot;
  session: RecordSession;
  engineRef: RefObject<ExecutionClient | null>;
  resetToken: number;
}) {
  useSyncExternalStore(session.subscribe, session.getState);
  const first = snapshot.lessons[0];
  const [themeId, setThemeId] = useState(
    first?.themeId ?? snapshot.course.themes[0]?.id ?? '',
  );
  const [lessonId, setLessonId] = useState(first?.id ?? '');
  const [menu, setMenu] = useState(false);
  const menuButton = useRef<HTMLButtonElement>(null);
  const theme = snapshot.course.themes.find((item) => item.id === themeId);
  const lesson = snapshot.lessons.find(
    (item) => item.themeId === themeId && item.id === lessonId,
  );
  function select(nextTheme: string, nextLesson: string) {
    engineRef.current?.cancel();
    if (menu && isMobile()) menuButton.current?.focus();
    setThemeId(nextTheme);
    setLessonId(nextLesson);
    setMenu(false);
  }
  return (
    <div className={styles.layout}>
      <aside className={styles.navigation}>
        <h2>{snapshot.course.title}</h2>
        <label htmlFor="theme">练习主题</label>
        <select
          id="theme"
          value={themeId}
          onChange={(event) =>
            select(
              event.target.value,
              snapshot.lessons.find(
                (item) => item.themeId === event.target.value,
              )?.id ?? '',
            )
          }
        >
          {snapshot.course.themes.map((item) => (
            <option key={item.id} value={item.id}>
              {item.title}
            </option>
          ))}
        </select>
        <button
          ref={menuButton}
          className={styles.menuToggle}
          type="button"
          aria-expanded={menu}
          aria-controls="course-nav"
          onClick={() => setMenu(!menu)}
        >
          {menu ? '收起关卡目录' : '展开关卡目录'}
        </button>
        <nav
          id="course-nav"
          aria-label="课程目录"
          className={styles.courseNav}
          data-open={menu}
        >
          {theme?.chapters.map((chapter) => (
            <section key={chapter.id}>
              <h3>{chapter.title}</h3>
              <ol>
                {chapter.lessons.map((index) => {
                  const target = snapshot.lessons.find(
                    (item) => item.themeId === themeId && item.id === index.id,
                  );
                  const record = target ? session.record(target) : undefined;
                  return (
                    <li key={index.id}>
                      {index.path === null ? (
                        <span className={styles.unopened}>
                          {index.title}（未开放）
                        </span>
                      ) : (
                        <button
                          type="button"
                          aria-current={
                            lessonId === index.id ? 'page' : undefined
                          }
                          onClick={() => select(themeId, index.id)}
                        >
                          {index.title}
                          {record?.passed && (
                            <span className={styles.navStatus}>已通过</span>
                          )}
                          {record?.reviewMarked && (
                            <span className={styles.navStatus}>待复习</span>
                          )}
                        </button>
                      )}
                    </li>
                  );
                })}
              </ol>
            </section>
          ))}
        </nav>
        <p className={styles.muted}>
          内容版本 <code>{snapshot.course.revision}</code> · 完整快照
        </p>
      </aside>
      {lesson ? (
        <LessonWorkspace
          key={`${snapshot.contentToken}/${recordKey(session.record(lesson))}/${resetToken}`}
          {...{ snapshot, lesson, session, engineRef, resetToken }}
        />
      ) : (
        <section className={styles.panel}>
          <h2>当前主题尚无开放关卡</h2>
          <p>可切换到其他主题。</p>
        </section>
      )}
    </div>
  );
}

export function App() {
  const [state, setState] = useState<LoadState>({ status: 'idle' });
  const [attempt, setAttempt] = useState(0);
  const [session] = useState(() => new RecordSession());
  const records = useSyncExternalStore(session.subscribe, session.getState);
  const engineRef = useRef<ExecutionClient | null>(null);
  const [resetToken, setResetToken] = useState(0);
  function invalidate() {
    engineRef.current?.cancel();
    setResetToken((value) => value + 1);
  }
  useEffect(() => {
    void session.initialize();
    const beforeUnload = (event: BeforeUnloadEvent) => {
      if (session.hasUnsaved()) {
        event.preventDefault();
        event.returnValue = '';
      }
    };
    const flush = () => {
      if (document.visibilityState === 'hidden') void session.flush();
    };
    window.addEventListener('beforeunload', beforeUnload);
    document.addEventListener('visibilitychange', flush);
    return () => {
      session.dispose();
      window.removeEventListener('beforeunload', beforeUnload);
      document.removeEventListener('visibilitychange', flush);
    };
  }, [session]);
  useEffect(() => {
    const configured: unknown = import.meta.env.VITE_CONTENT_ROOT_URL;
    const loader = new ContentLoader(
      typeof configured === 'string' ? configured : './content/course.json',
      new URL(import.meta.env.BASE_URL, document.baseURI).href,
    );
    const unsubscribe = loader.subscribe(() => setState(loader.getState()));
    void loader.load();
    return () => {
      unsubscribe();
      loader.dispose();
    };
  }, [attempt]);
  return (
    <main className={styles.shell}>
      <header className={styles.header}>
        <div className={styles.brand}>
          <h1>SQL Quest</h1>
          <span>SQL 练习台</span>
        </div>
        <span className={styles.muted}>查询在浏览器执行，学习记录仅存本机</span>
      </header>
      <RecordTools session={session} invalidate={invalidate} />
      <div role="status">
        {state.status === 'idle' && (
          <p className={styles.loading}>准备加载课程。</p>
        )}
        {state.status === 'loading' && (
          <p className={styles.loading}>{phaseLabels[state.phase]}…</p>
        )}
        {state.status === 'cancelled' && (
          <p className={styles.loading}>课程加载已取消。</p>
        )}
        {state.status === 'error' && (
          <p className={styles.loading}>
            {phaseLabels[state.phase]}失败：{state.message}
            。未启用任何课程内容。
          </p>
        )}
      </div>
      {state.status === 'error' && (
        <button type="button" onClick={() => setAttempt((value) => value + 1)}>
          重试加载
        </button>
      )}
      {state.status === 'ready' && records.status !== 'loading' && (
        <div inert={records.status === 'replacing'}>
          <Practice
            key={state.snapshot.contentToken}
            snapshot={state.snapshot}
            {...{ session, engineRef, resetToken }}
          />
        </div>
      )}
    </main>
  );
}
