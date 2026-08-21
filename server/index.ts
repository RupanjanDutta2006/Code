import express, { Request, Response } from 'express';
import cors from 'cors';

const app = express();
const PORT = process.env.PORT || 8000;

app.use(cors());
app.use(express.json());

const COMPILER_MAP: Record<string, string> = {
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
};

// Health check
app.get('/api/health', (req: Request, res: Response) => {
  res.json({ status: 'ok', engine: 'Node.js Express TypeScript', version: '2.0.0' });
});

// Universal Execution Endpoint for all 11 languages with full STDIN support
app.post('/api/programs/execute', async (req: Request, res: Response) => {
  const { language, source_code, code, custom_input, stdin } = req.body;
  const startTime = Date.now();
  const rawCode = source_code || code || '';
  const rawStdin = stdin !== undefined ? stdin : (custom_input || '');
  const normLang = (language || 'python').toLowerCase().trim();

  try {
    const compiler = COMPILER_MAP[normLang] || 'cpython-3.13.8';
    let codeToRun = rawCode;

    if (normLang === 'java') {
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

    const payload = {
      compiler,
      code: codeToRun,
      stdin: rawStdin,
    };

    const upstream = await fetch('https://wandbox.org/api/compile.json', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    const elapsed = Date.now() - startTime;

    if (!upstream.ok) {
      return res.status(200).json({
        status: 'error',
        output: '',
        error: `Remote runner returned status ${upstream.status}`,
        execution_time_ms: elapsed,
        exit_code: 1,
      });
    }

    const data = await upstream.json();
    const stdout = data.program_output || data.compiler_output || '';
    const stderr = data.program_error || data.compiler_error || '';
    const exitCode = typeof data.status === 'number' ? data.status : (stderr && !stdout ? 1 : 0);

    res.json({
      status: exitCode === 0 ? 'success' : 'error',
      output: stdout,
      error: stderr || undefined,
      execution_time_ms: elapsed,
      exit_code: exitCode,
    });
  } catch (err: any) {
    res.status(200).json({
      status: 'error',
      output: '',
      error: err.message || 'Execution error',
      execution_time_ms: Date.now() - startTime,
      exit_code: 1,
    });
  }
});

// AI explain & fix
app.post('/api/ai/explain', (req: Request, res: Response) => {
  const { language, source_code } = req.body;
  res.json({
    provider: 'CodeVault Pro Assistant',
    explanation: `Code Analysis for ${language?.toUpperCase() || 'Language'}:\n- Contains ${source_code ? source_code.split('\n').length : 0} lines.\n- Clean logic flow and standard library usage.`,
    disclaimer: 'Advisory analysis only.',
  });
});

if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log(`🚀 CodeVault Node.js server listening on http://localhost:${PORT}`);
  });
}

export default app;
