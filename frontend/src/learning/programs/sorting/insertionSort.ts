import { LearningProgram, LearningStep } from '../../core/types';

export const insertionSortProgram: LearningProgram = {
  id: 'insertion-sort',
  slug: 'insertion-sort',
  title: 'Insertion Sort',
  category: 'sorting',
  difficulty: 'easy',
  simulationType: 'array',
  description: 'Iteratively builds a sorted portion of the array one element at a time by comparing the current element with previously sorted elements and inserting it into its correct position.',
  conceptSummary: 'Similar to sorting playing cards in your hands: pick the next card and insert it into its proper place among already sorted cards.',
  timeComplexity: {
    best: 'O(n)',
    average: 'O(n²)',
    worst: 'O(n²)',
  },
  spaceComplexity: 'O(1)',
  tags: ['Sorting', 'Insertion', 'Online', 'In-Place', 'Stable'],
  defaultInput: [12, 11, 13, 5, 6],
  presets: [
    { label: 'Default', description: 'Standard 5 numbers', value: [12, 11, 13, 5, 6] },
    { label: 'Nearly Sorted', description: 'Quick insertion demo', value: [2, 4, 6, 8, 3] },
    { label: 'Reverse', description: 'Descending array', value: [9, 7, 5, 3, 1] },
  ],
  implementations: {
    cpp: {
      language: 'cpp',
      sourceCode: `#include <iostream>
#include <vector>
using namespace std;

void insertionSort(vector<int>& arr) {
    int n = arr.size();
    for (int i = 1; i < n; i++) {
        int key = arr[i];
        int j = i - 1;
        while (j >= 0 && arr[j] > key) {
            arr[j + 1] = arr[j];
            j = j - 1;
        }
        arr[j + 1] = key;
    }
}

int main() {
    vector<int> arr = {12, 11, 13, 5, 6};
    insertionSort(arr);
    for(int x : arr) cout << x << " ";
    return 0;
}`,
      lineMap: {
        INIT: 6,
        OUTER_LOOP: 8,
        PICK_KEY: 9,
        SHIFT_CHECK: 11,
        SHIFT_ELEMENT: 12,
        INSERT_KEY: 15,
        COMPLETE: 21,
      },
    },
    python: {
      language: 'python',
      sourceCode: `def insertion_sort(arr):
    for i in range(1, len(arr)):
        key = arr[i]
        j = i - 1
        while j >= 0 and arr[j] > key:
            arr[j + 1] = arr[j]
            j -= 1
        arr[j + 1] = key
    return arr

arr = [12, 11, 13, 5, 6]
print("Sorted:", insertion_sort(arr))`,
      lineMap: {
        INIT: 2,
        OUTER_LOOP: 2,
        PICK_KEY: 3,
        SHIFT_CHECK: 5,
        SHIFT_ELEMENT: 6,
        INSERT_KEY: 8,
        COMPLETE: 12,
      },
    },
  },
  generateTrace: (input: number[]): LearningStep[] => {
    const raw = Array.isArray(input) && input.length > 0 ? [...input] : [12, 11, 13, 5, 6];
    const arr = [...raw];
    const n = arr.length;
    const steps: LearningStep[] = [];
    let stepId = 1;

    steps.push({
      id: stepId++,
      event: 'INIT',
      action: 'Initialize Insertion Sort',
      description: `First element arr[0] (${arr[0]}) is already considered trivially sorted. We start from index 1.`,
      state: [...arr],
      variables: { n, i: 1 },
      output: `Input: [${arr.join(', ')}]`,
      highlights: { sortedIndices: [0] },
      pointers: [{ name: 'Sorted', index: 0, color: '#10b981', label: 'Sorted prefix' }],
    });

    for (let i = 1; i < n; i++) {
      const key = arr[i];
      let j = i - 1;

      steps.push({
        id: stepId++,
        event: 'PICK_KEY',
        action: `Pick key = arr[${i}] (${key})`,
        description: `Inspecting element at index ${i}: key = ${key}. We will insert it into the sorted subarray [0..${i - 1}].`,
        state: [...arr],
        variables: { i, key, j },
        output: `\nInspecting key: ${key} at index ${i}`,
        highlights: {
          indices: [i],
          sortedIndices: Array.from({ length: i }, (_, k) => k),
        },
        pointers: [
          { name: 'key', index: i, color: '#f59e0b', label: `Key (${key})` },
          { name: 'j', index: j, color: '#3b82f6', label: `j = ${j}` },
        ],
      });

      while (j >= 0 && arr[j] > key) {
        steps.push({
          id: stepId++,
          event: 'SHIFT_CHECK',
          action: `arr[${j}] (${arr[j]}) > key (${key}) ➔ Shift Right`,
          description: `Since arr[${j}] (${arr[j]}) is greater than key (${key}), shift arr[${j}] to index ${j + 1}.`,
          state: [...arr],
          variables: { i, key, j, 'arr[j]': arr[j] },
          output: `Shifting ${arr[j]} from index ${j} to ${j + 1}`,
          highlights: {
            compareIndices: [j, j + 1],
          },
          pointers: [
            { name: 'j', index: j, color: '#ec4899', label: `Shift ${arr[j]} ➔` },
          ],
        });

        arr[j + 1] = arr[j];
        j = j - 1;
      }

      arr[j + 1] = key;
      steps.push({
        id: stepId++,
        event: 'INSERT_KEY',
        action: `Insert key ${key} at index ${j + 1}`,
        description: `Found correct spot! Insert key ${key} at index ${j + 1}. Sorted prefix is now [0..${i}].`,
        state: [...arr],
        variables: { i, key, insertedAt: j + 1 },
        output: `Inserted key ${key} at index ${j + 1}`,
        highlights: {
          sortedIndices: Array.from({ length: i + 1 }, (_, k) => k),
          indices: [j + 1],
        },
        pointers: [
          { name: 'Inserted', index: j + 1, color: '#10b981', label: `✓ Key ${key}` },
        ],
      });
    }

    steps.push({
      id: stepId++,
      event: 'COMPLETE',
      action: 'Insertion Sort Complete',
      description: `All elements are inserted in proper sorted order: [${arr.join(', ')}].`,
      state: [...arr],
      variables: { complete: true },
      output: `\nFinal Output: ${arr.join(' ')}`,
      highlights: { sortedIndices: Array.from({ length: n }, (_, k) => k) },
      pointers: [],
    });

    return steps;
  },
};
