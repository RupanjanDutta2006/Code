import { LearningProgram, LearningStep } from '../../core/types';

export const factorialProgram: LearningProgram = {
  id: 'factorial-recursion',
  slug: 'factorial-recursion',
  title: 'Factorial (Recursion Stack)',
  category: 'recursion',
  difficulty: 'easy',
  simulationType: 'recursion',
  description: 'Calculates the factorial of a number n (n!) using recursive function calls, illustrating how the call stack grows during the winding phase and shrinks during the unwinding phase.',
  conceptSummary: 'Base case: 1! = 1. Recursive case: n! = n * (n - 1)!. Watch call frames push and pop on the call stack.',
  timeComplexity: {
    best: 'O(n)',
    average: 'O(n)',
    worst: 'O(n)',
  },
  spaceComplexity: 'O(n)',
  tags: ['Recursion', 'Call Stack', 'Math', 'Factorial'],
  defaultInput: 4,
  presets: [
    { label: 'n = 4 (4! = 24)', description: 'Standard 4-frame recursion', value: 4 },
    { label: 'n = 3 (3! = 6)', description: 'Quick 3-frame demo', value: 3 },
    { label: 'n = 5 (5! = 120)', description: '5-frame recursion', value: 5 },
  ],
  implementations: {
    cpp: {
      language: 'cpp',
      sourceCode: `#include <iostream>
using namespace std;

int factorial(int n) {
    if (n <= 1) {
        return 1; // Base case
    }
    return n * factorial(n - 1); // Recursive call
}

int main() {
    int n = 4;
    int result = factorial(n);
    cout << "Factorial of " << n << " = " << result << endl;
    return 0;
}`,
      lineMap: {
        ENTER_FUNCTION: 5,
        CHECK_BASE: 6,
        BASE_RETURN: 7,
        RECURSIVE_CALL: 9,
        RETURN_VALUE: 9,
        COMPLETE: 15,
      },
    },
    python: {
      language: 'python',
      sourceCode: `def factorial(n):
    if n <= 1:
        return 1  # Base case
    return n * factorial(n - 1)  # Recursive call

n = 4
result = factorial(n)
print(f"{n}! = {result}")`,
      lineMap: {
        ENTER_FUNCTION: 1,
        CHECK_BASE: 2,
        BASE_RETURN: 3,
        RECURSIVE_CALL: 4,
        RETURN_VALUE: 4,
        COMPLETE: 8,
      },
    },
  },
  generateTrace: (input: number): LearningStep[] => {
    const n = typeof input === 'number' && input >= 1 && input <= 6 ? input : 4;
    const steps: LearningStep[] = [];
    let stepId = 1;

    interface CallFrame {
      id: number;
      funcName: string;
      paramN: number;
      status: 'active' | 'waiting' | 'returned';
      returnValue?: number;
    }

    const callStack: CallFrame[] = [];

    // Push frames down to base case
    for (let k = n; k >= 1; k--) {
      const frame: CallFrame = {
        id: k,
        funcName: `factorial(${k})`,
        paramN: k,
        status: 'active',
      };
      callStack.push(frame);

      steps.push({
        id: stepId++,
        event: 'ENTER_FUNCTION',
        action: `Call factorial(${k}) ➔ Push Call Frame to Stack`,
        description: `Calling factorial(${k}). Allocating new call frame on top of the call stack with local variable n = ${k}.`,
        state: { stack: JSON.parse(JSON.stringify(callStack)), currentN: k, phase: 'winding' },
        variables: { n: k, call: `factorial(${k})`, stackDepth: callStack.length },
        output: `➔ Enter factorial(${k}) [Stack depth: ${callStack.length}]`,
        pointers: [{ name: 'Frame', index: callStack.length - 1, color: '#3b82f6', label: `factorial(${k})` }],
      });

      if (k === 1) {
        // Base case reached
        frame.status = 'returned';
        frame.returnValue = 1;

        steps.push({
          id: stepId++,
          event: 'BASE_RETURN',
          action: `Base Case Reached: factorial(1) returns 1`,
          description: `n = 1 satisfies base condition (n <= 1). Returning 1 directly without making any further recursive calls.`,
          state: { stack: JSON.parse(JSON.stringify(callStack)), currentN: 1, phase: 'base_case' },
          variables: { n: 1, returned: 1, isBaseCase: true },
          output: `Base Case: factorial(1) = 1`,
          pointers: [{ name: 'Base Return', index: callStack.length - 1, color: '#10b981', label: 'Returns 1' }],
        });
      } else {
        frame.status = 'waiting';
        steps.push({
          id: stepId++,
          event: 'RECURSIVE_CALL',
          action: `factorial(${k}) waits for factorial(${k - 1})`,
          description: `factorial(${k}) needs the result of factorial(${k - 1}) to compute ${k} * factorial(${k - 1}). Current frame pauses on stack.`,
          state: { stack: JSON.parse(JSON.stringify(callStack)), currentN: k, phase: 'winding' },
          variables: { n: k, waitingFor: `factorial(${k - 1})` },
          output: `factorial(${k}) paused waiting for factorial(${k - 1})`,
          pointers: [],
        });
      }
    }

    // Unwinding phase
    let currentVal = 1;
    for (let k = 2; k <= n; k++) {
      const parentFrame = callStack.find((f) => f.paramN === k)!;
      const returnedFromChild = currentVal;
      currentVal = k * returnedFromChild;
      parentFrame.status = 'returned';
      parentFrame.returnValue = currentVal;

      steps.push({
        id: stepId++,
        event: 'RETURN_VALUE',
        action: `Unwind: factorial(${k}) computes ${k} * ${returnedFromChild} = ${currentVal}`,
        description: `Child call returned ${returnedFromChild}. Multiplying by n (${k}) gives ${currentVal}. Popping call frame from stack.`,
        state: { stack: JSON.parse(JSON.stringify(callStack)), currentN: k, phase: 'unwinding' },
        variables: { n: k, childReturn: returnedFromChild, computed: currentVal },
        output: `factorial(${k}) = ${k} * ${returnedFromChild} = ${currentVal}`,
        pointers: [{ name: 'Return', index: callStack.length - 1, color: '#10b981', label: `Returns ${currentVal}` }],
      });

      callStack.pop();
    }

    steps.push({
      id: stepId++,
      event: 'COMPLETE',
      action: `Factorial Recursion Complete: ${n}! = ${currentVal}`,
      description: `All stack frames have popped and unwound. Final answer is ${currentVal}.`,
      state: { stack: [], currentN: n, phase: 'complete' },
      variables: { result: currentVal, complete: true },
      output: `\n[✓ Final Result] ${n}! = ${currentVal}`,
      pointers: [],
    });

    return steps;
  },
};
