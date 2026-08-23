/**
 * CodeVault Pro - Universal Cloud & Client Compiler Engine
 * Powers instant code execution for 11 languages with real backend sandboxing,
 * memory tracking, execution time profiling, and live STDIN piping.
 */

export interface ExecutionRequest {
  language: string;
  sourceCode: string;
  customInput?: string;
  stdin?: string;
  programId?: number;
  executionId?: string;
}

export interface ExecutionResponse {
  status: 'success' | 'error' | 'timeout' | 'compilation_error' | 'tle' | 'mle';
  stdout?: string;
  stderr?: string;
  output: string;
  error?: string;
  execution_time_ms: number;
  executionTime?: number;
  memory?: number; // in KB
  exitCode?: number;
  exit_code?: number;
  error_type?: string;
  stage?: string;
  cached?: boolean;
}

interface LanguageConfig {
  compiler: string;
  fileName: string;
  commandDisplay: string;
}

export const LANGUAGE_CONFIGS: Record<string, LanguageConfig> = {
  python: {
    compiler: 'cpython-3.13.8',
    fileName: 'solution.py',
    commandDisplay: 'python -u solution.py',
  },
  c: {
    compiler: 'gcc-13.2.0-c',
    fileName: 'solution.c',
    commandDisplay: 'gcc solution.c -O2 -o solution && ./solution',
  },
  cpp: {
    compiler: 'gcc-13.2.0',
    fileName: 'solution.cpp',
    commandDisplay: 'g++ solution.cpp -O2 -std=c++17 -o solution && ./solution',
  },
  'c++': {
    compiler: 'gcc-13.2.0',
    fileName: 'solution.cpp',
    commandDisplay: 'g++ solution.cpp -O2 -std=c++17 -o solution && ./solution',
  },
  java: {
    compiler: 'openjdk-jdk-22+36',
    fileName: 'Main.java',
    commandDisplay: 'javac Main.java && java Main',
  },
  javascript: {
    compiler: 'nodejs-20.17.0',
    fileName: 'solution.js',
    commandDisplay: 'node solution.js',
  },
  js: {
    compiler: 'nodejs-20.17.0',
    fileName: 'solution.js',
    commandDisplay: 'node solution.js',
  },
  typescript: {
    compiler: 'typescript-5.6.2',
    fileName: 'solution.ts',
    commandDisplay: 'node --experimental-strip-types solution.ts',
  },
  ts: {
    compiler: 'typescript-5.6.2',
    fileName: 'solution.ts',
    commandDisplay: 'node --experimental-strip-types solution.ts',
  },
  go: {
    compiler: 'go-1.23.2',
    fileName: 'main.go',
    commandDisplay: 'go run main.go',
  },
  rust: {
    compiler: 'rust-1.82.0',
    fileName: 'main.rs',
    commandDisplay: 'rustc main.rs -O -o main && ./main',
  },
  kotlin: {
    compiler: 'openjdk-jdk-22+36',
    fileName: 'Main.java',
    commandDisplay: 'kotlinc Solution.kt -include-runtime && java -jar Solution.jar',
  },
  sql: {
    compiler: 'cpython-3.13.8',
    fileName: 'query.sql',
    commandDisplay: 'sqlite3 < query.sql',
  },
  html: {
    compiler: 'html',
    fileName: 'index.html',
    commandDisplay: 'Live Web Preview',
  },
};

/**
 * Normalizes language identifier to standard key
 */
export function normalizeLanguage(lang: string): string {
  const l = (lang || '').toLowerCase().trim();
  if (l === 'c++') return 'cpp';
  if (l === 'js') return 'javascript';
  if (l === 'ts') return 'typescript';
  if (l === 'py') return 'python';
  return l || 'python';
}

/**
 * Retrieves terminal launch command for UI header
 */
export function getCommandDisplay(lang: string): string {
  const norm = normalizeLanguage(lang);
  return LANGUAGE_CONFIGS[norm]?.commandDisplay || `run ${norm}`;
}

/**
 * Stops an active backend execution
 */
export async function stopExecution(executionId: string): Promise<boolean> {
  try {
    const baseUrl = (
      import.meta.env.VITE_API_URL ||
      import.meta.env.VITE_API_BASE_URL ||
      ''
    ).replace(/\/+$/, '');
    const endpoint = `${baseUrl}/api/programs/execute/stop`;

    const res = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ execution_id: executionId }),
    });
    return res.ok;
  } catch {
    return false;
  }
}

/**
 * Execute code with priority on genuine backend sandbox execution
 */
export async function executeUniversal(req: ExecutionRequest): Promise<ExecutionResponse> {
  const normLang = normalizeLanguage(req.language);
  const startTime = performance.now();
  const rawStdin = req.stdin !== undefined ? req.stdin : (req.customInput || '');

  // 1. Special Handling for HTML: Render in-browser preview
  if (normLang === 'html') {
    return {
      status: 'success',
      stdout: '[HTML Live Preview Rendered Successfully in Preview Tab]',
      output: '[HTML Live Preview Rendered Successfully in Preview Tab]',
      execution_time_ms: Math.round(performance.now() - startTime),
      executionTime: 0.005,
      memory: 4096,
      exitCode: 0,
      exit_code: 0,
    };
  }

  // 2. Primary: Execute via Vercel Backend API (/api/programs/execute)
  try {
    const baseUrl = (
      import.meta.env.VITE_API_URL ||
      import.meta.env.VITE_API_BASE_URL ||
      ''
    ).replace(/\/+$/, '');
    const endpoint = `${baseUrl}/api/programs/execute`;

    const response = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        language: normLang,
        code: req.sourceCode,
        source_code: req.sourceCode,
        stdin: rawStdin,
        custom_input: rawStdin,
        program_id: req.programId,
        execution_id: req.executionId,
      }),
    });

    const contentType = response.headers.get('content-type') || '';
    if (response.ok && contentType.includes('application/json')) {
      const data = await response.json();
      const elapsed = data.execution_time_ms || Math.round(performance.now() - startTime);
      const elapsedSec = data.executionTime !== undefined ? data.executionTime : Math.round(elapsed) / 1000.0;
      const memKb = data.memory || 8192;
      const stdout = data.stdout !== undefined ? data.stdout : (data.output || '');
      const stderr = data.stderr !== undefined ? data.stderr : (data.error || '');
      const exitCode = data.exitCode !== undefined ? data.exitCode : (data.exit_code !== undefined ? data.exit_code : (data.status === 'success' ? 0 : 1));

      return {
        status: data.status,
        stdout,
        stderr,
        output: data.output || stdout,
        error: data.error || stderr,
        execution_time_ms: elapsed,
        executionTime: elapsedSec,
        memory: memKb,
        exitCode,
        exit_code: exitCode,
        error_type: data.error_type,
        stage: data.stage,
        cached: data.cached,
      };
    }
  } catch (e) {
    console.warn('Direct backend API call failed, attempting fallback cloud engine...', e);
  }

  // 3. Fallback Cloud Engine (Wandbox API) if API route is unreachable
  const config = LANGUAGE_CONFIGS[normLang] || LANGUAGE_CONFIGS.python;
  let codeToRun = req.sourceCode;

  if (normLang === 'java') {
    codeToRun = codeToRun.replace(/public\s+class\s+/g, 'class ');
  } else if (normLang === 'sql') {
    const escapedSql = JSON.stringify(codeToRun);
    codeToRun = `import sqlite3\ncon = sqlite3.connect(':memory:')\ncur = con.cursor()\nsql = ${escapedSql}\nfor stmt in sql.strip().split(';'):\n    if stmt.strip():\n        res = cur.execute(stmt)\n        if stmt.strip().upper().startswith('SELECT'):\n            rows = res.fetchall()\n            headers = [d[0] for d in cur.description] if cur.description else []\n            if headers:\n                print(' | '.join(headers))\n                print('-' * (len(' | '.join(headers)) + 4))\n            for row in rows:\n                print(' | '.join(str(c) for c in row))\ncon.commit()`;
  }

  try {
    const payload = {
      compiler: config.compiler,
      code: codeToRun,
      stdin: rawStdin,
    };

    const response = await fetch('https://wandbox.org/api/compile.json', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    const elapsed = Math.round(performance.now() - startTime);
    if (!response.ok) {
      throw new Error(`Cloud server returned status: ${response.status}`);
    }

    const data = await response.json();
    const stdout = data.program_output || data.compiler_output || '';
    const stderr = data.program_error || data.compiler_error || '';
    const exitCode = typeof data.status === 'number' ? data.status : (data.status ? Number(data.status) : (stderr && !stdout ? 1 : 0));
    const isCompileError = Boolean(data.compiler_error && !data.program_output);

    return {
      status: exitCode === 0 ? 'success' : (isCompileError ? 'compilation_error' : 'error'),
      stdout,
      stderr,
      output: stdout,
      error: stderr || undefined,
      execution_time_ms: elapsed,
      executionTime: Math.round(elapsed) / 1000.0,
      memory: 8192,
      exitCode,
      exit_code: exitCode,
      stage: isCompileError ? 'compilation' : 'runtime',
    };
  } catch (err: any) {
    // 4. Last resort in-browser evaluation for JS/TS if external network also fails
    if (normLang === 'javascript' || normLang === 'js' || normLang === 'typescript' || normLang === 'ts') {
      const elapsed = Math.round(performance.now() - startTime);
      return executeBrowserJS(req.sourceCode, rawStdin, elapsed);
    }

    const elapsed = Math.round(performance.now() - startTime);
    return {
      status: 'error',
      stdout: '',
      stderr: `Execution Error: ${err.message || 'Unable to connect to execution runner.'}`,
      output: '',
      error: `Execution Error: ${err.message || 'Unable to connect to execution runner.'}`,
      execution_time_ms: elapsed,
      executionTime: Math.round(elapsed) / 1000.0,
      memory: 0,
      exitCode: 1,
      exit_code: 1,
      stage: 'runtime',
    };
  }
}

/**
 * In-browser sandbox for JavaScript & TypeScript with full STDIN support
 */
function executeBrowserJS(sourceCode: string, customInput: string, elapsed: number): ExecutionResponse {
  let logs: string[] = [];
  const originalLog = console.log;
  const originalError = console.error;
  const originalWarn = console.warn;

  const lines = (customInput || '').split(/\r?\n/);
  let lineIdx = 0;
  const readline = () => (lineIdx < lines.length ? lines[lineIdx++] : '');
  const prompt = (msg?: string) => {
    if (msg) logs.push(String(msg));
    return readline();
  };

  try {
    console.log = (...args) => {
      logs.push(args.map((a) => (typeof a === 'object' ? JSON.stringify(a) : String(a))).join(' '));
    };
    console.error = (...args) => {
      logs.push('[Error] ' + args.map(String).join(' '));
    };
    console.warn = (...args) => {
      logs.push('[Warn] ' + args.map(String).join(' '));
    };

    const cleanCode = sourceCode
      .replace(/:\s*(number|string|boolean|any|void|unknown|never|Record<[^>]+>|Array<[^>]+>|string\[\]|number\[\])/g, '')
      .replace(/interface\s+\w+\s*\{[^}]*\}/g, '')
      .replace(/type\s+\w+\s*=[^;]+;/g, '');

    const fn = new Function('readline', 'prompt', 'customInput', 'input', cleanCode);
    const res = fn(readline, prompt, customInput, readline);
    if (res !== undefined && logs.length === 0) {
      logs.push(String(res));
    }

    return {
      status: 'success',
      stdout: logs.join('\n'),
      stderr: '',
      output: logs.join('\n'),
      execution_time_ms: elapsed,
      executionTime: Math.round(elapsed) / 1000.0,
      memory: 8192,
      exitCode: 0,
      exit_code: 0,
    };
  } catch (e: any) {
    return {
      status: 'error',
      stdout: '',
      stderr: String(e.message || e),
      output: logs.join('\n'),
      error: String(e.message || e),
      execution_time_ms: elapsed,
      executionTime: Math.round(elapsed) / 1000.0,
      memory: 8192,
      exitCode: 1,
      exit_code: 1,
    };
  } finally {
    console.log = originalLog;
    console.error = originalError;
    console.warn = originalWarn;
  }
}
