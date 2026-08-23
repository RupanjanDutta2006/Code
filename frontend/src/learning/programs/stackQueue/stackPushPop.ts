import { LearningProgram, LearningStep } from '../../core/types';

export const stackPushPopProgram: LearningProgram = {
  id: 'stack-push-pop',
  slug: 'stack-push-pop',
  title: 'Stack (Push & Pop)',
  category: 'stack-queue',
  difficulty: 'easy',
  simulationType: 'stack',
  description: 'Demonstrates a Last-In, First-Out (LIFO) stack data structure with push, peek, and pop operations.',
  conceptSummary: 'Elements are added and removed from the same end, called the TOP. The last item pushed is the first item popped.',
  timeComplexity: {
    best: 'O(1)',
    average: 'O(1)',
    worst: 'O(1)',
  },
  spaceComplexity: 'O(n)',
  tags: ['Stack', 'LIFO', 'Data Structure', 'Push', 'Pop'],
  defaultInput: [10, 20, 30],
  presets: [
    { label: 'Push 10, 20, 30', description: 'Standard push and pop cycle', value: [10, 20, 30] },
    { label: '5 Items', description: 'Stack with 5 operations', value: [5, 15, 25, 35, 45] },
  ],
  implementations: {
    cpp: {
      language: 'cpp',
      sourceCode: `#include <iostream>
#include <stack>
using namespace std;

int main() {
    stack<int> s;
    
    // Push operations
    s.push(10);
    s.push(20);
    s.push(30);
    
    cout << "Top element: " << s.top() << endl;
    
    // Pop operations
    while (!s.empty()) {
        cout << "Popping: " << s.top() << endl;
        s.pop();
    }
    return 0;
}`,
      lineMap: {
        INIT: 6,
        PUSH: 9,
        PEEK: 13,
        POP_CHECK: 16,
        POP: 18,
        COMPLETE: 20,
      },
    },
    python: {
      language: 'python',
      sourceCode: `stack = []

# Push operations
stack.append(10)
stack.append(20)
stack.append(30)

print("Top element:", stack[-1])

# Pop operations
while len(stack) > 0:
    val = stack.pop()
    print("Popping:", val)`,
      lineMap: {
        INIT: 1,
        PUSH: 4,
        PEEK: 8,
        POP_CHECK: 11,
        POP: 12,
        COMPLETE: 13,
      },
    },
  },
  generateTrace: (input: number[]): LearningStep[] => {
    const raw = Array.isArray(input) && input.length > 0 ? [...input] : [10, 20, 30];
    const steps: LearningStep[] = [];
    let stepId = 1;
    const currentStack: number[] = [];

    // Init
    steps.push({
      id: stepId++,
      event: 'INIT',
      action: 'Initialize Empty Stack',
      description: 'Created a new empty stack. TOP pointer is currently null.',
      state: { stack: [] },
      variables: { size: 0, top: 'null' },
      output: 'Initialized empty stack (Capacity: Dynamic)',
      pointers: [],
    });

    // Pushes
    for (const val of raw) {
      currentStack.push(val);
      steps.push({
        id: stepId++,
        event: 'PUSH',
        action: `Push ${val} onto Stack`,
        description: `Pushed value ${val} onto top of the stack. New stack size is ${currentStack.length}.`,
        state: { stack: [...currentStack] },
        variables: { size: currentStack.length, top: val, operation: `push(${val})` },
        output: `push(${val}) ➔ Top is now ${val}`,
        pointers: [{ name: 'TOP', index: currentStack.length - 1, color: '#3b82f6', label: `TOP (${val})` }],
      });
    }

    // Peek
    if (currentStack.length > 0) {
      const topVal = currentStack[currentStack.length - 1];
      steps.push({
        id: stepId++,
        event: 'PEEK',
        action: `Peek / Top: ${topVal}`,
        description: `Inspecting top element without removing it: s.top() = ${topVal}.`,
        state: { stack: [...currentStack] },
        variables: { top: topVal },
        output: `s.top() = ${topVal}`,
        pointers: [{ name: 'TOP', index: currentStack.length - 1, color: '#10b981', label: `TOP = ${topVal}` }],
      });
    }

    // Pops
    while (currentStack.length > 0) {
      const popped = currentStack.pop()!;
      steps.push({
        id: stepId++,
        event: 'POP',
        action: `Pop ${popped} from Stack`,
        description: `Popped top element ${popped} from the stack (LIFO). Remaining stack size is ${currentStack.length}.`,
        state: { stack: [...currentStack], poppedValue: popped },
        variables: {
          popped,
          size: currentStack.length,
          top: currentStack.length > 0 ? currentStack[currentStack.length - 1] : 'null',
        },
        output: `popped: ${popped}`,
        pointers: currentStack.length > 0
          ? [{ name: 'TOP', index: currentStack.length - 1, color: '#3b82f6', label: `TOP (${currentStack[currentStack.length - 1]})` }]
          : [],
      });
    }

    // Complete
    steps.push({
      id: stepId++,
      event: 'COMPLETE',
      action: 'Stack Operations Complete',
      description: 'All push and pop operations completed successfully. Stack is now empty.',
      state: { stack: [] },
      variables: { size: 0, isEmpty: true },
      output: '\n[✓ All Stack Operations Finished]',
      pointers: [],
    });

    return steps;
  },
};
