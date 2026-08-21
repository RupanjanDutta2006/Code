import { Program } from './api';

export const DEFAULT_PROGRAMS: Program[] = [
  {
    id: 1,
    title: 'Binary Search Algorithm',
    description: 'Standard O(log n) binary search algorithm to find index of a target element in a sorted array.',
    language: 'python',
    category: 'Algorithms',
    user_id: 1,
    author_username: 'Prof_Sharma',
    is_public: true,
    source_code: `def binary_search(arr, target):
    left, right = 0, len(arr) - 1
    while left <= right:
        mid = (left + right) // 2
        if arr[mid] == target:
            return mid
        elif arr[mid] < target:
            left = mid + 1
        else:
            right = mid - 1
    return -1

if __name__ == "__main__":
    nums = [1, 3, 5, 7, 9, 11, 13, 15]
    target = 7
    idx = binary_search(nums, target)
    print(f"Index of {target}: {idx}")`,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    version_count: 1,
    test_case_count: 3,
    test_cases: [
      {
        id: 101,
        program_id: 1,
        input_data: '7',
        expected_output: 'Index of 7: 3',
        is_sample: true,
        order_index: 1,
      },
      {
        id: 102,
        program_id: 1,
        input_data: '1',
        expected_output: 'Index of 7: 3',
        is_sample: true,
        order_index: 2,
      },
    ],
  },
  {
    id: 2,
    title: 'Two Sum Problem',
    description: 'Find two numbers such that they add up to a specific target.',
    language: 'cpp',
    category: 'Data Structures & Algorithms',
    user_id: 1,
    author_username: 'Prof_Sharma',
    is_public: true,
    source_code: `#include <iostream>
#include <vector>
#include <unordered_map>

using namespace std;

vector<int> twoSum(vector<int>& nums, int target) {
    unordered_map<int, int> seen;
    for (int i = 0; i < nums.size(); i++) {
        int complement = target - nums[i];
        if (seen.find(complement) != seen.end()) {
            return {seen[complement], i};
        }
        seen[nums[i]] = i;
    }
    return {};
}

int main() {
    vector<int> nums = {2, 7, 11, 15};
    int target = 9;
    vector<int> result = twoSum(nums, target);
    if (!result.empty()) {
        cout << "Indices: " << result[0] << ", " << result[1] << endl;
    }
    return 0;
}`,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    version_count: 1,
    test_case_count: 2,
    test_cases: [
      {
        id: 201,
        program_id: 2,
        input_data: '',
        expected_output: 'Indices: 0, 1',
        is_sample: true,
        order_index: 1,
      },
    ],
  },
  {
    id: 3,
    title: 'QuickSort Implementation',
    description: 'Efficient in-place divide and conquer sorting algorithm.',
    language: 'c',
    category: 'Algorithms',
    user_id: 1,
    author_username: 'Prof_Sharma',
    is_public: true,
    source_code: `#include <stdio.h>

void swap(int* a, int* b) {
    int t = *a;
    *a = *b;
    *b = t;
}

int partition(int arr[], int low, int high) {
    int pivot = arr[high];
    int i = (low - 1);
    for (int j = low; j <= high - 1; j++) {
        if (arr[j] < pivot) {
            i++;
            swap(&arr[i], &arr[j]);
        }
    }
    swap(&arr[i + 1], &arr[high]);
    return (i + 1);
}

void quickSort(int arr[], int low, int high) {
    if (low < high) {
        int pi = partition(arr, low, high);
        quickSort(arr, low, pi - 1);
        quickSort(arr, pi + 1, high);
    }
}

int main() {
    int arr[] = {10, 7, 8, 9, 1, 5};
    int n = sizeof(arr) / sizeof(arr[0]);
    quickSort(arr, 0, n - 1);
    printf("Sorted array: ");
    for (int i = 0; i < n; i++)
        printf("%d ", arr[i]);
    printf("\\n");
    return 0;
}`,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    version_count: 1,
    test_case_count: 1,
    test_cases: [
      {
        id: 301,
        program_id: 3,
        input_data: '',
        expected_output: 'Sorted array: 1 5 7 8 9 10',
        is_sample: true,
        order_index: 1,
      },
    ],
  },
  {
    id: 4,
    title: 'LRU Cache Design',
    description: 'Least Recently Used (LRU) Cache data structure implementation.',
    language: 'java',
    category: 'System Design',
    user_id: 1,
    author_username: 'Prof_Sharma',
    is_public: true,
    source_code: `import java.util.LinkedHashMap;
import java.util.Map;

public class Main {
    static class LRUCache<K, V> extends LinkedHashMap<K, V> {
        private final int capacity;
        public LRUCache(int capacity) {
            super(capacity, 0.75f, true);
            this.capacity = capacity;
        }
        @Override
        protected boolean removeEldestEntry(Map.Entry<K, V> eldest) {
            return size() > capacity;
        }
    }

    public static void main(String[] args) {
        LRUCache<Integer, String> cache = new LRUCache<>(2);
        cache.put(1, "Page 1");
        cache.put(2, "Page 2");
        cache.get(1); // accessed 1
        cache.put(3, "Page 3"); // evicts 2
        System.out.println("Contains Key 2: " + cache.containsKey(2));
        System.out.println("Contains Key 1: " + cache.containsKey(1));
    }
}`,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    version_count: 1,
    test_case_count: 1,
    test_cases: [
      {
        id: 401,
        program_id: 4,
        input_data: '',
        expected_output: 'Contains Key 2: false\nContains Key 1: true',
        is_sample: true,
        order_index: 1,
      },
    ],
  },
  {
    id: 5,
    title: 'Async Promise Queue',
    description: 'Concurrent asynchronous task worker queue with batching.',
    language: 'javascript',
    category: 'Web Development',
    user_id: 1,
    author_username: 'Alex_Dev',
    is_public: true,
    source_code: `async function runTasks() {
    const tasks = [1, 2, 3, 4, 5].map((id) => {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve(\`Task \${id} completed\`);
            }, 10);
        });
    });

    const results = await Promise.all(tasks);
    results.forEach((res) => console.log(res));
}

runTasks();`,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    version_count: 1,
    test_case_count: 1,
  },
  {
    id: 6,
    title: 'Concurrent Web Crawler',
    description: 'Goroutines and channels for concurrent scraping simulation.',
    language: 'go',
    category: 'Concurrency',
    user_id: 1,
    author_username: 'Alex_Dev',
    is_public: true,
    source_code: `package main
import (
    "fmt"
    "sync"
)

func fetch(url string, wg *sync.WaitGroup, ch chan<- string) {
    defer wg.Done()
    ch <- fmt.Sprintf("Fetched: %s", url)
}

func main() {
    urls := []string{"https://golang.org", "https://github.com", "https://vercel.com"}
    var wg sync.WaitGroup
    ch := make(chan string, len(urls))

    for _, u := range urls {
        wg.Add(1)
        go fetch(u, &wg, ch)
    }

    wg.Wait()
    close(ch)

    for msg := range ch {
        fmt.Println(msg)
    }
}`,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    version_count: 1,
    test_case_count: 1,
  },
  {
    id: 7,
    title: 'Rust Memory Safe Tree',
    description: 'Binary Search Tree implementation utilizing Rust Rc and RefCell.',
    language: 'rust',
    category: 'Data Structures',
    user_id: 1,
    author_username: 'Alex_Dev',
    is_public: true,
    source_code: `#[derive(Debug)]
struct TreeNode {
    val: i32,
    left: Option<Box<TreeNode>>,
    right: Option<Box<TreeNode>>,
}

impl TreeNode {
    fn new(val: i32) -> Self {
        TreeNode { val, left: None, right: None }
    }
}

fn main() {
    let mut root = TreeNode::new(10);
    root.left = Some(Box::new(TreeNode::new(5)));
    root.right = Some(Box::new(TreeNode::new(15)));
    println!("Root Node value: {}", root.val);
    println!("Left child value: {}", root.left.unwrap().val);
}`,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    version_count: 1,
    test_case_count: 1,
  },
  {
    id: 8,
    title: 'Student Performance Analytics',
    description: 'SQL aggregations and window functions for student rankings.',
    language: 'sql',
    category: 'Databases',
    user_id: 1,
    author_username: 'Prof_Sharma',
    is_public: true,
    source_code: `CREATE TABLE students (
    id INTEGER PRIMARY KEY,
    name TEXT,
    subject TEXT,
    marks INTEGER
);

INSERT INTO students VALUES 
(1, 'Rupanjan', 'Math', 98),
(2, 'Alex', 'Math', 92),
(3, 'Priya', 'Math', 95),
(4, 'Meera', 'Science', 88),
(5, 'Rohit', 'Science', 94);

SELECT subject, AVG(marks) as avg_marks, MAX(marks) as highest
FROM students
GROUP BY subject;`,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    version_count: 1,
    test_case_count: 1,
  },
  {
    id: 9,
    title: 'Glassmorphism UI Card',
    description: 'Modern CSS glassmorphic card component with hover micro-animations.',
    language: 'html',
    category: 'Frontend & UI',
    user_id: 1,
    author_username: 'Alex_Dev',
    is_public: true,
    source_code: `<!DOCTYPE html>
<html>
<head>
  <style>
    body {
      margin: 0;
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      background: radial-gradient(circle at top right, #1e1b4b, #0f172a);
      font-family: system-ui, sans-serif;
      color: white;
    }
    .glass-card {
      background: rgba(255, 255, 255, 0.06);
      backdrop-filter: blur(16px);
      border: 1px solid rgba(255, 255, 255, 0.15);
      padding: 32px;
      border-radius: 24px;
      box-shadow: 0 20px 40px rgba(0, 0, 0, 0.4);
      text-align: center;
      transition: transform 0.3s ease;
    }
    .glass-card:hover {
      transform: translateY(-6px);
    }
    h2 { margin-top: 0; color: #38bdf8; }
    p { color: #94a3b8; font-size: 14px; }
  </style>
</head>
<body>
  <div class="glass-card">
    <h2>✨ CodeVault Pro Glass Card</h2>
    <p>Live In-Browser HTML / CSS Engine</p>
  </div>
</body>
</html>`,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    version_count: 1,
    test_case_count: 1,
  },
];

export function getLocalPrograms(): Program[] {
  const customSaved = localStorage.getItem('codevault_custom_programs');
  if (customSaved) {
    try {
      const parsed = JSON.parse(customSaved);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return [...parsed, ...DEFAULT_PROGRAMS];
      }
    } catch (e) {}
  }
  return DEFAULT_PROGRAMS;
}

export function getLocalProgramById(id: number): Program | undefined {
  const all = getLocalPrograms();
  return all.find((p) => p.id === id);
}

export function saveLocalProgram(program: Partial<Program>): Program {
  const existing = getLocalPrograms();
  const newId = program.id || Date.now();
  const created: Program = {
    id: newId,
    title: program.title || 'Untitled Program',
    description: program.description || '',
    language: program.language || 'python',
    category: program.category || 'General',
    user_id: program.user_id || 1,
    author_username: program.author_username || 'Student',
    is_public: program.is_public ?? true,
    source_code: program.source_code || '',
    created_at: program.created_at || new Date().toISOString(),
    updated_at: new Date().toISOString(),
    version_count: (program.version_count || 0) + 1,
    test_case_count: program.test_cases?.length || 0,
    test_cases: program.test_cases || [],
  };

  const customOnly = (localStorage.getItem('codevault_custom_programs') 
    ? JSON.parse(localStorage.getItem('codevault_custom_programs')!) 
    : []) as Program[];

  const updatedCustom = [created, ...customOnly.filter((p) => p.id !== newId)];
  localStorage.setItem('codevault_custom_programs', JSON.stringify(updatedCustom));
  return created;
}
