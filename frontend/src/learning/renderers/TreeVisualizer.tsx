import React from 'react';
import { LearningStep } from '../core/types';
import { TreeNodeData } from '../programs/trees/treeTraversals';

interface TreeVisualizerProps {
  step: LearningStep;
}

export const TreeVisualizer: React.FC<TreeVisualizerProps> = ({ step }) => {
  const nodes: TreeNodeData[] = step.state?.nodes || [];
  const activeNodeId = step.highlights?.activeNodeId;
  const visitedNodeIds = step.highlights?.visitedNodeIds || [];
  const visitedOrder = step.state?.visitedOrder || [];

  return (
    <div className="flex flex-col items-center justify-center w-full py-4 space-y-4 select-none">
      {/* SVG Tree Canvas */}
      <div className="relative w-full max-w-md h-[240px] flex items-center justify-center bg-slate-100/40 dark:bg-dark-900/40 rounded-2xl border border-slate-200 dark:border-dark-800 p-2 shadow-inner">
        <svg className="w-full h-full" viewBox="0 0 400 240">
          {/* Edges */}
          {nodes.map((node) => {
            const leftChild = node.leftId ? nodes.find((n) => n.id === node.leftId) : null;
            const rightChild = node.rightId ? nodes.find((n) => n.id === node.rightId) : null;

            return (
              <g key={node.id}>
                {leftChild && (
                  <line
                    x1={node.x}
                    y1={node.y}
                    x2={leftChild.x}
                    y2={leftChild.y}
                    stroke="#475569"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                  />
                )}
                {rightChild && (
                  <line
                    x1={node.x}
                    y1={node.y}
                    x2={rightChild.x}
                    y2={rightChild.y}
                    stroke="#475569"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                  />
                )}
              </g>
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
                  fontSize="12"
                  fontWeight="bold"
                  fontFamily="monospace"
                >
                  {node.val}
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      {/* Traversal Output Trail */}
      <div className="w-full max-w-md p-3 rounded-xl bg-slate-900 border border-slate-800 font-mono text-xs text-white flex items-center gap-2 overflow-x-auto">
        <span className="text-emerald-400 font-bold">Traversal Order:</span>
        {visitedOrder.length > 0 ? (
          <span className="text-white">{visitedOrder.join(' ➔ ')}</span>
        ) : (
          <span className="text-slate-500">[Empty]</span>
        )}
      </div>
    </div>
  );
};
