import { LearningProgram, LearningStep } from '../../core/types';
import { LinkedListNode } from './reverseLinkedList';

export function generateMiddleLLTrace(values: number[] = [10, 20, 30, 40, 50]): LearningStep[] {
  const safeValues = values && values.length > 0 ? values : [10, 20, 30, 40, 50];
  const steps: LearningStep[] = [];
  let stepId = 1;

  const nodes: LinkedListNode[] = safeValues.map((val, idx) => ({
    id: idx + 1,
    value: val,
    nextId: idx < safeValues.length - 1 ? idx + 2 : null,
  }));

  let slowIdx = 0;
  let fastIdx = 0;

  steps.push({
    id: stepId++,
    event: 'INIT',
    action: 'Initialize Slow & Fast Pointers',
    description: 'Set both slow and fast pointers to head (node 1). Slow moves 1 step at a time, Fast moves 2 steps.',
    state: {
      nodes: JSON.parse(JSON.stringify(nodes)),
      headId: 1,
    },
    variables: { slow: nodes[slowIdx].value, fast: nodes[fastIdx].value },
    pointers: [
      { name: 'slow', nodeId: nodes[slowIdx].id, color: '#3b82f6', label: 'SLOW' },
      { name: 'fast', nodeId: nodes[fastIdx].id, color: '#ec4899', label: 'FAST' },
    ],
    codeLine: 2,
  });

  while (fastIdx < nodes.length && fastIdx + 1 < nodes.length) {
    slowIdx += 1;
    fastIdx += 2;

    const fastNodeId = fastIdx < nodes.length ? nodes[fastIdx].id : null;

    steps.push({
      id: stepId++,
      event: 'MOVE_POINTERS',
      action: `Advance Slow to Node #${nodes[slowIdx].id} (val: ${nodes[slowIdx].value}), Fast to ${fastNodeId ? `Node #${fastNodeId}` : 'NULL'}`,
      description: `Fast pointer traversed two hops, slow pointer traversed one hop.`,
      state: {
        nodes: JSON.parse(JSON.stringify(nodes)),
        headId: 1,
      },
      variables: {
        slow: nodes[slowIdx].value,
        fast: fastIdx < nodes.length ? nodes[fastIdx].value : 'NULL',
      },
      pointers: [
        { name: 'slow', nodeId: nodes[slowIdx].id, color: '#3b82f6', label: 'SLOW' },
        ...(fastNodeId ? [{ name: 'fast', nodeId: fastNodeId, color: '#ec4899', label: 'FAST' }] : []),
      ],
      codeLine: 4,
    });
  }

  steps.push({
    id: stepId++,
    event: 'COMPLETE',
    action: `Middle Found: Node #${nodes[slowIdx].id} (value: ${nodes[slowIdx].value})`,
    description: `Fast reached the end of the list. Slow is now resting exactly at the middle node.`,
    state: {
      nodes: JSON.parse(JSON.stringify(nodes)),
      headId: 1,
    },
    variables: { middleNode: nodes[slowIdx].value, index: slowIdx },
    output: `Middle node value = ${nodes[slowIdx].value}\n`,
    pointers: [
      { name: 'slow', nodeId: nodes[slowIdx].id, color: '#10b981', label: '★ MIDDLE' },
    ],
    codeLine: 6,
  });

  return steps;
}

export const middleLinkedListProgram: LearningProgram = {
  id: 'middle-of-linked-list',
  slug: 'middle-of-linked-list',
  title: 'Middle of Linked List (Slow & Fast)',
  category: 'linked-list',
  difficulty: 'easy',
  description: 'Find the middle node of a linked list in a single pass using the Tortoise and Hare (slow & fast pointers) technique.',
  conceptSummary: 'When fast pointer moves at 2x speed and reaches the end, slow pointer at 1x speed is exactly at the midpoint.',
  tags: ['linked-list', 'two-pointers', 'tortoise-hare', 'middle'],
  timeComplexity: {
    best: 'O(n)',
    average: 'O(n)',
    worst: 'O(n)',
  },
  spaceComplexity: 'O(1)',
  defaultInput: [10, 20, 30, 40, 50],
  presets: [
    { label: 'Odd (5 nodes)', value: [10, 20, 30, 40, 50], description: '5 nodes: middle is 30' },
    { label: 'Even (6 nodes)', value: [10, 20, 30, 40, 50, 60], description: '6 nodes: second middle is 40' },
    { label: 'Small (3 nodes)', value: [1, 2, 3], description: '3 nodes: middle is 2' },
  ],
  simulationType: 'linked-list',
  implementations: {
    cpp: {
      language: 'cpp',
      sourceCode: `ListNode* middleNode(ListNode* head) {
    ListNode* slow = head;
    ListNode* fast = head;
    while (fast != nullptr && fast->next != nullptr) {
        slow = slow->next;
        fast = fast->next->next;
    }
    return slow;
}`,
      lineMap: {
        INIT: 2,
        MOVE_POINTERS: 5,
        COMPLETE: 8,
      },
    },
    python: {
      language: 'python',
      sourceCode: `def middleNode(head):
    slow = head
    fast = head
    while fast and fast.next:
        slow = slow.next
        fast = fast.next.next
    return slow`,
      lineMap: {
        INIT: 2,
        MOVE_POINTERS: 5,
        COMPLETE: 7,
      },
    },
  },
  generateTrace: (input) => generateMiddleLLTrace(Array.isArray(input) ? input : undefined),
};
