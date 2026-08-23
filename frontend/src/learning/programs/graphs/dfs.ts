import { LearningProgram, LearningStep } from '../../core/types';
import { GraphNodeData, GraphEdgeData } from './bfs';

const SAMPLE_NODES: GraphNodeData[] = [
  { id: 'A', label: 'A', x: 60, y: 60 },
  { id: 'B', label: 'B', x: 180, y: 40 },
  { id: 'C', label: 'C', x: 300, y: 60 },
  { id: 'D', label: 'D', x: 100, y: 190 },
  { id: 'E', label: 'E', x: 260, y: 190 },
];

const SAMPLE_EDGES: GraphEdgeData[] = [
  { from: 'A', to: 'B' },
  { from: 'A', to: 'D' },
  { from: 'B', to: 'C' },
  { from: 'B', to: 'E' },
  { from: 'C', to: 'E' },
  { from: 'D', to: 'E' },
];

const ADJ_LIST: Record<string, string[]> = {
  A: ['B', 'D'],
  B: ['A', 'C', 'E'],
  C: ['B', 'E'],
  D: ['A', 'E'],
  E: ['B', 'C', 'D'],
};

export function generateDFSTrace(): LearningStep[] {
  const steps: LearningStep[] = [];
  let stepId = 1;

  steps.push({
    id: stepId++,
    event: 'INIT',
    action: 'Initialize Graph & Call Stack',
    description: 'We will traverse the graph using Depth First Search (DFS) starting at node A.',
    state: {
      nodes: SAMPLE_NODES,
      edges: SAMPLE_EDGES,
      stack: ['A'],
      visitedOrder: [],
    },
    variables: { startNode: 'A', current: 'None' },
    output: 'DFS Traversal started from node A.\n',
    highlights: {
      activeNodeId: 'A',
      visitedNodeIds: [],
    },
    codeLine: 1,
  });

  const visited = new Set<string>();
  const visitedOrder: string[] = [];
  const stack: string[] = ['A'];

  while (stack.length > 0) {
    const curr = stack.pop()!;

    if (!visited.has(curr)) {
      visited.add(curr);
      visitedOrder.push(curr);

      steps.push({
        id: stepId++,
        event: 'VISIT_NODE',
        action: `Visit node ${curr}`,
        description: `Popped node ${curr} from stack and marked it as visited.`,
        state: {
          nodes: SAMPLE_NODES,
          edges: SAMPLE_EDGES,
          stack: [...stack],
          visitedOrder: [...visitedOrder],
        },
        variables: { current: curr, visitedCount: visited.size },
        output: `Visited: ${curr}\n`,
        highlights: {
          activeNodeId: curr,
          visitedNodeIds: [...visitedOrder],
        },
        codeLine: 5,
      });

      const neighbors = ADJ_LIST[curr] || [];
      for (const neighbor of [...neighbors].reverse()) {
        if (!visited.has(neighbor)) {
          stack.push(neighbor);

          steps.push({
            id: stepId++,
            event: 'PUSH_NEIGHBOR',
            action: `Push unvisited neighbor ${neighbor} to Stack`,
            description: `Neighbor ${neighbor} of node ${curr} is unvisited, so push it onto the DFS call stack.`,
            state: {
              nodes: SAMPLE_NODES,
              edges: SAMPLE_EDGES,
              stack: [...stack],
              visitedOrder: [...visitedOrder],
            },
            variables: { current: curr, pushed: neighbor },
            highlights: {
              activeNodeId: neighbor,
              visitedNodeIds: [...visitedOrder],
            },
            codeLine: 8,
          });
        }
      }
    }
  }

  steps.push({
    id: stepId++,
    event: 'COMPLETE',
    action: 'DFS Traversal Finished',
    description: `All reachable vertices have been explored deeply. Order: ${visitedOrder.join(' ➔ ')}.`,
    state: {
      nodes: SAMPLE_NODES,
      edges: SAMPLE_EDGES,
      stack: [],
      visitedOrder: [...visitedOrder],
    },
    variables: { completed: true, totalVisited: visitedOrder.length },
    output: `DFS Complete: ${visitedOrder.join(' -> ')}\n`,
    highlights: {
      visitedNodeIds: [...visitedOrder],
    },
    codeLine: 12,
  });

  return steps;
}

export const dfsProgram: LearningProgram = {
  id: 'depth-first-search',
  slug: 'depth-first-search',
  title: 'Depth First Search (DFS)',
  category: 'graphs',
  difficulty: 'medium',
  description: 'Traverse graph vertices by exploring as deep as possible along each branch before backtracking.',
  conceptSummary: 'Uses LIFO stack (or recursion) to explore paths to leaf nodes before backtracking.',
  tags: ['graph', 'dfs', 'stack', 'traversal'],
  timeComplexity: {
    best: 'O(V + E)',
    average: 'O(V + E)',
    worst: 'O(V + E)',
  },
  spaceComplexity: 'O(V)',
  defaultInput: null,
  presets: [
    { label: '5-Node Graph (Default)', value: null, description: 'Connected graph with 5 vertices' },
  ],
  simulationType: 'graph',
  implementations: {
    cpp: {
      language: 'cpp',
      sourceCode: `#include <iostream>
#include <vector>
#include <stack>
using namespace std;

void dfs(int start, vector<vector<int>>& adj, int V) {
    vector<bool> visited(V, false);
    stack<int> s;
    s.push(start);

    while (!s.empty()) {
        int u = s.top();
        s.pop();

        if (!visited[u]) {
            visited[u] = true;
            cout << u << " ";

            for (int v : adj[u]) {
                if (!visited[v]) {
                    s.push(v);
                }
            }
        }
    }
}`,
      lineMap: {
        INIT: 6,
        VISIT_NODE: 14,
        PUSH_NEIGHBOR: 18,
        COMPLETE: 22,
      },
    },
    python: {
      language: 'python',
      sourceCode: `def dfs(graph, start):
    visited = set()
    stack = [start]

    while stack:
        vertex = stack.pop()
        if vertex not in visited:
            visited.add(vertex)
            print(vertex, end=' ')
            for neighbor in reversed(graph[vertex]):
                if neighbor not in visited:
                    stack.append(neighbor)`,
      lineMap: {
        INIT: 3,
        VISIT_NODE: 7,
        PUSH_NEIGHBOR: 11,
        COMPLETE: 12,
      },
    },
  },
  generateTrace: () => generateDFSTrace(),
};
