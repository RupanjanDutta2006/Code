import React from 'react';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { LearningStep, PointerInfo } from '../core/types';

interface QueueVisualizerProps {
  step: LearningStep;
}

export const QueueVisualizer: React.FC<QueueVisualizerProps> = ({ step }) => {
  const queue: number[] = step.state?.queue || [];
  const dequeuedValue = step.state?.dequeuedValue;
  const pointers: PointerInfo[] = step.pointers || [];

  return (
    <div className="flex flex-col items-center justify-center w-full py-8 space-y-6 select-none">
      {/* Front & Rear Pointers */}
      <div className="flex items-center justify-between w-full max-w-md px-4">
        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-600 text-white text-xs font-bold shadow-md">
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>FRONT (Exit)</span>
        </div>
        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-pink-600 text-white text-xs font-bold shadow-md">
          <span>REAR (Entry)</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </div>
      </div>

      {/* Horizontal Tube */}
      <div className="w-full max-w-lg min-h-[90px] p-3 rounded-2xl border-2 border-slate-400 dark:border-dark-600 bg-slate-100/50 dark:bg-dark-900/50 flex items-center justify-center gap-3 overflow-x-auto shadow-2xl backdrop-blur-md">
        {queue.map((val, idx) => {
          const isFront = idx === 0;
          const isRear = idx === queue.length - 1;

          return (
            <div
              key={idx}
              className={`w-16 h-16 rounded-2xl border-2 flex flex-col items-center justify-center font-mono font-bold text-base transition-all duration-300 shadow-md ${
                isFront
                  ? 'border-blue-500 bg-blue-500/20 text-blue-300 scale-105'
                  : isRear
                  ? 'border-pink-500 bg-pink-500/20 text-pink-300 scale-105'
                  : 'border-slate-300 dark:border-dark-700 bg-white dark:bg-dark-800 text-slate-800 dark:text-white'
              }`}
            >
              <span>{val}</span>
              <span className="text-[10px] text-slate-400 font-normal">[{idx}]</span>
            </div>
          );
        })}

        {queue.length === 0 && (
          <div className="text-xs font-mono text-slate-400 dark:text-dark-500">
            [Queue is Empty]
          </div>
        )}
      </div>

      {dequeuedValue !== undefined && (
        <div className="text-xs font-mono text-emerald-500 dark:text-emerald-400 flex items-center gap-1.5 animate-pulse">
          <span>Dequeued from FRONT:</span>
          <span className="font-bold">{dequeuedValue}</span>
        </div>
      )}
    </div>
  );
};
