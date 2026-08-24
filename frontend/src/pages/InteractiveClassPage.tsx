import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  ArrowLeft,
  Code2,
  Clock,
  Box,
  Sparkles,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  Info,
  Maximize2,
} from 'lucide-react';
import { getProgramBySlug } from '../learning/registry/learningPrograms';
import {
  LearningProgram,
  LearningStep,
  PlaybackSpeed,
  SPEED_DELAYS,
  getStepDelay,
  PresetInput,
} from '../learning/core/types';
import { useDeviceLayout } from '../learning/hooks/useDeviceLayout';
import { useLearningFullscreen } from '../learning/hooks/useLearningFullscreen';
import { CodeViewerPanel } from '../learning/components/CodeViewerPanel';
import { OutputViewerPanel } from '../learning/components/OutputViewerPanel';
import { VariableWatchPanel } from '../learning/components/VariableWatchPanel';
import { StepExplanationPanel } from '../learning/components/StepExplanationPanel';
import { PlaybackControlBar } from '../learning/components/PlaybackControlBar';
import { PresetSelector } from '../learning/components/PresetSelector';
import { MobileLandscapeOnboarding } from '../learning/components/MobileLandscapeOnboarding';
import { MobileLandscapeFullscreen } from '../learning/components/MobileLandscapeFullscreen';

// Visualizer Renderers
import { ArrayVisualizer } from '../learning/renderers/ArrayVisualizer';
import { LinkedListVisualizer } from '../learning/renderers/LinkedListVisualizer';
import { StackVisualizer } from '../learning/renderers/StackVisualizer';
import { QueueVisualizer } from '../learning/renderers/QueueVisualizer';
import { TreeVisualizer } from '../learning/renderers/TreeVisualizer';
import { GraphVisualizer } from '../learning/renderers/GraphVisualizer';
import { RecursionVisualizer } from '../learning/renderers/RecursionVisualizer';

export const InteractiveClassPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();

  const program: LearningProgram | undefined = useMemo(() => {
    return getProgramBySlug(slug || 'bubble-sort');
  }, [slug]);

  // If program not found, redirect to catalog
  useEffect(() => {
    if (!program && slug) {
      navigate('/my-class', { replace: true });
    }
  }, [program, slug, navigate]);

  // Selected Language implementation
  const availableLanguages = useMemo(() => {
    if (!program) return ['cpp'];
    return Object.keys(program.implementations);
  }, [program]);

  const [selectedLanguage, setSelectedLanguage] = useState<string>('cpp');

  // Ensure selectedLanguage is valid for this program
  useEffect(() => {
    if (availableLanguages.length > 0 && !availableLanguages.includes(selectedLanguage)) {
      setSelectedLanguage(availableLanguages[0]);
    }
  }, [availableLanguages, selectedLanguage]);

  // Current Input & Presets
  const [currentInput, setCurrentInput] = useState<any>(program?.defaultInput);
  const [selectedPresetLabel, setSelectedPresetLabel] = useState<string>('Default');
  const [showAboutModal, setShowAboutModal] = useState<boolean>(false);

  // When program changes, reset input
  useEffect(() => {
    if (program) {
      setCurrentInput(program.defaultInput);
      setSelectedPresetLabel(program.presets[0]?.label || 'Default');
    }
  }, [program]);

  // Generate trace steps
  const steps: LearningStep[] = useMemo(() => {
    if (!program) return [];
    try {
      return program.generateTrace(currentInput);
    } catch {
      return program.generateTrace(program.defaultInput);
    }
  }, [program, currentInput]);

  // Playback States
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [speed, setSpeed] = useState<PlaybackSpeed>('normal');

  // Reset playback when steps change
  useEffect(() => {
    setCurrentStepIndex(0);
    setIsPlaying(false);
  }, [steps]);

  // Animation Timer Loop with dynamic event-aware delay
  useEffect(() => {
    if (!isPlaying) return;

    const currentStep = steps[currentStepIndex];
    const delay = getStepDelay(speed, currentStep?.event);

    const timer = setTimeout(() => {
      setCurrentStepIndex((prev) => {
        if (prev >= steps.length - 1) {
          setIsPlaying(false);
          return prev;
        }
        return prev + 1;
      });
    }, delay);

    return () => clearTimeout(timer);
  }, [isPlaying, currentStepIndex, speed, steps]);

  if (!program) {
    return null;
  }

  const currentStep: LearningStep = steps[currentStepIndex] || steps[0] || {
    id: 1,
    event: 'INIT',
    action: 'Loading...',
    description: '',
    state: null,
  };

  const currentImplementation =
    program.implementations[selectedLanguage as keyof typeof program.implementations] ||
    program.implementations.cpp ||
    program.implementations.c ||
    program.implementations.python;

  // Resolve active line for current language based on step event
  const resolvedLineNumber = useMemo(() => {
    if (!currentImplementation || !currentStep) return undefined;
    const mapped = currentImplementation.lineMap?.[currentStep.event];
    if (typeof mapped === 'number') return mapped;
    if (Array.isArray(mapped) && mapped.length > 0) return mapped[0];
    return currentStep.codeLine;
  }, [currentImplementation, currentStep]);

  // Visualizer Switcher
  const renderVisualizer = () => {
    switch (program.simulationType) {
      case 'array':
        return <ArrayVisualizer step={currentStep} />;
      case 'linked-list':
        return <LinkedListVisualizer step={currentStep} />;
      case 'stack':
        return <StackVisualizer step={currentStep} />;
      case 'queue':
        return <QueueVisualizer step={currentStep} />;
      case 'tree':
        return <TreeVisualizer step={currentStep} />;
      case 'graph':
        return <GraphVisualizer step={currentStep} />;
      case 'recursion':
        return <RecursionVisualizer step={currentStep} />;
      default:
        return <ArrayVisualizer step={currentStep} />;
    }
  };

  const handleSelectPreset = (preset: PresetInput) => {
    setSelectedPresetLabel(preset.label);
    setCurrentInput(preset.value);
    setIsPlaying(false);
    setCurrentStepIndex(0);
  };

  const handleCustomInput = (val: any) => {
    setSelectedPresetLabel('Custom');
    setCurrentInput(val);
    setIsPlaying(false);
    setCurrentStepIndex(0);
  };

  const layout = useDeviceLayout();
  const { isFullscreen, enterFullscreen, exitFullscreen } = useLearningFullscreen();

  const handlePracticeInCompiler = () => {
    // Navigate to playground with preloaded source code
    navigate('/playground', {
      state: {
        preloadedCode: currentImplementation?.sourceCode,
        preloadedLang: selectedLanguage,
      },
    });
  };

  // Dedicated Mobile Landscape / Fullscreen Learning Mode
  if (isFullscreen || (layout.isMobile && layout.isLandscape)) {
    return (
      <MobileLandscapeFullscreen
        program={program}
        steps={steps}
        currentStepIndex={currentStepIndex}
        currentStep={currentStep}
        activeLineNumber={resolvedLineNumber}
        selectedLanguage={selectedLanguage}
        availableLanguages={availableLanguages}
        isPlaying={isPlaying}
        speed={speed}
        renderVisualizer={renderVisualizer}
        onLanguageChange={setSelectedLanguage}
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
        onSpeedChange={setSpeed}
        onStepChange={(idx) => {
          setIsPlaying(false);
          setCurrentStepIndex(idx);
        }}
        onExitFullscreen={exitFullscreen}
        onPracticeInCompiler={handlePracticeInCompiler}
      />
    );
  }

  return (
    <div className="min-h-screen py-6 px-3 sm:px-6 max-w-[1600px] mx-auto space-y-6 relative">
      {/* Mobile Landscape Onboarding / Rotation Guidance */}
      <MobileLandscapeOnboarding
        isMobile={layout.isMobile}
        isPortrait={layout.isPortrait}
        isFullscreen={isFullscreen}
        onEnterFullscreen={() => enterFullscreen()}
      />

      {/* Top Breadcrumb & Actions Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-dark-800">
        {/* Left Title & Meta */}
        <div className="flex items-center gap-3">
          <Link
            to="/my-class"
            className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-dark-800 dark:hover:bg-dark-750 text-slate-700 dark:text-dark-200 transition-colors"
            title="Back to My Class Catalog"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>

          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
                {program.title}
              </h1>
              <span className="px-2.5 py-0.5 rounded-full bg-brand-500/10 border border-brand-500/30 text-brand-600 dark:text-brand-400 text-xs font-mono font-bold uppercase">
                {program.difficulty}
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-dark-400 mt-0.5">
              {program.conceptSummary}
            </p>
          </div>
        </div>

        {/* Right Complexity, Fullscreen & Practice Button */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          <div className="hidden md:flex items-center gap-3 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-dark-800/80 border border-slate-200 dark:border-dark-700 text-xs font-mono text-slate-600 dark:text-dark-300">
            <span>Time: <b>{program.timeComplexity.average}</b></span>
            <span>•</span>
            <span>Space: <b>{program.spaceComplexity}</b></span>
          </div>

          <button
            onClick={() => enterFullscreen()}
            className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-dark-800 dark:hover:bg-dark-750 text-slate-600 dark:text-dark-300 text-xs font-medium flex items-center gap-1.5 transition-colors"
            title="Open Fullscreen Landscape Mode"
          >
            <Maximize2 className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Fullscreen</span>
          </button>

          <button
            onClick={() => setShowAboutModal(!showAboutModal)}
            className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-dark-800 dark:hover:bg-dark-750 text-slate-600 dark:text-dark-300 text-xs font-medium flex items-center gap-1.5 transition-colors"
          >
            <Info className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">About</span>
          </button>

          <button
            onClick={handlePracticeInCompiler}
            className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-md shadow-emerald-500/20 transition-transform active:scale-95"
          >
            <span>Practice in Code</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* About Collapsible Details */}
      {showAboutModal && (
        <div className="rounded-2xl liquid-glass p-4 text-xs sm:text-sm text-slate-700 dark:text-dark-200 space-y-2 border border-slate-200 dark:border-dark-700 shadow-xl animate-in fade-in duration-150">
          <h3 className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-brand-500" />
            About {program.title}
          </h3>
          <p className="leading-relaxed">{program.description}</p>
          <div className="flex flex-wrap gap-2 pt-1 font-mono text-[11px]">
            <span className="px-2 py-0.5 rounded bg-slate-200 dark:bg-dark-800">Best: {program.timeComplexity.best || 'O(1)'}</span>
            <span className="px-2 py-0.5 rounded bg-slate-200 dark:bg-dark-800">Average: {program.timeComplexity.average}</span>
            <span className="px-2 py-0.5 rounded bg-slate-200 dark:bg-dark-800">Worst: {program.timeComplexity.worst}</span>
            <span className="px-2 py-0.5 rounded bg-slate-200 dark:bg-dark-800">Space: {program.spaceComplexity}</span>
          </div>
        </div>
      )}

      {/* Presets & Input Selector Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-2xl liquid-glass border border-slate-200 dark:border-dark-700">
        <PresetSelector
          presets={program.presets}
          selectedPresetLabel={selectedPresetLabel}
          onSelectPreset={handleSelectPreset}
          onCustomInput={program.simulationType === 'array' ? handleCustomInput : undefined}
          simulationType={program.simulationType}
        />
        <div className="text-xs font-mono text-slate-400 dark:text-dark-400">
          {steps.length} total simulation steps
        </div>
      </div>

      {/* MAIN WORKSPACE: Left (Code + Output) | Right (Simulation + Variables + Explanation) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* LEFT COLUMN: 5 Columns on Desktop */}
        <div className="lg:col-span-5 flex flex-col space-y-5">
          {/* Source Code Viewer (Height: 380px) */}
          <div className="h-[380px]">
            {currentImplementation && (
              <CodeViewerPanel
                implementation={currentImplementation}
                activeLineNumber={resolvedLineNumber}
                availableLanguages={availableLanguages}
                selectedLanguage={selectedLanguage}
                onSelectLanguage={setSelectedLanguage}
              />
            )}
          </div>

          {/* Progressive Output Panel (Height: 160px) */}
          <div className="h-[160px]">
            <OutputViewerPanel
              output={currentStep.output}
              stepNumber={currentStepIndex + 1}
              totalSteps={steps.length}
            />
          </div>
        </div>

        {/* RIGHT COLUMN: 7 Columns on Desktop */}
        <div className="lg:col-span-7 flex flex-col space-y-5">
          {/* Visual Simulation Canvas */}
          <div className="rounded-3xl liquid-glass border border-slate-300 dark:border-dark-700/80 p-4 sm:p-6 shadow-2xl min-h-[380px] flex items-center justify-center relative overflow-hidden">
            {renderVisualizer()}
          </div>

          {/* Teacher Step Explanation */}
          <StepExplanationPanel
            step={currentStep}
            stepIndex={currentStepIndex}
            totalSteps={steps.length}
          />

          {/* Variable Watch Grid */}
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
