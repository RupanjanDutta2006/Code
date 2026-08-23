export type CCategoryId =
  | 'basics'
  | 'if-else'
  | 'number-checking'
  | 'nested-for-loop'
  | 'integer-array'
  | 'sorting'
  | 'matrix'
  | 'character-array'
  | 'structure'
  | 'storage-class'
  | 'file-handling';

export type CRendererType =
  | 'variables'
  | 'condition'
  | 'number'
  | 'pattern'
  | 'array'
  | 'sorting'
  | 'search'
  | 'matrix'
  | 'string'
  | 'structure'
  | 'storage'
  | 'file';

export interface CLearningStep {
  id: number;
  event: string;
  codeLine: number | number[];
  action: string;
  description: string;
  variables: Record<string, string | number | boolean | null | undefined>;
  state: any;
  output?: string;
  inputConsumed?: string;
  highlights?: {
    indices?: number[];
    compareIndices?: [number, number];
    swapIndices?: [number, number];
    activeCell?: [number, number];
    activeRow?: number;
    activeCol?: number;
    conditionResult?: boolean;
    conditionText?: string;
    branchTaken?: 'if' | 'else' | 'else-if' | 'none';
  };
  pointers?: Array<{
    name: string;
    index?: number;
    nodeId?: string | number;
    color?: string;
    label?: string;
  }>;
}

export interface CPresetInput {
  label: string;
  value: string;
  description: string;
}

export interface CProgramLesson {
  id: string;
  slug: string;
  title: string;
  category: CCategoryId;
  categoryFolder: string;
  categoryDisplay: string;
  originalFilename: string;
  originalPath: string;
  originalSource: string;
  learningSource: string;
  description: string;
  conceptSummary: string;
  tags: string[];
  difficulty: 'beginner' | 'easy' | 'medium';
  defaultInput: string;
  presets: CPresetInput[];
  renderer: CRendererType;
  lineMap: Record<string, number | number[]>;
  generateTrace: (input: string) => CLearningStep[];
}

export interface CCategoryMeta {
  id: CCategoryId;
  folder: string;
  name: string;
  description: string;
  icon: string;
  badgeColor: string;
}
