import { LearningProgram, LearningStep } from '../../core/types';

export interface BinarySearchInput {
  array: number[];
  target: number;
}

export const binarySearchProgram: LearningProgram = {
  id: 'binary-search',
  slug: 'binary-search',
  title: 'Binary Search',
  category: 'searching',
  difficulty: 'easy',
  simulationType: 'array',
  description: 'An efficient algorithm for finding an item from a sorted list of items. It works by repeatedly dividing in half the portion of the list that could contain the item, until you have narrowed down the possible locations to just one.',
  conceptSummary: 'At every step, binary search compares the target with the middle element. It halves the search space in O(log n) time.',
  timeComplexity: {
    best: 'O(1)',
    average: 'O(log n)',
    worst: 'O(log n)',
  },
  spaceComplexity: 'O(1)',
  tags: ['Searching', 'Divide & Conquer', 'Logarithmic', 'Sorted Array'],
  defaultInput: { array: [2, 5, 8, 12, 16, 23, 38, 56, 72, 91], target: 23 },
  presets: [
    { label: 'Target Found (23)', description: 'Target 23 in the middle-right', value: { array: [2, 5, 8, 12, 16, 23, 38, 56, 72, 91], target: 23 } },
    { label: 'First Element (2)', description: 'Best / Edge case at left end', value: { array: [2, 5, 8, 12, 16, 23, 38, 56, 72, 91], target: 2 } },
    { label: 'Last Element (91)', description: 'Edge case at right end', value: { array: [2, 5, 8, 12, 16, 23, 38, 56, 72, 91], target: 91 } },
    { label: 'Target Not Found (15)', description: 'Value missing from array', value: { array: [2, 5, 8, 12, 16, 23, 38, 56, 72, 91], target: 15 } },
    { label: 'Small (Target 8)', description: 'Compact 5-element array', value: { array: [2, 4, 6, 8, 10], target: 8 } },
  ],
  implementations: {
    cpp: {
      language: 'cpp',
      sourceCode: `#include <iostream>
#include <vector>
using namespace std;

int binarySearch(const vector<int>& arr, int target) {
    int low = 0;
    int high = arr.size() - 1;
    
    while (low <= high) {
        int mid = low + (high - low) / 2;
        
        if (arr[mid] == target) {
            return mid; // Found!
        }
        else if (arr[mid] < target) {
            low = mid + 1; // Discard left half
        }
        else {
            high = mid - 1; // Discard right half
        }
    }
    return -1; // Not found
}

int main() {
    vector<int> arr = {2, 5, 8, 12, 16, 23, 38, 56, 72, 91};
    int target = 23;
    int index = binarySearch(arr, target);
    cout << "Found at index: " << index << endl;
    return 0;
}`,
      lineMap: {
        INIT: 7,
        WHILE_CHECK: 10,
        CALCULATE_MID: 11,
        COMPARE_TARGET: 13,
        FOUND: 14,
        DISCARD_LEFT: 17,
        DISCARD_RIGHT: 20,
        NOT_FOUND: 23,
      },
    },
    c: {
      language: 'c',
      sourceCode: `#include <stdio.h>

int binarySearch(int arr[], int n, int target) {
    int low = 0;
    int high = n - 1;
    
    while (low <= high) {
        int mid = low + (high - low) / 2;
        
        if (arr[mid] == target) {
            return mid;
        }
        else if (arr[mid] < target) {
            low = mid + 1;
        }
        else {
            high = mid - 1;
        }
    }
    return -1;
}

int main() {
    int arr[] = {2, 5, 8, 12, 16, 23, 38, 56, 72, 91};
    int n = sizeof(arr)/sizeof(arr[0]);
    int target = 23;
    int result = binarySearch(arr, n, target);
    printf("Result index: %d\\n", result);
    return 0;
}`,
      lineMap: {
        INIT: 5,
        WHILE_CHECK: 7,
        CALCULATE_MID: 8,
        COMPARE_TARGET: 10,
        FOUND: 11,
        DISCARD_LEFT: 14,
        DISCARD_RIGHT: 17,
        NOT_FOUND: 20,
      },
    },
    python: {
      language: 'python',
      sourceCode: `def binary_search(arr, target):
    low = 0
    high = len(arr) - 1
    
    while low <= high:
        mid = (low + high) // 2
        
        if arr[mid] == target:
            return mid  # Found
        elif arr[mid] < target:
            low = mid + 1  # Discard left
        else:
            high = mid - 1  # Discard right
            
    return -1  # Not found

arr = [2, 5, 8, 12, 16, 23, 38, 56, 72, 91]
target = 23
result = binary_search(arr, target)
print(f"Target {target} found at index: {result}")`,
      lineMap: {
        INIT: 2,
        WHILE_CHECK: 5,
        CALCULATE_MID: 6,
        COMPARE_TARGET: 8,
        FOUND: 9,
        DISCARD_LEFT: 11,
        DISCARD_RIGHT: 13,
        NOT_FOUND: 15,
      },
    },
    java: {
      language: 'java',
      sourceCode: `public class BinarySearch {
    public static int binarySearch(int[] arr, int target) {
        int low = 0;
        int high = arr.length - 1;
        
        while (low <= high) {
            int mid = low + (high - low) / 2;
            
            if (arr[mid] == target) {
                return mid;
            } else if (arr[mid] < target) {
                low = mid + 1;
            } else {
                high = mid - 1;
            }
        }
        return -1;
    }

    public static void main(String[] args) {
        int[] arr = {2, 5, 8, 12, 16, 23, 38, 56, 72, 91};
        int target = 23;
        int idx = binarySearch(arr, target);
        System.out.println("Index: " + idx);
    }
}`,
      lineMap: {
        INIT: 3,
        WHILE_CHECK: 6,
        CALCULATE_MID: 7,
        COMPARE_TARGET: 9,
        FOUND: 10,
        DISCARD_LEFT: 12,
        DISCARD_RIGHT: 14,
        NOT_FOUND: 17,
      },
    },
    javascript: {
      language: 'javascript',
      sourceCode: `function binarySearch(arr, target) {
  let low = 0;
  let high = arr.length - 1;

  while (low <= high) {
    const mid = Math.floor((low + high) / 2);

    if (arr[mid] === target) {
      return mid; // Found
    } else if (arr[mid] < target) {
      low = mid + 1; // Discard left
    } else {
      high = mid - 1; // Discard right
    }
  }
  return -1; // Not found
}

const arr = [2, 5, 8, 12, 16, 23, 38, 56, 72, 91];
const target = 23;
console.log("Index:", binarySearch(arr, target));`,
      lineMap: {
        INIT: 2,
        WHILE_CHECK: 5,
        CALCULATE_MID: 6,
        COMPARE_TARGET: 8,
        FOUND: 9,
        DISCARD_LEFT: 11,
        DISCARD_RIGHT: 13,
        NOT_FOUND: 16,
      },
    },
  },
  generateTrace: (input: any): LearningStep[] => {
    let arr: number[] = [2, 5, 8, 12, 16, 23, 38, 56, 72, 91];
    let target = 23;

    if (input && typeof input === 'object') {
      if (Array.isArray(input.array) && input.array.length > 0) {
        arr = [...input.array].sort((a, b) => a - b);
      }
      if (input.target !== undefined) {
        target = Number(input.target);
      }
    }

    const n = arr.length;
    const steps: LearningStep[] = [];
    let stepId = 1;

    let low = 0;
    let high = n - 1;
    const discardedIndices: number[] = [];

    // Step 1: Init
    steps.push({
      id: stepId++,
      event: 'INIT',
      action: `Initialize Binary Search for Target = ${target}`,
      description: `Starting search in sorted array of ${n} elements. Set initial search boundaries: low = 0, high = ${n - 1}. Target value to find = ${target}.`,
      state: [...arr],
      variables: { target, low: 0, high: n - 1, mid: null },
      output: `Searching for target: ${target} in array of length ${n}`,
      highlights: { discardedIndices: [] },
      pointers: [
        { name: 'low', index: 0, color: '#3b82f6', label: 'LOW' },
        { name: 'high', index: n - 1, color: '#ec4899', label: 'HIGH' },
      ],
    });

    let foundIndex = -1;

    while (low <= high) {
      const mid = Math.floor(low + (high - low) / 2);

      // Step 2: Loop condition check
      steps.push({
        id: stepId++,
        event: 'WHILE_CHECK',
        action: `Check search interval: low (${low}) <= high (${high})`,
        description: `Current search space is valid [index ${low}..${high}]. The subarray has ${high - low + 1} remaining candidates.`,
        state: [...arr],
        variables: { target, low, high, mid: null },
        output: `Search Range: [${low} ... ${high}]`,
        highlights: { discardedIndices: [...discardedIndices] },
        pointers: [
          { name: 'low', index: low, color: '#3b82f6', label: 'LOW' },
          { name: 'high', index: high, color: '#ec4899', label: 'HIGH' },
        ],
      });

      // Step 3: Calculate mid
      steps.push({
        id: stepId++,
        event: 'CALCULATE_MID',
        action: `Calculate mid = ${low} + (${high} - ${low}) / 2 = ${mid}`,
        description: `Calculated middle index mid = ${mid}. The element at mid is arr[${mid}] = ${arr[mid]}.`,
        state: [...arr],
        variables: { target, low, high, mid, 'arr[mid]': arr[mid] },
        output: `Mid index: ${mid}, value: arr[${mid}] = ${arr[mid]}`,
        highlights: {
          indices: [mid],
          discardedIndices: [...discardedIndices],
        },
        pointers: [
          { name: 'low', index: low, color: '#3b82f6', label: 'LOW' },
          { name: 'mid', index: mid, color: '#eab308', label: 'MID' },
          { name: 'high', index: high, color: '#ec4899', label: 'HIGH' },
        ],
      });

      // Step 4: Compare arr[mid] with target
      if (arr[mid] === target) {
        foundIndex = mid;
        steps.push({
          id: stepId++,
          event: 'FOUND',
          action: `Target Found! arr[${mid}] == ${target}`,
          description: `Success! arr[${mid}] is exactly equal to target ${target}. Target found at index ${mid}!`,
          state: [...arr],
          variables: { target, found: true, index: mid },
          output: `\n[✓ Match Found!] Target ${target} located at index ${mid}`,
          highlights: {
            indices: [mid],
            discardedIndices: [...discardedIndices],
          },
          pointers: [
            { name: 'Found', index: mid, color: '#10b981', label: '🎯 FOUND' },
          ],
        });
        break;
      } else if (arr[mid] < target) {
        // Discard left half
        for (let k = low; k <= mid; k++) {
          if (!discardedIndices.includes(k)) discardedIndices.push(k);
        }
        const oldLow = low;
        low = mid + 1;

        steps.push({
          id: stepId++,
          event: 'DISCARD_LEFT',
          action: `arr[${mid}] (${arr[mid]}) < ${target} ➔ Search Right Half`,
          description: `Since arr[mid] (${arr[mid]}) is smaller than target (${target}), target cannot be in the left half [${oldLow}..${mid}]. Discarding left portion and moving low = ${low}.`,
          state: [...arr],
          variables: { target, low, high, mid, discarded: `0..${mid}` },
          output: `Target ${target} > arr[${mid}]. Moving low to ${low}`,
          highlights: {
            discardedIndices: [...discardedIndices],
          },
          pointers: [
            { name: 'low', index: Math.min(low, n - 1), color: '#3b82f6', label: 'LOW' },
            { name: 'high', index: high, color: '#ec4899', label: 'HIGH' },
          ],
        });
      } else {
        // Discard right half
        for (let k = mid; k <= high; k++) {
          if (!discardedIndices.includes(k)) discardedIndices.push(k);
        }
        const oldHigh = high;
        high = mid - 1;

        steps.push({
          id: stepId++,
          event: 'DISCARD_RIGHT',
          action: `arr[${mid}] (${arr[mid]}) > ${target} ➔ Search Left Half`,
          description: `Since arr[mid] (${arr[mid]}) is larger than target (${target}), target cannot be in the right half [${mid}..${oldHigh}]. Discarding right portion and moving high = ${high}.`,
          state: [...arr],
          variables: { target, low, high, mid, discarded: `${mid}..${oldHigh}` },
          output: `Target ${target} < arr[${mid}]. Moving high to ${high}`,
          highlights: {
            discardedIndices: [...discardedIndices],
          },
          pointers: [
            { name: 'low', index: low, color: '#3b82f6', label: 'LOW' },
            { name: 'high', index: Math.max(high, 0), color: '#ec4899', label: 'HIGH' },
          ],
        });
      }
    }

    if (foundIndex === -1) {
      steps.push({
        id: stepId++,
        event: 'NOT_FOUND',
        action: `Target ${target} Not Found in Array`,
        description: `Search completed: low (${low}) > high (${high}). Search interval is empty. Target ${target} does not exist in the array. Returning -1.`,
        state: [...arr],
        variables: { target, found: false, returnCode: -1 },
        output: `\n[✕ Target Not Found] Element ${target} is not in the array. Return -1`,
        highlights: {
          discardedIndices: Array.from({ length: n }, (_, i) => i),
        },
        pointers: [],
      });
    }

    return steps;
  },
};
