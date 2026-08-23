import { LearningProgram, LearningStep } from '../../core/types';

export interface LinkedListNode {
  id: number;
  value: number | string;
  nextId: number | null;
}

export const reverseLinkedListProgram: LearningProgram = {
  id: 'reverse-linked-list',
  slug: 'reverse-linked-list',
  title: 'Reverse Linked List',
  category: 'linked-list',
  difficulty: 'easy',
  simulationType: 'linked-list',
  description: 'Invert the direction of all pointers in a singly linked list so that the head becomes the tail and the tail becomes the new head.',
  conceptSummary: 'Uses three pointers: `prev` (initially null), `curr` (starts at head), and `next` (preserves remaining list). Invert `curr->next = prev` at every step.',
  timeComplexity: {
    best: 'O(n)',
    average: 'O(n)',
    worst: 'O(n)',
  },
  spaceComplexity: 'O(1)',
  tags: ['Linked List', 'Pointers', 'In-Place', 'Linear'],
  defaultInput: [10, 20, 30, 40, 50],
  presets: [
    { label: '5 Nodes (10..50)', description: 'Standard linked list', value: [10, 20, 30, 40, 50] },
    { label: '3 Nodes (1..3)', description: 'Quick 3-node list', value: [1, 2, 3] },
    { label: '2 Nodes', description: 'Small 2-node boundary', value: [100, 200] },
  ],
  implementations: {
    cpp: {
      language: 'cpp',
      sourceCode: `struct ListNode {
    int val;
    ListNode *next;
    ListNode(int x) : val(x), next(nullptr) {}
};

ListNode* reverseList(ListNode* head) {
    ListNode *prev = nullptr;
    ListNode *curr = head;
    
    while (curr != nullptr) {
        ListNode *next = curr->next; // 1. Save next
        curr->next = prev;           // 2. Reverse pointer
        prev = curr;                 // 3. Move prev forward
        curr = next;                 // 4. Move curr forward
    }
    return prev; // New head
}`,
      lineMap: {
        INIT: 8,
        LOOP_CHECK: 11,
        SAVE_NEXT: 12,
        REVERSE_POINTER: 13,
        MOVE_PREV: 14,
        MOVE_CURR: 15,
        COMPLETE: 17,
      },
    },
    python: {
      language: 'python',
      sourceCode: `class ListNode:
    def __init__(self, val=0, next=None):
        self.val = val
        self.next = next

def reverse_list(head):
    prev = None
    curr = head
    
    while curr is not None:
        next_node = curr.next  # Save next
        curr.next = prev       # Reverse pointer
        prev = curr            # Move prev
        curr = next_node       # Move curr
        
    return prev  # New head`,
      lineMap: {
        INIT: 7,
        LOOP_CHECK: 10,
        SAVE_NEXT: 11,
        REVERSE_POINTER: 12,
        MOVE_PREV: 13,
        MOVE_CURR: 14,
        COMPLETE: 16,
      },
    },
  },
  generateTrace: (input: any): LearningStep[] => {
    const values: number[] = Array.isArray(input) && input.length > 0 ? [...input] : [10, 20, 30, 40, 50];
    const steps: LearningStep[] = [];
    let stepId = 1;

    // Build initial node list
    let nodes: LinkedListNode[] = values.map((val, idx) => ({
      id: idx + 1,
      value: val,
      nextId: idx + 1 < values.length ? idx + 2 : null,
    }));

    let prevId: number | null = null;
    let currId: number | null = nodes.length > 0 ? nodes[0].id : null;

    steps.push({
      id: stepId++,
      event: 'INIT',
      action: 'Initialize Pointers: prev = null, curr = head',
      description: `Starting Linked List reversal. Set prev = null, curr = head (Node ${currId}, val = ${nodes[0]?.value}).`,
      state: { nodes: JSON.parse(JSON.stringify(nodes)), headId: 1 },
      variables: { prev: 'null', curr: `Node(${nodes[0]?.value})`, next: 'null' },
      output: `Initial Linked List: ${values.join(' ➔ ')} ➔ NULL`,
      pointers: [
        { name: 'prev', nodeId: 'null', color: '#8b5cf6', label: 'prev = NULL' },
        { name: 'curr', nodeId: currId || 1, color: '#3b82f6', label: 'curr (head)' },
      ],
    });

    while (currId !== null) {
      const currNode = nodes.find((n) => n.id === currId)!;
      const nextId = currNode.nextId;

      // 1. Loop check
      steps.push({
        id: stepId++,
        event: 'LOOP_CHECK',
        action: `Check curr != null (curr is Node ${currNode.value})`,
        description: `Current node is Node(${currNode.value}). Loop condition holds.`,
        state: { nodes: JSON.parse(JSON.stringify(nodes)), headId: 1 },
        variables: { prev: prevId ? `Node(${nodes.find((n) => n.id === prevId)?.value})` : 'null', curr: `Node(${currNode.value})` },
        output: `Processing Node: ${currNode.value}`,
        pointers: [
          ...(prevId ? [{ name: 'prev', nodeId: prevId, color: '#8b5cf6', label: 'prev' }] : []),
          { name: 'curr', nodeId: currId, color: '#3b82f6', label: 'curr' },
        ],
      });

      // 2. Save next
      steps.push({
        id: stepId++,
        event: 'SAVE_NEXT',
        action: `Save next = curr->next (${nextId ? `Node ${nodes.find((n) => n.id === nextId)?.value}` : 'null'})`,
        description: `Store reference to the rest of the list before breaking the pointer: next = ${
          nextId ? `Node(${nodes.find((n) => n.id === nextId)?.value})` : 'null'
        }.`,
        state: { nodes: JSON.parse(JSON.stringify(nodes)), headId: 1 },
        variables: {
          prev: prevId ? `Node(${nodes.find((n) => n.id === prevId)?.value})` : 'null',
          curr: `Node(${currNode.value})`,
          next: nextId ? `Node(${nodes.find((n) => n.id === nextId)?.value})` : 'null',
        },
        output: `Saved next node reference: ${nextId ? nodes.find((n) => n.id === nextId)?.value : 'NULL'}`,
        pointers: [
          ...(prevId ? [{ name: 'prev', nodeId: prevId, color: '#8b5cf6', label: 'prev' }] : []),
          { name: 'curr', nodeId: currId, color: '#3b82f6', label: 'curr' },
          ...(nextId ? [{ name: 'next', nodeId: nextId, color: '#f59e0b', label: 'next' }] : []),
        ],
      });

      // 3. Reverse pointer (curr->next = prev)
      currNode.nextId = prevId;
      steps.push({
        id: stepId++,
        event: 'REVERSE_POINTER',
        action: `Reverse Link: Node(${currNode.value})->next = ${
          prevId ? `Node(${nodes.find((n) => n.id === prevId)?.value})` : 'null'
        }`,
        description: `Redirected pointer of Node(${currNode.value}) backwards to point to ${
          prevId ? `Node(${nodes.find((n) => n.id === prevId)?.value})` : 'NULL'
        }.`,
        state: { nodes: JSON.parse(JSON.stringify(nodes)), headId: 1 },
        variables: { 'curr->next': prevId ? `Node(${nodes.find((n) => n.id === prevId)?.value})` : 'null' },
        output: `Reversed pointer for Node ${currNode.value}`,
        pointers: [
          ...(prevId ? [{ name: 'prev', nodeId: prevId, color: '#8b5cf6', label: 'prev' }] : []),
          { name: 'curr', nodeId: currId, color: '#10b981', label: 'curr (Reversed)' },
          ...(nextId ? [{ name: 'next', nodeId: nextId, color: '#f59e0b', label: 'next' }] : []),
        ],
      });

      // 4. Move prev forward
      prevId = currId;
      steps.push({
        id: stepId++,
        event: 'MOVE_PREV',
        action: `Move prev = curr (prev is now Node ${currNode.value})`,
        description: `Step prev forward to current node: prev = Node(${currNode.value}).`,
        state: { nodes: JSON.parse(JSON.stringify(nodes)), headId: 1 },
        variables: { prev: `Node(${currNode.value})` },
        output: `Shifted prev ➔ Node ${currNode.value}`,
        pointers: [
          { name: 'prev', nodeId: prevId, color: '#8b5cf6', label: 'prev' },
          ...(nextId ? [{ name: 'next', nodeId: nextId, color: '#f59e0b', label: 'next' }] : []),
        ],
      });

      // 5. Move curr forward
      currId = nextId;
      steps.push({
        id: stepId++,
        event: 'MOVE_CURR',
        action: `Move curr = next (${currId ? `curr is now Node ${nodes.find((n) => n.id === currId)?.value}` : 'curr is now null'})`,
        description: `Step curr forward to the saved next node.`,
        state: { nodes: JSON.parse(JSON.stringify(nodes)), headId: 1 },
        variables: { curr: currId ? `Node(${nodes.find((n) => n.id === currId)?.value})` : 'null' },
        output: `Shifted curr ➔ ${currId ? nodes.find((n) => n.id === currId)?.value : 'NULL'}`,
        pointers: [
          { name: 'prev', nodeId: prevId, color: '#8b5cf6', label: 'prev' },
          ...(currId ? [{ name: 'curr', nodeId: currId, color: '#3b82f6', label: 'curr' }] : []),
        ],
      });
    }

    // Complete
    steps.push({
      id: stepId++,
      event: 'COMPLETE',
      action: 'Reversal Complete! Return prev as new Head',
      description: `Linked List is fully reversed! Node(${nodes.find((n) => n.id === prevId)?.value}) is the new head.`,
      state: { nodes: JSON.parse(JSON.stringify(nodes)), headId: prevId },
      variables: { newHead: `Node(${nodes.find((n) => n.id === prevId)?.value})` },
      output: `\n[✓ List Reversed Successfully]\nNew Order: ${[...values].reverse().join(' ➔ ')} ➔ NULL`,
      pointers: [{ name: 'Head', nodeId: prevId || 1, color: '#10b981', label: '👑 New HEAD' }],
    });

    return steps;
  },
};
