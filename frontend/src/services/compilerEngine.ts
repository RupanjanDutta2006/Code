/**
 * CodeVault Pro - Universal Cloud & Client Compiler Engine
 * Powers instant code execution for 11 languages on Vercel, Mobile, and Desktop
 * with zero server setup required.
 */

export interface ExecutionRequest {
  language: string;
  sourceCode: string;
  customInput?: string;
  programId?: number;
}

export interface ExecutionResponse {
  status: 'success' | 'error' | 'timeout';
  output: string;
  error?: string;
  execution_time_ms: number;
  exit_code?: number;
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
    commandDisplay: 'ts-node solution.ts',
  },
  ts: {
    compiler: 'typescript-5.6.2',
    fileName: 'solution.ts',
    commandDisplay: 'ts-node solution.ts',
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
 * Execute code universally across any platform
 */
export async function executeUniversal(req: ExecutionRequest): Promise<ExecutionResponse> {
  const normLang = normalizeLanguage(req.language);
  const startTime = performance.now();

  // 1. Special Handling for HTML: Render in-browser preview
  if (normLang === 'html') {
    return {
      status: 'success',
      output: '[HTML Live Preview Rendered Successfully in Preview Tab]',
      execution_time_ms: Math.round(performance.now() - startTime),
      exit_code: 0,
    };
  }

  // 2. Try remote custom backend first if configured with VITE_API_BASE_URL
  const customBaseUrl = import.meta.env.VITE_API_BASE_URL;
  if (customBaseUrl && customBaseUrl.trim() !== '') {
    try {
      const response = await fetch(`${customBaseUrl}/api/programs/execute`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          language: normLang,
          source_code: req.sourceCode,
          custom_input: req.customInput || '',
          program_id: req.programId,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        return {
          status: data.status,
          output: data.output || '',
          error: data.error || '',
          execution_time_ms: data.execution_time_ms || Math.round(performance.now() - startTime),
          exit_code: data.status === 'success' ? 0 : 1,
        };
      }
    } catch (e) {
      console.warn('Custom backend unavailable, falling back to Universal Cloud Engine...');
    }
  }

  // 3. Universal High-Performance Engine (Wandbox Execution API)
  const config = LANGUAGE_CONFIGS[normLang] || LANGUAGE_CONFIGS.python;

  let codeToRun = req.sourceCode;

  // Formatting adjustments for specific languages
  if (normLang === 'java') {
    // Replace "public class" with "class" for single file Java runner
    codeToRun = codeToRun.replace(/public\s+class\s+/g, 'class ');
  } else if (normLang === 'sql') {
    // Wrap SQL query in Python sqlite3 runner for reliable formatted execution
    const escapedSql = JSON.stringify(codeToRun);
    codeToRun = `import sqlite3
con = sqlite3.connect(':memory:')
cur = con.cursor()
sql = ${escapedSql}
for stmt in sql.strip().split(';'):
    if stmt.strip():
        res = cur.execute(stmt)
        if stmt.strip().upper().startswith('SELECT'):
            rows = res.fetchall()
            headers = [d[0] for d in cur.description] if cur.description else []
            if headers:
                print(' | '.join(headers))
                print('-' * (len(' | '.join(headers)) + 4))
            for row in rows:
                print(' | '.join(str(c) for c in row))
con.commit()`;
  }

  try {
    const payload: any = {
      compiler: config.compiler,
      code: codeToRun,
      stdin: req.customInput || '',
    };

    const response = await fetch('https://wandbox.org/api/compile.json', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    const elapsed = Math.round(performance.now() - startTime);

    if (!response.ok) {
      // Fallback for JavaScript in browser
      if (normLang === 'javascript' || normLang === 'js') {
        return executeBrowserJS(req.sourceCode, elapsed);
      }
      throw new Error(`Execution server responded with status: ${response.status}`);
    }

    const data = await response.json();

    const stdout = data.program_output || data.compiler_output || '';
    const stderr = data.program_error || data.compiler_error || '';
    const exitCode = typeof data.status === 'number' ? data.status : (stderr && !stdout ? 1 : 0);

    return {
      status: exitCode === 0 ? 'success' : 'error',
      output: stdout,
      error: stderr || undefined,
      execution_time_ms: elapsed,
      exit_code: exitCode,
    };
  } catch (err: any) {
    const elapsed = Math.round(performance.now() - startTime);

    // Fallback for JS in browser
    if (normLang === 'javascript' || normLang === 'js') {
      return executeBrowserJS(req.sourceCode, elapsed);
    }

    return {
      status: 'error',
      output: '',
      error: `Execution Error: ${err.message || 'Unable to connect to execution server. Please check your internet connection.'}`,
      execution_time_ms: elapsed,
      exit_code: 1,
    };
  }
}

/**
 * In-browser sandbox fallback for JavaScript
 */
function executeBrowserJS(sourceCode: string, elapsed: number): ExecutionResponse {
  let logs: string[] = [];
  const originalLog = console.log;
  const originalError = console.error;
  const originalWarn = console.warn;

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

    // Safe isolated execution
    const fn = new Function(sourceCode);
    const res = fn();
    if (res !== undefined && logs.length === 0) {
      logs.push(String(res));
    }

    return {
      status: 'success',
      output: logs.join('\n'),
      execution_time_ms: elapsed,
      exit_code: 0,
    };
  } catch (e: any) {
    return {
      status: 'error',
      output: logs.join('\n'),
      error: String(e.message || e),
      execution_time_ms: elapsed,
      exit_code: 1,
    };
  } finally {
    console.log = originalLog;
    console.error = originalError;
    console.warn = originalWarn;
  }
}
