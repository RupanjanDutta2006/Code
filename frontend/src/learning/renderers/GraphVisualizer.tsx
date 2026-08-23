import React from 'react';
import { LearningStep } from '../core/types';
import { GraphNodeData, GraphEdgeData } from '../programs/graphs/bfs';

interface GraphVisualizerProps {
  step: LearningStep;
}

export const GraphVisualizer: React.FC<GraphVisualizerProps> = ({ step }) => {
  const nodes: GraphNodeData[] = step.state?.nodes || [];
  const edges: GraphEdgeData[] = step.state?.edges || [];
  const activeNodeId = step.highlights?.activeNodeId;
  const visitedNodeIds: string[] = (step.highlights?.visitedNodeIds || []).map(String);
  const queue: string[] = step.state?.queue || [];
  const visitedOrder: string[] = step.state?.visitedOrder || [];

  return (
    <div className="flex flex-col items-center justify-center w-full py-4 space-y-4 select-none">
      {/* Graph SVG Canvas */}
      <div className="relative w-full max-w-md h-[240px] flex items-center justify-center bg-slate-100/40 dark:bg-dark-900/40 rounded-2xl border border-slate-200 dark:border-dark-800 p-2 shadow-inner">
        <svg className="w-full h-full" viewBox="0 0 360 260">
          {/* Edges */}
          {edges.map((edge, idx) => {
            const u = nodes.find((n) => n.id === edge.from);
            const v = nodes.find((n) => n.id === edge.to);
            if (!u || !v) return null;

            return (
              <line
                key={idx}
                x1={u.x}
                y1={u.y}
                x2={v.x}
                y2={v.y}
                stroke="#475569"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
            );
          })}

          {/* Node Circles */}
          {nodes.map((node) => {
            const isActive = node.id === activeNodeId;
            const isVisited = visitedNodeIds.includes(node.id);

            let fill = '#1e293b';
            let stroke = '#64748b';
            let textColor = '#ffffff';

            if (isActive) {
              fill = '#3b82f6';
              stroke = '#60a5fa';
            } else if (isVisited) {
              fill = '#059669';
              stroke = '#34d399';
            }

            return (
              <g key={node.id} className="transition-all duration-300">
                {isActive && (
                  <circle
                    cx={node.x}
                    cy={node.y}
                    r="24"
                    fill="none"
                    stroke="#3b82f6"
                    strokeWidth="2"
                    className="animate-ping opacity-75"
                  />
                )}
                <circle
                  cx={node.x}
                  cy={node.y}
                  r="18"
                  fill={fill}
                  stroke={stroke}
                  strokeWidth="2.5"
                  className="shadow-lg"
                />
                <text
                  x={node.x}
                  y={node.y + 5}
                  textAnchor="middle"
                  fill={textColor}
                  fontSize="13"
                  fontWeight="bold"
                  fontFamily="monospace"
                >
                  {node.label}
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      {/* Queue State and Visited Trail */}
      <div className="grid grid-cols-2 gap-3 w-full max-w-md">
        <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 font-mono text-xs text-white">
          <div className="text-blue-400 font-bold mb-1">BFS Queue:</div>
          <div className="text-slate-300">{queue.length > 0 ? `[ ${queue.join(', ')} ]` : '[ Empty ]'}</div>
        </div>
        <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 font-mono text-xs text-white">
          <div className="text-emerald-400 font-bold mb-1">Visited Trail:</div>
          <div className="text-slate-300">{visitedOrder.length > 0 ? visitedOrder.join(' ➔ ') : '[ None ]'}</div>
        </div>
      </div>
    </div>
  );
};
