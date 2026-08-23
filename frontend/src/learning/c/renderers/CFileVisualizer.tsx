import React from 'react';
import { FileText, ArrowRight, HardDrive } from 'lucide-react';
import { CLearningStep } from '../core/types';

interface CFileVisualizerProps {
  step: CLearningStep;
}

export const CFileVisualizer: React.FC<CFileVisualizerProps> = ({ step }) => {
  const state = step.state || {};
  const filename = state.filename || 'data.txt';
  const mode = state.mode || 'w';
  const fileContentBefore = state.contentBefore ?? '';
  const fileContentAfter = state.contentAfter ?? '';
  const currentAction = state.fileAction || 'File Operation';

  return (
    <div className="flex flex-col items-center justify-center w-full py-6 space-y-6 select-none max-w-lg mx-auto">
      {/* File Stream Card */}
      <div className="w-full p-4 rounded-2xl bg-white/90 dark:bg-dark-800/90 border border-slate-200 dark:border-dark-700 shadow-xl space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <HardDrive className="w-4 h-4 text-brand-500" />
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-700 dark:text-dark-200">
              Virtual File Buffer: <span className="text-brand-500">{filename}</span>
            </span>
          </div>
          <span className="px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-dark-700 text-xs font-mono font-bold">
            Mode: <code className="text-brand-400">"{mode}"</code>
          </span>
        </div>

        {/* Disk content stream */}
        <div className="space-y-1.5 font-mono text-xs">
          <span className="text-slate-400 text-[11px]">Virtual Disk Contents:</span>
          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-emerald-400 min-h-[90px] whitespace-pre-wrap">
            {fileContentAfter || fileContentBefore || '[Empty File]'}
          </div>
        </div>
      </div>
    </div>
  );
};
