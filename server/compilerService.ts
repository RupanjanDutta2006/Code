/**
 * CodeVault Pro - Unified Cloud Execution Service
 * Production Engine supporting Judge0 (with API Key) and Wandbox (Zero-Config Fallback).
 * 
 * Features:
 * - 100% Cloud-based: No local MinGW, GCC, Python, or Java binaries required.
 * - Centralized language mapper for 11 programming languages.
 * - In-memory rate limiting & input/payload size safeguards.
 * - Standardized JSON contract matching both legacy & modern frontend expectations.
 */

export interface ExecuteServiceRequest {
  language?: string;
  code?: string;
  source_code?: string;
  sourceCode?: string;
  stdin?: string;
  custom_input?: string;
  customInput?: string;
  program_id?: number;
  programId?: number;
  execution_id?: string;
  executionId?: string;
  clientIp?: string;
}

export interface ExecuteServiceResponse {
  success: boolean;
  status: 'success' | 'error' | 'timeout' | 'compilation_error';
  stdout: string;
  stderr: string;
  output: string;
  error?: string;
  compileOutput?: string;
  exitCode: number;
  exit_code: number;
  executionTime: number; // in seconds
  execution_time_ms: number; // in milliseconds
  memory: number; // in KB
  stage: 'compilation' | 'runtime' | 'timeout' | 'validation';
  error_type?: string;
  cached: boolean;
}

// 1. Centralized Language Definitions
export interface LanguageDefinition {
  id: string;
  name: string;
  judge0Id: number;
  wandboxCompiler: string;
  fileExtension: string;
  aliases: string[];
}

export const LANGUAGE_REGISTRY: Record<string, LanguageDefinition> = {
  c: {
    id: 'c',
    name: 'C (GCC 13)',
    judge0Id: 105, // C (GCC 14.1.0 / 13.2.0)
    wandboxCompiler: 'gcc-13.2.0-c',
    fileExtension: 'c',
    aliases: ['c', 'gcc', 'clang-c'],
  },
  cpp: {
    id: 'cpp',
    name: 'C++ (G++ 13)',
    judge0Id: 105, // C++ (GCC 14.1.0 / 13.2.0)
    wandboxCompiler: 'gcc-13.2.0',
    fileExtension: 'cpp',
    aliases: ['cpp', 'c++', 'g++', 'cxx'],
  },
  python: {
    id: 'python',
    name: 'Python (CPython 3.13)',
    judge0Id: 100, // Python (3.12.5 / 3.13)
    wandboxCompiler: 'cpython-3.13.8',
    fileExtension: 'py',
    aliases: ['python', 'python3', 'py'],
  },
  java: {
    id: 'java',
    name: 'Java (OpenJDK 22)',
    judge0Id: 91, // Java (JDK 21.0.2 / 22)
    wandboxCompiler: 'openjdk-jdk-22+36',
    fileExtension: 'java',
    aliases: ['java', 'jdk'],
  },
  javascript: {
    id: 'javascript',
    name: 'JavaScript (Node.js 20)',
    judge0Id: 102, // JavaScript (Node.js 22.08 / 20.17)
    wandboxCompiler: 'nodejs-20.17.0',
    fileExtension: 'js',
    aliases: ['javascript', 'js', 'node', 'nodejs'],
  },
  typescript: {
    id: 'typescript',
    name: 'TypeScript (5.6)',
    judge0Id: 101, // TypeScript (5.0.3)
    wandboxCompiler: 'typescript-5.6.2',
    fileExtension: 'ts',
    aliases: ['typescript', 'ts'],
  },
  go: {
    id: 'go',
    name: 'Go (1.23)',
    judge0Id: 95, // Go (1.22.0 / 1.23)
    wandboxCompiler: 'go-1.23.2',
    fileExtension: 'go',
    aliases: ['go', 'golang'],
  },
  rust: {
    id: 'rust',
    name: 'Rust (1.82)',
    judge0Id: 108, // Rust (1.78.0 / 1.82)
    wandboxCompiler: 'rust-1.82.0',
    fileExtension: 'rs',
    aliases: ['rust', 'rs'],
  },
  kotlin: {
    id: 'kotlin',
    name: 'Kotlin (JVM 22)',
    judge0Id: 78, // Kotlin (1.9.23)
    wandboxCompiler: 'openjdk-jdk-22+36',
    fileExtension: 'kt',
    aliases: ['kotlin', 'kt'],
  },
  sql: {
    id: 'sql',
    name: 'SQL (SQLite3 Engine)',
    judge0Id: 82, // SQL (SQLite 3.42.0)
    wandboxCompiler: 'cpython-3.13.8',
    fileExtension: 'sql',
    aliases: ['sql', 'sqlite', 'sqlite3'],
  },
  html: {
    id: 'html',
    name: 'HTML / CSS / JS Live Preview',
    judge0Id: 0,
    wandboxCompiler: 'html',
    fileExtension: 'html',
    aliases: ['html', 'htm', 'web'],
  },
};

// Aliases lookup map
const ALIAS_LOOKUP: Record<string, string> = {};
for (const [key, def] of Object.entries(LANGUAGE_REGISTRY)) {
  for (const alias of def.aliases) {
    ALIAS_LOOKUP[alias.toLowerCase()] = key;
  }
}

export function normalizeLanguage(lang?: string): string {
  const clean = (lang || '').toLowerCase().trim();
  return ALIAS_LOOKUP[clean] || clean;
}

export const SUPPORTED_LANGUAGES = Object.keys(LANGUAGE_REGISTRY);

// 2. Simple In-Memory Rate Limiter (30 executions/min per IP)
interface RateLimitRecord {
  count: number;
  resetAt: number;
}
const ipRateLimits = new Map<string, RateLimitRecord>();

function checkRateLimit(ip: string = 'global'): boolean {
  const now = Date.now();
  const windowMs = 60 * 1000;
  const maxRequests = 40;

  const record = ipRateLimits.get(ip);
  if (!record || now > record.resetAt) {
    ipRateLimits.set(ip, { count: 1, resetAt: now + windowMs });
    return true;
  }

  if (record.count >= maxRequests) {
    return false;
  }

  record.count += 1;
  return true;
}

// 3. Main Universal Execution Handler
export async function executeCode(req: ExecuteServiceRequest): Promise<ExecuteServiceResponse> {
  const startTime = Date.now();
  const rawCode = req.source_code || req.code || req.sourceCode || '';
  const rawStdin =
    req.stdin !== undefined
      ? req.stdin
      : req.custom_input !== undefined
      ? req.custom_input
      : req.customInput !== undefined
      ? req.customInput
      : '';
  const rawLang = req.language || '';
  const normLang = normalizeLanguage(rawLang);
  const clientIp = req.clientIp || 'unknown-client';

  // Log clean diagnostic (No secrets or tokens logged)
  console.log(`[CodeVault Execution] Language: "${rawLang}" -> "${normLang}", CodeSize: ${rawCode.length}B, StdinSize: ${rawStdin.length}B, IP: ${clientIp}`);

  // Safeguard 1: Rate Limiting
  if (!checkRateLimit(clientIp)) {
    return {
      success: false,
      status: 'error',
      stdout: '',
      stderr: 'Rate limit exceeded (Max 40 requests/minute). Please wait a few moments.',
      output: '',
      error: 'Rate limit exceeded. Please slow down your requests.',
      exitCode: 429,
      exit_code: 429,
      executionTime: 0,
      execution_time_ms: 0,
      memory: 0,
      stage: 'validation',
      error_type: 'RateLimitExceeded',
      cached: false,
    };
  }

  // Safeguard 2: Language Validation
  if (!normLang || !LANGUAGE_REGISTRY[normLang]) {
    const errorMsg = normLang
      ? `Unsupported language "${rawLang}". Supported: ${SUPPORTED_LANGUAGES.join(', ')}`
      : `Language is required. Supported: ${SUPPORTED_LANGUAGES.join(', ')}`;
    return {
      success: false,
      status: 'error',
      stdout: '',
      stderr: errorMsg,
      output: '',
      error: errorMsg,
      exitCode: 1,
      exit_code: 1,
      executionTime: 0,
      execution_time_ms: 0,
      memory: 0,
      stage: 'validation',
      error_type: 'InvalidLanguage',
      cached: false,
    };
  }

  // Safeguard 3: Payload Size Limits (Max 64KB code, 32KB stdin)
  if (rawCode.length > 64 * 1024) {
    return {
      success: false,
      status: 'error',
      stdout: '',
      stderr: 'Source code size exceeds limit of 64 KB.',
      output: '',
      error: 'Payload Too Large: Source code exceeds 64 KB.',
      exitCode: 413,
      exit_code: 413,
      executionTime: 0,
      execution_time_ms: 0,
      memory: 0,
      stage: 'validation',
      error_type: 'PayloadTooLarge',
      cached: false,
    };
  }

  if (rawStdin.length > 32 * 1024) {
    return {
      success: false,
      status: 'error',
      stdout: '',
      stderr: 'Standard input size exceeds limit of 32 KB.',
      output: '',
      error: 'Payload Too Large: STDIN input exceeds 32 KB.',
      exitCode: 413,
      exit_code: 413,
      executionTime: 0,
      execution_time_ms: 0,
      memory: 0,
      stage: 'validation',
      error_type: 'PayloadTooLarge',
      cached: false,
    };
  }

  // Safeguard 4: Empty Source Check
  if (!rawCode.trim() && normLang !== 'html') {
    return {
      success: false,
      status: 'error',
      stdout: '',
      stderr: 'Source code cannot be empty.',
      output: '',
      error: 'Source code cannot be empty.',
      exitCode: 1,
      exit_code: 1,
      executionTime: 0,
      execution_time_ms: 0,
      memory: 0,
      stage: 'validation',
      error_type: 'EmptySourceCode',
      cached: false,
    };
  }

  // Special Case: HTML In-Browser Preview
  if (normLang === 'html') {
    return {
      success: true,
      status: 'success',
      stdout: '[HTML Live Preview Rendered Successfully in Preview Tab]',
      stderr: '',
      output: '[HTML Live Preview Rendered Successfully in Preview Tab]',
      exitCode: 0,
      exit_code: 0,
      executionTime: 0.005,
      execution_time_ms: 5,
      memory: 4096,
      stage: 'runtime',
      cached: false,
    };
  }

  const langDef = LANGUAGE_REGISTRY[normLang];

  // 4. Check if Judge0 API Credentials exist in Environment
  const judge0ApiKey = process.env.JUDGE0_API_KEY || process.env.RAPIDAPI_KEY;
  const judge0Host = process.env.JUDGE0_HOST || process.env.RAPIDAPI_HOST || 'judge0-ce.p.rapidapi.com';
  const judge0BaseUrl = process.env.JUDGE0_BASE_URL || `https://${judge0Host}`;

  if (judge0ApiKey && langDef.judge0Id > 0) {
    try {
      console.log(`[CodeVault Cloud] Routing to Judge0 Engine (Language ID: ${langDef.judge0Id})`);
      const judge0Result = await executeWithJudge0(
        judge0BaseUrl,
        judge0ApiKey,
        judge0Host,
        langDef.judge0Id,
        rawCode,
        rawStdin,
        startTime
      );
      return judge0Result;
    } catch (judge0Err: any) {
      console.warn(`[Judge0 Fallback] Judge0 returned error: ${judge0Err.message}. Falling back to Wandbox Engine.`);
    }
  }

  // 5. High-Availability Zero-Config Cloud Engine (Wandbox)
  return await executeWithWandbox(langDef, rawCode, rawStdin, startTime);
}

// 4. Judge0 Execution Driver
async function executeWithJudge0(
  baseUrl: string,
  apiKey: string,
  host: string,
  languageId: number,
  sourceCode: string,
  stdin: string,
  startTime: number
): Promise<ExecuteServiceResponse> {
  const endpoint = `${baseUrl.replace(/\/+$/, '')}/submissions?base64_encoded=false&wait=true`;
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 20000);

  const res = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-RapidAPI-Key': apiKey,
      'X-RapidAPI-Host': host,
      'X-Auth-Token': apiKey,
    },
    body: JSON.stringify({
      language_id: languageId,
      source_code: sourceCode,
      stdin: stdin,
      cpu_time_limit: 5,
      memory_limit: 128000,
    }),
    signal: controller.signal,
  });

  clearTimeout(timeoutId);
  const elapsed = Date.now() - startTime;
  const elapsedSec = Math.round(elapsed) / 1000.0;

  if (!res.ok) {
    throw new Error(`Judge0 Upstream HTTP ${res.status}`);
  }

  const data: any = await res.json();
  const stdout = data.stdout || '';
  const stderr = data.stderr || '';
  const compileOutput = data.compile_output || '';
  const statusId = data.status?.id || 3;
  const statusDescription = data.status?.description || '';
  const executionTime = data.time ? Number(data.time) : elapsedSec;
  const memoryKb = data.memory ? Number(data.memory) : 8192;

  // Status ID 3 = Accepted
  // Status ID 6 = Compilation Error
  // Status ID 5 = Time Limit Exceeded
  // Status ID 11 = Runtime Error
  if (statusId === 6) {
    const errText = compileOutput.trim() || stderr.trim() || 'Compilation failed.';
    return {
      success: false,
      status: 'compilation_error',
      stdout: '',
      stderr: errText,
      compileOutput: errText,
      output: '',
      error: errText,
      exitCode: 1,
      exit_code: 1,
      executionTime,
      execution_time_ms: Math.round(executionTime * 1000),
      memory: memoryKb,
      stage: 'compilation',
      error_type: 'CompilationError',
      cached: false,
    };
  }

  if (statusId === 5) {
    return {
      success: false,
      status: 'timeout',
      stdout: stdout,
      stderr: 'Time Limit Exceeded.',
      compileOutput,
      output: stdout,
      error: 'Time Limit Exceeded.',
      exitCode: 124,
      exit_code: 124,
      executionTime,
      execution_time_ms: Math.round(executionTime * 1000),
      memory: memoryKb,
      stage: 'timeout',
      error_type: 'TimeLimitExceeded',
      cached: false,
    };
  }

  if (statusId !== 3) {
    const errText = stderr.trim() || statusDescription || 'Runtime Error';
    return {
      success: false,
      status: 'error',
      stdout: stdout,
      stderr: errText,
      compileOutput,
      output: stdout,
      error: errText,
      exitCode: 1,
      exit_code: 1,
      executionTime,
      execution_time_ms: Math.round(executionTime * 1000),
      memory: memoryKb,
      stage: 'runtime',
      error_type: 'RuntimeError',
      cached: false,
    };
  }

  return {
    success: true,
    status: 'success',
    stdout,
    stderr: '',
    compileOutput,
    output: stdout,
    error: undefined,
    exitCode: 0,
    exit_code: 0,
    executionTime,
    execution_time_ms: Math.round(executionTime * 1000),
    memory: memoryKb,
    stage: 'runtime',
    cached: false,
  };
}

// 5. Wandbox Cloud Execution Driver
async function executeWithWandbox(
  langDef: LanguageDefinition,
  rawCode: string,
  rawStdin: string,
  startTime: number
): Promise<ExecuteServiceResponse> {
  let codeToRun = rawCode;

  // Preprocessing
  if (langDef.id === 'java') {
    codeToRun = codeToRun.replace(/public\s+class\s+/g, 'class ');
  } else if (langDef.id === 'sql') {
    const escapedSql = JSON.stringify(codeToRun);
    codeToRun = `import sqlite3\ncon = sqlite3.connect(':memory:')\ncur = con.cursor()\nsql = ${escapedSql}\nfor stmt in sql.strip().split(';'):\n    if stmt.strip():\n        res = cur.execute(stmt)\n        if stmt.strip().upper().startswith('SELECT'):\n            rows = res.fetchall()\n            headers = [d[0] for d in cur.description] if cur.description else []\n            if headers:\n                print(' | '.join(headers))\n                print('-' * (len(' | '.join(headers)) + 4))\n            for row in rows:\n                print(' | '.join(str(c) for c in row))\ncon.commit()`;
  }

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 20000);

    const upstream = await fetch('https://wandbox.org/api/compile.json', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        compiler: langDef.wandboxCompiler,
        code: codeToRun,
        stdin: rawStdin,
      }),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);
    const elapsed = Date.now() - startTime;
    const elapsedSec = Math.round(elapsed) / 1000.0;

    if (!upstream.ok) {
      return {
        success: false,
        status: 'error',
        stdout: '',
        stderr: `Remote execution runner returned HTTP status ${upstream.status}`,
        output: '',
        error: `Remote execution runner returned HTTP status ${upstream.status}`,
        exitCode: 1,
        exit_code: 1,
        executionTime: elapsedSec,
        execution_time_ms: elapsed,
        memory: 0,
        stage: 'runtime',
        error_type: 'RemoteRunnerError',
        cached: false,
      };
    }

    const data: any = await upstream.json();
    const compilerOutput = data.compiler_output || '';
    const compilerError = data.compiler_error || data.compiler_message || '';
    const programOutput = data.program_output || '';
    const programError = data.program_error || data.program_message || '';

    const rawStatus = data.status !== undefined && data.status !== '' ? Number(data.status) : 0;
    const hasCompilerError = Boolean(compilerError && compilerError.trim() && !programOutput);
    const hasRuntimeError = rawStatus !== 0 || Boolean(data.signal);

    if (hasCompilerError) {
      const errText = compilerError.trim();
      return {
        success: false,
        status: 'compilation_error',
        stdout: compilerOutput,
        stderr: errText,
        compileOutput: errText,
        output: compilerOutput,
        error: errText,
        exitCode: rawStatus !== 0 ? rawStatus : 1,
        exit_code: rawStatus !== 0 ? rawStatus : 1,
        executionTime: elapsedSec,
        execution_time_ms: elapsed,
        memory: 8192,
        stage: 'compilation',
        error_type: 'CompilationError',
        cached: false,
      };
    }

    if (hasRuntimeError) {
      const errText =
        programError.trim() ||
        compilerError.trim() ||
        (data.signal ? `Terminated with signal ${data.signal}` : `Process exited with code ${rawStatus}`);
      return {
        success: false,
        status: 'error',
        stdout: programOutput,
        stderr: errText,
        compileOutput: compilerError,
        output: programOutput || '',
        error: errText,
        exitCode: rawStatus !== 0 ? rawStatus : 1,
        exit_code: rawStatus !== 0 ? rawStatus : 1,
        executionTime: elapsedSec,
        execution_time_ms: elapsed,
        memory: 8192,
        stage: 'runtime',
        error_type: 'RuntimeError',
        cached: false,
      };
    }

    // Success
    const stdout = programOutput || compilerOutput || '';
    return {
      success: true,
      status: 'success',
      stdout,
      stderr: '',
      compileOutput: compilerOutput,
      output: stdout,
      error: undefined,
      exitCode: 0,
      exit_code: 0,
      executionTime: elapsedSec,
      execution_time_ms: elapsed,
      memory: 8192,
      stage: 'runtime',
      cached: false,
    };
  } catch (err: any) {
    const elapsed = Date.now() - startTime;
    const elapsedSec = Math.round(elapsed) / 1000.0;
    const isTimeout = err.name === 'AbortError' || (err.message && err.message.toLowerCase().includes('timeout'));

    if (isTimeout) {
      return {
        success: false,
        status: 'timeout',
        stdout: '',
        stderr: 'Execution timed out after 20 seconds.',
        output: '',
        error: 'Execution timed out after 20 seconds.',
        exitCode: 124,
        exit_code: 124,
        executionTime: elapsedSec,
        execution_time_ms: elapsed,
        memory: 0,
        stage: 'timeout',
        error_type: 'TimeLimitExceeded',
        cached: false,
      };
    }

    return {
      success: false,
      status: 'error',
      stdout: '',
      stderr: err.message || 'Execution error encountered.',
      output: '',
      error: err.message || 'Execution error encountered.',
      exitCode: 1,
      exit_code: 1,
      executionTime: elapsedSec,
      execution_time_ms: elapsed,
      memory: 0,
      stage: 'runtime',
      error_type: 'ExecutionException',
      cached: false,
    };
  }
}
