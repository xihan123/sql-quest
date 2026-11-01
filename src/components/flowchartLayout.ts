import type { DeepReadonly } from '../content/checks.ts';
import type { Flowchart, FlowNode } from '../contracts/generated/types.d.ts';

// Group by relationship depth, not JSON order. Keep shared children in one place.
export function layoutFlowNodes(flowchart: DeepReadonly<Flowchart>) {
  const pending = [...flowchart.nodes];
  const levels: DeepReadonly<FlowNode>[][] = [];
  const depths = new Map<string, number>();
  while (pending.length) {
    const index = pending.findIndex((node) =>
      flowchart.edges.every(
        (edge) => edge.to !== node.id || depths.has(edge.from),
      ),
    );
    const node = pending[index];
    if (!node) throw new Error('无法确定流程节点的排列顺序');
    const parents = flowchart.edges.filter((edge) => edge.to === node.id);
    const depth = parents.reduce((maximum, edge) => {
      const parentDepth = depths.get(edge.from);
      if (parentDepth === undefined) throw new Error('连线引用未知节点');
      return Math.max(maximum, parentDepth + 1);
    }, 0);
    const level = (levels[depth] ??= []);
    level.push(node);
    depths.set(node.id, depth);
    pending.splice(index, 1);
  }
  return levels;
}
