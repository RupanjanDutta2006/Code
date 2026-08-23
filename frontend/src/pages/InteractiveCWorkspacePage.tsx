import React, { useState, useEffect, useMemo } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Terminal,
  ExternalLink,
  Code2,
  FileCode,
  Sparkles,
  Info,
  Clock,
  Box,
} from 'lucide-react';
import { getCLessonBySlug, ALL_C_LESSONS } from '../learning/c/registry/cProgramsRegistry';
import { getCategoryMeta } from '../learning/c/registry/cCategories';
import { CLearningStep, CPresetInput } from '../learning/c/core/types';
import { PlaybackSpeed, SPEED_DELAYS } from '../learning/core/types';

// Components
import { CCodeViewerPanel } from '../learning/c/components/CCodeViewerPanel';
import { OutputViewerPanel } from '../learning/components/OutputViewerPanel';
import { VariableWatchPanel } from '../learning/components/VariableWatchPanel';
import { StepExplanationPanel } from '../learning/components/StepExplanationPanel';
import { PlaybackControlBar } from '../learning/components/PlaybackControlBar';
import { PresetSelector } from '../learning/components/PresetSelector';

// Specialized C Visualizers
import { BasicsVisualizer } from '../learning/c/renderers/BasicsVisualizer';
import { ConditionVisualizer } from '../learning/c/renderers/ConditionVisualizer';
import { NumberVisualizer } from '../learning/c/renderers/NumberVisualizer';
import { PatternVisualizer } from '../learning/c/renderers/PatternVisualizer';
import { CArrayVisualizer } from '../learning/c/renderers/CArrayVisualizer';
import { CMatrixVisualizer } from '../learning/c/renderers/CMatrixVisualizer';
import { CStringVisualizer } from '../learning/c/renderers/CStringVisualizer';
import { CStructureVisualizer } from '../learning/c/renderers/CStructureVisualizer';
import { CStorageVisualizer } from '../learning/c/renderers/CStorageVisualizer';
import { CFileVisualizer } from '../learning/c/renderers/CFileVisualizer';

export const InteractiveCWorkspacePage: React.FC = () => {
  const { category: categoryParam, slug } = useParams<{ category?: string; slug?: string }>();
  const navigate = useNavigate();

  // Search by slug or category/slug
  const targetSlug = slug || categoryParam;
  const lesson = useMemo(() => {
    return getCLessonBySlug(targetSlug || '');
  }, [targetSlug]);

  useEffect(() => {
    if (!lesson && targetSlug) {
      navigate('/my-class/c', { replace: true });
    }
  }, [lesson, targetSlug, navigate]);

  const categoryMeta = useMemo(() => {
    return lesson ? getCategoryMeta(lesson.category) : undefined;
  }, [lesson]);

  // Input & Presets
  const [currentInput, setCurrentInput] = useState<string>(lesson?.defaultInput || '');
  const [selectedPresetLabel, setSelectedPresetLabel] = useState<string>('Default Input');
  const [showOriginalModal, setShowOriginalModal] = useState<boolean>(false);

  useEffect(() => {
    if (lesson) {
      setCurrentInput(lesson.defaultInput);
      setSelectedPresetLabel(lesson.presets[0]?.label || 'Default Input');
    }
  }, [lesson]);

  // Generate trace steps
  const steps: CLearningStep[] = useMemo(() => {
    if (!lesson) return [];
    try {
      return lesson.generateTrace(currentInput);
    } catch {
      return lesson.generateTrace(lesson.defaultInput);
    }
  }, [lesson, currentInput]);

  // Playback States
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [speed, setSpeed] = useState<PlaybackSpeed>('normal');

  useEffect(() => {
    setCurrentStepIndex(0);
    setIsPlaying(false);
  }, [steps]);

  // Animation Timer Loop
  useEffect(() => {
    if (!isPlaying) return;

    const delay = SPEED_DELAYS[speed] || 900;
    const interval = setInterval(() => {
      setCurrentStepIndex((prev) => {
        if (prev >= steps.length - 1) {
          setIsPlaying(false);
          return prev;
        }
        return prev + 1;
      });
    }, delay);

    return () => clearInterval(interval);
  }, [isPlaying, speed, steps.length]);

  if (!lesson) {
    return null;
  }

  const currentStep: CLearningStep = steps[currentStepIndex] || steps[0] || {
    id: 1,
    event: 'INIT',
    codeLine: 1,
    action: 'Initializing...',
    description: '',
    variables: {},
    state: {},
  };

  const activeLineNumber = typeof currentStep.codeLine === 'number' ? currentStep.codeLine : Array.isArray(currentStep.codeLine) ? currentStep.codeLine[0] : 1;

  // Visualizer Switcher
  const renderVisualizer = () => {
    switch (lesson.renderer) {
      case 'variables':
        return <BasicsVisualizer step={currentStep} />;
      case 'condition':
        return <ConditionVisualizer step={currentStep} />;
      case 'number':
        return <NumberVisualizer step={currentStep} />;
      case 'pattern':
        return <PatternVisualizer step={currentStep} />;
      case 'array':
      case 'sorting':
      case 'search':
        return <CArrayVisualizer step={currentStep} />;
      case 'matrix':
        return <CMatrixVisualizer step={currentStep} />;
      case 'string':
        return <CStringVisualizer step={currentStep} />;
      case 'structure':
        return <CStructureVisualizer step={currentStep} />;
      case 'storage':
        return <CStorageVisualizer step={currentStep} />;
      case 'file':
        return <CFileVisualizer step={currentStep} />;
      default:
        return <BasicsVisualizer step={currentStep} />;
    }
  };

  const handleSelectPreset = (preset: any) => {
    setSelectedPresetLabel(preset.label);
    setCurrentInput(preset.value);
    setIsPlaying(false);
    setCurrentStepIndex(0);
  };

  const handleCustomInput = (val: string) => {
    setSelectedPresetLabel('Custom');
    setCurrentInput(val);
    setIsPlaying(false);
    setCurrentStepIndex(0);
  };

  const handlePracticeInCompiler = () => {
    // Navigate to Online Compiler preloaded with C source code
    navigate('/playground', {
      state: {
        preloadedCode: lesson.learningSource || lesson.originalSource,
        preloadedLang: 'c',
      },
    });
  };

  return (
    <div className="min-h-screen py-6 px-3 sm:px-6 max-w-[1600px] mx-auto space-y-6">
      {/* Top Breadcrumb & Actions Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-dark-800">
        {/* Left Title & Breadcrumbs */}
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
            <Link to="/my-class" className="hover:text-white transition-colors">
              My Class
            </Link>
            <span>&gt;</span>
            <Link to="/my-class/c" className="hover:text-white transition-colors">
              Fundamentals of C
            </Link>
            <span>&gt;</span>
            <Link
              to={`/my-class/c/${lesson.category}`}
              className="hover:text-white transition-colors"
            >
              {lesson.categoryDisplay}
            </Link>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to={`/my-class/c/${lesson.category}`}
              className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-dark-800 dark:hover:bg-dark-750 text-slate-700 dark:text-dark-200 transition-colors"
              title="Back to category"
            >
              <ArrowLeft className="w-4 h-4" />
            </Link>

            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
                  {lesson.title}
                </h1>
                <span className="px-2.5 py-0.5 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-600 dark:text-blue-400 text-xs font-mono font-bold uppercase">
                  {lesson.difficulty}
                </span>
              </div>
              <p className="text-xs font-mono text-slate-400">
                File: {lesson.originalFilename}
              </p>
            </div>
          </div>
        </div>

        {/* Right Actions */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          <button
            onClick={() => setShowOriginalModal(!showOriginalModal)}
            className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-dark-800 dark:hover:bg-dark-750 text-slate-600 dark:text-dark-300 text-xs font-medium flex items-center gap-1.5 transition-colors"
            title="View Original Repository Source Code"
          >
            <FileCode className="w-3.5 h-3.5 text-slate-400" />
            <span className="hidden sm:inline">Original .c Source</span>
          </button>

          {/* Practice in Compiler (Preloads C Code) */}
          <button
            onClick={handlePracticeInCompiler}
            className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-md shadow-emerald-500/20 transition-transform active:scale-95"
            title="Open in Online Compiler with C language preloaded"
          >
            <span>Practice in Compiler (C)</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Original Source Modal */}
      {showOriginalModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="w-full max-w-2xl max-h-[80vh] rounded-3xl liquid-glass p-6 space-y-4 shadow-2xl flex flex-col">
            <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-dark-700">
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <FileCode className="w-4 h-4 text-brand-500" />
                Original Repository File: {lesson.originalFilename}
              </h3>
              <button
                onClick={() => setShowOriginalModal(false)}
                className="px-3 py-1 rounded-lg bg-slate-200 dark:bg-dark-800 text-xs font-semibold"
              >
                Close
              </button>
            </div>
            <pre className="flex-1 p-4 rounded-2xl bg-slate-950 text-slate-200 font-mono text-xs overflow-y-auto leading-relaxed whitespace-pre">
              {lesson.originalSource}
            </pre>
          </div>
        </div>
      )}

      {/* Presets & Input Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-2xl liquid-glass border border-slate-200 dark:border-dark-700">
        <PresetSelector
          presets={lesson.presets}
          selectedPresetLabel={selectedPresetLabel}
          onSelectPreset={handleSelectPreset}
          onCustomInput={handleCustomInput}
          simulationType={lesson.renderer}
        />
        <div className="text-xs font-mono text-slate-400">
          {steps.length} simulation steps
        </div>
      </div>

      {/* WORKSPACE LAYOUT: Left (C Code + Output) | Right (Specialized Visualizer + Variables + Explanation) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* LEFT COLUMN (5 Cols) */}
        <div className="lg:col-span-5 flex flex-col space-y-5">
          {/* C Source Code Viewer */}
          <div className="h-[380px]">
            <CCodeViewerPanel
              sourceCode={lesson.learningSource}
              activeLineNumber={activeLineNumber}
              originalPath={lesson.originalPath}
            />
          </div>

          {/* Progressive Console Output */}
          <div className="h-[160px]">
            <OutputViewerPanel
              output={currentStep.output}
              stepNumber={currentStepIndex + 1}
              totalSteps={steps.length}
            />
          </div>
        </div>

        {/* RIGHT COLUMN (7 Cols) */}
        <div className="lg:col-span-7 flex flex-col space-y-5">
          {/* Simulation Visualizer */}
          <div className="rounded-3xl liquid-glass border border-slate-300 dark:border-dark-700/80 p-4 sm:p-6 shadow-2xl min-h-[380px] flex items-center justify-center relative overflow-hidden">
            {renderVisualizer()}
          </div>

          {/* Step Explanation */}
          <StepExplanationPanel
            step={currentStep as any}
            stepIndex={currentStepIndex}
            totalSteps={steps.length}
          />

          {/* Variables Watch */}
          <VariableWatchPanel variables={currentStep.variables} />
        </div>
      </div>

      {/* BOTTOM PLAYBACK CONTROLS */}
      <div className="sticky bottom-4 z-40">
        <PlaybackControlBar
          currentStepIndex={currentStepIndex}
          totalSteps={steps.length}
          isPlaying={isPlaying}
          speed={speed}
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
          onPrevious={() => {
            setIsPlaying(false);
            setCurrentStepIndex((prev) => Math.max(0, prev - 1));
          }}
          onNext={() => {
            setIsPlaying(false);
            setCurrentStepIndex((prev) => Math.min(steps.length - 1, prev + 1));
          }}
          onRestart={() => {
            setIsPlaying(false);
            setCurrentStepIndex(0);
          }}
          onJumpToEnd={() => {
            setIsPlaying(false);
            setCurrentStepIndex(steps.length - 1);
          }}
          onStepChange={(idx) => {
            setIsPlaying(false);
            setCurrentStepIndex(idx);
          }}
          onSpeedChange={setSpeed}
        />
      </div>
    </div>
  );
};
