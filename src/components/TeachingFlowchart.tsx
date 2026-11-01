import { Component, useId, useLayoutEffect, useRef, useState } from 'react';
import type { ReactNode } from 'react';
import type { DeepReadonly } from '../content/checks.ts';
import type { Flowchart } from '../contracts/generated/types.d.ts';
import { layoutFlowNodes } from './flowchartLayout.ts';
import styles from './TeachingFlowchart.module.css';

type Chart = DeepReadonly<Flowchart>;

function RenderFailure({ message }: { message: string }) {
  return (
    <p role="alert" className={styles.failure}>
      思维导图渲染失败：{message}。可继续阅读下方文字说明或使用 SQL 编辑器。
    </p>
  );
}

class FlowchartBoundary extends Component<
  { children: ReactNode },
  { error: string | null }
> {
  override state: { error: string | null } = { error: null };
  static getDerivedStateFromError(error: unknown) {
    return { error: error instanceof Error ? error.message : '未知渲染错误' };
  }
  override render() {
    return this.state.error !== null ? (
      <RenderFailure message={this.state.error} />
    ) : (
      this.props.children
    );
  }
}

function nodeName(flowchart: Chart, id: string) {
  const index = flowchart.nodes.findIndex((node) => node.id === id);
  return `节点 ${index + 1}：${flowchart.nodes[index]?.label ?? id}`;
}

function FlowDiagram({ flowchart }: { flowchart: Chart }) {
  const canvas = useRef<HTMLDivElement>(null);
  const buttons = useRef(new Map<string, HTMLButtonElement>());
  const [selected, setSelected] = useState<string | null>(null);
  const [paths, setPaths] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const descriptionId = useId();
  const levels = layoutFlowNodes(flowchart);
  const selectedNode = flowchart.nodes.find((node) => node.id === selected);

  useLayoutEffect(() => {
    let active = true;
    function measure() {
      if (!active) return;
      try {
        setPaths(
          flowchart.edges.map((edge) => {
            const from = buttons.current.get(edge.from);
            const to = buttons.current.get(edge.to);
            if (!from || !to) throw new Error('连线对应的节点未能显示');
            const x = from.offsetLeft + from.offsetWidth;
            const y = from.offsetTop + from.offsetHeight / 2;
            const endX = to.offsetLeft;
            const endY = to.offsetTop + to.offsetHeight / 2;
            const middle = (x + endX) / 2;
            return `M ${x} ${y} C ${middle} ${y}, ${middle} ${endY}, ${endX} ${endY}`;
          }),
        );
      } catch (error) {
        setError(error instanceof Error ? error.message : '无法计算连线位置');
      }
    }
    const observer = new ResizeObserver(measure);
    try {
      if (canvas.current) observer.observe(canvas.current);
      for (const button of buttons.current.values()) observer.observe(button);
      measure();
    } catch (error) {
      observer.disconnect();
      throw error;
    }
    return () => {
      active = false;
      observer.disconnect();
    };
  }, [flowchart]);

  if (error !== null) throw new Error(error);
  return (
    <>
      <p className={styles.help}>
        从主题向外阅读分支，点选节点查看说明。Tab 移动焦点，Enter
        或空格选择；大图可在框内滚动，也可阅读下方完整文字。
      </p>
      <div
        className={styles.scroll}
        role="region"
        aria-label="教学思维导图，可在容器内滚动"
        tabIndex={0}
      >
        <div ref={canvas} className={styles.canvas}>
          <div className={styles.nodes} role="group" aria-label="知识节点">
            {levels.map((level, depth) => (
              <div className={styles.branch} key={depth}>
                {level.map((node) => (
                  <button
                    type="button"
                    key={node.id}
                    ref={(button) => {
                      if (button) buttons.current.set(node.id, button);
                      else buttons.current.delete(node.id);
                    }}
                    className={styles.node}
                    data-root={depth === 0}
                    aria-label={nodeName(flowchart, node.id)}
                    aria-pressed={selected === node.id}
                    aria-describedby={
                      selected === node.id ? descriptionId : undefined
                    }
                    onClick={() => setSelected(node.id)}
                  >
                    {node.label}
                  </button>
                ))}
              </div>
            ))}
          </div>
          <svg className={styles.edges} aria-hidden="true" focusable="false">
            {flowchart.edges.map((edge, index) => (
              <path
                key={`${edge.from}/${edge.to}`}
                d={paths[index]}
                data-selected={edge.from === selected || edge.to === selected}
              />
            ))}
          </svg>
        </div>
      </div>
      <div className={styles.selection} aria-live="polite" aria-atomic="true">
        {selectedNode ? (
          <>
            <strong>{nodeName(flowchart, selectedNode.id)}</strong>
            <p id={descriptionId}>{selectedNode.description}</p>
          </>
        ) : (
          <p>尚未选择节点。也可直接阅读完整文字说明。</p>
        )}
      </div>
    </>
  );
}

export function TeachingFlowchart({ flowchart }: { flowchart: Chart }) {
  const [open, setOpen] = useState(false);
  const trigger = useRef<HTMLButtonElement>(null);
  const contentId = useId();
  return (
    <div className={styles.teaching}>
      <button
        ref={trigger}
        type="button"
        aria-expanded={open}
        aria-controls={contentId}
        onClick={() => setOpen(!open)}
      >
        思维导图（含示例 SQL）
      </button>
      <div
        id={contentId}
        hidden={!open}
        onKeyDown={(event) => {
          if (event.key === 'Escape') {
            event.preventDefault();
            event.stopPropagation();
            setOpen(false);
            trigger.current?.focus();
          }
        }}
      >
        {open && (
          <>
            <p className={styles.caption}>
              逻辑处理过程（教学示意，非真实执行计划）
            </p>
            <p className={styles.help}>
              围绕固定示例梳理知识关系，分支不表示执行先后。查看不会运行 SQL
              或修改草稿，也不是当前查询的执行轨迹。
            </p>
            <h4>固定示例 SQL</h4>
            <pre>{flowchart.exampleSql}</pre>
            <FlowchartBoundary>
              <FlowDiagram flowchart={flowchart} />
            </FlowchartBoundary>
            <h4>完整文字说明</h4>
            <ol className={styles.textNodes}>
              {flowchart.nodes.map((node) => (
                <li key={node.id}>
                  <strong>{node.label}</strong>
                  <p>{node.description}</p>
                </li>
              ))}
            </ol>
            <h4>连接关系</h4>
            {flowchart.edges.length ? (
              <ul className={styles.connections}>
                {flowchart.edges.map((edge) => (
                  <li key={`${edge.from}/${edge.to}`}>
                    从{nodeName(flowchart, edge.from)}，到
                    {nodeName(flowchart, edge.to)}
                    {edge.label ? `。${edge.label}` : '。'}
                  </li>
                ))}
              </ul>
            ) : (
              <p>本图没有连线。</p>
            )}
          </>
        )}
      </div>
    </div>
  );
}
