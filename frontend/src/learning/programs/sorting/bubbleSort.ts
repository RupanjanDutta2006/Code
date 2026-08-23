import { LearningProgram, LearningStep } from '../../core/types';

export const bubbleSortProgram: LearningProgram = {
  id: 'bubble-sort',
  slug: 'bubble-sort',
  title: 'Bubble Sort',
  category: 'sorting',
  difficulty: 'easy',
  simulationType: 'array',
  description: 'Repeatedly steps through the list, compares adjacent elements, and swaps them if they are in the wrong order. The pass through the list is repeated until the list is sorted.',
  conceptSummary: 'With each pass, the largest unsorted element "bubbles up" to its correct position at the end of the array.',
  timeComplexity: {
    best: 'O(n)',
    average: 'O(n²)',
    worst: 'O(n²)',
  },
  spaceComplexity: 'O(1)',
  tags: ['Sorting', 'Comparison', 'Quadratic', 'In-Place', 'Stable'],
  defaultInput: [34, 25, 12, 22, 11],
  presets: [
    { label: 'Default', description: 'Standard unsorted array', value: [34, 25, 12, 22, 11] },
    { label: 'Small', description: 'Quick 4-element array', value: [5, 2, 8, 1] },
    { label: 'Reverse Sorted', description: 'Worst case scenario', value: [50, 40, 30, 20, 10] },
    { label: 'Already Sorted', description: 'Best case scenario', value: [10, 20, 30, 40, 50] },
    { label: 'Duplicates', description: 'Testing stability with duplicates', value: [25, 12, 25, 7, 12] },
  ],
  implementations: {
    cpp: {
      language: 'cpp',
      sourceCode: `#include <iostream>
#include <vector>
using namespace std;

void bubbleSort(vector<int>& arr) {
    int n = arr.size();
    for (int i = 0; i < n - 1; i++) {
        bool swapped = false;
        for (int j = 0; j < n - i - 1; j++) {
            if (arr[j] > arr[j + 1]) {
                swap(arr[j], arr[j + 1]);
                swapped = true;
            }
        }
        if (!swapped) break;
    }
}

int main() {
    vector<int> arr = {34, 25, 12, 22, 11};
    bubbleSort(arr);
    for (int x : arr) cout << x << " ";
    return 0;
}`,
      lineMap: {
        INIT: 6,
        OUTER_LOOP: 8,
        INNER_LOOP: 10,
        COMPARE: 11,
        SWAP: 12,
        CHECK_SWAPPED: 16,
        ELEMENT_SORTED: 10,
        COMPLETE: 22,
      },
    },
    c: {
      language: 'c',
      sourceCode: `#include <stdio.h>
#include <stdbool.h>

void bubbleSort(int arr[], int n) {
    for (int i = 0; i < n - 1; i++) {
        bool swapped = false;
        for (int j = 0; j < n - i - 1; j++) {
            if (arr[j] > arr[j + 1]) {
                int temp = arr[j];
                arr[j] = arr[j + 1];
                arr[j + 1] = temp;
                swapped = true;
            }
        }
        if (!swapped) break;
    }
}

int main() {
    int arr[] = {34, 25, 12, 22, 11};
    int n = sizeof(arr)/sizeof(arr[0]);
    bubbleSort(arr, n);
    for(int i=0; i<n; i++) printf("%d ", arr[i]);
    return 0;
}`,
      lineMap: {
        INIT: 5,
        OUTER_LOOP: 6,
        INNER_LOOP: 8,
        COMPARE: 9,
        SWAP: 10,
        CHECK_SWAPPED: 16,
        ELEMENT_SORTED: 8,
        COMPLETE: 23,
      },
    },
    python: {
      language: 'python',
      sourceCode: `def bubble_sort(arr):
    n = len(arr)
    for i in range(n - 1):
        swapped = False
        for j in range(n - i - 1):
            if arr[j] > arr[j + 1]:
                arr[j], arr[j + 1] = arr[j + 1], arr[j]
                swapped = True
        if not swapped:
            break
    return arr

arr = [34, 25, 12, 22, 11]
sorted_arr = bubble_sort(arr)
print("Sorted array:", sorted_arr)`,
      lineMap: {
        INIT: 2,
        OUTER_LOOP: 3,
        INNER_LOOP: 5,
        COMPARE: 6,
        SWAP: 7,
        CHECK_SWAPPED: 9,
        ELEMENT_SORTED: 5,
        COMPLETE: 15,
      },
    },
    java: {
      language: 'java',
      sourceCode: `import java.util.Arrays;

public class BubbleSort {
    public static void bubbleSort(int[] arr) {
        int n = arr.length;
        for (int i = 0; i < n - 1; i++) {
            boolean swapped = false;
            for (int j = 0; j < n - i - 1; j++) {
                if (arr[j] > arr[j + 1]) {
                    int temp = arr[j];
                    arr[j] = arr[j + 1];
                    arr[j + 1] = temp;
                    swapped = true;
                }
            }
            if (!swapped) break;
        }
    }

    public static void main(String[] args) {
        int[] arr = {34, 25, 12, 22, 11};
        bubbleSort(arr);
        System.out.println(Arrays.toString(arr));
    }
}`,
      lineMap: {
        INIT: 6,
        OUTER_LOOP: 7,
        INNER_LOOP: 9,
        COMPARE: 10,
        SWAP: 11,
        CHECK_SWAPPED: 17,
        ELEMENT_SORTED: 9,
        COMPLETE: 24,
      },
    },
    javascript: {
      language: 'javascript',
      sourceCode: `function bubbleSort(arr) {
  const n = arr.length;
  for (let i = 0; i < n - 1; i++) {
    let swapped = false;
    for (let j = 0; j < n - i - 1; j++) {
      if (arr[j] > arr[j + 1]) {
        [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
        swapped = true;
      }
    }
    if (!swapped) break;
  }
  return arr;
}

const arr = [34, 25, 12, 22, 11];
console.log("Sorted:", bubbleSort(arr));`,
      lineMap: {
        INIT: 2,
        OUTER_LOOP: 3,
        INNER_LOOP: 5,
        COMPARE: 6,
        SWAP: 7,
        CHECK_SWAPPED: 11,
        ELEMENT_SORTED: 5,
        COMPLETE: 18,
      },
    },
  },
  generateTrace: (input: number[]): LearningStep[] => {
    const rawArr = Array.isArray(input) && input.length > 0 ? [...input] : [34, 25, 12, 22, 11];
    const arr = [...rawArr];
    const n = arr.length;
    const steps: LearningStep[] = [];
    let stepId = 1;
    const sortedIndices: number[] = [];

    // Step 1: Initial state
    steps.push({
      id: stepId++,
      event: 'INIT',
      action: 'Initialize Bubble Sort',
      description: `Starting Bubble Sort with array of ${n} elements: [${arr.join(', ')}]. We will make passes to bubble larger elements to the right.`,
      state: [...arr],
      variables: { n, i: 0, j: 0, swapped: false },
      output: `Input Array: [${arr.join(', ')}]`,
      highlights: { sortedIndices: [] },
      pointers: [],
    });

    for (let i = 0; i < n - 1; i++) {
      let swapped = false;
      steps.push({
        id: stepId++,
        event: 'OUTER_LOOP',
        action: `Start Pass ${i + 1}`,
        description: `Pass ${i + 1} begins. We will compare adjacent elements up to index ${n - i - 1}.`,
        state: [...arr],
        variables: { n, i, j: 0, swapped: false },
        output: `\n--- Starting Pass ${i + 1} ---`,
        highlights: { sortedIndices: [...sortedIndices] },
        pointers: [{ name: 'i', index: i, color: '#8b5cf6', label: `Pass ${i + 1}` }],
      });

      for (let j = 0; j < n - i - 1; j++) {
        // Compare step
        steps.push({
          id: stepId++,
          event: 'COMPARE',
          action: `Compare arr[${j}] (${arr[j]}) and arr[${j + 1}] (${arr[j + 1]})`,
          description: `Comparing adjacent elements: arr[${j}] = ${arr[j]} and arr[${j + 1}] = ${arr[j + 1]}. ${
            arr[j] > arr[j + 1]
              ? `Since ${arr[j]} > ${arr[j + 1]}, a swap is needed.`
              : `Since ${arr[j]} <= ${arr[j + 1]}, they are in correct relative order (no swap).`
          }`,
          state: [...arr],
          variables: { i, j, 'arr[j]': arr[j], 'arr[j+1]': arr[j + 1], swapped },
          output: `Comparing arr[${j}] (${arr[j]}) > arr[${j + 1}] (${arr[j + 1]})`,
          highlights: {
            compareIndices: [j, j + 1],
            sortedIndices: [...sortedIndices],
          },
          pointers: [
            { name: 'j', index: j, color: '#3b82f6', label: `j = ${j}` },
            { name: 'j+1', index: j + 1, color: '#06b6d4', label: `j+1 = ${j + 1}` },
          ],
        });

        if (arr[j] > arr[j + 1]) {
          // Swap step
          const temp = arr[j];
          arr[j] = arr[j + 1];
          arr[j + 1] = temp;
          swapped = true;

          steps.push({
            id: stepId++,
            event: 'SWAP',
            action: `Swap arr[${j}] and arr[${j + 1}]`,
            description: `Swapped values ${temp} and ${arr[j]}. The array state is now: [${arr.join(', ')}].`,
            state: [...arr],
            variables: { i, j, temp, swapped: true },
            output: `Swapped: [${arr[j]}, ${arr[j + 1]}]`,
            highlights: {
              swapIndices: [j, j + 1],
              sortedIndices: [...sortedIndices],
            },
            pointers: [
              { name: 'j', index: j, color: '#ec4899', label: `Swapped` },
              { name: 'j+1', index: j + 1, color: '#ec4899', label: `Swapped` },
            ],
          });
        }
      }

      // Mark the bubbled element as sorted
      sortedIndices.push(n - i - 1);
      steps.push({
        id: stepId++,
        event: 'ELEMENT_SORTED',
        action: `Placed ${arr[n - i - 1]} at final index ${n - i - 1}`,
        description: `Pass ${i + 1} complete. Value ${arr[n - i - 1]} is now permanently settled in its sorted position.`,
        state: [...arr],
        variables: { i, sortedPosition: n - i - 1, swapped },
        output: `Element ${arr[n - i - 1]} locked at index ${n - i - 1}`,
        highlights: { sortedIndices: [...sortedIndices] },
        pointers: [{ name: 'Sorted', index: n - i - 1, color: '#10b981', label: '✓ Sorted' }],
      });

      if (!swapped) {
        steps.push({
          id: stepId++,
          event: 'CHECK_SWAPPED',
          action: 'Early Termination: Array Already Sorted',
          description: 'No swaps occurred during this entire pass. The array is already completely sorted! Breaking early for O(n) performance.',
          state: [...arr],
          variables: { swapped: false, earlyExit: true },
          output: `\nEarly exit optimization: No swaps detected.`,
          highlights: { sortedIndices: Array.from({ length: n }, (_, idx) => idx) },
          pointers: [],
        });
        break;
      }
    }

    // Final complete step
    steps.push({
      id: stepId++,
      event: 'COMPLETE',
      action: 'Sorting Complete',
      description: `Bubble Sort finished successfully! Final sorted array is: [${arr.join(', ')}].`,
      state: [...arr],
      variables: { complete: true, totalElements: n },
      output: `\nFinal Output: ${arr.join(' ')}\n[✓ Sorting Complete]`,
      highlights: { sortedIndices: Array.from({ length: n }, (_, idx) => idx) },
      pointers: [],
    });

    return steps;
  },
};
