import { LearningProgram, LearningStep } from '../../core/types';

interface CallFrame {
  id: number;
  funcName: string;
  paramN: number;
  returnValue?: number;
}

export function generateFibonacciTrace(n: number = 4): LearningStep[] {
  const steps: LearningStep[] = [];
  let stepId = 1;
  let frameCount = 0;
  const stack: CallFrame[] = [];

  function fib(num: number): number {
    const currentFrameId = ++frameCount;
    stack.push({
      id: currentFrameId,
      funcName: `fib(${num})`,
      paramN: num,
    });

    steps.push({
      id: stepId++,
      event: 'CALL_PUSH',
      action: `Call fib(${num})`,
      description: `Push new stack frame fib(${num}) onto the recursion call stack.`,
      state: {
        stack: JSON.parse(JSON.stringify(stack)),
        phase: 'winding',
      },
      variables: { n: num, activeFrame: `fib(${num})` },
      codeLine: 2,
    });

    if (num <= 1) {
      const top = stack[stack.length - 1];
      top.returnValue = num;

      steps.push({
        id: stepId++,
        event: 'BASE_CASE',
        action: `Base Case: fib(${num}) = ${num}`,
        description: `Since n <= 1, return base case value ${num}.`,
        state: {
          stack: JSON.parse(JSON.stringify(stack)),
          phase: 'base_case',
        },
        variables: { n: num, result: num },
        output: `fib(${num}) = ${num}\n`,
        codeLine: 3,
      });

      stack.pop();
      return num;
    }

    const left = fib(num - 1);
    const right = fib(num - 2);
    const total = left + right;

    const top = stack[stack.length - 1];
    top.returnValue = total;

    steps.push({
      id: stepId++,
      event: 'UNWIND_RETURN',
      action: `fib(${num}) = fib(${num - 1}) + fib(${num - 2}) = ${total}`,
      description: `Combine results ${left} + ${right} = ${total} and pop frame fib(${num}).`,
      state: {
        stack: JSON.parse(JSON.stringify(stack)),
        phase: 'unwinding',
      },
      variables: { n: num, left, right, total },
      output: `Computed fib(${num}) = ${total}\n`,
      codeLine: 5,
    });

    stack.pop();
    return total;
  }

  const finalResult = fib(Math.min(5, Math.max(1, n)));

  steps.push({
    id: stepId++,
    event: 'COMPLETE',
    action: `Recursion Complete: fib(${n}) = ${finalResult}`,
    description: `All recursive subproblems resolved. The final Fibonacci number is ${finalResult}.`,
    state: {
      stack: [],
      phase: 'unwinding',
    },
    variables: { n, result: finalResult, complete: true },
    output: `\nFinal Answer: ${finalResult}\n`,
    codeLine: 6,
  });

  return steps;
}

export const fibonacciProgram: LearningProgram = {
  id: 'fibonacci-recursion',
  slug: 'fibonacci-recursion',
  title: 'Fibonacci (Recursion Tree)',
  category: 'recursion',
  difficulty: 'easy',
  description: 'Understand recursive branching and call stack frames with the classic Fibonacci sequence.',
  conceptSummary: 'Shows call stack pushing and unwinding as subproblems fib(n-1) and fib(n-2) resolve.',
  tags: ['recursion', 'fibonacci', 'stack', 'tree'],
  timeComplexity: {
    best: 'O(2^n)',
    average: 'O(2^n)',
    worst: 'O(2^n)',
  },
  spaceComplexity: 'O(n) Call Stack',
  defaultInput: 4,
  presets: [
    { label: 'n = 4 (Default)', value: 4, description: 'Quick 4th fibonacci number' },
    { label: 'n = 3 (Small)', value: 3, description: 'Minimal 3rd fibonacci number' },
    { label: 'n = 5', value: 5, description: '5th fibonacci number' },
  ],
  simulationType: 'recursion',
  implementations: {
    cpp: {
      language: 'cpp',
      sourceCode: `int fib(int n) {
    if (n <= 1) {
        return n;
    }
    return fib(n - 1) + fib(n - 2);
}`,
      lineMap: {
        CALL_PUSH: 1,
        BASE_CASE: 3,
        UNWIND_RETURN: 5,
        COMPLETE: 6,
      },
    },
    python: {
      language: 'python',
      sourceCode: `def fib(n):
    if n <= 1:
        return n
    return fib(n - 1) + fib(n - 2)`,
      lineMap: {
        CALL_PUSH: 1,
        BASE_CASE: 3,
        UNWIND_RETURN: 4,
        COMPLETE: 4,
      },
    },
    java: {
      language: 'java',
      sourceCode: `public class Solution {
    public static int fib(int n) {
        if (n <= 1) {
            return n;
        }
        return fib(n - 1) + fib(n - 2);
    }
}`,
      lineMap: {
        CALL_PUSH: 2,
        BASE_CASE: 4,
        UNWIND_RETURN: 6,
        COMPLETE: 7,
      },
    },
  },
  generateTrace: (input) => generateFibonacciTrace(typeof input === 'number' ? input : 4),
};
