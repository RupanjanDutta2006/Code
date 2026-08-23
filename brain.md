# 🧠 CodeVault Pro — Complete Project Architecture & Technical Documentation ("brain.md")

> **CodeVault Pro** is an enterprise-grade student code library, multi-language compiler sandbox, competitive programming judge, and real-time classroom collaboration platform. This document serves as the master technical blueprint and exhaustive documentation of the entire codebase, system architecture, execution mechanics, database models, and APIs.

---

## 📑 Table of Contents

1. [Executive Overview & Vision](#1-executive-overview--vision)
2. [Beginner-Friendly UX Dictionary](#2-beginner-friendly-ux-dictionary)
3. [System Architecture & Data Flow](#3-system-architecture--data-flow)
4. [Directory & Workspace Structure](#4-directory--workspace-structure)
5. [Database Architecture & Schema Design](#5-database-architecture--schema-design)
6. [Multi-Language Execution Engine & Sandboxing](#6-multi-language-execution-engine--sandboxing)
7. [Competitive Programming Judge System](#7-competitive-programming-judge-system)
8. [Classrooms & Teacher-Student Workflows](#8-classrooms--teacher-student-workflows)
9. [Real-Time Collaborative Playground (WebSockets)](#9-real-time-collaborative-playground-websockets)
10. [Folder Importer & SHA-256 Deduplication](#10-folder-importer--sha-256-deduplication)
11. [AI Assistant ("Ask for Help") Service](#11-ai-assistant-ask-for-help-service)
12. [Frontend Architecture & State Management](#12-frontend-architecture--state-management)
13. [Complete REST & WebSocket API Reference](#13-complete-rest--websocket-api-reference)
14. [Security, Roles & Multi-Tenancy](#14-security-roles--multi-tenancy)
15. [Setup, Execution & Deployment Guide](#15-setup-execution--deployment-guide)
16. [Demo Accounts & Test Fixtures](#16-demo-accounts--test-fixtures)

---

## 1. Executive Overview & Vision

CodeVault Pro is engineered to bridge the gap between simple browser code pads and industrial software development environments. It provides school and university students with a distraction-free, beautifully themed workspace while offering instructors full pedagogical oversight.

### 🌟 Core Capabilities

* **Personal Code Library**: Hierarchical folder structures, category tagging (DSA, Web Dev, Databases, Algorithms), full-text search, and quick access.
* **11-Language Compiler Sandbox**: Native subprocess and cloud fallbacks for C, C++, Python, Java, JavaScript, TypeScript, Go, Rust, Kotlin, HTML/CSS, and SQL.
* **Interactive Terminal**: Unbuffered real-time STDIN/STDOUT streaming via WebSockets.
* **Practice & Check (Competitive Judge)**: Batch testing against sample and hidden test cases with instant verdicts (*Accepted*, *Wrong Answer*, *Time Limit Exceeded*, *Runtime Error*).
* **Classrooms & Assignments**: Dedicated portals for teachers to generate unique invite codes (e.g. `DSA-7F2K`), post problem sets, monitor student progress, and inspect live leaderboards.
* **Real-time Collaborative Playground**: Temporary WebSocket-synchronized coding rooms with peer presence, live code broadcasting, and joint execution.
* **Past Versions & "What Changed"**: Automated immutable revision snapshots with Monaco side-by-side visual diffing.
* **Smart AI Assistant**: Non-destructive code explanations, algorithmic complexity breakdowns, and side-by-side patch suggestions.
* **Bulk Folder & ZIP Importer**: Recursive local directory upload (`webkitdirectory`) with automated language detection and SHA-256 deduplication.
* **Offline-First PWA Support**: IndexedDB offline execution queuing and Service Worker asset caching.

---

## 2. Beginner-Friendly UX Dictionary

To ensure junior students are not overwhelmed by heavy DevOps and compiler jargon, CodeVault Pro uses an approachable UI dictionary:

| Traditional Developer Term | CodeVault Pro UI Term | Meaning / Action |
|---|---|---|
| `Execute Binary / Process` | **Run Code** | Compiles and executes code in the secure sandbox |
| `STDOUT / STDERR` | **Output** | Program output and compiler messages |
| `STDIN Stream` | **Input** | Keystrokes/data fed into the running program |
| `Competitive Judge` | **Practice & Check** | Batch test runner against multiple test cases |
| `Git Commit History` | **Past Versions** | Saved history of program iterations |
| `Unified / Side-by-Side Diff` | **What Changed** | Visual comparison of code changes |
| `Repository / Root Dir` | **My Code** | Your personal programming library |
| `Tenant / Organization` | **Classroom** | Virtual classroom created by a teacher |

---

## 3. System Architecture & Data Flow

CodeVault Pro follows a modern decoupled client-server architecture:

```mermaid
flowchart TB
    subgraph Frontend["Frontend (React 19 + TypeScript + Vite)"]
        UI[Monaco Editor & UI Components]
        AuthCtx[Auth Context & Multi-Auth]
        OffCtx[Offline Queue & IndexedDB]
        CompEng[Universal Compiler Engine]
    end

    subgraph Backend["FastAPI Backend (Python 3.13)"]
        API[FastAPI Routers & Middleware]
        WSExec["/ws/execute (Interactive WebSocket)"]
        WSPlay["/ws/playground/{id} (Collab WebSocket)"]
        JudgeSvc[Judge Service]
        AISvc[AI Assist Service]
        ImportSvc[Folder Importer & Hash Service]
        ExecSvc[Subprocess Execution Service]
    end

    subgraph Sandbox["Execution Sandboxes"]
        SubProc[Local Process Sandboxes]
        Wandbox[Wandbox Cloud API Fallback]
    end

    subgraph Database["Storage Layer"]
        SQLite[(SQLite / SQLAlchemy ORM)]
        DataDir[Data & Sandboxes Storage]
    end

    UI <-->|REST API| API
    UI <-->|Bidirectional I/O| WSExec
    UI <-->|Real-time Collab| WSPlay
    CompEng -->|Direct Cloud Fallback| Wandbox
    API --> JudgeSvc
    API --> AISvc
    API --> ImportSvc
    API --> ExecSvc
    WSExec --> ExecSvc
    ExecSvc --> SubProc
    API --> SQLite
    ImportSvc --> DataDir
```

### Execution Flow

```mermaid
sequenceDiagram
    autonumber
    actor Student as Student / User
    participant Editor as Monaco Editor
    participant Terminal as Unified Terminal (VS Code Style)
    participant WS as WebSocket (/ws/execute)
    participant Runner as Interactive Runner
    participant Process as OS Subprocess (python/gcc/node)

    Student->>Editor: Types code & Clicks "Run Code" (Ctrl+Enter)
    Editor->>Terminal: Start interactive execution session
    Terminal->>WS: Connect & Send {action: "run", language, source_code}
    WS->>Runner: Initialize Sandbox in data/sandboxes/inter_<uuid>
    Runner->>Process: Compile & Spawn Subprocess (unbuffered I/O)
    Process-->>Runner: Stream STDOUT chunk (e.g. "Enter your name: ")
    Runner-->>WS: JSON {type: "stdout", data: "Enter your name: "}
    WS-->>Terminal: Print inline prompt text & active cursor
    Student->>Terminal: Types input inline & presses Enter
    Terminal->>WS: JSON {action: "stdin", data: "Rupanjan\n"}
    WS->>Runner: Pipe into Process.stdin.write() & flush()
    Process-->>Runner: Stream STDOUT result (e.g. "Hello Rupanjan\n")
    Runner-->>WS: JSON {type: "stdout", data: "Hello Rupanjan\n"}
    WS-->>Terminal: Print output text inline
    Process-->>Runner: Process exits (code: 0)
    Runner-->>WS: JSON {type: "finished", status: "success", exit_code: 0, executionTime: 0.15, memory: 12800}
    WS-->>Terminal: Render Exit Status, Execution Time, Memory Badge & Return prompt
```

---

## 4. Directory & Workspace Structure

```
d:/Personal Project/Online Compiler/
├── backend/                        # FastAPI Backend Application
│   ├── api/                        # REST API Route Handlers
│   │   ├── ai_assist.py            # AI code explanation & fix suggestions
│   │   ├── analytics.py           # Creator view/run/copy analytics
│   │   ├── auth.py                 # Registration, login, JWT token auth
│   │   ├── classrooms.py           # Classrooms, assignments, grading, leaderboards
│   │   ├── execution.py            # Synchronous code execution endpoint
│   │   ├── import_folder.py        # Folder & ZIP multi-file batch upload
│   │   ├── judge.py                # Practice & Check batch testcase runner
│   │   ├── playground.py           # Collaborative session management
│   │   ├── programs.py             # Program CRUD, categories, search, folders
│   │   └── versions.py             # Version history snapshots & Monaco diffing
│   ├── database/                   # Database Connection & Seed Data
│   │   ├── database.py             # SQLAlchemy engine & session factory
│   │   └── seed.py                 # Pre-loaded demo users, programs, & classrooms
│   ├── executor/                   # Sandboxed Execution Engine
│   │   ├── execution_service.py    # Synchronous runner with caching
│   │   ├── interactive_runner.py   # Asynchronous bidirectional WebSocket runner
│   │   ├── registry.py             # Language runner registry & alias mapper
│   │   ├── runner_interface.py     # BaseRunner abstract interface
│   │   ├── subprocess_runner.py    # Process isolation & timeout enforcement
│   │   └── runners/                # 11 Language-Specific Implementations
│   │       ├── c/                  # GCC compiler runner
│   │       ├── cpp/                # G++ (C++17) compiler runner
│   │       ├── go/                 # Go runtime runner
│   │       ├── html/               # HTML preview generator
│   │       ├── java/               # OpenJDK (javac + java) runner
│   │       ├── javascript/         # Node.js runner
│   │       ├── kotlin/             # Kotlinc / Java runner
│   │       ├── python/             # Python 3.13 unbuffered runner
│   │       ├── rust/               # Rustc runner
│   │       ├── sql/                # In-memory SQLite runner
│   │       └── typescript/         # Node.js with stripped types runner
│   ├── models/                     # SQLAlchemy ORM Models
│   │   └── __init__.py             # Complete schema (Users, Programs, Submissions, etc.)
│   ├── schemas/                    # Pydantic v2 Validation Schemas
│   │   └── __init__.py             # Request & Response DTOs
│   ├── services/                   # Business Logic Services
│   │   ├── ai_service.py           # Gemini/OpenAI/Fallback AI engine
│   │   ├── analytics_service.py    # Event tracking & 30-day metrics
│   │   ├── diff_service.py         # Unified diff generator
│   │   ├── hash_service.py         # SHA-256 content hashing
│   │   ├── importer.py             # Directory walker & folder hierarchy builder
│   │   └── judge_service.py        # Testcase normalization & grading
│   ├── tests/                      # Automated Test Suite
│   │   └── test_api.py             # Pytest tests for API, execution, auth
│   ├── utils/                      # Security & Helper Utilities
│   │   └── security.py             # Password hashing & JWT token validation
│   ├── websockets/                 # WebSocket Route Handlers
│   │   ├── execution_ws.py         # Real-time interactive terminal socket
│   │   └── playground_ws.py        # Collaborative code room socket
│   ├── config.py                   # Environment variables & constants
│   └── main.py                     # FastAPI entry point & lifespan events
│
├── frontend/                       # React 19 + TypeScript Frontend
│   ├── public/                     # Static assets & PWA manifest
│   ├── src/
│   │   ├── assets/                 # Icons and image assets
│   │   ├── components/             # Reusable UI Components
│   │   │   ├── AIAssistPanel.tsx   # AI Assistant drawer & diff applicator
│   │   │   ├── AnalyticsModal.tsx  # Recharts 30-day views/runs trend graph
│   │   │   ├── CodeEditor.tsx      # Monaco Editor wrapper with theme sync
│   │   │   ├── DiffViewer.tsx      # Monaco Side-by-Side Diff Viewer
│   │   │   ├── Navbar.tsx          # Navigation, theme toggle, user badge
│   │   │   ├── OutputTerminal.tsx  # Multi-mode terminal & STDIN manager
│   │   │   ├── PracticeJudge.tsx   # Testcase runner, sample/hidden view
│   │   │   └── VersionHistory.tsx  # Version list, commit history & restore
│   │   ├── context/                # React Context Providers
│   │   │   ├── AuthContext.tsx     # JWT + Firebase multi-auth provider
│   │   │   ├── OfflineContext.tsx  # Offline sync & queue provider
│   │   │   └── ThemeContext.tsx    # Dark/Light theme switching
│   │   ├── pages/                  # Page-Level Views
│   │   │   ├── AboutPage.tsx       # Documentation, architecture, shortcuts
│   │   │   ├── ClassroomDetailPage.tsx # Teacher management & student submission
│   │   │   ├── ClassroomListPage.tsx   # Classroom directory & join modal
│   │   │   ├── CreateProgramPage.tsx   # Program wizard with templates
│   │   │   ├── HomePage.tsx        # Hero, quick compiler, feature tour
│   │   │   ├── ImportPage.tsx      # Folder / ZIP upload & sync
│   │   │   ├── LoginPage.tsx       # Tabbed Login, Register & Phone OTP
│   │   │   ├── MyProgramsPage.tsx  # Personal file tree & code manager
│   │   │   ├── PlaygroundPage.tsx  # Collaborative real-time coding room
│   │   │   ├── ProgramDetailPage.tsx   # Main IDE (Editor, Terminal, Judge, AI)
│   │   │   └── ProgramsPage.tsx    # Public code directory & search
│   │   ├── services/               # Frontend API & Helper Services
│   │   │   ├── api.ts              # Axios HTTP client with JWT interceptor
│   │   │   ├── compilerEngine.ts   # Universal execution (Cloud + Client + Local)
│   │   │   ├── defaultPrograms.ts  # Seed templates for 11 languages
│   │   │   └── firebase.ts         # Firebase Auth SDK initialization
│   │   ├── App.tsx                 # Route declarations & main shell
│   │   ├── index.css               # Tailwind directives & custom CSS
│   │   └── main.tsx                # React DOM root entry
│   ├── package.json                # Frontend dependencies
│   ├── tailwind.config.js          # Tailwind CSS design system configuration
│   └── vite.config.ts              # Vite bundler configuration
│
├── data/                           # Runtime Storage Directory (Auto-created)
│   ├── codevault.db                # SQLite database file
│   ├── execution_cache/            # Cached binary execution outputs
│   └── sandboxes/                  # Temporary isolated execution directories
├── README.md                       # High-level overview & quickstart
├── package.json                    # Workspace root package scripts
└── vercel.json                     # Vercel deployment configuration
```

---

## 5. Database Architecture & Schema Design

CodeVault Pro uses SQLAlchemy with SQLite (and supports PostgreSQL via `DATABASE_URL`). The schema enforces relational integrity, cascading deletes, and strict tenant separation.

### Entity Relationship Diagram

```mermaid
erDiagram
    User ||--o{ Folder : owns
    User ||--o{ Program : creates
    User ||--o{ Submission : submits
    User ||--o{ Classroom : teaches
    User ||--o{ ClassroomMember : enrolls
    
    Folder ||--o{ Folder : "parent/child"
    Folder ||--o{ Program : contains
    
    Program ||--o{ ProgramVersion : versions
    Program ||--o{ TestCase : tests
    Program ||--o{ ProgramEvent : logs
    Program ||--o{ Submission : receives
    Program ||--o{ ClassroomAssignment : assigned_as
    
    Classroom ||--o{ ClassroomMember : members
    Classroom ||--o{ ClassroomAssignment : assignments
    Classroom ||--o{ Submission : submissions

    User {
        int id PK
        string username UK
        string email UK
        string hashed_password
        enum role "USER | CREATOR | TEACHER"
        string full_name
        datetime created_at
    }

    Folder {
        int id PK
        string name
        int parent_id FK
        int user_id FK
        datetime created_at
    }

    Program {
        int id PK
        string title
        text description
        string language
        string category
        int folder_id FK
        int user_id FK
        boolean is_public
        text source_code
        string content_hash
        datetime created_at
        datetime updated_at
    }

    ProgramVersion {
        int id PK
        int program_id FK
        int version_number
        text source_code
        string content_hash
        string commit_message
        int created_by FK
        datetime created_at
    }

    TestCase {
        int id PK
        int program_id FK
        text input_data
        text expected_output
        boolean is_sample
        int order_index
        datetime created_at
    }

    Classroom {
        int id PK
        string name
        text description
        int teacher_id FK
        string invite_code UK
        datetime created_at
    }

    ClassroomMember {
        int id PK
        int classroom_id FK
        int student_id FK
        datetime joined_at
    }

    ClassroomAssignment {
        int id PK
        int classroom_id FK
        int program_id FK
        datetime due_date
        datetime assigned_at
    }

    Submission {
        int id PK
        int program_id FK
        int student_id FK
        int classroom_id FK
        text source_code
        string language
        int passed_count
        int total_count
        string verdict
        text details_json
        datetime created_at
    }

    PlaygroundSession {
        string id PK
        int source_program_id FK
        string title
        text source_code
        string language
        text custom_input
        datetime created_at
        datetime expires_at
    }

    ExecutionCache {
        int id PK
        string cache_key UK
        string language
        string source_hash
        string status
        text output
        float execution_time_ms
        datetime created_at
    }

    ProgramEvent {
        int id PK
        int program_id FK
        string event_type "view | run | copy"
        datetime created_at
    }
```

---

## 6. Multi-Language Execution Engine & Sandboxing

CodeVault Pro implements an industrial, genuine dual-mode execution engine:

1. **Synchronous Subprocess Runner with Real Metrics** (`backend/executor/subprocess_runner.py`):
   * Backed by `POST /api/execute` and `POST /api/programs/execute`.
   * Real peak RSS memory measurement via background thread sampling with `psutil` every 10ms.
   * Hard limits: Wall-clock timeout (5.0s), Memory Limit (128 MB / 256 MB), and Output buffer limit (1 MB).
   * Active Process Tracker (`active_process_tracker`) allows stopping any running execution PID and its entire child process tree on demand via `POST /api/execute/stop`.
   * Standard error classification engine that parses and maps tracebacks to concrete error types (`SyntaxError`, `ZeroDivisionError`, `NameError`, `TypeError`, `CompilationError`, `TimeLimitExceeded`, `MemoryLimitExceeded`).

2. **Interactive Asynchronous Streaming Runner** (`backend/executor/interactive_runner.py`):
   * Backed by FastAPI WebSockets (`/ws/execute`).
   * Spawns unbuffered OS subprocesses in temporary sandbox directories (`data/sandboxes/inter_<uuid>`).
   * Reads standard output and error asynchronously in real-time chunks (1024 bytes) via `asyncio.get_running_loop().run_in_executor()`.
   * Accepts user keystrokes piped directly to `process.stdin` on demand.
   * Measures peak resident set memory and execution time in real time and handles user cancellation (`action: "kill"` / `action: "stop"`).

### 11 Supported Languages & Compiler Matrix

| Language | Identifier | Compiler / Interpreter | Standard Flags & Invocation |
|---|---|---|---|
| **Python** | `python`, `py` | CPython 3.13 | `python -u solution.py` (`PYTHONUNBUFFERED=1`) |
| **C** | `c` | GCC 13+ | `gcc -O2 main.c -o main.exe && ./main.exe` |
| **C++** | `cpp`, `c++` | G++ 13+ | `g++ -std=c++17 -O2 main.cpp -o main.exe && ./main.exe` |
| **Java** | `java` | OpenJDK 21+ | Auto-extracts class name $\to$ `javac ClassName.java && java ClassName` |
| **JavaScript** | `javascript`, `js` | Node.js 20+ | `node index.js` |
| **TypeScript** | `typescript`, `ts` | Node.js 20+ | `node --experimental-strip-types index.ts` |
| **Go** | `go` | Golang 1.22+ | `go run main.go` |
| **Rust** | `rust`, `rs` | Rustc / Cargo | `rustc -O main.rs -o main.exe && ./main.exe` |
| **Kotlin** | `kotlin`, `kt` | Kotlinc + JVM | `kotlinc Solution.kt -include-runtime -d app.jar && java -jar app.jar` |
| **SQL** | `sql`, `sqlite` | SQLite3 / Python | Wrapped in-memory SQLite runner with dynamic table formatting |
| **HTML / CSS** | `html` | Browser Sandbox | In-browser iframe rendering with instant DOM preview |

### Error Classification & Diagnostics Engine

The execution subsystem parses compiler and interpreter diagnostics into unified error categories:

| Error Category | Detected Signatures / Causes | Visual UI State |
|---|---|---|
| `SyntaxError` / `IndentationError` | `SyntaxError:`, `IndentationError:`, invalid token | Red cross, formatted traceback, code line indicator |
| `ZeroDivisionError` | `ZeroDivisionError: division by zero` | Red cross, runtime error banner |
| `NameError` / `TypeError` / `ValueError` | `NameError:`, `TypeError:`, `ValueError:` | Red cross, runtime error banner |
| `CompilationError` | GCC/G++ `error:`, `javac` compilation failure | Red cross, compiler diagnostic log |
| `TimeLimitExceeded` (TLE) | Process elapsed time > 5.0 seconds | Amber clock, "⏱ Time Limit Exceeded" banner |
| `MemoryLimitExceeded` (MLE) | Peak RSS memory > 128 MB / 256 MB | Purple lightning, "⚡ Memory Limit Exceeded" banner |
| `OutputLimitExceeded` (OLE) | Output buffer > 1 MB | Warning note with auto-truncation |
| `UserCancelled` | User clicked Stop (Ctrl+Shift+K) | Grey warning, `^C [Process terminated by user]` |

### Universal Frontend Fallback Engine (`compilerEngine.ts`)

When deployed in environments where local subprocesses are not accessible (e.g. static CDN previews):
1. **Primary**: Local / Configured Backend API (`POST /api/execute`).
2. **Fallback 1**: Universal Wandbox Cloud Compiler API (Sandboxed multi-language cloud runner).
3. **Fallback 2**: In-Browser JS/TS Sandbox (`new Function` evaluation with STDIN simulation and intercepted `console.log`).
4. **Fallback 3**: HTML Live Preview Tab.

---

## 7. Competitive Programming Judge System

The Practice & Check system allows students to solve algorithmic challenges and verify their solutions against multiple test cases.

### Testcase Workflow

```mermaid
flowchart LR
    A[Student Submits Code] --> B[Judge Service]
    B --> C[Fetch Sample & Hidden Testcases]
    C --> D[Run Sandbox for each Case with TC.Input]
    D --> E[Output Normalization Engine]
    E --> F{Matches TC.ExpectedOutput?}
    F -->|Yes| G[Mark Case: PASSED]
    F -->|No| H[Mark Case: FAILED]
    F -->|Time > 5.0s| I[Mark Case: TIME LIMIT EXCEEDED]
    F -->|Crash / Exception| J[Mark Case: RUNTIME ERROR]
    G & H & I & J --> K[Aggregate Score & Overall Verdict]
    K --> L[Save Immutable Submission Record]
```

### Output Normalization Algorithm

To prevent unfair failures due to OS newline discrepancies (`\r\n` vs `\n`) or trailing space artifacts:
```python
def normalize_output(text: str) -> str:
    if not text:
        return ""
    lines = [line.rstrip() for line in text.replace("\r\n", "\n").replace("\r", "\n").split("\n")]
    while lines and not lines[-1]:
        lines.pop()
    return "\n".join(lines)
```

### Privacy Guarantee
* **Sample Test Cases**: Full input, expected output, and actual output are rendered to the student.
* **Hidden Test Cases**: Input and expected output are masked as `[Hidden Test Case]`. If failed, actual output is masked as `[Output Hidden]`.

---

## 8. Classrooms & Teacher-Student Workflows

CodeVault Pro features a dedicated role-isolated classroom sub-system.

### Key Roles
* `TEACHER`: Can create classrooms, generate random formatted invite codes (`DSA-7F2K`), assign coding problems with test cases, view student submissions, and inspect live leaderboards.
* `USER` (Student): Can join classrooms using invite codes, solve assigned problems in the built-in IDE, submit for automated grading, and view their individual scorecard.

### Leaderboard Computation
The classroom leaderboard dynamically aggregates:
$$\text{Rank Score} = \text{Passed Testcases Count} \times 100 - \text{Total Attempts} \times 2$$
Teachers can instantly filter by assignment and inspect the student's exact submitted source code and per-testcase execution logs.

---

## 9. Real-Time Collaborative Playground (WebSockets)

The Collaborative Playground enables peer-to-peer coding sessions in temporary WebSocket rooms (`/ws/playground/{room_id}`).

### Broadcast Protocol & Message Types

| Message Type | Direction | Payload Structure | Purpose |
|---|---|---|---|
| `init` | Server $\to$ Client | `{type, code, language, peers: [{id, name, color}]}` | Sends current room state upon joining |
| `user_joined` | Server $\to$ Client | `{type, user: {id, name, color}}` | Alerts peers of a new collaborator |
| `code_change` | Bidirectional | `{type, code, senderId}` | Broadcasts live Monaco editor text changes |
| `language_change` | Bidirectional | `{type, language, senderId}` | Switches room compiler language |
| `cursor` | Bidirectional | `{type, senderId, cursor: {lineNumber, column}}` | Tracks peer cursor positions |
| `run_code` | Client $\to$ Server | `{type, custom_input}` | Initiates joint execution |
| `run_started` | Server $\to$ Client | `{type, senderName}` | Broadcasts compilation start badge |
| `run_finished` | Server $\to$ Client | `{type, status, output, error, execution_time_ms}` | Broadcasts output to all connected peers |
| `user_left` | Server $\to$ Client | `{type, clientId}` | Cleans up peer cursor upon disconnect |

---

## 10. Folder Importer & SHA-256 Deduplication

The folder importer (`backend/services/importer.py`) enables students and teachers to drag-and-drop entire project folders or `.zip` files into CodeVault Pro:

1. **Recursive Traversal**: Uses HTML5 `webkitdirectory` or Python `zipfile` extraction to read folder trees.
2. **Ignore Filters**: Automatically ignores non-code bloat:
   * Directories: `.git`, `node_modules`, `__pycache__`, `venv`, `dist`, `build`, `.vscode`.
   * Files: `.exe`, `.dll`, `.class`, `.pyc`, `.o`, `.zip`, `.tar.gz`.
3. **Category Auto-Inference**: Uses heuristics based on root folder names:
   * Folder names containing `dsa`, `tree`, `graph`, `dp` $\to$ **Data Structures & Algorithms**
   * Folder names containing `web`, `html`, `css`, `js` $\to$ **Web Development**
   * Folder names containing `contest`, `leetcode`, `cp` $\to$ **Competitive Programming**
   * Folder names containing `sql`, `db` $\to$ **Database & SQL**
4. **SHA-256 Deduplication**: Generates a content hash for every file. If a file with the same hash exists, it skips duplicate writes or logs a revision version.

---

## 11. AI Assistant ("Ask for Help") Service

The AI Assistant is an opt-in, student-centric tutoring engine (`backend/services/ai_service.py`):

### Features
1. **Explain Code**: Breaks down program flow, line-by-line logic, algorithmic time complexity ($O(N)$), space complexity, and provides a beginner tip.
2. **Suggest Fix**: Accepts failing testcase information, error logs, and source code to generate an actionable patch.

### Architecture & Fallback Tier
* **Tier 1 (Google Gemini)**: Calls `gemini-1.5-flash` API if `GEMINI_API_KEY` is configured.
* **Tier 2 (OpenAI)**: Calls `gpt-4o-mini` API if `OPENAI_API_KEY` is configured.
* **Tier 3 (Intelligent Built-in Engine)**: Deterministic heuristic static analysis engine that extracts symbols, line counts, and provides syntax-specific advice without external API keys.

### Non-Destructive Diff Applicator
AI fix suggestions are returned as unified diffs and displayed in the Monaco Diff Viewer. AI suggestions **never** overwrite user code without the user explicitly clicking **"Apply Fix"**.

---

## 12. Frontend Architecture & State Management

Built with **React 19**, **TypeScript**, and **Tailwind CSS**, the frontend uses an ergonomic component hierarchy:

### Context Providers
* `AuthContext` ([AuthContext.tsx](file:///d:/Personal%20Project/Online%20Compiler/frontend/src/context/AuthContext.tsx)): Handles JWT token storage, profile synchronization, Firebase authentication (Google, GitHub, Phone OTP), and automatic demo account fallbacks.
* `OfflineContext` ([OfflineContext.tsx](file:///d:/Personal%20Project/Online%20Compiler/frontend/src/context/OfflineContext.tsx)): Monitors browser `navigator.onLine` events, stores offline runs in IndexedDB, and auto-syncs when reconnected.
* `ThemeContext` ([ThemeContext.tsx](file:///d:/Personal%20Project/Online%20Compiler/frontend/src/context/ThemeContext.tsx)): Manages modern dark/light UI modes and synchronizes Monaco editor themes (`vs-dark` vs `vs`).

### Core Page Routes

| Route | Page Component | Key Functionality |
|---|---|---|
| `/` | `HomePage` | Hero section, live quick compiler, feature grid, global statistics |
| `/programs` | `ProgramsPage` | Public program library, search bar, language filters, card grid |
| `/programs/:id` | `ProgramDetailPage` | Full IDE (Monaco Editor, Interactive Terminal, Judge, Versions, AI) |
| `/my-programs` | `MyProgramsPage` | Personal folder tree manager, program creator, folder organizer |
| `/create` | `CreateProgramPage` | Program creation wizard with templates and initial test cases |
| `/import` | `ImportPage` | Folder drag-and-drop & ZIP file batch importer |
| `/playground` | `PlaygroundPage` | Collaborative room generator & multi-user WebSocket IDE |
| `/classrooms` | `ClassroomListPage` | Classroom browser, join modal, teacher classroom creator |
| `/classrooms/:id` | `ClassroomDetailPage` | Teacher assignment publisher, student submissions, leaderboard |
| `/login` | `LoginPage` | Email/password, demo one-click logins, Google/GitHub/Phone auth |
| `/about` | `AboutPage` | Architecture overview, UX dictionary, shortcut guide |

---

## 13. Complete REST & WebSocket API Reference

### 🔐 Authentication (`/api/auth`)

| Method | Endpoint | Request Body | Description |
|---|---|---|---|
| `POST` | `/api/auth/register` | `{username, email, password, role, full_name}` | Create a new user account |
| `POST` | `/api/auth/login` | `{username_or_email, password}` | Authenticate and receive JWT token |
| `GET` | `/api/auth/me` | *Bearer Token* | Get current authenticated user profile |

### 📂 Programs & Versions (`/api/programs`)

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/programs` | List public programs with search & category filters |
| `POST` | `/api/programs` | Create a new program with optional test cases |
| `GET` | `/api/programs/mine` | List all programs and folders belonging to current user |
| `GET` | `/api/programs/{id}` | Get full program details, versions, and test cases |
| `PUT` | `/api/programs/{id}` | Update program code (automatically creates a new version) |
| `DELETE` | `/api/programs/{id}` | Delete program (owner only) |
| `POST` | `/api/programs/folders` | Create a new folder |
| `GET` | `/api/programs/{id}/versions` | List all version snapshots for a program |
| `GET` | `/api/programs/{id}/versions/{v_id}` | Get specific version snapshot |
| `GET` | `/api/programs/{id}/diff` | Compare two versions and return unified diff |

### ⚡ Execution & Judge (`/api/execution` & `/api/judge`)

| Method | Endpoint | Request Body | Description |
|---|---|---|---|
| `POST` | `/api/execute` | `{language, code, stdin, execution_id}` | Standard synchronous execution with memory, time, error classification |
| `POST` | `/api/execute/stop` | `{execution_id}` | Immediately terminates active running process PID tree |
| `POST` | `/api/programs/execute` | `{language, source_code, custom_input, program_id}` | Legacy compatible execution endpoint |
| `POST` | `/api/judge/run-checks` | `{program_id, source_code, language}` | Evaluate solution against all test cases |
| `GET` | `/api/judge/submissions/{program_id}` | *Bearer Token* | Retrieve student submission history |
| `WS` | `/ws/execute` | Bidirectional JSON & Text | Real-time unbuffered interactive terminal with live STDIN |

#### Standard `/api/execute` JSON Contract

**Request Schema**:
```json
{
  "language": "python",
  "code": "name = input()\nprint(f'Hello {name}')",
  "stdin": "Rupanjan"
}
```

**Success Response (HTTP 200)**:
```json
{
  "status": "success",
  "stdout": "Hello Rupanjan\n",
  "stderr": "",
  "executionTime": 0.16,
  "execution_time_ms": 156.98,
  "memory": 12800,
  "exitCode": 0
}
```

**Error Response (HTTP 200)**:
```json
{
  "status": "error",
  "stdout": "",
  "stderr": "ZeroDivisionError: division by zero",
  "executionTime": 0.01,
  "execution_time_ms": 12.4,
  "memory": 8200,
  "exitCode": 1,
  "error_type": "ZeroDivisionError"
}
```

### 🏫 Classrooms (`/api/classrooms`)

| Method | Endpoint | Request Body | Description |
|---|---|---|---|
| `POST` | `/api/classrooms` | `{name, description}` | Create a new classroom (Teacher only) |
| `GET` | `/api/classrooms` | *Bearer Token* | List classrooms (taught or enrolled) |
| `GET` | `/api/classrooms/{id}` | *Bearer Token* | Get classroom details and member roster |
| `POST` | `/api/classrooms/join` | `{invite_code}` | Join classroom as a student |
| `POST` | `/api/classrooms/{id}/assign` | `{program_id, due_date}` | Assign coding problem to classroom |
| `GET` | `/api/classrooms/{id}/assignments`| *Bearer Token* | List all assignments and completion status |
| `GET` | `/api/classrooms/{id}/leaderboard`| *Bearer Token* | Get real-time scored student leaderboard |

### 🤖 AI Assistant & Analytics (`/api/ai` & `/api/analytics`)

| Method | Endpoint | Request Body | Description |
|---|---|---|---|
| `POST` | `/api/ai/explain` | `{source_code, language, context}` | Generates algorithmic code explanation |
| `POST` | `/api/ai/suggest-fix`| `{source_code, language, error_message, ...}` | Generates fix and unified diff |
| `GET` | `/api/analytics/program/{id}` | *Bearer Token* | 30-day views, runs, copies analytics |
| `POST` | `/api/analytics/event` | `{program_id, event_type}` | Log program interaction event |

---

## 14. Security, Roles & Multi-Tenancy

CodeVault Pro implements defensive security best practices:

* **Authentication**: Password hashing using `passlib` with Argon2/bcrypt algorithms. Stateless JSON Web Tokens (JWT) signed with HMAC-SHA256.
* **Role-Based Access Control (RBAC)**:
  * Strict dependency guards (`require_teacher`, `get_current_user`).
  * Students cannot view assignments of classrooms they are not enrolled in.
  * Submissions are strictly private between student and classroom teacher.
* **Sandbox Defense**:
  * Child subprocesses run with strict timeouts (5.0s default) to prevent infinite loops (`while(true)`).
  * Output buffer truncated at 1 MB to prevent memory overflow attacks.
  * Ephemeral execution directories automatically cleaned up upon process termination.

---

## 15. Setup, Execution & Deployment Guide

### Prerequisites
* **Python**: Python 3.10+ (Recommended: Python 3.13)
* **Node.js**: Node.js 18+ (Recommended: Node.js 20+)
* **C/C++/Java/Go Compilers** (Optional for local execution; cloud fallback handles execution when local compilers are omitted).

### 1. Local Backend Setup

```powershell
# Navigate to project root
cd "d:\Personal Project\Online Compiler"

# Activate Python virtual environment
.\venv\Scripts\Activate.ps1

# Install backend dependencies
pip install -r requirements.txt

# Start FastAPI server on port 8000
python -m uvicorn backend.main:app --host 127.0.0.1 --port 8000 --reload
```

### 2. Local Frontend Setup

```powershell
# Open a new terminal and navigate to frontend directory
cd "d:\Personal Project\Online Compiler\frontend"

# Install node dependencies
npm install

# Start Vite dev server on port 5173
npm run dev
```

Visit **`http://localhost:5173`** in your browser.

### 3. Production Deployment Architecture (Render + Vercel)

For true, real-time interactive terminal execution with persistent WebSockets (`/ws/execute`), genuine OS subprocesses (`subprocess.Popen`), and memory profiling, deploy using the industry standard decoupled topology:

```
┌──────────────────────────────────────────────────────────┐
│                   Vercel (Frontend)                      │
│             React 19 + Vite SPA (Edge CDN)               │
│                                                          │
│  Environment Variables in Vercel Dashboard:              │
│    VITE_API_URL = https://codevault-backend.onrender.com │
│    VITE_WS_URL  = wss://codevault-backend.onrender.com   │
└────────────┬─────────────────────────────┬───────────────┘
             │ REST APIs                   │ Persistent WebSockets
             │ (/api/execute, auth, etc.)  │ (/ws/execute, /ws/playground)
             ▼                             ▼
┌──────────────────────────────────────────────────────────┐
│                 Render.com (Backend API)                 │
│         FastAPI + Uvicorn (Linux Docker Runner)          │
│                                                          │
│  - Python 3.11, GCC 13, G++, OpenJDK 21, Node.js, SQLite │
│  - Real-time Bidirectional WebSocket I/O                 │
│  - Peak Resident Set (psutil) Memory Profiling           │
└──────────────────────────────────────────────────────────┘
```

#### Step A: Deploy Backend on Render.com (Free Tier)
1. Go to [https://render.com](https://render.com) and create a **New Web Service**.
2. Connect your GitHub repository: `https://github.com/RupanjanDutta2006/Code`.
3. Choose **Docker** as the runtime (or use the included `render.yaml` Blueprint).
   * **Root Directory**: `.`
   * **Dockerfile Path**: `./Dockerfile`
   * **Plan**: Free
4. Click **Deploy Web Service**. Once deployed, Render will provide a service URL, e.g.:
   `https://codevault-backend-xxxx.onrender.com`

#### Step B: Connect Vercel to the Render Backend
1. Go to your [Vercel Project Dashboard](https://vercel.com/dashboard) $\to$ **Settings** $\to$ **Environment Variables**.
2. Add the two environment variables:
   * **`VITE_API_URL`**: `https://codevault-backend-xxxx.onrender.com` (Your Render URL)
   * **`VITE_WS_URL`**: `wss://codevault-backend-xxxx.onrender.com` (Your Render WebSocket URL)
3. Go to **Deployments** $\to$ Click **Redeploy** (or push a new commit to `main`).
4. Done! Your Vercel live application now connects directly to your cloud execution engine with 100% genuine interactive terminal capabilities.

### 4. Automated Backend Tests

```powershell
.\venv\Scripts\python -m pytest backend/tests/ -v
```

---

## 16. Demo Accounts & Test Fixtures

The database is pre-seeded with rich demo fixtures on startup:

| Role | Username | Password | Purpose & Access Scope |
|---|---|---|---|
| **Teacher** | `prof_sharma` | `password123` | Classroom management, assign problems, view leaderboards |
| **Creator** | `creator` | `password123` | Public code library, folder sync, versioning, analytics |
| **Student** | `asha_r` | `password123` | Classroom student, Practice & Check judge, AI helper |
| **Student** | `rohit_k` | `password123` | Classroom member & competitor |
| **Student** | `meera_s` | `password123` | Classroom member & competitor |

---

*Documentation maintained by the CodeVault Pro Engineering Team.*
