/**
 * CodeVault Pro - Interactive Learning & Algorithm Simulation Engine Types
 */

export type AlgorithmCategory = 
  | 'sorting' 
  | 'searching' 
  | 'arrays' 
  | 'linked-list' 
  | 'stack-queue' 
  | 'trees' 
  | 'graphs' 
  | 'recursion';

export type ProgramDifficulty = 'easy' | 'medium' | 'hard';

export type SimulationType = 
  | 'array' 
  | 'linked-list' 
  | 'stack' 
  | 'queue' 
  | 'tree' 
  | 'graph' 
  | 'recursion';

export interface PointerInfo {
  name: string;
  index?: number;
  nodeId?: string | number;
  color?: string;
  label?: string;
}

export interface LearningStep {
  id: number;
  event: string; // e.g. 'INIT', 'COMPARE', 'SWAP', 'CALCULATE_MID', 'MOVE_POINTER', 'PUSH', 'POP', 'VISIT', 'FOUND', 'NOT_FOUND', 'COMPLETE'
  codeLine?: number; // active line number (1-indexed) in current language
  action: string; // short summary action e.g. 'Compare arr[j] and arr[j+1]'
  description: string; // teacher explanation of what is happening
  state: any; // visualizer specific state (e.g. array numbers, node list, tree, graph)
  variables?: Record<string, string | number | boolean | null>; // variable watch
  output?: string; // progressive console output up to this step
  highlights?: {
    indices?: number[]; // highlighted array indices
    compareIndices?: [number, number]; // specifically comparing two indices
    swapIndices?: [number, number]; // specifically swapping two indices
    sortedIndices?: number[]; // elements confirmed in sorted position
    discardedIndices?: number[]; // elements ruled out (e.g. binary search)
    activeNodeId?: string | number;
    visitedNodeIds?: (string | number)[];
    pathNodeIds?: (string | number)[];
  };
  pointers?: PointerInfo[];
}

export interface ProgramImplementation {
  language: 'c' | 'cpp' | 'python' | 'java' | 'javascript';
  sourceCode: string;
  lineMap: Record<string, number | number[]>; // maps event key or step id to line number(s)
}

export interface PresetInput {
  label: string;
  description: string;
  value: any;
}

export interface LearningProgram {
  id: string;
  slug: string;
  title: string;
  category: AlgorithmCategory;
  difficulty: ProgramDifficulty;
  simulationType: SimulationType;
  description: string;
  conceptSummary: string;
  timeComplexity: {
    best?: string;
    average: string;
    worst: string;
  };
  spaceComplexity: string;
  tags: string[];
  implementations: {
    c?: ProgramImplementation;
    cpp?: ProgramImplementation;
    python?: ProgramImplementation;
    java?: ProgramImplementation;
    javascript?: ProgramImplementation;
  };
  presets: PresetInput[];
  defaultInput: any;
  generateTrace: (input: any) => LearningStep[];
}

export type PlaybackSpeed = 'slow' | 'normal' | 'fast';

export interface PlaybackConfig {
  speed: PlaybackSpeed;
  delayMs: number;
}

export const SPEED_DELAYS: Record<PlaybackSpeed, number> = {
  slow: 2800, // 2.8s per step (within 2.5 - 3.0s range for comfortable student reading)
  normal: 1000, // 1.0s per step (within 0.9 - 1.1s range)
  fast: 400, // 0.4s per step (within 0.35 - 0.5s range)
};

/**
 * Centralized step delay calculator.
 * Allows complex steps (e.g. SWAP, FOUND, POP, BACKTRACK) to have slightly
 * extended durations in Slow mode for optimal educational clarity.
 */
export function getStepDelay(speed: PlaybackSpeed, stepEvent?: string): number {
  const baseDelay = SPEED_DELAYS[speed] || 1000;

  if (speed === 'slow') {
    // Give complex or pivotal transition steps extra time in slow mode
    if (
      stepEvent &&
      ['SWAP', 'FOUND', 'NOT_FOUND', 'COMPLETE', 'POP', 'DEQUEUE', 'BACKTRACK'].includes(
        stepEvent
      )
    ) {
      return baseDelay + 400; // 3.2s for complex actions
    }
  } else if (speed === 'normal') {
    if (stepEvent && ['SWAP', 'FOUND', 'COMPLETE'].includes(stepEvent)) {
      return baseDelay + 150; // 1.15s
    }
  }

  return baseDelay;
}

