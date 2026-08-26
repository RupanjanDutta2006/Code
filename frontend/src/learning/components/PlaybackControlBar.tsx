import React, { useEffect } from 'react';
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  RotateCcw,
  FastForward,
  Gauge,
} from 'lucide-react';
import { PlaybackSpeed } from '../core/types';

interface PlaybackControlBarProps {
  currentStepIndex: number;
  totalSteps: number;
  isPlaying: boolean;
  speed: PlaybackSpeed;
  onPlay: () => void;
  onPause: () => void;
  onPrevious: () => void;
  onNext: () => void;
  onRestart: () => void;
  onJumpToEnd: () => void;
  onStepChange: (index: number) => void;
  onSpeedChange: (speed: PlaybackSpeed) => void;
}

export const PlaybackControlBar: React.FC<PlaybackControlBarProps> = ({
  currentStepIndex,
  totalSteps,
  isPlaying,
  speed,
  onPlay,
  onPause,
  onPrevious,
  onNext,
  onRestart,
  onJumpToEnd,
  onStepChange,
  onSpeedChange,
}) => {
  // Global keyboard shortcuts (when not typing in an input/textarea)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      if (
        target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        target.tagName === 'SELECT'
      ) {
        return;
      }

      if (e.code === 'Space') {
        e.preventDefault();
        if (isPlaying) onPause();
        else onPlay();
      } else if (e.code === 'ArrowRight') {
        e.preventDefault();
        onNext();
      } else if (e.code === 'ArrowLeft') {
        e.preventDefault();
        onPrevious();
      } else if (e.code === 'KeyR') {
        e.preventDefault();
        onRestart();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isPlaying, onPlay, onPause, onNext, onPrevious, onRestart]);

  return (
    <div className="rounded-2xl border border-light-border dark:border-white/10 bg-white dark:bg-[#0f0f13]/90 p-4 sm:p-5 shadow-card-light dark:shadow-2xl flex flex-col space-y-4 transition-colors duration-200 backdrop-blur-xl">
      {/* Timeline Slider */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div className="flex items-center justify-between sm:justify-start gap-3 w-full">
          <span className="font-mono text-xs font-bold text-light-textStrong dark:text-dark-200 select-none">
            Timeline
          </span>
          <span className="px-2.5 py-0.5 rounded-full bg-crimson-500/10 dark:bg-crimson-500/15 border border-crimson-500/30 font-mono text-xs font-bold text-crimson-600 dark:text-crimson-400 select-none">
            Step {currentStepIndex + 1} / {totalSteps}
          </span>
        </div>

        {/* Timeline Range Input */}
        <div className="w-full flex-1 flex items-center">
          <input
            type="range"
            min={0}
            max={Math.max(0, totalSteps - 1)}
            value={currentStepIndex}
            onChange={(e) => onStepChange(Number(e.target.value))}
            className="w-full h-2 bg-slate-200 dark:bg-[#141419] rounded-lg appearance-none cursor-pointer accent-crimson-500"
            title="Drag to jump steps"
          />
        </div>
      </div>

      {/* Action Buttons & Speed Selector */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-1 border-t border-light-border dark:border-white/10">
        {/* Left: Playback Controls */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Restart */}
          <button
            onClick={onRestart}
            className="p-2 sm:px-3 sm:py-2 rounded-xl bg-light-secondary hover:bg-white text-light-textNormal hover:text-light-textStrong border border-light-border dark:bg-[#141419] dark:hover:bg-[#1c1c24] dark:border-white/10 dark:text-dark-200 text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-card-light hover:border-crimson-500/40"
            title="Restart simulation (R)"
          >
            <RotateCcw className="w-4 h-4 text-light-textMuted dark:text-dark-400" />
            <span className="hidden sm:inline">Restart</span>
          </button>

          {/* Previous Step */}
          <button
            onClick={onPrevious}
            disabled={currentStepIndex === 0}
            className="p-2 sm:px-3 sm:py-2 rounded-xl bg-light-secondary hover:bg-white text-light-textNormal hover:text-light-textStrong border border-light-border dark:bg-[#141419] dark:hover:bg-[#1c1c24] dark:border-white/10 disabled:opacity-40 dark:text-crimson-400 text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-card-light hover:border-crimson-500/40"
            title="Previous Step (Left Arrow)"
          >
            <SkipBack className="w-4 h-4 text-crimson-600 dark:text-crimson-400" />
            <span className="hidden sm:inline">Prev</span>
          </button>

          {/* Play / Pause Primary Button */}
          {isPlaying ? (
            <button
              onClick={onPause}
              className="px-4 py-2 sm:px-5 sm:py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs sm:text-sm flex items-center gap-2 shadow-sm transition-transform active:scale-95"
              title="Pause (Space)"
            >
              <Pause className="w-4 h-4 fill-white" />
              <span>Pause</span>
            </button>
          ) : (
            <button
              onClick={onPlay}
              className="px-4 py-2 sm:px-5 sm:py-2.5 rounded-xl bg-crimson-600 hover:bg-crimson-700 dark:bg-gradient-to-r dark:from-crimson-600 dark:to-rose-600 text-white font-bold text-xs sm:text-sm flex items-center gap-2 shadow-glow-red-sm transition-transform active:scale-95 hover:scale-105"
              title="Play (Space)"
            >
              <Play className="w-4 h-4 fill-white" />
              <span>Play</span>
            </button>
          )}

          {/* Next Step */}
          <button
            onClick={onNext}
            disabled={currentStepIndex >= totalSteps - 1}
            className="p-2 sm:px-3 sm:py-2 rounded-xl bg-light-secondary hover:bg-white text-light-textNormal hover:text-light-textStrong border border-light-border dark:bg-[#141419] dark:hover:bg-[#1c1c24] dark:border-white/10 disabled:opacity-40 dark:text-crimson-400 text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-card-light hover:border-crimson-500/40"
            title="Next Step (Right Arrow)"
          >
            <span className="hidden sm:inline">Next</span>
            <SkipForward className="w-4 h-4 text-crimson-600 dark:text-crimson-400" />
          </button>

          {/* Jump To End */}
          <button
            onClick={onJumpToEnd}
            disabled={currentStepIndex >= totalSteps - 1}
            className="p-2 sm:px-3 sm:py-2 rounded-xl bg-light-secondary hover:bg-white text-light-textNormal hover:text-light-textStrong border border-light-border dark:bg-[#141419] dark:hover:bg-[#1c1c24] dark:border-white/10 disabled:opacity-40 dark:text-dark-200 text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-card-light hover:border-crimson-500/40"
            title="Jump to End"
          >
            <FastForward className="w-4 h-4 text-light-textMuted dark:text-dark-400" />
          </button>
        </div>

        {/* Right: Speed Control */}
        <div className="flex items-center gap-1 bg-light-secondary dark:bg-[#141419] p-1 rounded-xl border border-light-border dark:border-white/10 shadow-card-light">
          <Gauge className="w-3.5 h-3.5 text-light-textMuted dark:text-dark-400 mx-1 hidden sm:block" />
          {(['slow', 'normal', 'fast'] as PlaybackSpeed[]).map((spd) => {
            const label = spd === 'slow' ? 'Slow' : spd === 'normal' ? 'Normal' : 'Fast';
            const hint =
              spd === 'slow'
                ? 'Slow (2.8s per step - optimal for learning)'
                : spd === 'normal'
                ? 'Normal (1.0s per step)'
                : 'Fast (0.4s per step)';

            return (
              <button
                key={spd}
                onClick={() => onSpeedChange(spd)}
                title={hint}
                className={`px-2.5 py-1 rounded-lg text-xs font-mono font-semibold transition-all ${
                  speed === spd
                    ? 'bg-crimson-600 text-white shadow-glow-red-sm'
                    : 'text-light-textSecondary dark:text-dark-400 hover:text-light-textStrong dark:hover:text-white'
                }`}
              >
                {label}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
