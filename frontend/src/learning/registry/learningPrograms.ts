import { LearningProgram, AlgorithmCategory } from '../core/types';
import { bubbleSortProgram } from '../programs/sorting/bubbleSort';
import { selectionSortProgram } from '../programs/sorting/selectionSort';
import { insertionSortProgram } from '../programs/sorting/insertionSort';
import { binarySearchProgram } from '../programs/searching/binarySearch';
import { linearSearchProgram } from '../programs/searching/linearSearch';
import { reverseLinkedListProgram } from '../programs/linkedList/reverseLinkedList';
import { stackPushPopProgram } from '../programs/stackQueue/stackPushPop';
import { queueEnqueueDequeueProgram } from '../programs/stackQueue/queueEnqueueDequeue';
import { treeTraversalsProgram } from '../programs/trees/treeTraversals';
import { bfsProgram } from '../programs/graphs/bfs';
import { factorialProgram } from '../programs/recursion/factorial';

export const ALL_LEARNING_PROGRAMS: LearningProgram[] = [
  // 1. Sorting
  bubbleSortProgram,
  selectionSortProgram,
  insertionSortProgram,

  // 2. Searching
  binarySearchProgram,
  linearSearchProgram,

  // 3. Linked Lists
  reverseLinkedListProgram,

  // 4. Stacks & Queues
  stackPushPopProgram,
  queueEnqueueDequeueProgram,

  // 5. Trees
  treeTraversalsProgram,

  // 6. Graphs
  bfsProgram,

  // 7. Recursion
  factorialProgram,
];

export const CATEGORY_LABELS: Record<AlgorithmCategory | 'all', string> = {
  all: 'All Topics',
  sorting: 'Sorting Algorithms',
  searching: 'Searching',
  arrays: 'Arrays',
  'linked-list': 'Linked Lists',
  'stack-queue': 'Stacks & Queues',
  trees: 'Trees & BST',
  graphs: 'Graphs & BFS/DFS',
  recursion: 'Recursion & Call Stack',
};

export function getProgramBySlug(slug: string): LearningProgram | undefined {
  const cleanSlug = (slug || '').toLowerCase().trim();
  return ALL_LEARNING_PROGRAMS.find(
    (p) => p.slug.toLowerCase() === cleanSlug || p.id.toLowerCase() === cleanSlug
  );
}

export function searchLearningPrograms(
  query: string,
  category: AlgorithmCategory | 'all' = 'all'
): LearningProgram[] {
  const q = query.toLowerCase().trim();

  return ALL_LEARNING_PROGRAMS.filter((p) => {
    // Category match
    if (category !== 'all' && p.category !== category) {
      return false;
    }

    if (!q) return true;

    // Search query match
    return (
      p.title.toLowerCase().includes(q) ||
      p.slug.toLowerCase().includes(q) ||
      p.description.toLowerCase().includes(q) ||
      p.conceptSummary.toLowerCase().includes(q) ||
      p.tags.some((t) => t.toLowerCase().includes(q))
    );
  });
}
