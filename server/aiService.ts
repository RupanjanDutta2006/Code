/**
 * CodeVault AI - Backend Nemotron Provider Service
 */

export interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface AIExplainRequest {
  source_code: string;
  language: string;
  context?: string;
}

export interface AISuggestFixRequest {
  source_code: string;
  language: string;
  error_message?: string;
  input_data?: string;
  expected_output?: string;
}

export interface AIChatRequest {
  messages: ChatMessage[];
  source_code?: string;
  language?: string;
  context?: string;
}

export const NVIDIA_CONFIG = {
  apiKey: process.env.NVIDIA_API_KEY || '',
  baseURL:
    process.env.NVIDIA_BASE_URL || 'https://integrate.api.nvidia.com/v1',
  model:
    process.env.NVIDIA_MODEL || 'nvidia/nemotron-3.5-lightning-30b-a3b',
  reasoningBudget: Number(process.env.NVIDIA_REASONING_BUDGET || 16384),
  enableThinking: process.env.NVIDIA_ENABLE_THINKING !== 'false',
  temperature: Number(process.env.NVIDIA_TEMPERATURE || 0.7),
  topP: Number(process.env.NVIDIA_TOP_P || 0.95),
  maxTokens: Number(process.env.NVIDIA_MAX_TOKENS || 4096),
  timeoutMs: 60000,
};

const SYSTEM_PROMPT = `You are CodeVault AI, an expert Computer Science tutor and AI coding assistant for CodeVault Pro.
You help students understand concepts, debug errors, analyze Big-O complexity, and write clean, optimal code.
Provide friendly, clear, structured responses with markdown formatting.
When providing code snippets, always specify the language markdown fence.`;

function buildMessagesPayload(req: AIChatRequest): ChatMessage[] {
  const messages: ChatMessage[] = [{ role: 'system', content: SYSTEM_PROMPT }];

  if (req.source_code) {
    messages.push({
      role: 'system',
      content: `Current Workspace Code (${req.language || 'c'}):\n\`\`\`${req.language || 'c'}\n${req.source_code}\n\`\`\``,
    });
  }

  if (req.context) {
    messages.push({
      role: 'system',
      content: req.context,
    });
  }

  messages.push(...req.messages);
  return messages;
}

async function callNvidiaNim(messages: ChatMessage[], maxTokensOverride?: number): Promise<string> {
  const apiKey = NVIDIA_CONFIG.apiKey;
  const baseURL = NVIDIA_CONFIG.baseURL;
  const model = NVIDIA_CONFIG.model;

  console.log(`[CodeVault AI] Calling NVIDIA NIM API (model=${model}, messages=${messages.length})...`);

  const payload = {
    model,
    messages,
    temperature: NVIDIA_CONFIG.temperature,
    top_p: NVIDIA_CONFIG.topP,
    max_tokens: maxTokensOverride || NVIDIA_CONFIG.maxTokens,
  };

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), NVIDIA_CONFIG.timeoutMs);

  try {
    const res = await fetch(`${baseURL}/chat/completions`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!res.ok) {
      const errorText = await res.text();
      console.error(`[CodeVault AI] Provider Error HTTP ${res.status}:`, errorText);
      if (res.status === 401 || res.status === 403) {
        throw new Error('AUTH_ERROR: Invalid or expired API credentials.');
      } else if (res.status === 429) {
        throw new Error('RATE_LIMITED: Upstream quota exceeded. Please try again shortly.');
      } else {
        throw new Error(`PROVIDER_ERROR: Upstream API returned HTTP ${res.status}`);
      }
    }

    const data: any = await res.json();
    const text = data.choices?.[0]?.message?.content || '';
    console.log(`[CodeVault AI] Received response (${text.length} chars).`);
    return text;
  } catch (err: any) {
    clearTimeout(timeoutId);
    if (err.name === 'AbortError') {
      console.error('[CodeVault AI] Upstream request timed out.');
      throw new Error('TIMEOUT: CodeVault AI took too long to respond. Please try again.');
    }
    throw err;
  }
}

/**
 * 1. Interactive Chat with CodeVault AI (Standard Non-Streaming)
 */
export async function chatWithNemotron(req: AIChatRequest): Promise<{
  provider: string;
  model: string;
  response: string;
  disclaimer: string;
}> {
  const messages = buildMessagesPayload(req);

  try {
    const content = await callNvidiaNim(messages);
    return {
      provider: 'CodeVault AI (NVIDIA Nemotron)',
      model: NVIDIA_CONFIG.model,
      response: content,
      disclaimer: 'AI-generated guidance. Powered by NVIDIA Nemotron.',
    };
  } catch (err: any) {
    console.error('[CodeVault AI Chat Error]:', err.message);
    let fallbackMsg = 'CodeVault AI is temporarily unavailable. Please try again in a moment.';
    if (err.message.includes('RATE_LIMITED')) {
      fallbackMsg = "You're sending messages too quickly. Please wait a moment and try again.";
    } else if (err.message.includes('TIMEOUT')) {
      fallbackMsg = 'CodeVault AI took too long to respond. Please try again.';
    }
    return {
      provider: 'CodeVault AI (Offline Fallback)',
      model: 'local-fallback',
      response: fallbackMsg,
      disclaimer: 'Advisory analysis only.',
    };
  }
}

/**
 * 1b. Real-Time Streaming Chat with CodeVault AI via Server-Sent Events (SSE)
 */
export async function streamChatWithNemotron(
  req: AIChatRequest,
  onToken: (token: string) => void,
  onDone: () => void,
  onError: (err: any) => void
): Promise<void> {
  const messages = buildMessagesPayload(req);

  console.log(`[CodeVault AI] Streaming request started (model=${NVIDIA_CONFIG.model})...`);

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), NVIDIA_CONFIG.timeoutMs);

  try {
    const res = await fetch(`${NVIDIA_CONFIG.baseURL}/chat/completions`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${NVIDIA_CONFIG.apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: NVIDIA_CONFIG.model,
        messages,
        temperature: NVIDIA_CONFIG.temperature,
        top_p: NVIDIA_CONFIG.topP,
        max_tokens: NVIDIA_CONFIG.maxTokens,
        stream: true,
      }),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!res.ok || !res.body) {
      const errText = await res.text();
      console.error(`[CodeVault AI] Streaming upstream error HTTP ${res.status}:`, errText);
      throw new Error(`Upstream returned HTTP ${res.status}`);
    }

    const reader = res.body.getReader();
    const decoder = new TextDecoder('utf-8');
    let done = false;

    while (!done) {
      const { value, done: streamDone } = await reader.read();
      done = streamDone;
      if (value) {
        const chunk = decoder.decode(value, { stream: true });
        const lines = chunk.split('\n');
        for (const line of lines) {
          if (line.startsWith('data: ') && line.trim() !== 'data: [DONE]') {
            try {
              const json = JSON.parse(line.slice(6));
              const token = json.choices?.[0]?.delta?.content || '';
              if (token) {
                onToken(token);
              }
            } catch (e) {}
          }
        }
      }
    }

    console.log('[CodeVault AI] Streaming completed successfully.');
    onDone();
  } catch (err: any) {
    clearTimeout(timeoutId);
    console.error('[CodeVault AI Streaming Error]:', err.message);
    onError(err);
  }
}

/**
 * 2. Explain Code with CodeVault AI
 */
export async function explainCodeWithNemotron(req: AIExplainRequest): Promise<{
  provider: string;
  model: string;
  explanation: string;
  disclaimer: string;
}> {
  const prompt = `Explain the following ${req.language} code in clear, simple terms.

Structure your response into:
1. 🎯 **Purpose & High-Level Summary**
2. 🔍 **Line-by-Line / Logical Breakdown**
3. ⚡ **Time & Space Complexity** (Big-O analysis)
4. 💡 **Beginner Tip & Common Pitfalls**

Code:
\`\`\`${req.language}
${req.source_code}
\`\`\``;

  const messages: ChatMessage[] = [
    { role: 'system', content: SYSTEM_PROMPT },
    { role: 'user', content: prompt },
  ];

  try {
    const content = await callNvidiaNim(messages);
    return {
      provider: 'CodeVault AI (NVIDIA Nemotron)',
      model: NVIDIA_CONFIG.model,
      explanation: content,
      disclaimer: 'AI-generated code explanation. Powered by NVIDIA Nemotron.',
    };
  } catch (err: any) {
    console.error('[CodeVault AI Explain Error]:', err.message);
    const lines = req.source_code ? req.source_code.split('\n').length : 0;
    return {
      provider: 'CodeVault AI (Built-in)',
      model: 'local-fallback',
      explanation: `### 📘 Code Analysis for ${req.language.toUpperCase()}\n\n- **Length**: ${lines} lines.\n- **Language**: ${req.language}\n- **Ready**: Code is structured and ready for cloud sandbox execution.`,
      disclaimer: 'Advisory analysis only.',
    };
  }
}

/**
 * 3. Suggest Fix with CodeVault AI
 */
export async function suggestFixWithNemotron(req: AISuggestFixRequest): Promise<{
  provider: string;
  model: string;
  explanation: string;
  suggested_code?: string;
  disclaimer: string;
}> {
  const prompt = `Analyze this ${req.language} code and the failure information:
- Error / Failure: ${req.error_message || 'Compilation or runtime error'}
- Input Data: ${req.input_data || 'Standard input'}
- Expected Output: ${req.expected_output || 'Correct execution'}

Provide:
1. ⚠️ **Root Cause**: What caused the bug?
2. 🛠️ **How to Fix**: Exact changes needed.
3. 💻 **Corrected Full Code**: Provide the complete corrected program in a fenced code block (\`\`\`${req.language}).

Code:
\`\`\`${req.language}
${req.source_code}
\`\`\``;

  const messages: ChatMessage[] = [
    { role: 'system', content: SYSTEM_PROMPT },
    { role: 'user', content: prompt },
  ];

  try {
    const content = await callNvidiaNim(messages);

    let extractedCode = req.source_code;
    const match = content.match(/```(?:[a-zA-Z+]+)?\n([\s\S]*?)```/);
    if (match && match[1]) {
      extractedCode = match[1].trim();
    }

    return {
      provider: 'CodeVault AI (NVIDIA Nemotron)',
      model: NVIDIA_CONFIG.model,
      explanation: content,
      suggested_code: extractedCode,
      disclaimer: 'AI-suggested fixes are advisory. Powered by NVIDIA Nemotron.',
    };
  } catch (err: any) {
    console.error('[CodeVault AI Fix Error]:', err.message);
    return {
      provider: 'CodeVault AI (Built-in)',
      model: 'local-fallback',
      explanation: `### Fix Suggestions\n\n${req.error_message ? `**Detected Issue**: \`${req.error_message}\`\n\n` : ''}- Check variable declarations and scope.\n- Verify syntax and matching braces.\n- Ensure required inputs (STDIN) are provided.`,
      suggested_code: req.source_code,
      disclaimer: 'Advisory analysis only.',
    };
  }
}
