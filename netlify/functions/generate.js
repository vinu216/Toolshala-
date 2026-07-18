const PROVIDER_TIMEOUT_MS = 25000;
const MAX_PROMPT_CHARS = 12000;
const MAX_REQUEST_BYTES = 64 * 1024;

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Content-Type': 'application/json'
};

const jsonResponse = (statusCode, body) => ({
  statusCode,
  headers: corsHeaders,
  body: JSON.stringify(body)
});

const isBodyTooLarge = (body = '') => Buffer.byteLength(String(body || ''), 'utf8') > MAX_REQUEST_BYTES;
const getEnv = (key, fallback = '') => String(process.env[key] || fallback).trim();

const providers = [
  {
    name: 'nvidia',
    apiKeyEnv: 'NVIDIA_API_KEY',
    modelEnv: 'NVIDIA_MODEL',
    defaultModel: 'openai/gpt-oss-20b',
    endpoint: 'https://integrate.api.nvidia.com/v1/chat/completions'
  },
  {
    name: 'openai',
    apiKeyEnv: 'OPENAI_API_KEY',
    modelEnv: 'OPENAI_MODEL',
    defaultModel: 'gpt-4.1-mini',
    endpoint: 'https://api.openai.com/v1/chat/completions'
  }
];

const getConfiguredProviders = () => {
  const preferred = getEnv('AI_PROVIDER').toLowerCase();
  const ordered = preferred
    ? [...providers.filter((provider) => provider.name === preferred), ...providers.filter((provider) => provider.name !== preferred)]
    : providers;

  return ordered
    .map((provider) => ({ ...provider, apiKey: getEnv(provider.apiKeyEnv), model: getEnv(provider.modelEnv, provider.defaultModel) }))
    .filter((provider) => provider.apiKey);
};

const getProviderErrorStatus = (status) => {
  if (status === 401 || status === 403) return 500;
  if (status === 408 || status === 429 || status >= 500) return 503;
  return status >= 400 ? status : 502;
};

const getProviderErrorCode = (status) => {
  if (status === 401 || status === 403) return 'provider_auth_error';
  if (status === 408 || status === 429 || status >= 500) return 'provider_unavailable';
  return 'provider_request_error';
};

const createGenerationPayload = (provider, prompt) => ({
  model: provider.model,
  messages: [
    {
      role: 'system',
      content: 'You create clean, readable Markdown responses for ToolShala. Use short headings, bold labels, bullets or numbered lists, and concise paragraphs when helpful. Do not return raw HTML, markdown tables, pipe-delimited rows, or raw | separators.'
    },
    { role: 'user', content: prompt }
  ],
  temperature: provider.name === 'nvidia' ? 1 : 0.7,
  top_p: 1,
  max_tokens: 4096,
  stream: false
});

const callProvider = async (provider, prompt) => {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), PROVIDER_TIMEOUT_MS);

  try {
    const response = await fetch(provider.endpoint, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${provider.apiKey}`,
        'Content-Type': 'application/json'
      },
      signal: controller.signal,
      body: JSON.stringify(createGenerationPayload(provider, prompt))
    });

    const data = await response.json().catch(() => ({}));
    if (!response.ok) {
      const upstreamMessage = String(data?.error?.message || data?.message || '').trim();
      const err = new Error(upstreamMessage || `${provider.name} request failed with status ${response.status}.`);
      err.statusCode = getProviderErrorStatus(response.status);
      err.code = getProviderErrorCode(response.status);
      err.providerStatus = response.status;
      throw err;
    }

    const text = String(data?.choices?.[0]?.message?.content || data?.choices?.[0]?.text || data?.output_text || '').trim();
    if (!text) {
      const err = new Error(`${provider.name} returned an empty response.`);
      err.statusCode = 502;
      err.code = 'provider_empty_response';
      throw err;
    }

    return { text, provider: provider.name };
  } catch (error) {
    if (error?.name === 'AbortError') {
      const err = new Error(`${provider.name} timed out.`);
      err.statusCode = 504;
      err.code = 'provider_timeout';
      throw err;
    }
    throw error;
  } finally {
    clearTimeout(timeout);
  }
};

export const handler = async (event) => {
  try {
    if (event.httpMethod === 'OPTIONS') return { statusCode: 204, headers: corsHeaders, body: '' };
    if (event.httpMethod !== 'POST') return jsonResponse(405, { error: 'Method not allowed. Use POST.', code: 'method_not_allowed' });
    if (isBodyTooLarge(event.body)) return jsonResponse(413, { error: 'Request payload is too large.', code: 'payload_too_large' });

    let body = {};
    try {
      body = JSON.parse(event.body || '{}');
    } catch (error) {
      console.warn('[generate] Invalid JSON body.', { message: error?.message });
      return jsonResponse(400, { error: 'Invalid JSON body.', code: 'invalid_json' });
    }

    if (!body || typeof body !== 'object' || Array.isArray(body)) {
      return jsonResponse(400, { error: 'Invalid request payload.', code: 'invalid_payload' });
    }

    const prompt = String(body.prompt || '').trim();
    if (!prompt) return jsonResponse(400, { error: 'Missing required field: prompt.', code: 'missing_prompt' });
    if (prompt.length > MAX_PROMPT_CHARS) return jsonResponse(413, { error: `Prompt is too long. Please keep it under ${MAX_PROMPT_CHARS} characters.`, code: 'prompt_too_long' });

    const configuredProviders = getConfiguredProviders();
    if (!configuredProviders.length) {
      console.error('[generate] No AI provider API key configured. Required env: NVIDIA_API_KEY or OPENAI_API_KEY.');
      return jsonResponse(500, { error: 'AI provider is not configured.', code: 'provider_config_missing' });
    }

    const errors = [];
    for (const provider of configuredProviders) {
      try {
        const result = await callProvider(provider, prompt);
        return jsonResponse(200, { text: result.text });
      } catch (error) {
        errors.push(error);
        console.error('[generate] AI provider failed.', {
          provider: provider.name,
          model: provider.model,
          statusCode: error?.statusCode,
          providerStatus: error?.providerStatus,
          code: error?.code,
          message: error?.message
        });
      }
    }

    const lastError = errors[errors.length - 1] || {};
    const statusCode = lastError.statusCode || 502;
    const code = lastError.code || 'provider_unavailable';
    const publicMessage = code === 'provider_auth_error'
      ? 'AI provider authentication is not configured correctly.'
      : code === 'provider_timeout'
        ? 'AI provider timed out. Please try again.'
        : 'AI provider is unavailable right now. Please try again.';

    return jsonResponse(statusCode, { error: publicMessage, code });
  } catch (error) {
    console.error('[generate] Unhandled generation error.', { message: error?.message, stack: error?.stack });
    return jsonResponse(500, { error: 'Internal server error while generating output.', code: 'internal_error' });
  }
};
