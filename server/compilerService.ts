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
}

export interface ExecuteServiceResponse {
  status: 'success' | 'error' | 'timeout' | 'compilation_error';
  stdout: string;
  stderr: string;
  output: string;
  error?: string;
  exitCode: number;
  exit_code: number;
  execution_time_ms: number;
  executionTime: number;
  memory: number;
  stage: 'compilation' | 'runtime' | 'timeout' | 'validation';
  error_type?: string;
  cached: boolean;
}

export const COMPILER_MAP: Record<string, string> = {
  python: 'cpython-3.13.8',
  py: 'cpython-3.13.8',
  c: 'gcc-13.2.0-c',
  cpp: 'gcc-13.2.0',
  'c++': 'gcc-13.2.0',
  java: 'openjdk-jdk-22+36',
  javascript: 'nodejs-20.17.0',
  js: 'nodejs-20.17.0',
  typescript: 'typescript-5.6.2',
  ts: 'typescript-5.6.2',
  go: 'go-1.23.2',
  rust: 'rust-1.82.0',
  kotlin: 'openjdk-jdk-22+36',
  sql: 'cpython-3.13.8',
  html: 'html',
};

export const SUPPORTED_LANGUAGES = [
  'c',
  'cpp',
  'python',
  'java',
  'javascript',
  'typescript',
  'go',
  'rust',
  'kotlin',
  'sql',
  'html',
];

export function normalizeLanguage(lang?: string): string {
  const l = (lang || '').toLowerCase().trim();
  if (l === 'c++') return 'cpp';
  if (l === 'js') return 'javascript';
  if (l === 'ts') return 'typescript';
  if (l === 'py') return 'python';
  return l;
}

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

  console.log(`[Execute Request] Language: "${rawLang}" -> normalized: "${normLang}", Code length: ${rawCode.length}, Stdin length: ${rawStdin.length}`);

  // 1. Language validation
  if (!normLang) {
    return {
      status: 'error',
      stdout: '',
      stderr: 'Language is required. Supported languages: ' + SUPPORTED_LANGUAGES.join(', '),
      output: '',
      error: 'Language is required. Supported languages: ' + SUPPORTED_LANGUAGES.join(', '),
      exitCode: 1,
      exit_code: 1,
      execution_time_ms: 0,
      executionTime: 0,
      memory: 0,
      stage: 'validation',
      error_type: 'InvalidLanguage',
      cached: false,
    };
  }

  const compiler = COMPILER_MAP[normLang];
  if (!compiler) {
    return {
      status: 'error',
      stdout: '',
      stderr: `Unsupported language "${rawLang}". Supported: ${SUPPORTED_LANGUAGES.join(', ')}`,
      output: '',
      error: `Unsupported language "${rawLang}". Supported: ${SUPPORTED_LANGUAGES.join(', ')}`,
      exitCode: 1,
      exit_code: 1,
      execution_time_ms: 0,
      executionTime: 0,
      memory: 0,
      stage: 'validation',
      error_type: 'UnsupportedLanguage',
      cached: false,
    };
  }

  // 2. Source code validation
  if (!rawCode.trim() && normLang !== 'html') {
    return {
      status: 'error',
      stdout: '',
      stderr: 'Source code cannot be empty.',
      output: '',
      error: 'Source code cannot be empty.',
      exitCode: 1,
      exit_code: 1,
      execution_time_ms: 0,
      executionTime: 0,
      memory: 0,
      stage: 'validation',
      error_type: 'EmptySourceCode',
      cached: false,
    };
  }

  // 3. HTML special handling
  if (normLang === 'html') {
    return {
      status: 'success',
      stdout: '[HTML Live Preview Rendered Successfully in Preview Tab]',
      stderr: '',
      output: '[HTML Live Preview Rendered Successfully in Preview Tab]',
      exitCode: 0,
      exit_code: 0,
      execution_time_ms: 5,
      executionTime: 0.005,
      memory: 4096,
      stage: 'runtime',
      cached: false,
    };
  }

  // 4. Preprocessing for Java and SQL
  let codeToRun = rawCode;
  if (normLang === 'java') {
    // Wandbox expects non-public class declarations when source is in prog.java
    codeToRun = codeToRun.replace(/public\s+class\s+/g, 'class ');
  } else if (normLang === 'sql') {
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

  // 5. Send to Wandbox Cloud API
  try {
    console.log(`[Wandbox Dispatch] Sending to Wandbox API with compiler: ${compiler}`);
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 20000);

    const upstream = await fetch('https://wandbox.org/api/compile.json', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        compiler,
        code: codeToRun,
        stdin: rawStdin,
      }),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);
    const elapsed = Date.now() - startTime;
    const elapsedSec = Math.round(elapsed) / 1000.0;

    if (!upstream.ok) {
      console.error(`[Wandbox Error] Remote HTTP ${upstream.status}`);
      return {
        status: 'error',
        stdout: '',
        stderr: `Remote execution runner returned HTTP status ${upstream.status}`,
        output: '',
        error: `Remote execution runner returned HTTP status ${upstream.status}`,
        exitCode: 1,
        exit_code: 1,
        execution_time_ms: elapsed,
        executionTime: elapsedSec,
        memory: 0,
        stage: 'runtime',
        error_type: 'RemoteRunnerError',
        cached: false,
      };
    }

    const data: any = await upstream.json();
    console.log(`[Wandbox Response] Status: ${data.status}, Time: ${elapsed}ms, Signal: "${data.signal || ''}"`);

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
        status: 'compilation_error',
        stdout: compilerOutput,
        stderr: errText,
        output: compilerOutput,
        error: errText,
        exitCode: rawStatus !== 0 ? rawStatus : 1,
        exit_code: rawStatus !== 0 ? rawStatus : 1,
        execution_time_ms: elapsed,
        executionTime: elapsedSec,
        memory: 8192,
        stage: 'compilation',
        error_type: 'CompilationError',
        cached: false,
      };
    }

    if (hasRuntimeError) {
      const errText = programError.trim() || compilerError.trim() || (data.signal ? `Terminated with signal ${data.signal}` : `Process exited with code ${rawStatus}`);
      return {
        status: 'error',
        stdout: programOutput,
        stderr: errText,
        output: programOutput || '',
        error: errText,
        exitCode: rawStatus !== 0 ? rawStatus : 1,
        exit_code: rawStatus !== 0 ? rawStatus : 1,
        execution_time_ms: elapsed,
        executionTime: elapsedSec,
        memory: 8192,
        stage: 'runtime',
        error_type: 'RuntimeError',
        cached: false,
      };
    }

    // Successful execution
    const stdout = programOutput || compilerOutput || '';
    return {
      status: 'success',
      stdout,
      stderr: '',
      output: stdout,
      error: undefined,
      exitCode: 0,
      exit_code: 0,
      execution_time_ms: elapsed,
      executionTime: elapsedSec,
      memory: 8192,
      stage: 'runtime',
      cached: false,
    };
  } catch (err: any) {
    const elapsed = Date.now() - startTime;
    const elapsedSec = Math.round(elapsed) / 1000.0;
    const isTimeout = err.name === 'AbortError' || (err.message && err.message.toLowerCase().includes('timeout'));

    console.error(`[Execution Exception] Error: ${err.message}, Timeout: ${isTimeout}`);

    if (isTimeout) {
      return {
        status: 'timeout',
        stdout: '',
        stderr: 'Execution timed out after 20 seconds.',
        output: '',
        error: 'Execution timed out after 20 seconds.',
        exitCode: 124,
        exit_code: 124,
        execution_time_ms: elapsed,
        executionTime: elapsedSec,
        memory: 0,
        stage: 'timeout',
        error_type: 'TimeLimitExceeded',
        cached: false,
      };
    }

    return {
      status: 'error',
      stdout: '',
      stderr: err.message || 'Execution error encountered.',
      output: '',
      error: err.message || 'Execution error encountered.',
      exitCode: 1,
      exit_code: 1,
      execution_time_ms: elapsed,
      executionTime: elapsedSec,
      memory: 0,
      stage: 'runtime',
      error_type: 'ExecutionException',
      cached: false,
    };
  }
}
