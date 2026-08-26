import React, { useState, useEffect, useRef } from 'react';
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  RotateCcw,
  Minimize2,
  ExternalLink,
  Sparkles,
  Info,
  Layers,
  ChevronDown,
  X,
  Code2,
  Terminal,
} from 'lucide-react';
import {
  LearningProgram,
  LearningStep,
  PlaybackSpeed,
  SPEED_DELAYS,
} from '../core/types';

interface MobileLandscapeFullscreenProps {
  program: LearningProgram;
  steps: LearningStep[];
  currentStepIndex: number;
  currentStep: LearningStep;
  activeLineNumber?: number;
  selectedLanguage: string;
  availableLanguages: string[];
  isPlaying: boolean;
  speed: PlaybackSpeed;
  renderVisualizer: () => React.ReactNode;
  onLanguageChange: (lang: string) => void;
  onPlay: () => void;
  onPause: () => void;
  onPrevious: () => void;
  onNext: () => void;
  onRestart: () => void;
  onSpeedChange: (spd: PlaybackSpeed) => void;
  onStepChange: (index: number) => void;
  onExitFullscreen: () => void;
  onPracticeInCompiler: () => void;
}

export const MobileLandscapeFullscreen: React.FC<MobileLandscapeFullscreenProps> = ({
  program,
  steps,
  currentStepIndex,
  currentStep,
  activeLineNumber,
  selectedLanguage,
  availableLanguages,
  isPlaying,
  speed,
  renderVisualizer,
  onLanguageChange,
  onPlay,
  onPause,
  onPrevious,
  onNext,
  onRestart,
  onSpeedChange,
  onStepChange,
  onExitFullscreen,
  onPracticeInCompiler,
}) => {
  const [activePopover, setActivePopover] = useState<'explanation' | 'variables' | null>(null);

  // Auto-scroll active code line smoothly
  const activeLineRef = useRef<HTMLDivElement>(null);
  const codeContainerRef = useRef<HTMLDivElement>(null);

  const currentImplementation =
    program.implementations[selectedLanguage as keyof typeof program.implementations] ||
    program.implementations.cpp ||
    program.implementations.c ||
    program.implementations.python;

  const codeLines = (currentImplementation?.sourceCode || '').split('\n');

  useEffect(() => {
    if (activeLineRef.current && codeContainerRef.current) {
      activeLineRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
      });
    }
  }, [activeLineNumber]);

  const isCompleted = currentStepIndex >= steps.length - 1 && steps.length > 1;

  return (
    <div className="fixed inset-0 z-50 w-screen h-screen h-[100dvh] bg-[#060608] text-dark-100 flex flex-col overflow-hidden select-none pt-[env(safe-area-inset-top)] pb-[env(safe-area-inset-bottom)] pl-[env(safe-area-inset-left)] pr-[env(safe-area-inset-right)]">
      {/* MAIN DUAL PANE WORKSPACE (Left 46% Code+Output | Right 54% Simulation) */}
      <div className="flex-1 grid grid-cols-12 gap-2 p-2 min-h-0 overflow-hidden">
        {/* LEFT PANE (5 of 12 columns ≈ 42-46%) */}
        <div className="col-span-5 flex flex-col gap-2 min-h-0 overflow-hidden">
          {/* Top Mini Header: Language Selector & Title */}
          <div className="flex items-center justify-between px-2.5 py-1.5 rounded-xl bg-[#0c0c10]/95 border border-white/10 text-[11px] font-mono">
            <span className="font-bold text-white truncate max-w-[120px]">
              {program.title}
            </span>

            {/* Language Selector */}
            {availableLanguages.length > 1 ? (
              <div className="flex items-center gap-1">
                {availableLanguages.map((lang) => (
                  <button
                    key={lang}
                    onClick={() => onLanguageChange(lang)}
                    className={`px-1.5 py-0.5 rounded text-[10px] uppercase font-bold transition-all ${
                      selectedLanguage === lang
                        ? 'bg-crimson-600 text-white shadow-glow-red-sm'
                        : 'text-dark-400 hover:text-white bg-[#16161d]'
                    }`}
                  >
                    {lang === 'javascript' ? 'JS' : lang}
                  </button>
                ))}
              </div>
            ) : (
              <span className="px-1.5 py-0.5 rounded text-[10px] uppercase font-bold bg-crimson-500/20 text-crimson-400">
                {selectedLanguage}
              </span>
            )}
          </div>

          {/* Code Viewer Panel (~72% of left height) */}
          <div className="flex-1 rounded-2xl bg-[#08080c] border border-white/10 flex flex-col min-h-0 overflow-hidden shadow-inner">
            <div
              ref={codeContainerRef}
              className="flex-1 p-2 overflow-y-auto overflow-x-auto font-mono text-[12px] leading-relaxed select-text"
            >
              {codeLines.map((lineText, idx) => {
                const lineNum = idx + 1;
                const isActive = lineNum === activeLineNumber;

                return (
                  <div
                    key={lineNum}
                    ref={isActive ? activeLineRef : null}
                    className={`flex items-center gap-2 px-1.5 py-0.5 rounded transition-colors ${
                      isActive
                        ? 'bg-crimson-500/25 border-l-2 border-crimson-500 text-white font-semibold'
                        : 'text-dark-300 hover:bg-[#121218]/60'
                    }`}
                  >
                    <span
                      className={`w-5 text-right select-none text-[10px] font-mono ${
                        isActive ? 'text-crimson-400 font-bold' : 'text-dark-500'
                      }`}
                    >
                      {lineNum}
                    </span>
                    <span className="flex-1 font-mono whitespace-pre">{lineText || ' '}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Compact Output Panel (~28% of left height) */}
          <div className="h-[95px] rounded-2xl bg-[#0c0c10]/95 border border-white/10 p-2 flex flex-col min-h-0 shadow-inner">
            <div className="flex items-center justify-between pb-1 border-b border-white/10 text-[10px] font-mono text-dark-400">
              <span className="flex items-center gap-1 font-bold">
                <Terminal className="w-3 h-3 text-crimson-400" />
                <span>OUTPUT</span>
              </span>
              <span className="text-[9px] text-emerald-400">Live stdout</span>
            </div>
            <div className="flex-1 overflow-y-auto font-mono text-[11px] text-emerald-300 pt-1 whitespace-pre-wrap">
              {currentStep.output || '> Program running...'}
            </div>
          </div>
        </div>

        {/* RIGHT PANE (7 of 12 columns ≈ 54-58%) */}
        <div className="col-span-7 flex flex-col gap-2 min-h-0 overflow-hidden relative">
          {/* Top Quick Actions Bar (Explanation & Variables Drawers) */}
          <div className="flex items-center justify-between px-2.5 py-1.5 rounded-xl bg-[#0c0c10]/95 border border-white/10 text-[11px] font-mono">
            <div className="flex items-center gap-2">
              <button
                onClick={() =>
                  setActivePopover(activePopover === 'explanation' ? null : 'explanation')
                }
                className={`px-2 py-0.5 rounded-lg font-semibold flex items-center gap-1 transition-colors ${
                  activePopover === 'explanation'
                    ? 'bg-crimson-600 text-white shadow-glow-red-sm'
                    : 'bg-[#16161d] text-dark-300 hover:text-white'
                }`}
              >
                <Info className="w-3 h-3" />
                <span>Explanation</span>
              </button>

              <button
                onClick={() =>
                  setActivePopover(activePopover === 'variables' ? null : 'variables')
                }
                className={`px-2 py-0.5 rounded-lg font-semibold flex items-center gap-1 transition-colors ${
                  activePopover === 'variables'
                    ? 'bg-crimson-600 text-white shadow-glow-red-sm'
                    : 'bg-[#16161d] text-dark-300 hover:text-white'
                }`}
              >
                <Layers className="w-3 h-3" />
                <span>Variables</span>
              </button>
            </div>

            {/* Step Action Tag */}
            <span className="text-[10px] text-crimson-400 font-bold truncate max-w-[180px]">
              {currentStep.action}
            </span>
          </div>

          {/* Simulation Visualizer Canvas */}
          <div className="flex-1 rounded-2xl bg-[#08080c]/80 border border-white/10 p-2 sm:p-3 flex items-center justify-center min-h-0 overflow-hidden relative shadow-2xl">
            <div className="w-full h-full flex items-center justify-center overflow-auto">
              {renderVisualizer()}
            </div>

            {/* Lesson Completed Overlay Modal inside simulation */}
            {isCompleted && (
              <div className="absolute inset-0 bg-[#060608]/90 backdrop-blur-md flex flex-col items-center justify-center p-4 text-center space-y-3 z-30 animate-in fade-in duration-200">
                <div className="p-2.5 rounded-2xl bg-crimson-500/20 text-crimson-400 border border-crimson-500/30 animate-bounce">
                  <Sparkles className="w-6 h-6" />
                </div>
                <h3 className="text-base font-bold text-white">Lesson Completed!</h3>
                <p className="text-xs text-dark-300 max-w-xs">
                  You have stepped through all {steps.length} simulation steps of {program.title}.
                </p>
                <div className="flex items-center gap-2 pt-1">
                  <button
                    onClick={onRestart}
                    className="px-3 py-1.5 rounded-xl bg-[#16161d] hover:bg-[#20202a] text-white text-xs font-semibold flex items-center gap-1"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Replay</span>
                  </button>
                  <button
                    onClick={onPracticeInCompiler}
                    className="px-3.5 py-1.5 rounded-xl bg-crimson-600 hover:bg-crimson-700 text-white text-xs font-bold flex items-center gap-1 shadow-glow-red-sm hover:scale-105 transition-transform"
                  >
                    <span>Practice in Compiler</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={onExitFullscreen}
                    className="px-3 py-1.5 rounded-xl bg-[#1a1a24] hover:bg-[#242432] text-white text-xs font-semibold"
                  >
                    Exit
                  </button>
                </div>
              </div>
            )}

            {/* Explanation Popover Drawer */}
            {activePopover === 'explanation' && (
              <div className="absolute top-2 left-2 right-2 p-3 rounded-2xl bg-[#0c0c10]/95 border border-crimson-500/40 text-dark-200 text-xs shadow-2xl backdrop-blur-md z-20 space-y-1.5 animate-in fade-in slide-in-from-top-1">
                <div className="flex items-center justify-between pb-1 border-b border-white/10">
                  <span className="font-bold text-crimson-400 flex items-center gap-1">
                    <Info className="w-3.5 h-3.5" />
                    Step {currentStepIndex + 1}: {currentStep.action}
                  </span>
                  <button
                    onClick={() => setActivePopover(null)}
                    className="p-1 text-dark-400 hover:text-white"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
                <p className="leading-relaxed text-[11px]">{currentStep.description}</p>
              </div>
            )}

            {/* Variables Popover Drawer */}
            {activePopover === 'variables' && (
              <div className="absolute top-2 left-2 right-2 p-3 rounded-2xl bg-[#0c0c10]/95 border border-crimson-500/40 text-dark-200 text-xs shadow-2xl backdrop-blur-md z-20 space-y-1.5 animate-in fade-in slide-in-from-top-1">
                <div className="flex items-center justify-between pb-1 border-b border-white/10">
                  <span className="font-bold text-crimson-400 flex items-center gap-1">
                    <Layers className="w-3.5 h-3.5" />
                    RAM Variables Watch
                  </span>
                  <button
                    onClick={() => setActivePopover(null)}
                    className="p-1 text-dark-400 hover:text-white"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 pt-1">
                  {Object.entries(currentStep.variables || {}).map(([k, v]) => (
                    <div
                      key={k}
                      className="p-1.5 rounded-xl bg-[#14141a]/90 border border-white/10 flex flex-col items-center text-[10px] font-mono"
                    >
                      <span className="text-dark-400">{k}</span>
                      <span className="font-bold text-white text-xs truncate max-w-full">
                        {v === null || v === undefined ? '?' : String(v)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* COMPACT BOTTOM PLAYBACK CONTROL BAR (Height ~48px, Touch Target >= 44px) */}
      <div className="h-12 px-3 bg-[#0c0c10]/95 border-t border-white/10 flex items-center justify-between gap-2 shadow-2xl select-none">
        {/* Left: Transport Buttons */}
        <div className="flex items-center gap-1">
          <button
            onClick={onRestart}
            className="w-9 h-9 rounded-xl bg-[#16161d] hover:bg-[#20202a] text-dark-300 flex items-center justify-center transition-colors"
            title="Restart (R)"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          <button
            onClick={onPrevious}
            disabled={currentStepIndex === 0}
            className="w-9 h-9 rounded-xl bg-[#16161d] hover:bg-[#20202a] disabled:opacity-30 text-crimson-400 flex items-center justify-center transition-colors"
            title="Previous Step"
          >
            <SkipBack className="w-4 h-4" />
          </button>

          {isPlaying ? (
            <button
              onClick={onPause}
              className="px-3.5 h-9 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs flex items-center gap-1.5 shadow-md shadow-amber-500/20"
              title="Pause (Space)"
            >
              <Pause className="w-4 h-4 fill-white" />
              <span>Pause</span>
            </button>
          ) : (
            <button
              onClick={onPlay}
              className="px-3.5 h-9 rounded-xl bg-gradient-to-r from-crimson-600 to-rose-600 hover:from-crimson-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-glow-red-sm"
              title="Play (Space)"
            >
              <Play className="w-4 h-4 fill-white" />
              <span>Play</span>
            </button>
          )}

          <button
            onClick={onNext}
            disabled={currentStepIndex >= steps.length - 1}
            className="w-9 h-9 rounded-xl bg-[#16161d] hover:bg-[#20202a] disabled:opacity-30 text-crimson-400 flex items-center justify-center transition-colors"
            title="Next Step"
          >
            <SkipForward className="w-4 h-4" />
          </button>
        </div>

        {/* Center: Speed Pills */}
        <div className="flex items-center gap-1 bg-[#14141a] p-0.5 rounded-xl border border-white/10 font-mono text-[10px]">
          {(['slow', 'normal', 'fast'] as PlaybackSpeed[]).map((spd) => {
            const label = spd === 'slow' ? 'Slow' : spd === 'normal' ? 'Normal' : 'Fast';

            return (
              <button
                key={spd}
                onClick={() => onSpeedChange(spd)}
                className={`px-2 py-1 rounded-lg font-bold transition-colors ${
                  speed === spd
                    ? 'bg-crimson-600 text-white shadow-glow-red-sm'
                    : 'text-dark-400 hover:text-white'
                }`}
              >
                {label}
              </button>
            );
          })}
        </div>

        {/* Right: Step Counter & Exit Fullscreen Button */}
        <div className="flex items-center gap-2">
          <span className="px-2 py-1 rounded-lg bg-[#14141a] text-[10px] font-mono font-bold text-crimson-400 border border-white/10">
            {currentStepIndex + 1} / {steps.length}
          </span>

          <button
            onClick={onExitFullscreen}
            className="h-9 px-2.5 rounded-xl bg-[#16161d] hover:bg-rose-950/50 hover:text-rose-300 text-dark-300 text-xs font-semibold flex items-center gap-1 transition-colors"
            title="Exit Fullscreen"
          >
            <Minimize2 className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Exit</span>
          </button>
        </div>
      </div>
    </div>
  );
};
