import { LearningProgram, LearningStep } from '../../core/types';

export const linearSearchProgram: LearningProgram = {
  id: 'linear-search',
  slug: 'linear-search',
  title: 'Linear Search',
  category: 'searching',
  difficulty: 'easy',
  simulationType: 'array',
  description: 'Sequentially checks each element of the list until a match is found or the whole list has been searched.',
  conceptSummary: 'Walks through the array element by element from index 0 to n-1. Works on both sorted and unsorted collections.',
  timeComplexity: {
    best: 'O(1)',
    average: 'O(n)',
    worst: 'O(n)',
  },
  spaceComplexity: 'O(1)',
  tags: ['Searching', 'Linear Scan', 'Sequential', 'Unsorted Array'],
  defaultInput: { array: [14, 33, 27, 10, 35, 19, 42, 44], target: 35 },
  presets: [
    { label: 'Target 35 (Index 4)', description: 'Target located mid-array', value: { array: [14, 33, 27, 10, 35, 19, 42, 44], target: 35 } },
    { label: 'Target 14 (First)', description: 'Best case at index 0', value: { array: [14, 33, 27, 10, 35, 19, 42, 44], target: 14 } },
    { label: 'Target 99 (Not Found)', description: 'Element not present', value: { array: [14, 33, 27, 10, 35, 19, 42, 44], target: 99 } },
  ],
  implementations: {
    cpp: {
      language: 'cpp',
      sourceCode: `#include <iostream>
#include <vector>
using namespace std;

int linearSearch(const vector<int>& arr, int target) {
    for (int i = 0; i < arr.size(); i++) {
        if (arr[i] == target) {
            return i; // Target found
        }
    }
    return -1; // Not found
}

int main() {
    vector<int> arr = {14, 33, 27, 10, 35, 19, 42, 44};
    int target = 35;
    int index = linearSearch(arr, target);
    cout << "Index: " << index << endl;
    return 0;
}`,
      lineMap: {
        INIT: 6,
        LOOP_CHECK: 6,
        COMPARE: 7,
        FOUND: 8,
        NOT_FOUND: 11,
      },
    },
    python: {
      language: 'python',
      sourceCode: `def linear_search(arr, target):
    for i in range(len(arr)):
        if arr[i] == target:
            return i  # Found
    return -1  # Not found

arr = [14, 33, 27, 10, 35, 19, 42, 44]
target = 35
print("Found at:", linear_search(arr, target))`,
      lineMap: {
        INIT: 2,
        LOOP_CHECK: 2,
        COMPARE: 3,
        FOUND: 4,
        NOT_FOUND: 5,
      },
    },
  },
  generateTrace: (input: any): LearningStep[] => {
    let arr: number[] = [14, 33, 27, 10, 35, 19, 42, 44];
    let target = 35;

    if (input && typeof input === 'object') {
      if (Array.isArray(input.array) && input.array.length > 0) {
        arr = [...input.array];
      }
      if (input.target !== undefined) {
        target = Number(input.target);
      }
    }

    const n = arr.length;
    const steps: LearningStep[] = [];
    let stepId = 1;
    const visitedIndices: number[] = [];

    steps.push({
      id: stepId++,
      event: 'INIT',
      action: `Initialize Linear Search for Target = ${target}`,
      description: `Starting sequential search in array of ${n} elements. We will inspect indices 0 through ${n - 1}.`,
      state: [...arr],
      variables: { target, i: 0, n },
      output: `Searching for target ${target} in [${arr.join(', ')}]`,
      highlights: { indices: [] },
      pointers: [],
    });

    let foundIdx = -1;

    for (let i = 0; i < n; i++) {
      visitedIndices.push(i);

      steps.push({
        id: stepId++,
        event: 'COMPARE',
        action: `Check arr[${i}] (${arr[i]}) == ${target}`,
        description: `Inspecting index ${i}: value is ${arr[i]}. ${
          arr[i] === target
            ? `Match found! arr[${i}] equals ${target}.`
            : `Not a match (${arr[i]} != ${target}). Moving to next index.`
        }`,
        state: [...arr],
        variables: { target, i, 'arr[i]': arr[i] },
        output: `Checking index ${i}: arr[${i}] = ${arr[i]}`,
        highlights: {
          indices: [i],
          discardedIndices: [...visitedIndices.slice(0, -1)],
        },
        pointers: [{ name: 'i', index: i, color: '#3b82f6', label: `i = ${i}` }],
      });

      if (arr[i] === target) {
        foundIdx = i;
        steps.push({
          id: stepId++,
          event: 'FOUND',
          action: `Target ${target} Found at Index ${i}!`,
          description: `Search successful! Element ${target} found at index ${i}.`,
          state: [...arr],
          variables: { target, found: true, index: i },
          output: `\n[✓ Match Found] Target ${target} located at index ${i}`,
          highlights: {
            indices: [i],
            sortedIndices: [i],
          },
          pointers: [{ name: 'Found', index: i, color: '#10b981', label: '🎯 FOUND' }],
        });
        break;
      }
    }

    if (foundIdx === -1) {
      steps.push({
        id: stepId++,
        event: 'NOT_FOUND',
        action: `Target ${target} Not Found in Array`,
        description: `Checked all ${n} elements. Target ${target} was not found. Returning -1.`,
        state: [...arr],
        variables: { target, found: false, returnVal: -1 },
        output: `\n[✕ Not Found] Target ${target} not in array. Return -1`,
        highlights: { discardedIndices: Array.from({ length: n }, (_, k) => k) },
        pointers: [],
      });
    }

    return steps;
  },
};
