import React from 'react';
import { Grid3X3, ArrowRight } from 'lucide-react';
import { CLearningStep } from '../core/types';

interface CMatrixVisualizerProps {
  step: CLearningStep;
}

export const CMatrixVisualizer: React.FC<CMatrixVisualizerProps> = ({ step }) => {
  const state = step.state || {};
  const matrixA: number[][] = state.matrixA || state.matrix || [];
  const matrixB: number[][] = state.matrixB || [];
  const matrixC: number[][] = state.matrixC || state.resultMatrix || [];
  const activeRow = state.activeRow ?? step.variables?.i;
  const activeCol = state.activeCol ?? step.variables?.j;
  const op = state.operation || '+';

  const renderGrid = (mat: number[][], title: string, isResult: boolean = false) => {
    if (!mat || mat.length === 0) return null;

    return (
      <div className="flex flex-col items-center space-y-2">
        <span className="text-xs font-mono font-bold text-slate-400 dark:text-dark-300">{title}</span>
        <div className="p-3 rounded-2xl bg-white/90 dark:bg-dark-800/90 border border-slate-200 dark:border-dark-700 shadow-xl flex flex-col gap-2">
          {mat.map((row, rIdx) => (
            <div key={rIdx} className="flex items-center gap-2">
              {row.map((cell, cIdx) => {
                const isActive = rIdx === Number(activeRow) && cIdx === Number(activeCol);

                return (
                  <div
                    key={cIdx}
                    className={`w-11 h-11 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center font-mono font-bold text-sm sm:text-base border-2 transition-all duration-300 ${
                      isActive
                        ? isResult
                          ? 'border-emerald-500 bg-emerald-500/25 text-emerald-300 scale-110 shadow-lg'
                          : 'border-brand-500 bg-brand-500/25 text-brand-300 scale-110 shadow-lg'
                        : 'border-slate-200 dark:border-dark-700 bg-slate-100/50 dark:bg-dark-900/50 text-slate-800 dark:text-white'
                    }`}
                  >
                    {cell}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col items-center justify-center w-full py-4 space-y-6 select-none overflow-x-auto">
      {/* 2D Matrix display */}
      <div className="flex items-center justify-center gap-4 sm:gap-6 min-w-max p-2">
        {renderGrid(matrixA, matrixB.length > 0 ? 'Matrix A' : 'Matrix')}

        {matrixB.length > 0 && (
          <>
            <span className="text-xl font-bold font-mono text-brand-500">{op}</span>
            {renderGrid(matrixB, 'Matrix B')}
            <span className="text-xl font-bold font-mono text-slate-400">=</span>
            {renderGrid(matrixC, 'Result (Matrix C)', true)}
          </>
        )}
      </div>

      {/* Row & Col Indicator */}
      {(activeRow !== undefined || activeCol !== undefined) && (
        <div className="flex items-center gap-3 text-xs font-mono">
          <span className="px-3 py-1 rounded-xl bg-slate-100 dark:bg-dark-800 border border-slate-200 dark:border-dark-700">
            Row: <b>{String(activeRow)}</b>
          </span>
          <span className="px-3 py-1 rounded-xl bg-slate-100 dark:bg-dark-800 border border-slate-200 dark:border-dark-700">
            Column: <b>{String(activeCol)}</b>
          </span>
        </div>
      )}
    </div>
  );
};
