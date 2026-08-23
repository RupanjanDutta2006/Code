import React from 'react';
import { Database, Zap, Clock, Shield } from 'lucide-react';
import { CLearningStep } from '../core/types';

interface CStorageVisualizerProps {
  step: CLearningStep;
}

export const CStorageVisualizer: React.FC<CStorageVisualizerProps> = ({ step }) => {
  const state = step.state || {};
  const storageClass = state.storageClass || 'static';
  const scope = state.scope || 'Local Function Scope';
  const lifetime = state.lifetime || 'Entire Program Execution';
  const memorySegment = state.memorySegment || 'Data Segment (.data / .bss)';
  const callCount = state.callCount ?? step.variables?.callNumber ?? 1;
  const history: Array<{ call: number; value: any }> = state.history || [];

  return (
    <div className="flex flex-col items-center justify-center w-full py-6 space-y-6 select-none max-w-lg mx-auto">
      {/* Storage Class Specifier Card */}
      <div className="w-full p-4 rounded-2xl bg-white/90 dark:bg-dark-800/90 border border-slate-200 dark:border-dark-700 shadow-xl space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Database className="w-4 h-4 text-brand-500" />
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-700 dark:text-dark-200">
              Storage Class: <span className="text-brand-500 font-black">{storageClass}</span>
            </span>
          </div>
          <span className="px-2.5 py-0.5 rounded-full bg-brand-500/10 text-brand-400 text-xs font-mono font-bold">
            Call #{callCount}
          </span>
        </div>

        <div className="grid grid-cols-2 gap-2 text-xs font-mono">
          <div className="p-2.5 rounded-xl bg-slate-100 dark:bg-dark-900 border border-slate-200 dark:border-dark-750">
            <span className="text-slate-400 block text-[10px]">SCOPE</span>
            <span className="font-bold text-slate-800 dark:text-white">{scope}</span>
          </div>
          <div className="p-2.5 rounded-xl bg-slate-100 dark:bg-dark-900 border border-slate-200 dark:border-dark-750">
            <span className="text-slate-400 block text-[10px]">LIFETIME</span>
            <span className="font-bold text-slate-800 dark:text-white">{lifetime}</span>
          </div>
        </div>
      </div>

      {/* Memory Value Preservation Trail */}
      {history.length > 0 && (
        <div className="w-full space-y-2">
          <span className="text-xs font-mono text-slate-400">Value Persistence across invocations:</span>
          <div className="flex items-center gap-2 overflow-x-auto p-1">
            {history.map((h, idx) => (
              <div
                key={idx}
                className="px-3 py-2 rounded-xl bg-slate-100 dark:bg-dark-800 border border-slate-200 dark:border-dark-700 text-xs font-mono flex flex-col items-center shadow-sm min-w-[70px]"
              >
                <span className="text-[10px] text-slate-400">Call #{h.call}</span>
                <span className="font-bold text-brand-500 text-sm">{h.value}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
