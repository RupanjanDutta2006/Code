from datetime import datetime, timedelta
import json
from sqlalchemy.orm import Session
from backend.database.database import engine, Base, SessionLocal
from backend.models import (
    User, UserRole, Folder, Program, ProgramVersion, TestCase,
    Classroom, ClassroomMember, ClassroomAssignment, Submission, ProgramEvent
)
from backend.utils.security import get_password_hash
from backend.services.hash_service import compute_content_hash

def seed_database():
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()

    # Check if already seeded
    if db.query(User).first():
        db.close()
        return

    print("Seeding CodeVault Pro initial database...")

    # 1. Create Users
    creator = User(
        username="creator",
        email="creator@codevault.pro",
        hashed_password=get_password_hash("password123"),
        role=UserRole.CREATOR,
        full_name="Alex Chen (Creator)"
    )
    teacher = User(
        username="prof_sharma",
        email="teacher@codevault.pro",
        hashed_password=get_password_hash("password123"),
        role=UserRole.TEACHER,
        full_name="Prof. Rajesh Sharma"
    )
    student1 = User(
        username="asha_r",
        email="asha@codevault.pro",
        hashed_password=get_password_hash("password123"),
        role=UserRole.USER,
        full_name="Asha R."
    )
    student2 = User(
        username="rohit_k",
        email="rohit@codevault.pro",
        hashed_password=get_password_hash("password123"),
        role=UserRole.USER,
        full_name="Rohit K."
    )
    student3 = User(
        username="meera_s",
        email="meera@codevault.pro",
        hashed_password=get_password_hash("password123"),
        role=UserRole.USER,
        full_name="Meera S."
    )

    db.add_all([creator, teacher, student1, student2, student3])
    db.commit()
    db.refresh(creator)
    db.refresh(teacher)
    db.refresh(student1)
    db.refresh(student2)
    db.refresh(student3)

    # 2. Folders
    f_dsa = Folder(name="DSA", parent_id=None, user_id=creator.id)
    f_web = Folder(name="Web_Dev", parent_id=None, user_id=creator.id)
    f_sql = Folder(name="Databases", parent_id=None, user_id=creator.id)
    db.add_all([f_dsa, f_web, f_sql])
    db.commit()
    db.refresh(f_dsa)

    f_trees = Folder(name="Trees_and_Search", parent_id=f_dsa.id, user_id=creator.id)
    db.add(f_trees)
    db.commit()
    db.refresh(f_trees)

    # 3. Programs
    programs_data = [
        {
            "title": "Binary Search",
            "description": "Standard O(log n) binary search algorithm to find index of a target element in a sorted array.",
            "language": "python",
            "category": "Data Structures & Algorithms",
            "folder_id": f_trees.id,
            "user_id": teacher.id,
            "source_code": """def binary_search(arr, target):
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
    import sys
    input_data = sys.stdin.read().split()
    if input_data:
        n = int(input_data[0])
        arr = [int(x) for x in input_data[1:n+1]]
        target = int(input_data[n+1])
        idx = binary_search(arr, target)
        if idx != -1:
            print(f"Element found at index {idx}")
        else:
            print("Element not found")
    else:
        sample = [10, 20, 30, 40, 50]
        print(f"Element found at index {binary_search(sample, 30)}")
""",
            "test_cases": [
                {"input": "5\n10 20 30 40 50\n30", "expected": "Element found at index 2", "is_sample": True},
                {"input": "4\n1 3 5 7\n1", "expected": "Element found at index 0", "is_sample": True},
                {"input": "3\n2 4 6\n5", "expected": "Element not found", "is_sample": False}
            ]
        },
        {
            "title": "Factorial Calculation",
            "description": "Calculates factorial of a non-negative integer using recursive function in C.",
            "language": "c",
            "category": "Fundamentals",
            "folder_id": f_dsa.id,
            "user_id": teacher.id,
            "source_code": """#include <stdio.h>

long long factorial(int n) {
    if (n <= 1) return 1;
    return n * factorial(n - 1);
}

int main() {
    int n;
    if (scanf("%d", &n) == 1) {
        printf("%lld\\n", factorial(n));
    } else {
        printf("%lld\\n", factorial(5));
    }
    return 0;
}
""",
            "test_cases": [
                {"input": "5", "expected": "120", "is_sample": True},
                {"input": "0", "expected": "1", "is_sample": True},
                {"input": "6", "expected": "720", "is_sample": False}
            ]
        },
        {
            "title": "Two Sum (O(n) Hash Map)",
            "description": "Find indices of the two numbers in an array such that they add up to target.",
            "language": "cpp",
            "category": "Data Structures & Algorithms",
            "folder_id": f_dsa.id,
            "user_id": creator.id,
            "source_code": """#include <iostream>
#include <vector>
#include <unordered_map>

using namespace std;

int main() {
    int n, target;
    if (!(cin >> n)) {
        vector<int> nums = {2, 7, 11, 15};
        target = 9;
        n = 4;
        unordered_map<int, int> seen;
        for (int i = 0; i < n; i++) {
            int comp = target - nums[i];
            if (seen.count(comp)) {
                cout << seen[comp] << " " << i << "\\n";
                return 0;
            }
            seen[nums[i]] = i;
        }
        return 0;
    }

    vector<int> nums(n);
    for (int i = 0; i < n; i++) cin >> nums[i];
    cin >> target;

    unordered_map<int, int> seen;
    for (int i = 0; i < n; i++) {
        int comp = target - nums[i];
        if (seen.count(comp)) {
            cout << seen[comp] << " " << i << "\\n";
            return 0;
        }
        seen[nums[i]] = i;
    }
    cout << "-1 -1\\n";
    return 0;
}
""",
            "test_cases": [
                {"input": "4\n2 7 11 15\n9", "expected": "0 1", "is_sample": True},
                {"input": "3\n3 2 4\n6", "expected": "1 2", "is_sample": True}
            ]
        },
        {
            "title": "Stack Balanced Parentheses",
            "description": "Validates whether string containing '()', '{}', '[]' has matched brackets.",
            "language": "java",
            "category": "Data Structures & Algorithms",
            "folder_id": f_dsa.id,
            "user_id": creator.id,
            "source_code": """import java.util.*;

public class Main {
    public static boolean isValid(String s) {
        Stack<Character> stack = new Stack<>();
        for (char c : s.toCharArray()) {
            if (c == '(') stack.push(')');
            else if (c == '{') stack.push('}');
            else if (c == '[') stack.push(']');
            else if (stack.isEmpty() || stack.pop() != c) return false;
        }
        return stack.isEmpty();
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        String s = sc.hasNext() ? sc.next() : "({[]})";
        System.out.println(isValid(s) ? "VALID" : "INVALID");
    }
}
""",
            "test_cases": [
                {"input": "({[]})", "expected": "VALID", "is_sample": True},
                {"input": "([)]", "expected": "INVALID", "is_sample": True}
            ]
        },
        {
            "title": "Students & Course Grades DB",
            "description": "Creates students table, enrollments, and computes class average and top performers using SQLite.",
            "language": "sql",
            "category": "Database & SQL",
            "folder_id": f_sql.id,
            "user_id": creator.id,
            "source_code": """CREATE TABLE students (
    id INTEGER PRIMARY KEY,
    name TEXT NOT NULL,
    department TEXT NOT NULL
);

CREATE TABLE grades (
    student_id INTEGER,
    course TEXT NOT NULL,
    score INTEGER NOT NULL
);

INSERT INTO students VALUES (1, 'Asha Sharma', 'Computer Science');
INSERT INTO students VALUES (2, 'Rohit Kumar', 'Information Technology');
INSERT INTO students VALUES (3, 'Meera Sen', 'Computer Science');
INSERT INTO students VALUES (4, 'David Miller', 'Electrical Eng');

INSERT INTO grades VALUES (1, 'DSA', 94);
INSERT INTO grades VALUES (1, 'OS', 88);
INSERT INTO grades VALUES (2, 'DSA', 78);
INSERT INTO grades VALUES (3, 'DSA', 98);
INSERT INTO grades VALUES (3, 'OS', 92);
INSERT INTO grades VALUES (4, 'Circuits', 85);

-- Query: Average score per student in Computer Science
SELECT 
    s.name, 
    s.department, 
    COUNT(g.course) AS total_courses, 
    ROUND(AVG(g.score), 2) AS avg_score
FROM students s
JOIN grades g ON s.id = g.student_id
WHERE s.department = 'Computer Science'
GROUP BY s.id
ORDER BY avg_score DESC;
""",
            "test_cases": []
        },
        {
            "title": "Glassmorphism Card Profile",
            "description": "Modern responsive CSS glassmorphism developer badge with animated gradient ring.",
            "language": "html",
            "category": "Web Development",
            "folder_id": f_web.id,
            "user_id": creator.id,
            "source_code": """<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <style>
    body {
      margin: 0;
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      background: radial-gradient(circle at 10% 20%, #0f172a 0%, #020617 90%);
      font-family: system-ui, -apple-system, sans-serif;
      color: #f8fafc;
    }
    .card {
      background: rgba(30, 41, 59, 0.7);
      backdrop-filter: blur(16px);
      -webkit-backdrop-filter: blur(16px);
      border: 1px solid rgba(255, 255, 255, 0.12);
      border-radius: 20px;
      padding: 32px;
      width: 320px;
      text-align: center;
      box-shadow: 0 20px 40px rgba(0, 0, 0, 0.4);
      transition: transform 0.3s ease;
    }
    .card:hover { transform: translateY(-5px); }
    .avatar {
      width: 72px;
      height: 72px;
      margin: 0 auto 16px;
      border-radius: 50%;
      background: linear-gradient(135deg, #38bdf8, #818cf8);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 28px;
    }
    h2 { margin: 0 0 4px; font-size: 20px; }
    p { margin: 0 0 16px; color: #94a3b8; font-size: 14px; }
    .badge {
      display: inline-block;
      padding: 4px 12px;
      background: rgba(56, 189, 248, 0.15);
      color: #38bdf8;
      border-radius: 9999px;
      font-size: 12px;
      font-weight: 600;
    }
  </style>
</head>
<body>
  <div class="card">
    <div class="avatar">⚡</div>
    <h2>CodeVault Student</h2>
    <p>Class of 2026 • CSE</p>
    <div class="badge">Pro Member</div>
  </div>
</body>
</html>
""",
            "test_cases": []
        },
        {
            "title": "TypeScript LRU Cache",
            "description": "Type-safe Least Recently Used cache implementation with O(1) get and put.",
            "language": "typescript",
            "category": "Data Structures & Algorithms",
            "folder_id": f_dsa.id,
            "user_id": creator.id,
            "source_code": """class LRUCache<K, V> {
  private capacity: number;
  private cache: Map<K, V>;

  constructor(capacity: number) {
    this.capacity = capacity;
    this.cache = new Map();
  }

  get(key: K): V | undefined {
    if (!this.cache.has(key)) return undefined;
    const val = this.cache.get(key)!;
    this.cache.delete(key);
    this.cache.set(key, val);
    return val;
  }

  put(key: K, value: V): void {
    if (this.cache.has(key)) {
      this.cache.delete(key);
    } else if (this.cache.size >= this.capacity) {
      const firstKey = this.cache.keys().next().value;
      if (firstKey !== undefined) this.cache.delete(firstKey);
    }
    this.cache.set(key, value);
  }
}

const lru = new LRUCache<string, number>(2);
lru.put("A", 100);
lru.put("B", 200);
console.log("Get A:", lru.get("A"));
lru.put("C", 300);
console.log("Get B (evicted):", lru.get("B"));
console.log("Get C:", lru.get("C"));
""",
            "test_cases": []
        }
    ]

    saved_programs = []
    for p_data in programs_data:
        h = compute_content_hash(p_data["source_code"])
        prog = Program(
            title=p_data["title"],
            description=p_data["description"],
            language=p_data["language"],
            category=p_data["category"],
            folder_id=p_data["folder_id"],
            user_id=p_data["user_id"],
            is_public=True,
            source_code=p_data["source_code"],
            content_hash=h
        )
        db.add(prog)
        db.commit()
        db.refresh(prog)

        v1 = ProgramVersion(
            program_id=prog.id,
            version_number=1,
            source_code=p_data["source_code"],
            content_hash=h,
            commit_message="Initial library version",
            created_by=p_data["user_id"]
        )
        db.add(v1)

        for idx, tc in enumerate(p_data["test_cases"]):
            test_c = TestCase(
                program_id=prog.id,
                input_data=tc["input"],
                expected_output=tc["expected"],
                is_sample=tc["is_sample"],
                order_index=idx
            )
            db.add(test_c)

        # Add sample analytics events
        for _ in range(15):
            db.add(ProgramEvent(program_id=prog.id, event_type="view", created_at=datetime.utcnow() - timedelta(days=2)))
        for _ in range(5):
            db.add(ProgramEvent(program_id=prog.id, event_type="run", created_at=datetime.utcnow() - timedelta(days=1)))
        for _ in range(2):
            db.add(ProgramEvent(program_id=prog.id, event_type="copy", created_at=datetime.utcnow()))

        db.commit()
        saved_programs.append(prog)

    # 4. Classroom
    classroom = Classroom(
        name="Data Structures - Section A",
        description="Fall Semester CSE201 DSA Class - Weekly Assignments and Code Checks",
        teacher_id=teacher.id,
        invite_code="DSA-7F2K"
    )
    db.add(classroom)
    db.commit()
    db.refresh(classroom)

    # Enroll Students
    m1 = ClassroomMember(classroom_id=classroom.id, student_id=student1.id)
    m2 = ClassroomMember(classroom_id=classroom.id, student_id=student2.id)
    m3 = ClassroomMember(classroom_id=classroom.id, student_id=student3.id)
    db.add_all([m1, m2, m3])
    db.commit()

    # Assign Binary Search problem to Classroom
    bin_search_prog = saved_programs[0]
    assignment1 = ClassroomAssignment(
        classroom_id=classroom.id,
        program_id=bin_search_prog.id,
        due_date=datetime.utcnow() + timedelta(days=7)
    )
    db.add(assignment1)
    db.commit()

    # Student 1 (Asha) submitted perfect solution
    sub1 = Submission(
        program_id=bin_search_prog.id,
        student_id=student1.id,
        classroom_id=classroom.id,
        source_code=bin_search_prog.source_code,
        language="python",
        passed_count=3,
        total_count=3,
        verdict="Accepted",
        details_json=json.dumps([{"case_index": 1, "status": "Passed"}, {"case_index": 2, "status": "Passed"}, {"case_index": 3, "status": "Passed"}]),
        created_at=datetime.utcnow() - timedelta(hours=2)
    )
    # Student 2 (Rohit) submitted partial solution
    sub2 = Submission(
        program_id=bin_search_prog.id,
        student_id=student2.id,
        classroom_id=classroom.id,
        source_code=bin_search_prog.source_code,
        language="python",
        passed_count=2,
        total_count=3,
        verdict="Wrong Answer",
        details_json=json.dumps([{"case_index": 1, "status": "Passed"}, {"case_index": 2, "status": "Passed"}, {"case_index": 3, "status": "Failed"}]),
        created_at=datetime.utcnow() - timedelta(hours=1)
    )
    db.add_all([sub1, sub2])
    db.commit()

    db.close()
    print("Database seeding completed successfully!")

if __name__ == "__main__":
    seed_database()
