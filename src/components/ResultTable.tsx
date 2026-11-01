import type { QueryResult } from '../contracts/generated/types.d.ts';
import type { DeepReadonly } from '../content/checks.ts';
import styles from '../app/App.module.css';

export function ResultTable({
  result,
  label,
}: {
  result: DeepReadonly<QueryResult>;
  label: string;
}) {
  return (
    <div
      className={styles.tableScroll}
      tabIndex={0}
      role="region"
      aria-label={`${label}，可横向滚动`}
    >
      <table>
        <caption>
          {label} · 共 <code>{result.rows.length}</code> 行
          {result.rows.length > 100 ? '，仅展示前 100 行' : ''}
        </caption>
        <thead>
          <tr>
            {result.columns.map((column, index) => (
              <th scope="col" key={index}>
                {column}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {result.rows.slice(0, 100).map((row, index) => (
            <tr key={index}>
              {row.map((cell, column) => (
                <td key={column}>
                  {cell === null ? (
                    <em>SQL NULL</em>
                  ) : typeof cell === 'string' ? (
                    JSON.stringify(cell)
                  ) : (
                    <code>{cell}</code>
                  )}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      {result.rows.length === 0 && (
        <p className={styles.empty}>空结果（0 行）</p>
      )}
    </div>
  );
}
