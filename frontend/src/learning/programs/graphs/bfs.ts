import { LearningProgram, LearningStep } from '../../core/types';

export interface GraphNodeData {
  id: string;
  label: string;
  x: number;
  y: number;
}

export interface GraphEdgeData {
  from: string;
  to: string;
}

export const bfsProgram: LearningProgram = {
  id: 'breadth-first-search',
  slug: 'breadth-first-search',
  title: 'Breadth-First Search (BFS)',
  category: 'graphs',
  difficulty: 'medium',
  simulationType: 'graph',
  description: 'An algorithm for traversing or searching tree or graph data structures. It starts at the tree root and explores all nodes at the present depth prior to moving on to the nodes at the next depth level.',
  conceptSummary: 'Uses a FIFO Queue to visit neighbors level by level, ensuring the shortest path in unweighted graphs.',
  timeComplexity: {
    best: 'O(V + E)',
    average: 'O(V + E)',
    worst: 'O(V + E)',
  },
  spaceComplexity: 'O(V)',
  tags: ['Graph', 'BFS', 'Queue', 'Level-Order', 'Shortest Path'],
  defaultInput: null,
  presets: [
    { label: '5-Node Graph (A..E)', description: 'Connected undirected graph', value: 'default' },
  ],
  implementations: {
    cpp: {
      language: 'cpp',
      sourceCode: `#include <iostream>
#include <vector>
#include <queue>
using namespace std;

void bfs(int start, const vector<vector<int>>& adj) {
    int n = adj.size();
    vector<bool> visited(n, false);
    queue<int> q;
    
    visited[start] = true;
    q.push(start);
    
    while (!q.empty()) {
        int u = q.front();
        q.pop();
        cout << u << " ";
        
        for (int v : adj[u]) {
            if (!visited[v]) {
                visited[v] = true;
                q.push(v);
            }
        }
    }
}`,
      lineMap: {
        INIT: 11,
        WHILE_LOOP: 15,
        DEQUEUE: 16,
        EXPLORE_NEIGHBOR: 20,
        ENQUEUE_NEIGHBOR: 22,
        COMPLETE: 26,
      },
    },
    python: {
      language: 'python',
      sourceCode: `from collections import deque

def bfs(start, adj):
    visited = set()
    queue = deque([start])
    visited.add(start)
    
    while queue:
        u = queue.popleft()
        print(u, end=" ")
        
        for v in adj[u]:
            if v not in visited:
                visited.add(v)
                queue.append(v)`,
      lineMap: {
        INIT: 5,
        WHILE_LOOP: 8,
        DEQUEUE: 9,
        EXPLORE_NEIGHBOR: 12,
        ENQUEUE_NEIGHBOR: 14,
        COMPLETE: 15,
      },
    },
  },
  generateTrace: (): LearningStep[] => {
    const nodes: GraphNodeData[] = [
      { id: 'A', label: 'A', x: 180, y: 40 },
      { id: 'B', label: 'B', x: 80, y: 120 },
      { id: 'C', label: 'C', x: 280, y: 120 },
      { id: 'D', label: 'D', x: 100, y: 220 },
      { id: 'E', label: 'E', x: 260, y: 220 },
    ];

    const edges: GraphEdgeData[] = [
      { from: 'A', to: 'B' },
      { from: 'A', to: 'C' },
      { from: 'B', to: 'D' },
      { from: 'C', to: 'E' },
      { from: 'D', to: 'E' },
    ];

    const adj: Record<string, string[]> = {
      A: ['B', 'C'],
      B: ['A', 'D'],
      C: ['A', 'E'],
      D: ['B', 'E'],
      E: ['C', 'D'],
    };

    const steps: LearningStep[] = [];
    let stepId = 1;

    const visited: string[] = ['A'];
    const queue: string[] = ['A'];
    const visitedOrder: string[] = [];

    // Init
    steps.push({
      id: stepId++,
      event: 'INIT',
      action: 'Start BFS at Node A: Mark visited & enqueue(A)',
      description: 'Starting BFS from source Node A. Enqueued A into the BFS FIFO queue and marked visited.',
      state: { nodes, edges, queue: [...queue], visited: [...visited], visitedOrder: [] },
      variables: { start: 'A', queue: '["A"]', visited: '["A"]' },
      output: 'BFS Started from Node A',
      highlights: { activeNodeId: 'A', visitedNodeIds: ['A'] },
      pointers: [{ name: 'Queue[0]', nodeId: 'A', color: '#3b82f6', label: 'Queue Front' }],
    });

    while (queue.length > 0) {
      const u = queue.shift()!;
      visitedOrder.push(u);

      steps.push({
        id: stepId++,
        event: 'DEQUEUE',
        action: `Dequeue & Visit Node ${u}`,
        description: `Popped Node ${u} from the queue. Process this node and check its adjacent neighbors.`,
        state: { nodes, edges, queue: [...queue], visited: [...visited], visitedOrder: [...visitedOrder] },
        variables: { u, queue: JSON.stringify(queue), order: visitedOrder.join(' ➔ ') },
        output: `Visited: ${u}`,
        highlights: { activeNodeId: u, visitedNodeIds: [...visited] },
        pointers: [{ name: 'u', nodeId: u, color: '#10b981', label: `Visiting ${u}` }],
      });

      for (const v of adj[u]) {
        if (!visited.includes(v)) {
          visited.push(v);
          queue.push(v);

          steps.push({
            id: stepId++,
            event: 'ENQUEUE_NEIGHBOR',
            action: `Discover Neighbor ${v}: Mark visited & enqueue(${v})`,
            description: `Discovered unvisited neighbor Node ${v} from Node ${u}. Enqueue ${v} into BFS queue.`,
            state: { nodes, edges, queue: [...queue], visited: [...visited], visitedOrder: [...visitedOrder] },
            variables: { u, discovered: v, queue: JSON.stringify(queue) },
            output: `Discovered Node ${v} ➔ Enqueued`,
            highlights: { activeNodeId: v, visitedNodeIds: [...visited] },
            pointers: [{ name: 'v', nodeId: v, color: '#f59e0b', label: `Discovered ${v}` }],
          });
        }
      }
    }

    steps.push({
      id: stepId++,
      event: 'COMPLETE',
      action: 'BFS Traversal Complete',
      description: `BFS finished level-by-level traversal. Visited order: ${visitedOrder.join(' ➔ ')}.`,
      state: { nodes, edges, queue: [], visited: [...visited], visitedOrder: [...visitedOrder] },
      variables: { completed: true, result: visitedOrder.join(', ') },
      output: `\nFinal BFS Order: ${visitedOrder.join(' ')}\n[✓ BFS Traversal Complete]`,
      highlights: { visitedNodeIds: [...visited] },
      pointers: [],
    });

    return steps;
  },
};
