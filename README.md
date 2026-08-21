# CodeVault Pro — Student Code Library, Online Compiler & Classroom Platform

CodeVault Pro is an all-in-one student code library, multi-language compiler, competitive programming judge, and classroom platform. It is engineered with a clean, beginner-friendly UI on the surface while featuring a secure, sandboxed execution engine and real-time collaboration underneath.

---

## 🌟 Key Features

1. **Personal Code Library**: Organize programming code with subfolders, categories (DSA, Web Development, Databases, Algorithms), and search filters.
2. **Online Compiler / Code Runner**: Real sandboxed compilers for **11 languages** (C, C++, Python, Java, JavaScript, TypeScript, Go, Rust, Kotlin, HTML/CSS, SQL).
3. **Practice & Check (Competitive Judge Mode)**: Attach sample and hidden test cases to programs. Click **"Run My Solution Against Checks"** to automatically test solutions and receive instant verdict breakdowns (Accepted, Wrong Answer, Time Limit Exceeded, Runtime Error).
4. **Classrooms ("My Class")**:
   - **Teachers** can create classrooms, generate unique student invite codes (e.g. `DSA-7F2K`), assign problems with check cases, and track live student progress on a leaderboard.
   - **Students** join with invite codes, solve assignments, and receive instant feedback. Submissions remain strictly private between the student and teacher.
5. **Real-time Collaborative Playground**: Temporary rooms where peers can write code, view cursors, and run programs together over WebSockets. Sessions auto-expire after 2 hours.
6. **Past Versions & "What Changed"**: Every program edit or folder re-import automatically creates a revision snapshot. Compare any two versions in the built-in Monaco Diff Viewer.
7. **Ask for Help (AI Assistant)**: Opt-in AI helper for code explanations and fix suggestions with side-by-side diff previews. AI suggestions never overwrite user code.
8. **Folder Importer + Sync**: Upload entire local computer folders (`webkitdirectory`) or `.zip` archives with automatic recursion, language detection, and SHA-256 deduplication.
9. **Offline-First PWA**: Saved programs and playground work offline. Clicking "Run Code" while offline queues the execution and runs it automatically once connection is restored.
10. **Analytics Dashboard**: Creators see total views, runs, copies, and an interactive 30-day activity trend chart.

---

## 📖 Beginner-Friendly UX Dictionary

To ensure accessibility for students in school and college, complex engineering terms are presented in plain language:

| Technical Term | Shown in CodeVault Pro As | What It Means |
|---|---|---|
| Execute Source | **Run Code** | Compiles and executes code in the secure sandbox |
| STDOUT / STDERR | **Output** | Program output or compiler messages |
| STDIN | **Input** | Input data supplied to the running program |
| Competitive Judge | **Practice & Check** | Batch test runner against multiple test cases |
| Revision History | **Past Versions** | Saved history of program iterations |
| Diff Viewer | **What Changed** | Visual comparison showing additions and deletions |
| Repository / Root | **My Code** | Your personal programming library |

---

## 🛠️ Architecture & Technology Stack

### Backend
- **Framework**: FastAPI (Python 3.13) with asynchronous endpoints and WebSockets
- **Database**: SQLite with SQLAlchemy ORM (auto-migrating with rich demo seed data)
- **Security**: Argon2/bcrypt password hashing, JWT Bearer tokens, strict classroom tenant isolation
- **Sandbox Execution**: Process lifecycle manager with CPU, 256MB RAM limits, 5.0s timeouts, and SHA-256 build caching
- **AI Assist**: Swappable LLM provider (`ai_service.py`) supporting Google Gemini, OpenAI, or intelligent built-in fallback analysis

### Frontend
- **Framework**: React 19 + TypeScript + Vite
- **Styling**: Tailwind CSS with custom glassmorphism and modern dark theme
- **Code & Diff Editor**: Monaco Editor (VS Code core engine)
- **Real-Time Communication**: Native WebSockets (`/ws/execute` and `/ws/playground/{id}`)
- **Analytics Charts**: Recharts responsive area graphs
- **PWA**: Service Worker caching and IndexedDB offline queue

---

## 🚀 Running CodeVault Pro Locally

### 1. Start the Backend API Server
```powershell
# Activate Python virtual environment
.\venv\Scripts\Activate.ps1

# Run FastAPI server on port 8000
python -m uvicorn backend.main:app --host 127.0.0.1 --port 8000 --reload
```

### 2. Start the Frontend Application
```powershell
cd frontend
npm.cmd run dev
```
Open `http://localhost:5173` in your browser.

---

## 🧪 Testing

Run the automated backend test suite:
```powershell
.\venv\Scripts\python -m pytest backend/tests/ -v
```

---

## 👥 Demo User Accounts

| Role | Username | Password | Purpose |
|---|---|---|---|
| **Teacher** | `prof_sharma` | `password123` | Classroom management, assign problems, view leaderboards |
| **Creator** | `creator` | `password123` | Personal library, folder import, versioning, analytics |
| **Student** | `asha_r` | `password123` | Problem solving, Practice & Check judge submissions, AI helper |
| **Student** | `rohit_k` | `password123` | Classroom member |
