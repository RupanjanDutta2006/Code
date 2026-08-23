import { LearningProgram, LearningStep } from '../../core/types';

export function generateArrayReverseTrace(arrInput: number[] = [1, 2, 3, 4, 5]): LearningStep[] {
  const arr = arrInput && arrInput.length > 0 ? [...arrInput] : [1, 2, 3, 4, 5];
  const steps: LearningStep[] = [];
  let stepId = 1;

  let left = 0;
  let right = arr.length - 1;

  steps.push({
    id: stepId++,
    event: 'INIT',
    action: 'Initialize Two Pointers',
    description: `Set left pointer at index 0 (val: ${arr[left]}) and right pointer at index ${right} (val: ${arr[right]}).`,
    state: [...arr],
    variables: { left, right, leftVal: arr[left], rightVal: arr[right] },
    pointers: [
      { name: 'left', index: left, color: '#3b82f6', label: 'LEFT' },
      { name: 'right', index: right, color: '#ec4899', label: 'RIGHT' },
    ],
    highlights: {
      indices: [left, right],
    },
    codeLine: 2,
  });

  while (left < right) {
    steps.push({
      id: stepId++,
      event: 'SWAP',
      action: `Swap arr[${left}] (${arr[left]}) ↔ arr[${right}] (${arr[right]})`,
      description: `Swap the values at the two pointer boundaries to reverse their positions.`,
      state: [...arr],
      variables: { left, right, swapping: `${arr[left]} ↔ ${arr[right]}` },
      pointers: [
        { name: 'left', index: left, color: '#3b82f6', label: 'LEFT' },
        { name: 'right', index: right, color: '#ec4899', label: 'RIGHT' },
      ],
      highlights: {
        swapIndices: [left, right],
      },
      codeLine: 4,
    });

    const temp = arr[left];
    arr[left] = arr[right];
    arr[right] = temp;

    left++;
    right--;

    steps.push({
      id: stepId++,
      event: 'ADVANCE',
      action: `Move pointers inward (left → ${left}, right → ${right})`,
      description: `Increment left pointer and decrement right pointer towards the center.`,
      state: [...arr],
      variables: { left, right },
      pointers: [
        ...(left < arr.length ? [{ name: 'left', index: left, color: '#3b82f6', label: 'LEFT' }] : []),
        ...(right >= 0 ? [{ name: 'right', index: right, color: '#ec4899', label: 'RIGHT' }] : []),
      ],
      highlights: {
        indices: left <= right ? [left, right] : [],
      },
      codeLine: 5,
    });
  }

  steps.push({
    id: stepId++,
    event: 'COMPLETE',
    action: `Array Inversion Finished: [${arr.join(', ')}]`,
    description: `Pointers met in the center. The array has been fully reversed in-place.`,
    state: [...arr],
    variables: { completed: true },
    output: `Reversed Array: [${arr.join(', ')}]\n`,
    highlights: {
      sortedIndices: arr.map((_, idx) => idx),
    },
    codeLine: 7,
  });

  return steps;
}

export const arrayReverseProgram: LearningProgram = {
  id: 'array-reverse',
  slug: 'array-reverse',
  title: 'Array Reverse (Two Pointers)',
  category: 'arrays',
  difficulty: 'easy',
  description: 'Reverse an array in-place using two inward-moving pointers (left and right).',
  conceptSummary: 'Swaps symmetric elements at opposite ends until left and right pointers meet.',
  tags: ['arrays', 'two-pointers', 'in-place', 'reverse'],
  timeComplexity: {
    best: 'O(n)',
    average: 'O(n)',
    worst: 'O(n)',
  },
  spaceComplexity: 'O(1)',
  defaultInput: [10, 20, 30, 40, 50, 60],
  presets: [
    { label: '6 Elements (Default)', value: [10, 20, 30, 40, 50, 60], description: 'Even size array' },
    { label: '5 Elements (Odd)', value: [1, 2, 3, 4, 5], description: 'Odd size array' },
    { label: 'Small (4)', value: [4, 3, 2, 1], description: '4 elements' },
  ],
  simulationType: 'array',
  implementations: {
    cpp: {
      language: 'cpp',
      sourceCode: `void reverseArray(int arr[], int n) {
    int left = 0, right = n - 1;
    while (left < right) {
        swap(arr[left], arr[right]);
        left++;
        right--;
    }
}`,
      lineMap: {
        INIT: 2,
        SWAP: 4,
        ADVANCE: 5,
        COMPLETE: 8,
      },
    },
    python: {
      language: 'python',
      sourceCode: `def reverse_array(arr):
    left, right = 0, len(arr) - 1
    while left < right:
        arr[left], arr[right] = arr[right], arr[left]
        left += 1
        right -= 1
    return arr`,
      lineMap: {
        INIT: 2,
        SWAP: 4,
        ADVANCE: 5,
        COMPLETE: 7,
      },
    },
  },
  generateTrace: (input) => generateArrayReverseTrace(Array.isArray(input) ? input : undefined),
};
