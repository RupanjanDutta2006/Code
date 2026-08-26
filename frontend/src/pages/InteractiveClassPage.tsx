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

  // Layout & Fullscreen detection
  const layout = useDeviceLayout();
  const { isFullscreen, enterFullscreen, exitFullscreen } = useLearningFullscreen();

  // Reset playback when steps change (e.g. preset changed)
  useEffect(() => {
    setCurrentStepIndex(0);
    setIsPlaying(false);
  }, [steps]);

  // Auto-play animation timer loop
  useEffect(() => {
    if (!isPlaying) return;

    if (currentStepIndex >= steps.length - 1) {
      setIsPlaying(false);
      return;
    }

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
  }, [isPlaying, currentStepIndex, steps, speed]);

  if (!program || steps.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center text-light-textMuted dark:text-dark-400 font-semibold animate-pulse">
        Loading interactive algorithm session...
      </div>
    );
  }

  const currentStep = steps[currentStepIndex] || steps[0];
  const currentImplementation = program.implementations[selectedLanguage as keyof typeof program.implementations];
  const resolvedLineNumber = currentStep.codeLine;

  // Handle Preset selection
  const handleSelectPreset = (preset: PresetInput) => {
    setIsPlaying(false);
    setSelectedPresetLabel(preset.label);
    setCurrentInput(preset.value);
  };

  // Handle Custom Input
  const handleCustomInput = (val: any) => {
    setIsPlaying(false);
    setSelectedPresetLabel('Custom');
    setCurrentInput(val);
  };

  // Render Visualizer by simulation type
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

  // Practice in Code Studio
  const handlePracticeInCompiler = () => {
    navigate('/programs', {
      state: {
        templateCode: currentImplementation?.sourceCode,
        language: selectedLanguage,
        title: `Practice: ${program.title}`,
      },
    });
  };

  const [portraitTab, setPortraitTab] = useState<'visualizer' | 'code' | 'explanation'>('visualizer');

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
    <div className="min-h-screen py-4 sm:py-8 px-3 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-4 sm:space-y-6 mesh-gradient-bg transition-colors duration-200">
      {/* Landscape Fullscreen Onboarding Banner */}
      <MobileLandscapeOnboarding
        isMobile={layout.isMobile}
        isPortrait={layout.isPortrait}
        isFullscreen={isFullscreen}
        onEnterFullscreen={() => enterFullscreen()}
      />

      {/* Top Breadcrumb & Actions Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 sm:pb-4 border-b border-light-border dark:border-dark-800">
        {/* Left Title & Meta */}
        <div className="flex items-center gap-2.5 sm:gap-3">
          <Link
            to="/my-class"
            className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-white hover:bg-light-secondary text-light-textNormal hover:text-light-textStrong border border-light-border dark:bg-dark-800 dark:hover:bg-dark-750 dark:text-dark-200 flex items-center justify-center transition-colors shadow-xs touch-target"
            title="Back to My Class Catalog"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>

          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg sm:text-2xl font-black text-light-textStrong dark:text-white font-sans truncate max-w-[200px] sm:max-w-none">
                {program.title}
              </h1>
              <span className="px-2 py-0.5 rounded-full bg-light-blueSoft border border-light-blueBorder/40 text-light-blue dark:bg-brand-500/10 dark:border-brand-500/30 dark:text-brand-400 text-[10px] sm:text-xs font-mono font-bold uppercase">
                {program.difficulty}
              </span>
            </div>
            <p className="text-[11px] sm:text-xs text-light-textSecondary dark:text-dark-400 mt-0.5 truncate max-w-[260px] sm:max-w-none">
              {program.conceptSummary}
            </p>
          </div>
        </div>

        {/* Right Complexity, Fullscreen & Practice Button */}
        <div className="flex flex-wrap items-center gap-1.5 sm:gap-3">
          <button
            onClick={() => enterFullscreen()}
            className="px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-xl bg-white hover:bg-light-secondary text-light-textNormal hover:text-light-textStrong border border-light-border dark:bg-dark-800 dark:hover:bg-dark-750 dark:text-dark-300 text-xs font-medium flex items-center gap-1.5 transition-colors shadow-xs touch-target"
            title="Open Fullscreen Landscape Mode"
          >
            <Maximize2 className="w-3.5 h-3.5" />
            <span>Landscape Fullscreen</span>
          </button>

          <button
            onClick={() => setShowAboutModal(!showAboutModal)}
            className="p-1.5 sm:p-2 rounded-xl bg-white hover:bg-light-secondary text-light-textNormal hover:text-light-textStrong border border-light-border dark:bg-dark-800 dark:hover:bg-dark-750 dark:text-dark-300 text-xs font-medium flex items-center gap-1 transition-colors shadow-xs touch-target"
            title="About Lesson"
          >
            <Info className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={handlePracticeInCompiler}
            className="px-3 sm:px-3.5 py-1.5 sm:py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-xs transition-transform active:scale-95 touch-target"
          >
            <span>Practice</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* About Collapsible Details */}
      {showAboutModal && (
        <div className="rounded-2xl bg-white dark:bg-dark-900 p-4 text-xs sm:text-sm text-light-textStrong dark:text-dark-200 space-y-2 border border-light-border dark:border-dark-700 shadow-xs animate-in fade-in duration-150">
          <h3 className="font-bold text-light-textStrong dark:text-white flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-light-blue dark:text-brand-500" />
            About {program.title}
          </h3>
          <p className="leading-relaxed text-light-textSecondary dark:text-dark-300">{program.description}</p>
          <div className="flex flex-wrap gap-2 pt-1 font-mono text-[11px]">
            <span className="px-2 py-0.5 rounded bg-light-secondary border border-light-border dark:bg-dark-800 dark:border-transparent">Best: {program.timeComplexity.best || 'O(1)'}</span>
            <span className="px-2 py-0.5 rounded bg-light-secondary border border-light-border dark:bg-dark-800 dark:border-transparent">Average: {program.timeComplexity.average}</span>
            <span className="px-2 py-0.5 rounded bg-light-secondary border border-light-border dark:bg-dark-800 dark:border-transparent">Worst: {program.timeComplexity.worst}</span>
            <span className="px-2 py-0.5 rounded bg-light-secondary border border-light-border dark:bg-dark-800 dark:border-transparent">Space: {program.spaceComplexity}</span>
          </div>
        </div>
      )}

      {/* Presets & Input Selector Bar */}
      <div className="flex flex-wrap items-center justify-between gap-2.5 p-2.5 sm:p-3 rounded-2xl bg-white dark:bg-dark-900 border border-light-border dark:border-dark-700 shadow-xs">
        <PresetSelector
          presets={program.presets}
          selectedPresetLabel={selectedPresetLabel}
          onSelectPreset={handleSelectPreset}
          onCustomInput={program.simulationType === 'array' ? handleCustomInput : undefined}
          simulationType={program.simulationType}
        />
        <div className="text-[11px] sm:text-xs font-mono text-light-textMuted dark:text-dark-400">
          Step <b>{currentStepIndex + 1}</b> of {steps.length}
        </div>
      </div>

      {/* Mobile Portrait Viewport Tab Switcher (Visible on small screens) */}
      <div className="lg:hidden grid grid-cols-3 gap-1 p-1 bg-light-secondary dark:bg-dark-900 rounded-2xl border border-light-border dark:border-dark-700">
        <button
          onClick={() => setPortraitTab('visualizer')}
          className={`py-2 rounded-xl text-xs font-bold transition-all ${
            portraitTab === 'visualizer'
              ? 'bg-light-blue text-white shadow-xs dark:bg-brand-600'
              : 'text-light-textSecondary dark:text-dark-400'
          }`}
        >
          1. Simulation
        </button>
        <button
          onClick={() => setPortraitTab('code')}
          className={`py-2 rounded-xl text-xs font-bold transition-all ${
            portraitTab === 'code'
              ? 'bg-light-blue text-white shadow-xs dark:bg-brand-600'
              : 'text-light-textSecondary dark:text-dark-400'
          }`}
        >
          2. Code & Output
        </button>
        <button
          onClick={() => setPortraitTab('explanation')}
          className={`py-2 rounded-xl text-xs font-bold transition-all ${
            portraitTab === 'explanation'
              ? 'bg-light-blue text-white shadow-xs dark:bg-brand-600'
              : 'text-light-textSecondary dark:text-dark-400'
          }`}
        >
          3. Details & Vars
        </button>
      </div>

      {/* MAIN WORKSPACE: Left (Code + Output) | Right (Simulation + Variables + Explanation) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6 items-start">
        {/* LEFT COLUMN: 5 Columns on Desktop (Visible on mobile if 'code' tab selected) */}
        <div className={`lg:col-span-5 flex-col space-y-4 sm:space-y-5 ${portraitTab === 'code' ? 'flex' : 'hidden lg:flex'}`}>
          {/* Source Code Viewer */}
          <div className="h-[340px] sm:h-[380px]">
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

          {/* Progressive Output Panel */}
          <div className="h-[140px] sm:h-[160px]">
            <OutputViewerPanel
              output={currentStep.output}
              stepNumber={currentStepIndex + 1}
              totalSteps={steps.length}
            />
          </div>
        </div>

        {/* RIGHT COLUMN: 7 Columns on Desktop (Simulation canvas + Explanation) */}
        <div className="lg:col-span-7 flex flex-col space-y-4 sm:space-y-5">
          {/* Visual Simulation Canvas (Always on desktop, on mobile visible when 'visualizer' tab selected) */}
          <div className={`rounded-3xl bg-white dark:bg-dark-900/90 border border-light-border dark:border-dark-700/80 p-3 sm:p-6 shadow-xs sm:shadow-md min-h-[300px] sm:min-h-[380px] flex items-center justify-center relative overflow-hidden ${
            portraitTab === 'visualizer' ? 'block' : 'hidden lg:block'
          }`}>
            {renderVisualizer()}
          </div>

          {/* Teacher Step Explanation */}
          <div className={portraitTab === 'explanation' || portraitTab === 'visualizer' ? 'block' : 'hidden lg:block'}>
            <StepExplanationPanel
              step={currentStep}
              stepIndex={currentStepIndex}
              totalSteps={steps.length}
            />
          </div>

          {/* Variable Watch Grid */}
          <div className={portraitTab === 'explanation' || portraitTab === 'visualizer' ? 'block' : 'hidden lg:block'}>
            <VariableWatchPanel variables={currentStep.variables} />
          </div>
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
