import { CompletionContext, pickedCompletion } from '@codemirror/autocomplete';
import type { Completion, CompletionResult } from '@codemirror/autocomplete';
import { isolateHistory } from '@codemirror/commands';
import { ensureSyntaxTree } from '@codemirror/language';
import {
  keywordCompletionSource,
  SQLDialect,
  SQLite,
} from '@codemirror/lang-sql';
import type { DeepReadonly } from '../content/checks.ts';
import type { Fixture, FixtureTable } from '../contracts/generated/types.d.ts';

// Fill the bundled SQLite dialect's gaps so identifiers also quote modern keywords.
export const sqliteDialect = SQLDialect.define({
  ...SQLite.spec,
  identifierQuotes: '`"[',
  keywords: `${SQLite.spec.keywords} exclude filter following generated groups materialized nothing nulls others over partition preceding range returning ties unbounded window`,
});

const readKeywords = new Set(
  (
    'SELECT FROM WHERE JOIN INNER LEFT RIGHT FULL OUTER CROSS NATURAL ON USING ' +
    'AS DISTINCT ALL AND OR NOT IS NULL TRUE FALSE BETWEEN IN LIKE GLOB ESCAPE ' +
    'GROUP BY HAVING ORDER ASC DESC LIMIT OFFSET CASE WHEN THEN ELSE END ' +
    'CAST COLLATE EXISTS UNION INTERSECT EXCEPT WITH RECURSIVE VALUES COUNT'
  ).split(' '),
);
const keywords = keywordCompletionSource(sqliteDialect, true);
const reserved = new Set(
  `${sqliteDialect.spec.keywords} ${sqliteDialect.spec.types} ${sqliteDialect.spec.builtin} true false null`.split(
    ' ',
  ),
);
const identifierNodes = new Set(['Identifier', 'QuotedIdentifier']);
const endFrom = new Set([
  'WHERE',
  'GROUP',
  'HAVING',
  'ORDER',
  'LIMIT',
  'OFFSET',
]);
const joinWords = new Set([
  'INNER',
  'LEFT',
  'RIGHT',
  'FULL',
  'OUTER',
  'CROSS',
  'NATURAL',
]);
type Table = DeepReadonly<FixtureTable>;
type Token = { name: string; text: string; to: number };
type Binding = { table: Table; qualifier: string };

function unquote(text: string) {
  const open = text[0];
  if (open !== '"' && open !== '`' && open !== '[') return text;
  const close = open === '[' ? ']' : open;
  return text
    .slice(1, text.endsWith(close) ? -1 : undefined)
    .split(close + close)
    .join(close);
}

function quote(name: string) {
  return /^[a-z_][a-z_0-9]*$/i.test(name) && !reserved.has(name.toLowerCase())
    ? name
    : `"${name.replaceAll('"', '""')}"`;
}

function word(token: Token | undefined) {
  return token?.name === 'Keyword' ? token.text.toUpperCase() : '';
}

// Only bind flat FROM/JOIN sources. Derived tables, CTEs and compound queries
// deliberately lose schema candidates rather than borrowing an inner alias.
function bindings(tokens: Token[], tables: readonly Table[]): Binding[] | null {
  const result: Binding[] = [];
  let inFrom = false;
  let expectTable = false;
  let inCondition = false;
  for (let i = 0; i < tokens.length; i++) {
    const token = tokens[i];
    if (!token) continue;
    const kw = word(token);
    if (kw === 'FROM') {
      if (inFrom) return null;
      inFrom = expectTable = true;
      continue;
    }
    if (!inFrom) continue;
    if (endFrom.has(kw) || token.name === ';') break;
    if (kw === 'JOIN' || token.text === ',') {
      expectTable = true;
      inCondition = false;
      continue;
    }
    if (expectTable) {
      if (!identifierNodes.has(token.name)) return null;
      const table = tables.find(
        (item) => item.name === unquote(token.text).toLowerCase(),
      );
      if (!table) return null;
      let qualifier = unquote(token.text);
      if (word(tokens[i + 1]) === 'AS') {
        i++;
        if (!identifierNodes.has(tokens[i + 1]?.name ?? '')) return null;
      }
      const alias = tokens[i + 1];
      if (alias && identifierNodes.has(alias.name)) {
        qualifier = unquote(alias.text);
        i++;
      }
      if (
        result.some(
          (item) => item.qualifier.toLowerCase() === qualifier.toLowerCase(),
        )
      )
        return null;
      result.push({ table, qualifier });
      expectTable = false;
    } else if (kw === 'ON' || kw === 'USING') {
      inCondition = true;
    } else if (!inCondition && !joinWords.has(kw)) {
      return null;
    }
  }
  return expectTable ? null : result;
}

export function createSqlCompletionSource(
  readableTables: readonly string[],
  preview: DeepReadonly<Fixture> | undefined,
) {
  const tables =
    preview?.tables.filter((table) => readableTables.includes(table.name)) ??
    [];
  return async (
    context: CompletionContext,
  ): Promise<CompletionResult | null> => {
    const { state, pos } = context;
    if (context.view?.compositionStarted || !state.selection.main.empty)
      return null;
    const tree = ensureSyntaxTree(state, state.doc.length, 25);
    if (!tree) return null;
    let node = tree.resolveInner(pos, -1);
    if (/Comment|String|Number|Bits|Bytes|SpecialVar/.test(node.name))
      return null;
    const next = tree.resolveInner(pos, 1);
    if (next.from === pos && identifierNodes.has(next.name)) node = next;
    const isIdentifier =
      identifierNodes.has(node.name) || node.name === 'Keyword';
    const from = isIdentifier ? node.from : pos;
    const end = isIdentifier ? node.to : pos;
    const quoted =
      node.name === 'QuotedIdentifier' ? state.sliceDoc(from, from + 1) : '';
    let before = tree.resolveInner(from, -1);
    while (/Comment/.test(before.name))
      before = tree.resolveInner(before.from, -1);
    let qualifier: string | undefined;
    if (before.name === '.') {
      const composite = before.parent;
      const parts = composite?.getChildren('Identifier').length ?? 0;
      const quotedParts =
        composite?.getChildren('QuotedIdentifier').length ?? 0;
      const parent = before.prevSibling;
      if (
        !parent ||
        !identifierNodes.has(parent.name) ||
        parts + quotedParts > (isIdentifier ? 2 : 1)
      )
        return null;
      qualifier = unquote(state.sliceDoc(parent.from, parent.to));
    }
    if (!context.explicit && from === pos && qualifier === undefined)
      return null;
    let statement = node;
    while (statement.parent && statement.name !== 'Statement')
      statement = statement.parent;
    const tokens: Token[] = [];
    let complex = false;
    let selects = 0;
    tree.iterate({
      from: statement.from,
      to: statement.to,
      enter(entry) {
        if (entry.name === 'Keyword') {
          const kw = state.sliceDoc(entry.from, entry.to).toUpperCase();
          if (kw === 'SELECT') selects++;
          if (['WITH', 'UNION', 'INTERSECT', 'EXCEPT'].includes(kw))
            complex = true;
        }
      },
    });
    complex ||= selects > 1;
    for (let child = statement.firstChild; child; child = child.nextSibling) {
      if (!/Comment/.test(child.name))
        tokens.push({
          name: child.name,
          text: state.sliceDoc(child.from, child.to),
          to: child.to,
        });
    }
    const previous = tokens.findLast((token) => token.to <= from);
    const tablePosition =
      ['FROM', 'JOIN'].includes(word(previous)) ||
      (previous?.text === ',' &&
        tokens.some((token) => word(token) === 'FROM' && token.to < from));
    const scope = complex ? null : bindings(tokens, tables);
    const options: Completion[] = [];
    if (qualifier === undefined && !quoted) {
      const result = await keywords(context);
      options.push(
        ...(result?.options ?? [])
          .filter((option) => readKeywords.has(option.label))
          .map((option) => ({ ...option, type: 'keyword', detail: '关键字' })),
      );
    }
    if (!complex && qualifier === undefined) {
      options.push(
        ...tables.map((table) => ({
          label: table.name,
          type: 'type',
          detail: '表',
          info: table.description,
          apply: quote(table.name),
        })),
      );
    }
    if (scope && !tablePosition) {
      let sources = scope.length
        ? scope
        : tables.map((table) => ({ table, qualifier: table.name }));
      if (qualifier !== undefined)
        sources = sources.filter(
          (item) => item.qualifier.toLowerCase() === qualifier.toLowerCase(),
        );
      const counts = new Map<string, number>();
      for (const { table } of sources)
        for (const column of table.columns)
          counts.set(column.name, (counts.get(column.name) ?? 0) + 1);
      for (const source of sources)
        for (const column of source.table.columns) {
          const ambiguous =
            qualifier === undefined && (counts.get(column.name) ?? 0) > 1;
          const name = ambiguous
            ? `${source.qualifier}.${column.name}`
            : column.name;
          options.push({
            label: column.name,
            displayLabel: name,
            type: 'property',
            detail: `字段 · ${source.table.name} · ${column.type}${scope.length ? '' : ' · 尚未绑定'}`,
            info: column.description,
            apply: `${ambiguous ? quote(source.qualifier) + '.' : ''}${quote(column.name)}`,
            boost: 2,
          });
        }
    }
    if (!options.length || context.aborted) return null;
    return {
      from,
      to: pos,
      // The apply closures capture an exact document and suffix range, never a
      // reusable regex context. Ordinary edits must request fresh candidates.
      map: () => null,
      options: options.map((option) => {
        const insert =
          typeof option.apply === 'string' ? option.apply : option.label;
        const close = quoted === '[' ? ']' : quoted;
        return {
          ...option,
          label: quoted ? quoted + option.label + close : option.label,
          apply(view, completion, applyFrom, applyTo) {
            if (
              context.aborted ||
              (context.view !== undefined && context.view !== view) ||
              view.state.doc !== state.doc ||
              view.compositionStarted ||
              !view.state.selection.main.empty ||
              view.state.selection.main.head !== pos ||
              applyFrom !== from ||
              applyTo !== pos
            )
              return;
            view.dispatch({
              changes: { from, to: end, insert },
              selection: { anchor: from + insert.length },
              userEvent: 'input.complete',
              annotations: [
                pickedCompletion.of(completion),
                isolateHistory.of('full'),
              ],
            });
            view.focus();
          },
        };
      }),
    };
  };
}
