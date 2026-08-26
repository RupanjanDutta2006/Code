import React from 'react';
import { Eye } from 'lucide-react';

interface VariableWatchPanelProps {
  variables?: Record<string, any>;
}

export const VariableWatchPanel: React.FC<VariableWatchPanelProps> = ({ variables }) => {
  const entries = Object.entries(variables || {});

  return (
    <div className="rounded-2xl border border-light-border dark:border-white/10 bg-white/90 dark:bg-[#0f0f13]/90 p-4 shadow-card-light dark:shadow-xl backdrop-blur-xl">
      <div className="flex items-center gap-2 mb-3 select-none">
        <Eye className="w-4 h-4 text-crimson-500 dark:text-crimson-400" />
        <h3 className="text-xs font-bold font-mono uppercase tracking-wider text-light-textStrong dark:text-dark-200">
          Variables Watch
        </h3>
      </div>

      {entries.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {entries.map(([key, val]) => (
            <div
              key={key}
              className="flex items-center justify-between p-2 rounded-xl bg-light-secondary dark:bg-[#14141a] border border-light-border dark:border-white/10 font-mono text-xs shadow-sm"
            >
              <span className="text-light-textSecondary dark:text-dark-400 font-semibold">{key}:</span>
              <span className="font-bold text-crimson-600 dark:text-crimson-400 truncate max-w-[120px]">
                {val === null || val === undefined ? 'null' : String(val)}
              </span>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-xs font-mono text-light-textMuted dark:text-dark-500 italic">
          No active variables at this step.
        </div>
      )}
    </div>
  );
};
