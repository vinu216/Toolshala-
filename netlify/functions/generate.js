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

exports.handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') return { statusCode: 204, headers: corsHeaders, body: '' };
  if (event.httpMethod !== 'POST') return jsonResponse(405, { error: 'Method not allowed' });
  if (isBodyTooLarge(event.body)) return jsonResponse(413, { error: 'Request payload is too large.' });

  const apiKey = String(process.env.NVIDIA_API_KEY || '').trim();
  if (!apiKey) return jsonResponse(500, { error: 'AI provider is not configured.' });

  let body = {};
  try {
    body = JSON.parse(event.body || '{}');
  } catch (_error) {
    return jsonResponse(400, { error: 'Invalid JSON body.' });
  }

  const prompt = String(body.prompt || '').trim();
  if (!prompt) return jsonResponse(400, { error: 'prompt is required' });
  if (prompt.length > MAX_PROMPT_CHARS) return jsonResponse(413, { error: `Prompt is too long. Please keep it under ${MAX_PROMPT_CHARS} characters.` });

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), PROVIDER_TIMEOUT_MS);

  try {
    const response = await fetch('https://integrate.api.nvidia.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      signal: controller.signal,
      body: JSON.stringify({
        model: process.env.NVIDIA_MODEL || 'openai/gpt-oss-20b',
        messages: [
          {
            role: 'system',
            content: 'You create clean, readable Markdown responses for ToolShala. Use short headings, bold emphasis, bullets or numbered lists, and concise paragraphs when helpful. Do not return raw HTML.'
          },
          { role: 'user', content: prompt }
        ],
        temperature: 1,
        top_p: 1,
        max_tokens: 4096,
        stream: false
      })
    });

    const data = await response.json().catch(() => ({}));
    if (!response.ok) {
      const upstreamMessage = String(data?.error?.message || '').trim();
      return jsonResponse(response.status >= 500 ? 502 : response.status, {
        error: upstreamMessage || 'AI provider request failed.'
      });
    }

    const text = String(data?.choices?.[0]?.message?.content || data?.choices?.[0]?.delta?.content || '').trim();
    if (!text) return jsonResponse(502, { error: 'AI provider returned an empty response.' });

    return jsonResponse(200, { text });
  } catch (err) {
    if (err?.name === 'AbortError') return jsonResponse(504, { error: 'AI provider timed out. Please try again.' });
    return jsonResponse(502, { error: 'AI provider request failed. Please try again.' });
  } finally {
    clearTimeout(timeout);
  }
};
