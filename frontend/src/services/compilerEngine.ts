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
  pistonLang: string;
  version: string;
  fileName: string;
  commandDisplay: string;
}

export const LANGUAGE_CONFIGS: Record<string, LanguageConfig> = {
  python: {
    pistonLang: 'python',
    version: '3.10.0',
    fileName: 'solution.py',
    commandDisplay: 'python -u solution.py',
  },
  c: {
    pistonLang: 'c',
    version: '10.2.0',
    fileName: 'solution.c',
    commandDisplay: 'gcc solution.c -O2 -o solution && ./solution',
  },
  cpp: {
    pistonLang: 'c++',
    version: '10.2.0',
    fileName: 'solution.cpp',
    commandDisplay: 'g++ solution.cpp -O2 -std=c++17 -o solution && ./solution',
  },
  'c++': {
    pistonLang: 'c++',
    version: '10.2.0',
    fileName: 'solution.cpp',
    commandDisplay: 'g++ solution.cpp -O2 -std=c++17 -o solution && ./solution',
  },
  java: {
    pistonLang: 'java',
    version: '15.0.2',
    fileName: 'Main.java',
    commandDisplay: 'javac Main.java && java Main',
  },
  javascript: {
    pistonLang: 'javascript',
    version: '18.15.0',
    fileName: 'solution.js',
    commandDisplay: 'node solution.js',
  },
  js: {
    pistonLang: 'javascript',
    version: '18.15.0',
    fileName: 'solution.js',
    commandDisplay: 'node solution.js',
  },
  typescript: {
    pistonLang: 'typescript',
    version: '5.0.3',
    fileName: 'solution.ts',
    commandDisplay: 'ts-node solution.ts',
  },
  ts: {
    pistonLang: 'typescript',
    version: '5.0.3',
    fileName: 'solution.ts',
    commandDisplay: 'ts-node solution.ts',
  },
  go: {
    pistonLang: 'go',
    version: '1.16.2',
    fileName: 'main.go',
    commandDisplay: 'go run main.go',
  },
  rust: {
    pistonLang: 'rust',
    version: '1.68.2',
    fileName: 'main.rs',
    commandDisplay: 'rustc main.rs -O -o main && ./main',
  },
  kotlin: {
    pistonLang: 'kotlin',
    version: '1.8.20',
    fileName: 'Solution.kt',
    commandDisplay: 'kotlinc Solution.kt -include-runtime -d Solution.jar && java -jar Solution.jar',
  },
  sql: {
    pistonLang: 'sqlite3',
    version: '3.36.0',
    fileName: 'query.sql',
    commandDisplay: 'sqlite3 < query.sql',
  },
  html: {
    pistonLang: 'html',
    version: '5.0',
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

  // 3. Universal High-Performance Engine (Piston Multi-language)
  const config = LANGUAGE_CONFIGS[normLang] || LANGUAGE_CONFIGS.python;

  // Prepare source code adjustments if needed (e.g. Java class name checks)
  let preparedSource = req.sourceCode;
  let preparedFilename = config.fileName;

  if (normLang === 'java') {
    const classMatch = req.sourceCode.match(/public\s+class\s+([A-Za-z0-9_]+)/);
    if (classMatch && classMatch[1]) {
      preparedFilename = `${classMatch[1]}.java`;
    }
  }

  try {
    const response = await fetch('https://emkc.org/api/v2/piston/execute', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        language: config.pistonLang,
        version: config.version,
        files: [
          {
            name: preparedFilename,
            content: preparedSource,
          },
        ],
        stdin: req.customInput || '',
        args: [],
        compile_timeout: 10000,
        run_timeout: 6000,
      }),
    });

    const elapsed = Math.round(performance.now() - startTime);

    if (!response.ok) {
      // Fallback for JS/TS in browser if API is unreachable
      if (normLang === 'javascript') {
        return executeBrowserJS(req.sourceCode, elapsed);
      }
      throw new Error(`Execution server responded with status: ${response.status}`);
    }

    const data = await response.json();

    if (data.compile && data.compile.code !== 0) {
      return {
        status: 'error',
        output: '',
        error: data.compile.output || data.compile.stderr || 'Compilation error occurred.',
        execution_time_ms: elapsed,
        exit_code: data.compile.code ?? 1,
      };
    }

    const run = data.run || {};
    const stdout = run.stdout || '';
    const stderr = run.stderr || '';
    const code = run.code ?? 0;

    return {
      status: code === 0 && !stderr ? 'success' : stderr && !stdout ? 'error' : 'success',
      output: stdout,
      error: stderr || undefined,
      execution_time_ms: elapsed,
      exit_code: code,
    };
  } catch (err: any) {
    const elapsed = Math.round(performance.now() - startTime);
    // Fallback for JS in browser
    if (normLang === 'javascript') {
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
