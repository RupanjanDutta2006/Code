export type StudySubjectId = 'dsa' | 'c' | 'python' | 'java' | string;
export type StudyResourceType = 'theory' | 'notes' | 'code' | 'document' | 'assignment' | 'practice' | 'link' | 'github';
export type SupportedLanguage = 'c' | 'cpp' | 'python' | 'java' | 'javascript' | 'go' | 'rust';

export interface StudyResourceItem {
  id: string;
  title: string;
  description?: string;
  resourceType: StudyResourceType;
  language?: SupportedLanguage;
  sourceCode?: string;
  fileUrl?: string;
  githubUrl?: string;
  megaUrl?: string;
  downloadableOffline?: boolean;
  topicId: string;
  subtopicId?: string;
  authorName?: string;
  createdAt?: string;
}

export interface StudyTopic {
  id: string;
  title: string;
  description: string;
  icon?: string;
  resources: StudyResourceItem[];
}

export interface StudySubject {
  id: StudySubjectId;
  title: string;
  shortName: string;
  description: string;
  icon: string;
  color: string;
  badgeBg: string;
  borderColor: string;
  availableLanguages?: SupportedLanguage[];
  topics: StudyTopic[];
}

export const STUDY_SUBJECTS: StudySubject[] = [
  // ==========================================
  // 1. DATA STRUCTURES & ALGORITHMS (DSA)
  // ==========================================
  {
    id: 'dsa',
    title: 'Data Structures & Algorithms',
    shortName: 'DSA',
    description: 'Core computational problem solving, data representations, algorithms, time/space complexity & competitive programming.',
    icon: '🧠',
    color: '#10b981',
    badgeBg: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
    borderColor: 'hover:border-emerald-500/50',
    availableLanguages: ['c', 'python', 'java', 'cpp', 'javascript'],
    topics: [
      {
        id: 'sorting',
        title: 'Sorting Algorithms',
        description: 'Comparison and non-comparison based sorting techniques with complexity analysis.',
        icon: '📊',
        resources: [
          {
            id: 'dsa-sort-bubble-theory',
            title: 'Bubble Sort — Concept & Analysis',
            description: 'Step-by-step adjacent element swapping algorithm with O(n²) worst-case and O(n) best-case time complexity.',
            resourceType: 'theory',
            topicId: 'sorting',
            subtopicId: 'bubble-sort',
            downloadableOffline: true,
          },
          {
            id: 'dsa-sort-bubble-c',
            title: 'Bubble Sort in C',
            description: 'Standard in-place bubble sort implementation in C with optimized swap flag.',
            resourceType: 'code',
            language: 'c',
            topicId: 'sorting',
            subtopicId: 'bubble-sort',
            githubUrl: 'https://github.com/RupanjanDutta2006/C-CODES/tree/main/DATA%20STRUCTURE',
            sourceCode: `#include <stdio.h>

void bubbleSort(int arr[], int n) {
    int i, j, temp, swapped;
    for (i = 0; i < n - 1; i++) {
        swapped = 0;
        for (j = 0; j < n - i - 1; j++) {
            if (arr[j] > arr[j + 1]) {
                temp = arr[j];
                arr[j] = arr[j + 1];
                arr[j + 1] = temp;
                swapped = 1;
            }
        }
        if (swapped == 0) break;
    }
}

int main() {
    int arr[] = {64, 34, 25, 12, 22, 11, 90};
    int n = sizeof(arr) / sizeof(arr[0]);
    bubbleSort(arr, n);
    printf("Sorted array: ");
    for (int i = 0; i < n; i++) printf("%d ", arr[i]);
    printf("\\n");
    return 0;
}`,
          },
          {
            id: 'dsa-sort-bubble-py',
            title: 'Bubble Sort in Python',
            description: 'Pythonic implementation of bubble sort algorithm with early termination.',
            resourceType: 'code',
            language: 'python',
            topicId: 'sorting',
            subtopicId: 'bubble-sort',
            githubUrl: 'https://github.com/RupanjanDutta2006/Python-Codes',
            sourceCode: `def bubble_sort(arr):
    n = len(arr)
    for i in range(n - 1):
        swapped = False
        for j in range(n - i - 1):
            if arr[j] > arr[j + 1]:
                arr[j], arr[j + 1] = arr[j + 1], arr[j]
                swapped = True
        if not swapped:
            break
    return arr

if __name__ == '__main__':
    nums = [64, 34, 25, 12, 22, 11, 90]
    sorted_nums = bubble_sort(nums)
    print("Sorted array:", sorted_nums)`,
          },
          {
            id: 'dsa-sort-bubble-java',
            title: 'Bubble Sort in Java',
            description: 'Java class implementation of bubble sort with sample test cases.',
            resourceType: 'code',
            language: 'java',
            topicId: 'sorting',
            subtopicId: 'bubble-sort',
            sourceCode: `public class BubbleSort {
    public static void bubbleSort(int[] arr) {
        int n = arr.length;
        boolean swapped;
        for (int i = 0; i < n - 1; i++) {
            swapped = false;
            for (int j = 0; j < n - i - 1; j++) {
                if (arr[j] > arr[j + 1]) {
                    int temp = arr[j];
                    arr[j] = arr[j + 1];
                    arr[j + 1] = temp;
                    swapped = true;
                }
            }
            if (!swapped) break;
        }
    }

    public static void main(String[] args) {
        int[] arr = {64, 34, 25, 12, 22, 11, 90};
        bubbleSort(arr);
        System.out.print("Sorted array: ");
        for (int num : arr) System.out.print(num + " ");
        System.out.println();
    }
}`,
          },
          {
            id: 'dsa-sort-selection-c',
            title: 'Selection Sort in C',
            description: 'Finds minimum element in unsorted partition and places at beginning.',
            resourceType: 'code',
            language: 'c',
            topicId: 'sorting',
            subtopicId: 'selection-sort',
            githubUrl: 'https://github.com/RupanjanDutta2006/C-CODES/tree/main/DATA%20STRUCTURE',
            sourceCode: `#include <stdio.h>

void selectionSort(int arr[], int n) {
    for (int i = 0; i < n - 1; i++) {
        int min_idx = i;
        for (int j = i + 1; j < n; j++) {
            if (arr[j] < arr[min_idx]) min_idx = j;
        }
        int temp = arr[min_idx];
        arr[min_idx] = arr[i];
        arr[i] = temp;
    }
}

int main() {
    int arr[] = {29, 10, 14, 37, 13};
    int n = sizeof(arr) / sizeof(arr[0]);
    selectionSort(arr, n);
    for (int i = 0; i < n; i++) printf("%d ", arr[i]);
    printf("\\n");
    return 0;
}`,
          },
          {
            id: 'dsa-sort-selection-py',
            title: 'Selection Sort in Python',
            description: 'Python implementation of selection sort.',
            resourceType: 'code',
            language: 'python',
            topicId: 'sorting',
            subtopicId: 'selection-sort',
            githubUrl: 'https://github.com/RupanjanDutta2006/Python-Codes',
            sourceCode: `def selection_sort(arr):
    n = len(arr)
    for i in range(n - 1):
        min_idx = i
        for j in range(i + 1, n):
            if arr[j] < arr[min_idx]:
                min_idx = j
        arr[i], arr[min_idx] = arr[min_idx], arr[i]
    return arr

if __name__ == '__main__':
    data = [29, 10, 14, 37, 13]
    print("Sorted:", selection_sort(data))`,
          },
          {
            id: 'dsa-sort-selection-java',
            title: 'Selection Sort in Java',
            description: 'Java selection sort implementation.',
            resourceType: 'code',
            language: 'java',
            topicId: 'sorting',
            subtopicId: 'selection-sort',
            sourceCode: `public class SelectionSort {
    public static void sort(int[] arr) {
        int n = arr.length;
        for (int i = 0; i < n - 1; i++) {
            int minIdx = i;
            for (int j = i + 1; j < n; j++) {
                if (arr[j] < arr[minIdx]) minIdx = j;
            }
            int temp = arr[minIdx];
            arr[minIdx] = arr[i];
            arr[i] = temp;
        }
    }

    public static void main(String[] args) {
        int[] arr = {29, 10, 14, 37, 13};
        sort(arr);
        for (int x : arr) System.out.print(x + " ");
        System.out.println();
    }
}`,
          },
        ],
      },
      {
        id: 'searching',
        title: 'Searching Algorithms',
        description: 'Linear, Binary and divide-and-conquer searching algorithms.',
        icon: '🔍',
        resources: [
          {
            id: 'dsa-search-binary-theory',
            title: 'Binary Search — Theory & Logarithmic Complexity',
            description: 'Divide and conquer search algorithm on sorted collections with O(log n) efficiency.',
            resourceType: 'theory',
            topicId: 'searching',
            subtopicId: 'binary-search',
            downloadableOffline: true,
          },
          {
            id: 'dsa-search-binary-c',
            title: 'Binary Search in C',
            description: 'Iterative binary search implementation in C.',
            resourceType: 'code',
            language: 'c',
            topicId: 'searching',
            subtopicId: 'binary-search',
            githubUrl: 'https://github.com/RupanjanDutta2006/C-CODES/tree/main/DATA%20STRUCTURE',
            sourceCode: `#include <stdio.h>

int binarySearch(int arr[], int l, int r, int target) {
    while (l <= r) {
        int mid = l + (r - l) / 2;
        if (arr[mid] == target) return mid;
        if (arr[mid] < target) l = mid + 1;
        else r = mid - 1;
    }
    return -1;
}

int main() {
    int arr[] = {2, 5, 8, 12, 16, 23, 38, 56, 72, 91};
    int n = sizeof(arr) / sizeof(arr[0]);
    int target = 23;
    int result = binarySearch(arr, 0, n - 1, target);
    if (result != -1) printf("Element found at index: %d\\n", result);
    else printf("Element not present in array\\n");
    return 0;
}`,
          },
          {
            id: 'dsa-search-binary-py',
            title: 'Binary Search in Python',
            description: 'Python implementation of binary search algorithm.',
            resourceType: 'code',
            language: 'python',
            topicId: 'searching',
            subtopicId: 'binary-search',
            githubUrl: 'https://github.com/RupanjanDutta2006/Python-Codes',
            sourceCode: `def binary_search(arr, target):
    left, right = 0, len(arr) - 1
    while left <= right:
        mid = left + (right - left) // 2
        if arr[mid] == target:
            return mid
        elif arr[mid] < target:
            left = mid + 1
        else:
            right = mid - 1
    return -1

if __name__ == '__main__':
    items = [2, 5, 8, 12, 16, 23, 38, 56, 72, 91]
    target = 23
    idx = binary_search(items, target)
    print(f"Target {target} located at index: {idx}")`,
          },
          {
            id: 'dsa-search-binary-java',
            title: 'Binary Search in Java',
            description: 'Java binary search implementation with edge case verification.',
            resourceType: 'code',
            language: 'java',
            topicId: 'searching',
            subtopicId: 'binary-search',
            sourceCode: `public class BinarySearch {
    public static int search(int[] arr, int target) {
        int left = 0, right = arr.length - 1;
        while (left <= right) {
            int mid = left + (right - left) / 2;
            if (arr[mid] == target) return mid;
            if (arr[mid] < target) left = mid + 1;
            else right = mid - 1;
        }
        return -1;
    }

    public static void main(String[] args) {
        int[] arr = {2, 5, 8, 12, 16, 23, 38, 56, 72, 91};
        int target = 23;
        int idx = search(arr, target);
        System.out.println("Element index: " + idx);
    }
}`,
          },
        ],
      },
      {
        id: 'linked-list',
        title: 'Linked Lists',
        description: 'Dynamic node-based memory structures, pointers, reversing, and cycle detection.',
        icon: '🔗',
        resources: [
          {
            id: 'dsa-ll-theory',
            title: 'Singly Linked List — Node Structure & Traversal',
            description: 'Dynamic memory allocation, head/tail pointers, insertion and deletion.',
            resourceType: 'theory',
            topicId: 'linked-list',
            downloadableOffline: true,
          },
          {
            id: 'dsa-ll-reverse-c',
            title: 'Reverse Linked List in C',
            description: 'In-place iterative reversal using prev, curr, next pointers.',
            resourceType: 'code',
            language: 'c',
            topicId: 'linked-list',
            githubUrl: 'https://github.com/RupanjanDutta2006/C-CODES/tree/main/DATA%20STRUCTURE',
            sourceCode: `#include <stdio.h>
#include <stdlib.h>

struct Node {
    int data;
    struct Node* next;
};

struct Node* reverseList(struct Node* head) {
    struct Node *prev = NULL, *curr = head, *next = NULL;
    while (curr != NULL) {
        next = curr->next;
        curr->next = prev;
        prev = curr;
        curr = next;
    }
    return prev;
}

void printList(struct Node* node) {
    while (node != NULL) {
        printf("%d -> ", node->data);
        node = node->next;
    }
    printf("NULL\\n");
}

int main() {
    struct Node* head = (struct Node*)malloc(sizeof(struct Node));
    head->data = 1;
    head->next = (struct Node*)malloc(sizeof(struct Node));
    head->next->data = 2;
    head->next->next = (struct Node*)malloc(sizeof(struct Node));
    head->next->next->data = 3;
    head->next->next->next = NULL;

    printf("Original: ");
    printList(head);
    head = reverseList(head);
    printf("Reversed: ");
    printList(head);
    return 0;
}`,
          },
          {
            id: 'dsa-ll-reverse-py',
            title: 'Reverse Linked List in Python',
            description: 'Python implementation of node-based linked list reversal.',
            resourceType: 'code',
            language: 'python',
            topicId: 'linked-list',
            githubUrl: 'https://github.com/RupanjanDutta2006/Python-Codes',
            sourceCode: `class ListNode:
    def __init__(self, val=0, next=None):
        self.val = val
        self.next = next

def reverse_list(head):
    prev = None
    curr = head
    while curr:
        nxt = curr.next
        curr.next = prev
        prev = curr
        curr = nxt
    return prev`,
          },
          {
            id: 'dsa-ll-reverse-java',
            title: 'Reverse Linked List in Java',
            description: 'Java ListNode reversal algorithm.',
            resourceType: 'code',
            language: 'java',
            topicId: 'linked-list',
            sourceCode: `class ListNode {
    int val;
    ListNode next;
    ListNode(int val) { this.val = val; }
}

public class ReverseLinkedList {
    public static ListNode reverseList(ListNode head) {
        ListNode prev = null;
        ListNode curr = head;
        while (curr != null) {
            ListNode next = curr.next;
            curr.next = prev;
            prev = curr;
            curr = next;
        }
        return prev;
    }
}`,
          },
        ],
      },
      {
        id: 'creator-dsa-vault',
        title: 'DSA Problem Sets & Competitive Solutions',
        description: 'Curated problem sets, handwritten notes & competitive programming archives.',
        icon: '🏆',
        resources: [
          {
            id: 'creator-dsa-mega-notes',
            title: 'Complete DSA Problem Sets (Mega Drive)',
            description: 'Handcrafted theory notes, categorization across arrays, trees, graphs, and dynamic programming.',
            resourceType: 'document',
            megaUrl: 'https://mega.nz/folder/k2ARjBJA#zY20iT3K2w_o2yP1q6a33A',
            topicId: 'creator-dsa-vault',
          },
          {
            id: 'creator-dsa-cp-repo',
            title: 'Competitive Programming Codes (GitHub)',
            description: 'Optimized solutions for LeetCode, Codeforces, and CodeChef contest problems.',
            resourceType: 'github',
            githubUrl: 'https://github.com/RupanjanDutta2006/CP-SOLUTIONS',
            topicId: 'creator-dsa-vault',
          },
        ],
      },
    ],
  },

  // ==========================================
  // 2. C PROGRAMMING LANGUAGE
  // ==========================================
  {
    id: 'c',
    title: 'C Programming',
    shortName: 'C Language',
    description: 'Comprehensive mastery of C language: fundamentals, syntax, pointers, memory allocation, structs, and file I/O.',
    icon: '💻',
    color: '#3b82f6',
    badgeBg: 'bg-blue-500/10 text-blue-400 border-blue-500/30',
    borderColor: 'hover:border-blue-500/50',
    topics: [
      {
        id: 'c-basics',
        title: 'Fundamentals & Syntax',
        description: 'Variables, data types, operators, format specifiers, and I/O streams.',
        icon: '⚙️',
        resources: [
          {
            id: 'c-basics-notes',
            title: 'C Fundamentals & Memory Architecture',
            description: 'Data types, integer sizing, stack vs heap, variable scope and operators.',
            resourceType: 'notes',
            topicId: 'c-basics',
            downloadableOffline: true,
          },
          {
            id: 'c-basics-code-io',
            title: 'Formatted Input and Output in C',
            description: 'Demonstrating printf, scanf, format flags and precision specifiers.',
            resourceType: 'code',
            language: 'c',
            topicId: 'c-basics',
            githubUrl: 'https://github.com/RupanjanDutta2006/C-CODES/tree/main/FUNDAMENTALS%20OF%20C',
            sourceCode: `#include <stdio.h>

int main() {
    int age = 20;
    float gpa = 3.95;
    char grade = 'A';
    char name[50] = "Souvik";

    printf("Student: %s\\n", name);
    printf("Age: %d years\\n", age);
    printf("GPA: %.2f (Grade: %c)\\n", gpa, grade);
    return 0;
}`,
          },
        ],
      },
      {
        id: 'c-pointers',
        title: 'Pointers & Dynamic Memory',
        description: 'Address-of operator, dereferencing, pointer arithmetic, malloc, calloc, realloc, and free.',
        icon: '📍',
        resources: [
          {
            id: 'c-pointers-theory',
            title: 'Pointers & Memory Layout Theory',
            description: 'Understanding memory addresses, pointer dereferencing, double pointers and heap management.',
            resourceType: 'theory',
            topicId: 'c-pointers',
            downloadableOffline: true,
          },
          {
            id: 'c-pointers-code-malloc',
            title: 'Dynamic Memory Allocation (malloc/free)',
            description: 'Allocating runtime integer buffer on heap with safety checks and clean deallocation.',
            resourceType: 'code',
            language: 'c',
            topicId: 'c-pointers',
            githubUrl: 'https://github.com/RupanjanDutta2006/C-CODES/tree/main/FUNDAMENTALS%20OF%20C',
            sourceCode: `#include <stdio.h>
#include <stdlib.h>

int main() {
    int n = 5;
    int *arr = (int*)malloc(n * sizeof(int));
    if (arr == NULL) {
        printf("Memory allocation failed!\\n");
        return 1;
    }

    for (int i = 0; i < n; i++) {
        arr[i] = (i + 1) * 10;
    }

    printf("Dynamically allocated array: ");
    for (int i = 0; i < n; i++) {
        printf("%d ", arr[i]);
    }
    printf("\\n");

    free(arr);
    arr = NULL;
    return 0;
}`,
          },
        ],
      },
      {
        id: 'c-creator-notes',
        title: 'C Handcrafted Notes & Assignments',
        description: 'Curated university lecture notes, problem sets, and repository archives.',
        icon: '📚',
        resources: [
          {
            id: 'c-creator-mega-notes',
            title: 'C & C++ Handwritten Notes (Mega Drive)',
            description: 'Structured handwritten lecture notes with memory layouts, dry runs, and exam questions.',
            resourceType: 'document',
            megaUrl: 'https://mega.nz/folder/UuRmhbaK#70s9jG6Z_n12i7Y1G9y33A',
            topicId: 'c-creator-notes',
          },
          {
            id: 'c-creator-mega-assign',
            title: 'C Practice Assignments (Mega Drive)',
            description: 'University and competitive programming assignment sets with solutions.',
            resourceType: 'assignment',
            megaUrl: 'https://mega.nz/folder/E2oRzCja#yY20iT3K2w_o2yP1q6a33A',
            topicId: 'c-creator-notes',
          },
          {
            id: 'c-creator-github-codes',
            title: 'All C Codes Repository (GitHub)',
            description: 'Fundamentals of C, pointers, memory management & low-level code examples.',
            resourceType: 'github',
            githubUrl: 'https://github.com/RupanjanDutta2006/C-CODES/tree/main/FUNDAMENTALS%20OF%20C',
            topicId: 'c-creator-notes',
          },
        ],
      },
    ],
  },

  // ==========================================
  // 3. PYTHON PROGRAMMING
  // ==========================================
  {
    id: 'python',
    title: 'Python Programming',
    shortName: 'Python',
    description: 'High-level Python language concepts: data structures, list comprehensions, OOP, decorators, and script development.',
    icon: '🐍',
    color: '#f59e0b',
    badgeBg: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
    borderColor: 'hover:border-amber-500/50',
    topics: [
      {
        id: 'py-basics',
        title: 'Python Fundamentals & Syntax',
        description: 'Variables, dynamic typing, control flow, functions, and string formatting.',
        icon: '⚡',
        resources: [
          {
            id: 'py-basics-theory',
            title: 'Python Overview & Core Syntax',
            description: 'Interpreted execution model, indentation, built-in types, and boolean logic.',
            resourceType: 'theory',
            topicId: 'py-basics',
            downloadableOffline: true,
          },
          {
            id: 'py-basics-code-dict',
            title: 'Dictionaries & List Comprehensions',
            description: 'Pythonic mapping and iterable transformations.',
            resourceType: 'code',
            language: 'python',
            topicId: 'py-basics',
            githubUrl: 'https://github.com/RupanjanDutta2006/Python-Codes',
            sourceCode: `# Dictionary mapping and comprehension
squares = {x: x**2 for x in range(1, 6)}
print("Squares dictionary:", squares)

# Filtered list comprehension
even_squares = [v for k, v in squares.items() if v % 2 == 0]
print("Even squares:", even_squares)`,
          },
        ],
      },
      {
        id: 'py-oop',
        title: 'Object-Oriented Programming in Python',
        description: 'Classes, constructors (__init__), inheritance, encapsulation, and dunder methods.',
        icon: '📦',
        resources: [
          {
            id: 'py-oop-theory',
            title: 'Python OOP Principles & Class Hierarchy',
            description: 'Self reference, class vs instance variables, polymorphism and super() calls.',
            resourceType: 'theory',
            topicId: 'py-oop',
            downloadableOffline: true,
          },
          {
            id: 'py-oop-code-bank',
            title: 'BankAccount Class Implementation',
            description: 'Clean encapsulation of balance, deposit, and withdraw operations in Python.',
            resourceType: 'code',
            language: 'python',
            topicId: 'py-oop',
            githubUrl: 'https://github.com/RupanjanDutta2006/Python-Codes',
            sourceCode: `class BankAccount:
    def __init__(self, account_holder: str, initial_balance: float = 0.0):
        self.holder = account_holder
        self.__balance = initial_balance

    def deposit(self, amount: float) -> None:
        if amount > 0:
            self.__balance += amount
            print(f"Deposited \${amount:.2f}. New Balance: \${self.__balance:.2f}")

    def withdraw(self, amount: float) -> bool:
        if 0 < amount <= self.__balance:
            self.__balance -= amount
            print(f"Withdrew \${amount:.2f}. New Balance: \${self.__balance:.2f}")
            return True
        print("Insufficient funds or invalid amount.")
        return False

    def get_balance(self) -> float:
        return self.__balance

if __name__ == '__main__':
    acc = BankAccount("Souvik", 500.0)
    acc.deposit(250.0)
    acc.withdraw(100.0)`,
          },
        ],
      },
      {
        id: 'py-creator-notes',
        title: 'Python Curated Notes & Assignments',
        description: 'Comprehensive Python repository, Mega theory notes & assignment problems.',
        icon: '📘',
        resources: [
          {
            id: 'py-creator-mega-notes',
            title: 'Python Notes & Cheat-sheets (Mega Drive)',
            description: 'Handcrafted theory notes, cheat-sheets & conceptual guides.',
            resourceType: 'document',
            megaUrl: 'https://mega.nz/folder/guRx3RJK#qr9w7onbKe2oQxjqBfwacA',
            topicId: 'py-creator-notes',
          },
          {
            id: 'py-creator-mega-assign',
            title: 'Python Practice Problem Sheets (Mega Drive)',
            description: 'Practice problem sheets with verified solutions & test examples.',
            resourceType: 'assignment',
            megaUrl: 'https://mega.nz/folder/J64mDTpD#bLNxmJFRPjCg2UY2Fpp1qw',
            topicId: 'py-creator-notes',
          },
          {
            id: 'py-creator-github-repo',
            title: 'Python Codes Repository (GitHub)',
            description: 'Complete Python exercises, scripts & algorithmic implementations.',
            resourceType: 'github',
            githubUrl: 'https://github.com/RupanjanDutta2006/Python-Codes',
            topicId: 'py-creator-notes',
          },
        ],
      },
    ],
  },

  // ==========================================
  // 4. JAVA PROGRAMMING
  // ==========================================
  {
    id: 'java',
    title: 'Java Programming',
    shortName: 'Java',
    description: 'Enterprise & object-oriented Java: JVM architecture, classes, interfaces, collections framework & exception handling.',
    icon: '☕',
    color: '#ef4444',
    badgeBg: 'bg-rose-500/10 text-rose-400 border-rose-500/30',
    borderColor: 'hover:border-rose-500/50',
    topics: [
      {
        id: 'java-basics',
        title: 'Java Fundamentals & OOP',
        description: 'Java classes, methods, constructors, encapsulation, interfaces and collections.',
        icon: '☕',
        resources: [
          {
            id: 'java-basics-theory',
            title: 'Java OOPs & JVM Architecture Notes',
            description: 'Class vs Object, inheritance, method overloading/overriding, garbage collection.',
            resourceType: 'theory',
            topicId: 'java-basics',
            downloadableOffline: true,
          },
          {
            id: 'java-basics-code-student',
            title: 'Student Grade Tracker Class in Java',
            description: 'Demonstrating encapsulation, getters/setters, and methods in Java.',
            resourceType: 'code',
            language: 'java',
            topicId: 'java-basics',
            sourceCode: `public class Student {
    private String name;
    private int rollNo;
    private double marks;

    public Student(String name, int rollNo, double marks) {
        this.name = name;
        this.rollNo = rollNo;
        this.marks = marks;
    }

    public void displayInfo() {
        System.out.println("Roll: " + rollNo + " | Name: " + name + " | Marks: " + marks);
    }

    public static void main(String[] args) {
        Student s1 = new Student("Souvik Saha", 101, 94.5);
        s1.displayInfo();
    }
}`,
          },
        ],
      },
      {
        id: 'java-creator-notes',
        title: 'Java Notes & Practice Problems',
        description: 'Object-oriented programming notes, assignments & exam sheets.',
        icon: '📕',
        resources: [
          {
            id: 'java-creator-mega-notes',
            title: 'Java Theory & OOPs Notes (Mega Drive)',
            description: 'Object-oriented programming, multithreading, JVM architecture & collections.',
            resourceType: 'document',
            megaUrl: 'https://mega.nz/folder/Y7B2nQjA#m35q2q1p6_o2yP1q6a33A',
            topicId: 'java-creator-notes',
          },
          {
            id: 'java-creator-mega-assign',
            title: 'Java Assignments & Practice Sheets (Mega Drive)',
            description: 'Comprehensive assignment problems with test cases and solution code.',
            resourceType: 'assignment',
            megaUrl: 'https://mega.nz/folder/1n4SgLzA#xY20iT3K2w_o2yP1q6a33A',
            topicId: 'java-creator-notes',
          },
        ],
      },
    ],
  },
];