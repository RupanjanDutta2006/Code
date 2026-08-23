import { LearningProgram, LearningStep } from '../../core/types';

export interface TreeNodeData {
  id: number;
  val: number;
  leftId: number | null;
  rightId: number | null;
  x: number;
  y: number;
}

export const treeTraversalsProgram: LearningProgram = {
  id: 'tree-inorder-traversal',
  slug: 'tree-inorder-traversal',
  title: 'Binary Tree Inorder Traversal',
  category: 'trees',
  difficulty: 'medium',
  simulationType: 'tree',
  description: 'Inorder tree traversal visits nodes in the order: Left Subtree ➔ Root Node ➔ Right Subtree. On a Binary Search Tree (BST), this produces sorted output.',
  conceptSummary: 'Recursively traverse left subtree, visit current node, and recursively traverse right subtree: L-N-R.',
  timeComplexity: {
    best: 'O(n)',
    average: 'O(n)',
    worst: 'O(n)',
  },
  spaceComplexity: 'O(h)',
  tags: ['Tree', 'Binary Tree', 'Inorder', 'Recursion', 'DFS', 'Traversal'],
  defaultInput: null,
  presets: [
    { label: 'Standard BST (7 Nodes)', description: 'Balanced 3-level tree', value: 'default' },
  ],
  implementations: {
    cpp: {
      language: 'cpp',
      sourceCode: `struct TreeNode {
    int val;
    TreeNode *left;
    TreeNode *right;
    TreeNode(int x) : val(x), left(nullptr), right(nullptr) {}
};

void inorder(TreeNode* root) {
    if (root == nullptr) return;
    
    inorder(root->left);       // 1. Traverse Left
    cout << root->val << " ";  // 2. Visit Node
    inorder(root->right);      // 3. Traverse Right
}`,
      lineMap: {
        CHECK_NULL: 9,
        GO_LEFT: 11,
        VISIT_NODE: 12,
        GO_RIGHT: 13,
        COMPLETE: 14,
      },
    },
    python: {
      language: 'python',
      sourceCode: `class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right

def inorder(root):
    if root is None:
        return
        
    inorder(root.left)         # 1. Left
    print(root.val, end=" ")   # 2. Visit
    inorder(root.right)        # 3. Right`,
      lineMap: {
        CHECK_NULL: 8,
        GO_LEFT: 11,
        VISIT_NODE: 12,
        GO_RIGHT: 13,
        COMPLETE: 14,
      },
    },
  },
  generateTrace: (): LearningStep[] => {
    // Tree nodes: 8 as root, 4 left, 12 right, 2, 6, 10, 14 leaves
    const nodes: TreeNodeData[] = [
      { id: 1, val: 8, leftId: 2, rightId: 3, x: 200, y: 40 },
      { id: 2, val: 4, leftId: 4, rightId: 5, x: 100, y: 110 },
      { id: 3, val: 12, leftId: 6, rightId: 7, x: 300, y: 110 },
      { id: 4, val: 2, leftId: null, rightId: null, x: 50, y: 180 },
      { id: 5, val: 6, leftId: null, rightId: null, x: 150, y: 180 },
      { id: 6, val: 10, leftId: null, rightId: null, x: 250, y: 180 },
      { id: 7, val: 14, leftId: null, rightId: null, x: 350, y: 180 },
    ];

    const steps: LearningStep[] = [];
    let stepId = 1;
    const visitedList: number[] = [];
    const visitedNodeIds: number[] = [];

    steps.push({
      id: stepId++,
      event: 'CHECK_NULL',
      action: 'Start Inorder Traversal at Root (Node 8)',
      description: 'Beginning traversal at root node 8. Rule: Left ➔ Root ➔ Right.',
      state: { nodes, activeNodeId: 1, visitedOrder: [] },
      variables: { current: 'Node(8)', visitedOrder: '[]' },
      output: 'Inorder Traversal Started (L ➔ N ➔ R)',
      highlights: { activeNodeId: 1, visitedNodeIds: [] },
      pointers: [{ name: 'curr', nodeId: 1, color: '#3b82f6', label: 'Root (8)' }],
    });

    function traverse(nodeId: number | null) {
      if (nodeId === null) return;
      const node = nodes.find((n) => n.id === nodeId)!;

      // 1. Go Left
      if (node.leftId !== null) {
        steps.push({
          id: stepId++,
          event: 'GO_LEFT',
          action: `Recurse Left from Node ${node.val} ➔ Node ${nodes.find((n) => n.id === node.leftId)!.val}`,
          description: `Traversing left child of Node ${node.val}.`,
          state: { nodes, activeNodeId: node.leftId, visitedOrder: [...visitedList] },
          variables: { current: `Node(${node.val})`, action: `inorder(${node.val}->left)` },
          output: `Calling inorder(${nodes.find((n) => n.id === node.leftId)!.val})`,
          highlights: { activeNodeId: node.leftId, visitedNodeIds: [...visitedNodeIds] },
          pointers: [{ name: 'curr', nodeId: node.leftId, color: '#3b82f6', label: 'Left Child' }],
        });
        traverse(node.leftId);
      }

      // 2. Visit Node
      visitedList.push(node.val);
      visitedNodeIds.push(node.id);
      steps.push({
        id: stepId++,
        event: 'VISIT_NODE',
        action: `Visit & Print Node ${node.val}`,
        description: `Left subtree of Node ${node.val} is completed. Visiting node: output ${node.val}.`,
        state: { nodes, activeNodeId: node.id, visitedOrder: [...visitedList] },
        variables: { visitedNode: node.val, traversal: visitedList.join(' ➔ ') },
        output: `Visited: ${node.val}`,
        highlights: { activeNodeId: node.id, visitedNodeIds: [...visitedNodeIds] },
        pointers: [{ name: 'Visited', nodeId: node.id, color: '#10b981', label: `✓ ${node.val}` }],
      });

      // 3. Go Right
      if (node.rightId !== null) {
        steps.push({
          id: stepId++,
          event: 'GO_RIGHT',
          action: `Recurse Right from Node ${node.val} ➔ Node ${nodes.find((n) => n.id === node.rightId)!.val}`,
          description: `Traversing right child of Node ${node.val}.`,
          state: { nodes, activeNodeId: node.rightId, visitedOrder: [...visitedList] },
          variables: { current: `Node(${node.val})`, action: `inorder(${node.val}->right)` },
          output: `Calling inorder(${nodes.find((n) => n.id === node.rightId)!.val})`,
          highlights: { activeNodeId: node.rightId, visitedNodeIds: [...visitedNodeIds] },
          pointers: [{ name: 'curr', nodeId: node.rightId, color: '#3b82f6', label: 'Right Child' }],
        });
        traverse(node.rightId);
      }
    }

    traverse(1);

    steps.push({
      id: stepId++,
      event: 'COMPLETE',
      action: 'Inorder Traversal Complete',
      description: `Inorder traversal of BST produces fully sorted order: ${visitedList.join(' ➔ ')}.`,
      state: { nodes, activeNodeId: null, visitedOrder: [...visitedList] },
      variables: { result: visitedList.join(', ') },
      output: `\nFinal Inorder Result: ${visitedList.join(' ')}\n[✓ Inorder Complete]`,
      highlights: { visitedNodeIds: [...visitedNodeIds] },
      pointers: [],
    });

    return steps;
  },
};
