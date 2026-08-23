import { LearningProgram, LearningStep } from '../../core/types';

export const selectionSortProgram: LearningProgram = {
  id: 'selection-sort',
  slug: 'selection-sort',
  title: 'Selection Sort',
  category: 'sorting',
  difficulty: 'easy',
  simulationType: 'array',
  description: 'Selects the smallest element from an unsorted list in each iteration and places that element at the beginning of the unsorted list.',
  conceptSummary: 'In each pass, find the minimum element in the remaining unsorted subarray and swap it into its correct sorted index.',
  timeComplexity: {
    best: 'O(n²)',
    average: 'O(n²)',
    worst: 'O(n²)',
  },
  spaceComplexity: 'O(1)',
  tags: ['Sorting', 'Comparison', 'Quadratic', 'In-Place'],
  defaultInput: [64, 25, 12, 22, 11],
  presets: [
    { label: 'Default', description: 'Standard unsorted array', value: [64, 25, 12, 22, 11] },
    { label: 'Reverse', description: 'Descending array', value: [50, 40, 30, 20, 10] },
    { label: 'Small', description: '4 elements', value: [29, 10, 14, 37] },
  ],
  implementations: {
    cpp: {
      language: 'cpp',
      sourceCode: `#include <iostream>
#include <vector>
using namespace std;

void selectionSort(vector<int>& arr) {
    int n = arr.size();
    for (int i = 0; i < n - 1; i++) {
        int min_idx = i;
        for (int j = i + 1; j < n; j++) {
            if (arr[j] < arr[min_idx]) {
                min_idx = j;
            }
        }
        if (min_idx != i) {
            swap(arr[i], arr[min_idx]);
        }
    }
}

int main() {
    vector<int> arr = {64, 25, 12, 22, 11};
    selectionSort(arr);
    for (int x : arr) cout << x << " ";
    return 0;
}`,
      lineMap: {
        INIT: 6,
        OUTER_LOOP: 8,
        INNER_LOOP: 10,
        COMPARE: 11,
        UPDATE_MIN: 12,
        SWAP: 16,
        COMPLETE: 22,
      },
    },
    python: {
      language: 'python',
      sourceCode: `def selection_sort(arr):
    n = len(arr)
    for i in range(n - 1):
        min_idx = i
        for j in range(i + 1, n):
            if arr[j] < arr[min_idx]:
                min_idx = j
        if min_idx != i:
            arr[i], arr[min_idx] = arr[min_idx], arr[i]
    return arr

arr = [64, 25, 12, 22, 11]
print("Sorted:", selection_sort(arr))`,
      lineMap: {
        INIT: 2,
        OUTER_LOOP: 3,
        INNER_LOOP: 5,
        COMPARE: 6,
        UPDATE_MIN: 7,
        SWAP: 9,
        COMPLETE: 13,
      },
    },
  },
  generateTrace: (input: number[]): LearningStep[] => {
    const raw = Array.isArray(input) && input.length > 0 ? [...input] : [64, 25, 12, 22, 11];
    const arr = [...raw];
    const n = arr.length;
    const steps: LearningStep[] = [];
    let stepId = 1;
    const sortedIndices: number[] = [];

    steps.push({
      id: stepId++,
      event: 'INIT',
      action: 'Initialize Selection Sort',
      description: `Starting Selection Sort on array of ${n} elements.`,
      state: [...arr],
      variables: { n, i: 0 },
      output: `Input: [${arr.join(', ')}]`,
      highlights: { sortedIndices: [] },
      pointers: [],
    });

    for (let i = 0; i < n - 1; i++) {
      let min_idx = i;
      steps.push({
        id: stepId++,
        event: 'OUTER_LOOP',
        action: `Pass ${i + 1}: Assume min is at index ${i} (${arr[i]})`,
        description: `Starting pass for position ${i}. Initially assume minimum is arr[${i}] = ${arr[i]}.`,
        state: [...arr],
        variables: { i, min_idx: i, 'arr[min_idx]': arr[i] },
        output: `\nPass ${i + 1}: Finding minimum starting from index ${i}`,
        highlights: { sortedIndices: [...sortedIndices], indices: [i] },
        pointers: [
          { name: 'i', index: i, color: '#8b5cf6', label: `i = ${i}` },
          { name: 'min', index: min_idx, color: '#f59e0b', label: 'Min candidate' },
        ],
      });

      for (let j = i + 1; j < n; j++) {
        steps.push({
          id: stepId++,
          event: 'COMPARE',
          action: `Compare arr[${j}] (${arr[j]}) < arr[${min_idx}] (${arr[min_idx]})`,
          description: `Scanning index ${j}: value = ${arr[j]}. Comparing with current minimum ${arr[min_idx]}.`,
          state: [...arr],
          variables: { i, j, min_idx, 'arr[j]': arr[j], 'arr[min_idx]': arr[min_idx] },
          output: `Comparing arr[${j}] (${arr[j]}) with min (${arr[min_idx]})`,
          highlights: {
            compareIndices: [j, min_idx],
            sortedIndices: [...sortedIndices],
          },
          pointers: [
            { name: 'min', index: min_idx, color: '#f59e0b', label: 'Min' },
            { name: 'j', index: j, color: '#3b82f6', label: `j = ${j}` },
          ],
        });

        if (arr[j] < arr[min_idx]) {
          min_idx = j;
          steps.push({
            id: stepId++,
            event: 'UPDATE_MIN',
            action: `New minimum found at index ${j} (${arr[j]})`,
            description: `Found smaller element! Update minimum index to ${j} (value = ${arr[j]}).`,
            state: [...arr],
            variables: { i, j, min_idx, 'arr[min_idx]': arr[j] },
            output: `New minimum found: ${arr[j]} at index ${j}`,
            highlights: {
              indices: [min_idx],
              sortedIndices: [...sortedIndices],
            },
            pointers: [
              { name: 'min', index: min_idx, color: '#10b981', label: `New Min (${arr[min_idx]})` },
            ],
          });
        }
      }

      if (min_idx !== i) {
        const temp = arr[i];
        arr[i] = arr[min_idx];
        arr[min_idx] = temp;

        steps.push({
          id: stepId++,
          event: 'SWAP',
          action: `Swap arr[${i}] and arr[${min_idx}]`,
          description: `Swap minimum value ${arr[i]} into its correct sorted position at index ${i}.`,
          state: [...arr],
          variables: { i, min_idx, swapped: true },
          output: `Swapped: arr[${i}] <-> arr[${min_idx}]`,
          highlights: {
            swapIndices: [i, min_idx],
            sortedIndices: [...sortedIndices],
          },
          pointers: [],
        });
      }

      sortedIndices.push(i);
    }
    sortedIndices.push(n - 1);

    steps.push({
      id: stepId++,
      event: 'COMPLETE',
      action: 'Selection Sort Complete',
      description: `All elements are sorted in ascending order: [${arr.join(', ')}].`,
      state: [...arr],
      variables: { complete: true },
      output: `\nFinal Sorted Output: ${arr.join(' ')}`,
      highlights: { sortedIndices: Array.from({ length: n }, (_, i) => i) },
      pointers: [],
    });

    return steps;
  },
};
