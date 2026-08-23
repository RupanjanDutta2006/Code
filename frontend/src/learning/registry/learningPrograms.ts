import { LearningProgram, AlgorithmCategory } from '../core/types';
import { bubbleSortProgram } from '../programs/sorting/bubbleSort';
import { selectionSortProgram } from '../programs/sorting/selectionSort';
import { insertionSortProgram } from '../programs/sorting/insertionSort';
import { binarySearchProgram } from '../programs/searching/binarySearch';
import { linearSearchProgram } from '../programs/searching/linearSearch';
import { arrayReverseProgram } from '../programs/arrays/arrayReverse';
import { reverseLinkedListProgram } from '../programs/linkedList/reverseLinkedList';
import { middleLinkedListProgram } from '../programs/linkedList/middleLinkedList';
import { stackPushPopProgram } from '../programs/stackQueue/stackPushPop';
import { queueEnqueueDequeueProgram } from '../programs/stackQueue/queueEnqueueDequeue';
import { treeTraversalsProgram } from '../programs/trees/treeTraversals';
import { bfsProgram } from '../programs/graphs/bfs';
import { dfsProgram } from '../programs/graphs/dfs';
import { factorialProgram } from '../programs/recursion/factorial';
import { fibonacciProgram } from '../programs/recursion/fibonacci';

export const ALL_LEARNING_PROGRAMS: LearningProgram[] = [
  // 1. Sorting
  bubbleSortProgram,
  selectionSortProgram,
  insertionSortProgram,

  // 2. Searching & Arrays
  binarySearchProgram,
  linearSearchProgram,
  arrayReverseProgram,

  // 3. Linked Lists
  reverseLinkedListProgram,
  middleLinkedListProgram,

  // 4. Stacks & Queues
  stackPushPopProgram,
  queueEnqueueDequeueProgram,

  // 5. Trees
  treeTraversalsProgram,

  // 6. Graphs
  bfsProgram,
  dfsProgram,

  // 7. Recursion
  factorialProgram,
  fibonacciProgram,
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
  const q = (query || '').toLowerCase().trim();

  return ALL_LEARNING_PROGRAMS.filter((program) => {
    const matchesCategory = category === 'all' || program.category === category;
    if (!matchesCategory) return false;

    if (!q) return true;

    const inTitle = program.title.toLowerCase().includes(q);
    const inDescription = program.description.toLowerCase().includes(q);
    const inConcept = (program.conceptSummary || '').toLowerCase().includes(q);
    const inTags = program.tags.some((t) => t.toLowerCase().includes(q));
    const inCategory = program.category.toLowerCase().includes(q);
    const inSlug = program.slug.toLowerCase().includes(q);

    return inTitle || inDescription || inConcept || inTags || inCategory || inSlug;
  });
}
