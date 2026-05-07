const DEFAULT_MAX_FILE_MB = 4;
const ALLOWED_MIME_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp']);

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Content-Type': 'application/json'
};

const jsonResponse = (statusCode, body) => ({ statusCode, headers: corsHeaders, body: JSON.stringify(body) });
const getEnvString = (key, fallback = '') => String(process.env[key] || fallback).trim();
const normalizeBaseUrl = (baseUrl = '') => String(baseUrl || '').trim().replace(/\/+$/, '');
const getMaxImageBytes = () => {
  const configuredMaxMb = Number(getEnvString('LECTURE_NOTES_IMAGE_MAX_FILE_MB', String(DEFAULT_MAX_FILE_MB)));
  const maxMb = Number.isFinite(configuredMaxMb) && configuredMaxMb > 0 ? configuredMaxMb : DEFAULT_MAX_FILE_MB;
  return Math.floor(maxMb * 1024 * 1024);
};
const parseImagePayload = (imageBase64 = '') => {
  const value = String(imageBase64 || '').trim();
  const match = value.match(/^data:([^;]+);base64,(.+)$/i);
  if (match) return { mimeType: match[1].toLowerCase(), base64: match[2] };
  return { mimeType: '', base64: value };
};
const normalizeText = (text = '') => String(text || '')
  .replace(/\r\n/g, '\n')
  .replace(/\r/g, '\n')
  .replace(/^```(?:markdown|text)?\s*\n([\s\S]*?)\n```$/i, '$1')
  .trim();
const extractMessageContent = (payload = {}) => {
  const content = payload?.choices?.[0]?.message?.content ?? payload?.choices?.[0]?.delta?.content ?? '';
  if (Array.isArray(content)) return content.map((part) => (typeof part === 'string' ? part : part?.text || '')).join('\n');
  return String(content || '');
};
const buildVisionConfig = () => {
  const provider = getEnvString('LECTURE_NOTES_IMAGE_PROVIDER', 'openai').toLowerCase();
  if (provider === 'nvidia') {
    return {
      provider,
      apiKey: getEnvString('NVIDIA_API_KEY'),
      model: getEnvString('LECTURE_NOTES_IMAGE_MODEL', 'meta/llama-3.2-90b-vision-instruct'),
      baseUrl: normalizeBaseUrl(getEnvString('LECTURE_NOTES_IMAGE_BASE_URL', 'https://integrate.api.nvidia.com/v1'))
    };
  }
  if (provider === 'openai' || provider === 'openai-compatible') {
    return {
      provider,
      apiKey: getEnvString('LECTURE_NOTES_IMAGE_API_KEY', getEnvString('OPENAI_API_KEY')),
      model: getEnvString('LECTURE_NOTES_IMAGE_MODEL', 'gpt-4o-mini'),
      baseUrl: normalizeBaseUrl(getEnvString('LECTURE_NOTES_IMAGE_BASE_URL', provider === 'openai' ? 'https://api.openai.com/v1' : ''))
    };
  }
  return { provider, apiKey: '', model: '', baseUrl: '' };
};

const buildPrompt = ({ subject, summaryLength, summaryStyle, fileName }) => [
  `Analyze the uploaded lecture-notes image${fileName ? ` (${fileName})` : ''}.`,
  `Subject, if provided: ${subject || 'not provided'}.`,
  `Summary length: ${summaryLength || 'medium'}.`,
  `Summary style: ${summaryStyle || 'bullet-points'}.`,
  '',
  'Read only the visible content in the image: class notes, textbook text, slides, diagrams, or whiteboard notes.',
  'Do not invent facts, definitions, examples, formulas, dates, or headings that are not visible or strongly supported by the image.',
  'If text is unclear, mention that the image text is unclear instead of guessing.',
  'Return clean Markdown with these sections:',
  '## Concise Summary',
  '## Key Points',
  '## Important Definitions',
  '## Revision-Friendly Bullets',
  '## Exam Notes',
  '## Quick Recap / Memory Hook',
  'Keep it concise, structured, student-friendly, and easy to revise.'
].join('\n');

const callVisionSummary = async ({ config, base64, mimeType, fileName, subject, summaryLength, summaryStyle }) => {
  if (!config.apiKey) throw new Error('Lecture Notes image summarizer is not configured. Add a vision-capable provider API key on the server.');
  if (!config.model) throw new Error('Lecture Notes image summarizer model is not configured.');
  if (!config.baseUrl) throw new Error('Lecture Notes image summarizer base URL is not configured.');

  const response = await fetch(`${config.baseUrl}/chat/completions`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${config.apiKey}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: config.model,
      messages: [
        {
          role: 'system',
          content: 'You are a strict lecture notes image summarizer. Read visible image content accurately and summarize only that content into clean Markdown study notes.'
        },
        {
          role: 'user',
          content: [
            { type: 'text', text: buildPrompt({ subject, summaryLength, summaryStyle, fileName }) },
            { type: 'image_url', image_url: { url: `data:${mimeType};base64,${base64}` } }
          ]
        }
      ],
      temperature: 0.3,
      top_p: 0.9,
      max_tokens: 2200,
      stream: false
    })
  });
  const payload = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(payload?.error?.message || `${config.provider} vision request failed with status ${response.status}.`);
  return normalizeText(extractMessageContent(payload));
};

exports.handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') return { statusCode: 204, headers: corsHeaders, body: '' };
  if (event.httpMethod !== 'POST') return jsonResponse(405, { error: 'Method not allowed' });

  let body = {};
  try { body = JSON.parse(event.body || '{}'); } catch (_error) { return jsonResponse(400, { error: 'Invalid JSON body.' }); }

  const { mimeType: dataUrlMimeType, base64 } = parseImagePayload(body.imageBase64 || body.imageData || '');
  const mimeType = String(body.mimeType || dataUrlMimeType || '').toLowerCase();
  const fileName = String(body.fileName || body.filename || 'lecture-notes-image').slice(0, 180);
  if (!base64) return jsonResponse(400, { error: 'Image data is required.' });
  if (!ALLOWED_MIME_TYPES.has(mimeType)) return jsonResponse(400, { error: 'Unsupported image type. Please upload a JPEG, PNG, or WEBP image.' });
  const normalizedBase64 = base64.replace(/\s/g, '');
  if (!/^[A-Za-z0-9+/]+={0,2}$/.test(normalizedBase64)) return jsonResponse(400, { error: 'Invalid image data. Please upload the image again.' });
  if (Buffer.from(normalizedBase64, 'base64').length > getMaxImageBytes()) {
    return jsonResponse(413, { error: `Image is too large. Please upload an image up to ${DEFAULT_MAX_FILE_MB} MB.` });
  }

  const config = buildVisionConfig();
  if (!['nvidia', 'openai', 'openai-compatible'].includes(config.provider)) {
    return jsonResponse(500, { error: `Unsupported Lecture Notes image provider "${config.provider}".` });
  }

  try {
    const text = await callVisionSummary({
      config,
      base64: normalizedBase64,
      mimeType,
      fileName,
      subject: String(body.subject || '').trim(),
      summaryLength: String(body.summaryLength || 'medium').trim(),
      summaryStyle: String(body.summaryStyle || 'bullet-points').trim()
    });
    if (!text) return jsonResponse(422, { error: 'No readable lecture-note content was found in this image. Try a clearer or higher-resolution photo.' });
    return jsonResponse(200, { text });
  } catch (error) {
    return jsonResponse(502, { error: error?.message || 'Vision provider failed. Please try another clear image.' });
  }
};
