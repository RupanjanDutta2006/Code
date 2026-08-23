import React from 'react';
import { ArrowRight } from 'lucide-react';
import { LearningStep, PointerInfo } from '../core/types';
import { LinkedListNode } from '../programs/linkedList/reverseLinkedList';

interface LinkedListVisualizerProps {
  step: LearningStep;
}

export const LinkedListVisualizer: React.FC<LinkedListVisualizerProps> = ({ step }) => {
  const state = step.state || {};
  const nodes: LinkedListNode[] = state.nodes || [];
  const headId = state.headId;
  const pointers: PointerInfo[] = step.pointers || [];

  return (
    <div className="flex flex-col items-center justify-center w-full py-8 space-y-6 select-none overflow-x-auto">
      {/* Node Cards & Pointers Chain */}
      <div className="flex items-center gap-3 sm:gap-4 px-4 py-4 min-w-max">
        {nodes.map((node, idx) => {
          const nodePtrs = pointers.filter((p) => String(p.nodeId) === String(node.id));
          const isHead = node.id === headId;

          return (
            <React.Fragment key={node.id}>
              <div className="flex flex-col items-center space-y-2">
                {/* Pointer Tag Above Node */}
                <div className="h-8 flex items-end justify-center">
                  {nodePtrs.length > 0 && (
                    <div className="flex flex-wrap items-center justify-center gap-1">
                      {nodePtrs.map((p, pIdx) => (
                        <span
                          key={pIdx}
                          style={{ backgroundColor: p.color || '#3b82f6' }}
                          className="px-2 py-0.5 rounded-full text-[11px] font-bold text-white shadow-md animate-bounce"
                        >
                          {p.label || p.name}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Node Box */}
                <div className="flex items-center rounded-2xl border-2 border-brand-500/80 bg-white/90 dark:bg-dark-800/90 shadow-xl overflow-hidden backdrop-blur-md">
                  {/* Value Section */}
                  <div className="w-14 sm:w-16 h-14 sm:h-16 flex flex-col items-center justify-center border-r border-slate-200 dark:border-dark-700">
                    <span className="text-[10px] text-slate-400 dark:text-dark-400 font-mono">val</span>
                    <span className="font-mono font-bold text-base sm:text-lg text-slate-900 dark:text-white">
                      {node.value}
                    </span>
                  </div>

                  {/* Next Pointer Section */}
                  <div className="w-12 sm:w-14 h-14 sm:h-16 flex flex-col items-center justify-center bg-slate-100/60 dark:bg-dark-900/60">
                    <span className="text-[10px] text-slate-400 dark:text-dark-400 font-mono">next</span>
                    <span className="font-mono text-xs font-semibold text-brand-500 dark:text-brand-400">
                      {node.nextId ? `*#${node.nextId}` : 'NULL'}
                    </span>
                  </div>
                </div>

                {/* Node Identifier */}
                <div className="text-[11px] font-mono text-slate-400 dark:text-dark-400">
                  Node #{node.id} {isHead && '(HEAD)'}
                </div>
              </div>

              {/* Arrow Connector */}
              {idx < nodes.length - 1 && (
                <div className="flex items-center justify-center text-slate-400 dark:text-dark-500 pt-6">
                  <ArrowRight className="w-6 h-6 text-brand-500 animate-pulse" />
                </div>
              )}
            </React.Fragment>
          );
        })}

        {/* Null Terminator */}
        <div className="flex items-center gap-2 pt-6 pl-2">
          <div className="px-3 py-2 rounded-xl bg-slate-200 dark:bg-dark-900 border border-slate-300 dark:border-dark-700 text-slate-500 dark:text-dark-400 font-mono text-xs font-bold">
            NULL
          </div>
        </div>
      </div>
    </div>
  );
};
