import { useLayoutEffect, useRef, useState } from 'react';
import { Annotation, EditorState } from '@codemirror/state';
import {
  EditorView,
  keymap,
  lineNumbers,
  highlightActiveLine,
  tooltips,
  runScopeHandlers,
} from '@codemirror/view';
import {
  defaultKeymap,
  history,
  historyKeymap,
  isolateHistory,
} from '@codemirror/commands';
import {
  defaultHighlightStyle,
  syntaxHighlighting,
} from '@codemirror/language';
import { sql } from '@codemirror/lang-sql';
import {
  autocompletion,
  closeCompletion,
  completionKeymap,
  startCompletion,
} from '@codemirror/autocomplete';
import { validateSqlDraftStructure } from '../contracts/generated/validators.js';
import type { Fixture } from '../contracts/generated/types.d.ts';
import type { DeepReadonly } from '../content/checks.ts';
import { createSqlCompletionSource, sqliteDialect } from './sqlCompletion.ts';

const externalChange = Annotation.define<boolean>();

export function SqlEditor({
  value,
  onChange,
  readableTables,
  preview,
  active = true,
}: {
  value: string;
  onChange: (sql: string) => void;
  readableTables: readonly string[];
  preview: DeepReadonly<Fixture> | undefined;
  active?: boolean;
}) {
  const host = useRef<HTMLDivElement>(null);
  const view = useRef<EditorView | null>(null);
  const [limitError, setLimitError] = useState(false);
  useLayoutEffect(() => {
    if (!host.current) return;
    let composing = false;
    const complete = createSqlCompletionSource(readableTables, preview);
    const editor = new EditorView({
      parent: host.current,
      state: EditorState.create({
        doc: value,
        extensions: [
          lineNumbers(),
          highlightActiveLine(),
          history(),
          sql({ dialect: sqliteDialect }),
          autocompletion({
            override: [(context) => (composing ? null : complete(context))],
            defaultKeymap: false,
            icons: false,
            addToOptions: [
              {
                position: 80,
                render(completion) {
                  if (typeof completion.info !== 'string') return null;
                  const description = document.createElement('span');
                  description.className = 'cm-completionDescription';
                  description.textContent = completion.info;
                  return description;
                },
              },
            ],
          }),
          keymap.of(
            [
              ...completionKeymap,
              ...defaultKeymap,
              ...historyKeymap,
              {
                key: 'Tab',
                run: (view: EditorView) => {
                  closeCompletion(view);
                  return false;
                },
                shift: (view: EditorView) => {
                  closeCompletion(view);
                  return false;
                },
              },
            ].map((binding) => ({ ...binding, scope: 'sql-editor' })),
          ),
          EditorView.domEventHandlers({
            // Guard editing shortcuts too, without preventing the IME's native event.
            keydown(event, view) {
              if (
                event.isComposing ||
                event.keyCode === 229 ||
                composing ||
                view.compositionStarted
              )
                return false;
              return runScopeHandlers(view, event, 'sql-editor');
            },
            compositionstart(_event, view) {
              composing = true;
              closeCompletion(view);
            },
            compositionend() {
              composing = false;
            },
          }),
          tooltips({
            tooltipSpace: () => {
              const viewport = window.visualViewport;
              return {
                left: (viewport?.offsetLeft ?? 0) + 8,
                top: (viewport?.offsetTop ?? 0) + 8,
                right:
                  (viewport?.offsetLeft ?? 0) +
                  (viewport?.width ?? innerWidth) -
                  8,
                bottom:
                  (viewport?.offsetTop ?? 0) +
                  (viewport?.height ?? innerHeight) -
                  8,
              };
            },
          }),
          syntaxHighlighting(defaultHighlightStyle),
          EditorView.lineWrapping,
          EditorView.contentAttributes.of({
            'aria-label': 'SQL 编辑器',
            'aria-describedby': 'editor-help',
            spellcheck: 'false',
          }),
          EditorState.transactionFilter.of((transaction) => {
            if (
              transaction.docChanged &&
              !validateSqlDraftStructure(transaction.newDoc.toString())
            ) {
              setLimitError(true);
              return [];
            }
            return transaction;
          }),
          EditorView.updateListener.of((update) => {
            if (
              update.docChanged &&
              !update.transactions.every((transaction) =>
                transaction.annotation(externalChange),
              )
            ) {
              setLimitError(false);
              onChange(update.state.doc.toString());
            }
          }),
          EditorView.theme({
            '&': {
              fontFamily: 'var(--mono)',
              fontSize: 'var(--editor-font-size)',
              minHeight: '240px',
            },
            '.cm-scroller': { fontFamily: 'inherit', overflow: 'auto' },
            '.cm-content': { minHeight: '240px', padding: '12px 0' },
            '.cm-gutters': {
              background: 'var(--surface)',
              color: 'var(--muted)',
              borderRight: '1px solid var(--border)',
            },
            '.cm-activeLine': { background: 'var(--soft-blue)' },
            '&.cm-focused': {
              outline: '2px solid var(--primary)',
              outlineOffset: '2px',
            },
            '.cm-tooltip': {
              background: 'var(--surface)',
              color: 'var(--text)',
              border: '1px solid var(--border)',
              borderRadius: '4px',
              fontFamily: 'inherit',
              maxWidth: 'min(440px, calc(100vw - 16px))',
            },
            '.cm-tooltip-autocomplete > ul': {
              maxHeight: 'min(280px, 40dvh)',
              maxWidth: '100%',
              fontFamily: 'var(--mono)',
              fontSize: 'var(--editor-font-size)',
            },
            '.cm-tooltip-autocomplete > ul > li': {
              minHeight: '44px',
              padding: '8px 12px',
              margin: '0',
              whiteSpace: 'normal',
              overflowWrap: 'anywhere',
            },
            '.cm-tooltip-autocomplete > ul > li[aria-selected]': {
              background: 'var(--soft-blue)',
              color: 'var(--text)',
              outline: '1px solid var(--primary)',
              outlineOffset: '-1px',
            },
            '.cm-completionDetail, .cm-completionDescription': {
              display: 'block',
              fontFamily:
                "'Noto Sans SC', 'Microsoft YaHei', 'PingFang SC', sans-serif",
              fontSize: '12px',
              fontStyle: 'normal',
              margin: '0',
              color: 'var(--muted)',
            },
            '.cm-completionDescription': {
              display: '-webkit-box',
              WebkitLineClamp: '2',
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
            },
            '.cm-completionInfo': {
              overflowWrap: 'anywhere',
              maxHeight: 'min(240px, 35dvh)',
              overflow: 'auto',
            },
          }),
        ],
      }),
    });
    view.current = editor;
    const measure = () => editor.requestMeasure();
    window.visualViewport?.addEventListener('resize', measure);
    window.visualViewport?.addEventListener('scroll', measure);
    return () => {
      view.current = null;
      window.visualViewport?.removeEventListener('resize', measure);
      window.visualViewport?.removeEventListener('scroll', measure);
      closeCompletion(editor);
      editor.destroy();
    };
    // The parent keys this editor by record context; document replacements below remain undoable.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [onChange, readableTables, preview]);
  useLayoutEffect(() => {
    const editor = view.current;
    if (editor && editor.state.doc.toString() !== value) {
      closeCompletion(editor);
      editor.dispatch({
        changes: { from: 0, to: editor.state.doc.length, insert: value },
        annotations: [isolateHistory.of('full'), externalChange.of(true)],
      });
    }
  }, [value]);
  useLayoutEffect(() => {
    const editor = view.current;
    if (!editor) return;
    if (!active) closeCompletion(editor);
    else editor.requestMeasure();
  }, [active]);
  return (
    <>
      <button
        type="button"
        onClick={() => {
          const editor = view.current;
          if (!editor || editor.compositionStarted) return;
          editor.focus();
          startCompletion(editor);
        }}
      >
        补全（Ctrl+Space）
      </button>
      <div ref={host} />
      {limitError && (
        <p role="alert">SQL 最多 20,000 字符，本次超限修改未应用，原稿保留。</p>
      )}
    </>
  );
}
