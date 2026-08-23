import React from 'react';
import { Users2, Search } from 'lucide-react';
import { CLearningStep } from '../core/types';

interface CStructureVisualizerProps {
  step: CLearningStep;
}

export const CStructureVisualizer: React.FC<CStructureVisualizerProps> = ({ step }) => {
  const state = step.state || {};
  const records: any[] = state.records || state.students || state.employees || [];
  const activeRecordIdx = state.activeRecordIdx ?? step.variables?.i;
  const isMatch = state.isMatch;

  return (
    <div className="flex flex-col items-center justify-center w-full py-6 space-y-6 select-none overflow-x-auto">
      <div className="flex items-center gap-4 min-w-max p-2">
        {records.map((rec, idx) => {
          const isActive = idx === Number(activeRecordIdx);

          return (
            <div
              key={idx}
              className={`w-44 p-4 rounded-2xl border-2 transition-all duration-300 shadow-xl space-y-2.5 ${
                isActive && isMatch
                  ? 'border-emerald-500 bg-emerald-500/10 text-emerald-300 scale-105 shadow-emerald-500/20'
                  : isActive
                  ? 'border-brand-500 bg-brand-500/10 scale-105 shadow-brand-500/20'
                  : 'border-slate-200 dark:border-dark-700 bg-white/90 dark:bg-dark-800/90'
              }`}
            >
              <div className="flex items-center justify-between pb-1 border-b border-slate-200 dark:border-dark-700">
                <span className="text-[11px] font-mono font-bold text-slate-400">
                  Record [{idx}]
                </span>
                {isActive && (
                  <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-brand-500 text-white">
                    ACTIVE
                  </span>
                )}
              </div>

              <div className="space-y-1 font-mono text-xs">
                {Object.entries(rec).map(([key, val]) => (
                  <div key={key} className="flex items-center justify-between">
                    <span className="text-slate-400 capitalize">{key}:</span>
                    <span className="font-bold text-slate-800 dark:text-white truncate max-w-[90px]">
                      {String(val)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
