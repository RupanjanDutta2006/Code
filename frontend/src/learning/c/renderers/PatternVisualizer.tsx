import React from 'react';
import { Grid, Eye } from 'lucide-react';
import { CLearningStep } from '../core/types';

interface PatternVisualizerProps {
  step: CLearningStep;
}

export const PatternVisualizer: React.FC<PatternVisualizerProps> = ({ step }) => {
  const state = step.state || {};
  const currentGrid: string[][] = state.grid || [];
  const currentRow = state.row ?? step.variables?.i;
  const currentCol = state.col ?? step.variables?.j;
  const patternOutput: string = step.output || state.patternOutput || '';

  return (
    <div className="flex flex-col items-center justify-center w-full py-4 space-y-5 select-none">
      {/* Loop Tracker */}
      <div className="flex items-center justify-between w-full max-w-md px-2 text-xs font-mono">
        <div className="flex items-center gap-1.5 text-brand-600 dark:text-brand-400 font-bold">
          <Grid className="w-4 h-4" />
          <span>Nested Loops State</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="px-2.5 py-1 rounded-lg bg-blue-500/10 border border-blue-500/30 text-blue-500 font-bold">
            Outer (i): {currentRow ?? '-'}
          </span>
          <span className="px-2.5 py-1 rounded-lg bg-purple-500/10 border border-purple-500/30 text-purple-500 font-bold">
            Inner (j): {currentCol ?? '-'}
          </span>
        </div>
      </div>

      {/* Visual Pattern Matrix Canvas */}
      {currentGrid.length > 0 ? (
        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl flex flex-col gap-1.5 font-mono">
          {currentGrid.map((row, rIdx) => (
            <div key={rIdx} className="flex items-center gap-1.5">
              {row.map((cell, cIdx) => {
                const isActive = rIdx === currentRow && cIdx === currentCol;

                return (
                  <div
                    key={cIdx}
                    className={`w-9 h-9 rounded-lg flex items-center justify-center font-bold text-sm transition-all duration-200 border ${
                      isActive
                        ? 'border-brand-400 bg-brand-500 text-white scale-110 shadow-md shadow-brand-500/40'
                        : cell && cell.trim() !== ''
                        ? 'border-slate-700 bg-slate-800 text-emerald-400'
                        : 'border-slate-800 bg-slate-950/40 text-slate-700'
                    }`}
                  >
                    {cell || '·'}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      ) : (
        /* Formatted Output Console */
        <div className="w-full max-w-md min-h-[160px] p-4 rounded-2xl bg-slate-950 border border-slate-800 font-mono text-sm text-emerald-400 whitespace-pre shadow-inner">
          {patternOutput || '[Generating pattern step by step...]'}
        </div>
      )}
    </div>
  );
};
