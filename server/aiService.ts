/**
 * CodeVault AI - Backend Provider Service
 * Provider-neutral: backend calls upstream AI; frontend never sees provider name.
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

const AI_CONFIG = {
  apiKey: process.env.NVIDIA_API_KEY || '',
  baseURL: process.env.NVIDIA_BASE_URL || 'https://integrate.api.nvidia.com/v1',
  model: process.env.NVIDIA_MODEL || 'nvidia/llama-3.1-nemotron-70b-instruct',
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
    messages.push({ role: 'system', content: req.context });
  }

  messages.push(...req.messages);
  return messages;
}

async function callAIProvider(messages: ChatMessage[], maxTokensOverride?: number): Promise<string> {
  const { apiKey, baseURL, model, temperature, topP, maxTokens, timeoutMs } = AI_CONFIG;

  if (!apiKey) {
    throw new Error('CONFIG_ERROR: AI provider API key is not configured on server.');
  }

  console.log(`[CodeVault AI] Calling upstream API (messages=${messages.length})...`);

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const res = await fetch(`${baseURL}/chat/completions`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model,
        messages,
        temperature,
        top_p: topP,
        max_tokens: maxTokensOverride || maxTokens,
      }),
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
      throw new Error('TIMEOUT: CodeVault AI took too long to respond. Please try again.');
    }
    throw err;
  }
}

/**
 * 1. Interactive Chat with CodeVault AI
 */
export async function chatWithAI(req: AIChatRequest): Promise<{
  provider: string;
  response: string;
  disclaimer: string;
}> {
  const messages = buildMessagesPayload(req);

  try {
    const content = await callAIProvider(messages);
    return {
      provider: 'CodeVault AI',
      response: content,
      disclaimer: 'AI-generated guidance. Always verify critical code logic independently.',
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
      provider: 'CodeVault AI',
      response: fallbackMsg,
      disclaimer: 'AI temporarily unavailable.',
    };
  }
}

// Keep legacy export names for backwards compat with api/ route files
export const chatWithNemotron = chatWithAI;

/**
 * 1b. Streaming Chat
 */
export async function streamChatWithAI(
  req: AIChatRequest,
  onToken: (token: string) => void,
  onDone: () => void,
  onError: (err: any) => void
): Promise<void> {
  const messages = buildMessagesPayload(req);
  const { apiKey, baseURL, model, temperature, topP, maxTokens, timeoutMs } = AI_CONFIG;

  if (!apiKey) {
    onError(new Error('CONFIG_ERROR: AI provider API key is not configured on server.'));
    return;
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const res = await fetch(`${baseURL}/chat/completions`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model,
        messages,
        temperature,
        top_p: topP,
        max_tokens: maxTokens,
        stream: true,
      }),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!res.ok || !res.body) {
      const errText = await res.text();
      throw new Error(`Upstream returned HTTP ${res.status}: ${errText}`);
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
              if (token) onToken(token);
            } catch (e) {}
          }
        }
      }
    }

    onDone();
  } catch (err: any) {
    clearTimeout(timeoutId);
    console.error('[CodeVault AI Streaming Error]:', err.message);
    onError(err);
  }
}

export const streamChatWithNemotron = streamChatWithAI;

/**
 * 2. Explain Code
 */
export async function explainCodeWithAI(req: AIExplainRequest): Promise<{
  provider: string;
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
    const content = await callAIProvider(messages);
    return {
      provider: 'CodeVault AI',
      explanation: content,
      disclaimer: 'AI-generated code explanation. Always verify logic independently.',
    };
  } catch (err: any) {
    console.error('[CodeVault AI Explain Error]:', err.message);
    const lines = req.source_code ? req.source_code.split('\n').length : 0;
    return {
      provider: 'CodeVault AI',
      explanation: `### 📘 Code Analysis for ${req.language.toUpperCase()}\n\n- **Length**: ${lines} lines.\n- **Language**: ${req.language}\n- **Ready**: Code is structured and ready for cloud sandbox execution.`,
      disclaimer: 'Advisory analysis only.',
    };
  }
}

export const explainCodeWithNemotron = explainCodeWithAI;

/**
 * 3. Suggest Fix
 */
export async function suggestFixWithAI(req: AISuggestFixRequest): Promise<{
  provider: string;
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
    const content = await callAIProvider(messages);
    let extractedCode = req.source_code;
    const match = content.match(/```(?:[a-zA-Z+]+)?\n([\s\S]*?)```/);
    if (match && match[1]) extractedCode = match[1].trim();

    return {
      provider: 'CodeVault AI',
      explanation: content,
      suggested_code: extractedCode,
      disclaimer: 'AI-suggested fixes are advisory. Always test before submitting.',
    };
  } catch (err: any) {
    console.error('[CodeVault AI Fix Error]:', err.message);
    return {
      provider: 'CodeVault AI',
      explanation: `### Fix Suggestions\n\n${req.error_message ? `**Detected Issue**: \`${req.error_message}\`\n\n` : ''}- Check variable declarations and scope.\n- Verify syntax and matching braces.\n- Ensure required inputs (STDIN) are provided.`,
      suggested_code: req.source_code,
      disclaimer: 'Advisory analysis only.',
    };
  }
}

export const suggestFixWithNemotron = suggestFixWithAI;