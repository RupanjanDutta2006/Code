import { LearningProgram, LearningStep } from '../../core/types';

export const queueEnqueueDequeueProgram: LearningProgram = {
  id: 'queue-enqueue-dequeue',
  slug: 'queue-enqueue-dequeue',
  title: 'Queue (Enqueue & Dequeue)',
  category: 'stack-queue',
  difficulty: 'easy',
  simulationType: 'queue',
  description: 'Demonstrates a First-In, First-Out (FIFO) queue data structure where elements enter at the rear and leave from the front.',
  conceptSummary: 'Just like a line of people waiting for a ticket: the first person to join the queue is the first person served.',
  timeComplexity: {
    best: 'O(1)',
    average: 'O(1)',
    worst: 'O(1)',
  },
  spaceComplexity: 'O(n)',
  tags: ['Queue', 'FIFO', 'Data Structure', 'Enqueue', 'Dequeue'],
  defaultInput: [100, 200, 300],
  presets: [
    { label: 'Default (100, 200, 300)', description: '3 item queue cycle', value: [100, 200, 300] },
    { label: '4 Items', description: '4 item queue cycle', value: [10, 20, 30, 40] },
  ],
  implementations: {
    cpp: {
      language: 'cpp',
      sourceCode: `#include <iostream>
#include <queue>
using namespace std;

int main() {
    queue<int> q;
    
    // Enqueue
    q.push(100);
    q.push(200);
    q.push(300);
    
    cout << "Front element: " << q.front() << endl;
    
    // Dequeue
    while (!q.empty()) {
        cout << "Dequeuing: " << q.front() << endl;
        q.pop();
    }
    return 0;
}`,
      lineMap: {
        INIT: 6,
        ENQUEUE: 9,
        FRONT: 13,
        DEQUEUE: 18,
        COMPLETE: 20,
      },
    },
    python: {
      language: 'python',
      sourceCode: `from collections import deque

q = deque()

# Enqueue
q.append(100)
q.append(200)
q.append(300)

print("Front:", q[0])

# Dequeue
while len(q) > 0:
    val = q.popleft()
    print("Dequeuing:", val)`,
      lineMap: {
        INIT: 3,
        ENQUEUE: 6,
        FRONT: 10,
        DEQUEUE: 14,
        COMPLETE: 15,
      },
    },
  },
  generateTrace: (input: number[]): LearningStep[] => {
    const raw = Array.isArray(input) && input.length > 0 ? [...input] : [100, 200, 300];
    const steps: LearningStep[] = [];
    let stepId = 1;
    const currentQueue: number[] = [];

    steps.push({
      id: stepId++,
      event: 'INIT',
      action: 'Initialize Empty Queue',
      description: 'Created a new FIFO queue. FRONT and REAR are both currently empty.',
      state: { queue: [] },
      variables: { size: 0, front: 'null', rear: 'null' },
      output: 'Queue initialized (FIFO)',
      pointers: [],
    });

    for (const val of raw) {
      currentQueue.push(val);
      steps.push({
        id: stepId++,
        event: 'ENQUEUE',
        action: `Enqueue ${val} at REAR`,
        description: `Enqueued ${val} at the end of the queue. REAR is now ${val}, FRONT is ${currentQueue[0]}.`,
        state: { queue: [...currentQueue] },
        variables: { size: currentQueue.length, front: currentQueue[0], rear: val },
        output: `enqueue(${val}) ➔ Size: ${currentQueue.length}`,
        pointers: [
          { name: 'FRONT', index: 0, color: '#3b82f6', label: `FRONT (${currentQueue[0]})` },
          { name: 'REAR', index: currentQueue.length - 1, color: '#ec4899', label: `REAR (${val})` },
        ],
      });
    }

    while (currentQueue.length > 0) {
      const dequeued = currentQueue.shift()!;
      steps.push({
        id: stepId++,
        event: 'DEQUEUE',
        action: `Dequeue ${dequeued} from FRONT`,
        description: `Dequeued element ${dequeued} from the FRONT of the queue (FIFO order). Remaining size: ${currentQueue.length}.`,
        state: { queue: [...currentQueue], dequeuedValue: dequeued },
        variables: {
          dequeued,
          size: currentQueue.length,
          front: currentQueue.length > 0 ? currentQueue[0] : 'null',
        },
        output: `dequeued: ${dequeued}`,
        pointers: currentQueue.length > 0
          ? [
              { name: 'FRONT', index: 0, color: '#3b82f6', label: `FRONT (${currentQueue[0]})` },
              { name: 'REAR', index: currentQueue.length - 1, color: '#ec4899', label: `REAR (${currentQueue[currentQueue.length - 1]})` },
            ]
          : [],
      });
    }

    steps.push({
      id: stepId++,
      event: 'COMPLETE',
      action: 'Queue Cycle Finished',
      description: 'All elements processed in exact First-In, First-Out order.',
      state: { queue: [] },
      variables: { size: 0, isEmpty: true },
      output: '\n[✓ FIFO Queue Processing Complete]',
      pointers: [],
    });

    return steps;
  },
};
