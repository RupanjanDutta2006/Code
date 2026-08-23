import React from 'react';
import { Eye } from 'lucide-react';

interface VariableWatchPanelProps {
  variables?: Record<string, any>;
}

export const VariableWatchPanel: React.FC<VariableWatchPanelProps> = ({ variables }) => {
  const entries = Object.entries(variables || {});

  return (
    <div className="rounded-2xl border border-slate-200 dark:border-dark-700/80 bg-white/90 dark:bg-dark-900/90 p-4 shadow-lg backdrop-blur-md">
      <div className="flex items-center gap-2 mb-3 select-none">
        <Eye className="w-4 h-4 text-brand-500" />
        <h3 className="text-xs font-bold font-mono uppercase tracking-wider text-slate-700 dark:text-dark-200">
          Variables Watch
        </h3>
      </div>

      {entries.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {entries.map(([key, val]) => (
            <div
              key={key}
              className="flex items-center justify-between p-2 rounded-xl bg-slate-100/80 dark:bg-dark-800/80 border border-slate-200 dark:border-dark-700 font-mono text-xs shadow-sm"
            >
              <span className="text-slate-500 dark:text-dark-400 font-semibold">{key}:</span>
              <span className="font-bold text-brand-600 dark:text-brand-300 truncate max-w-[120px]">
                {val === null || val === undefined ? 'null' : String(val)}
              </span>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-xs font-mono text-slate-400 dark:text-dark-500 italic">
          No active variables at this step.
        </div>
      )}
    </div>
  );
};
