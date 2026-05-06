const DEFAULT_MAX_FILE_MB = 8;
const DEFAULT_TIMEOUT_MS = 20000;
const DEFAULT_MAX_DIMENSION = 1600;
const ALLOWED_MIME_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp']);

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

const getEnvString = (key, fallback = '') => String(process.env[key] || fallback).trim();

const getPositiveNumber = (key, fallback) => {
  const value = Number(getEnvString(key, String(fallback)));
  return Number.isFinite(value) && value > 0 ? value : fallback;
};

const getMaxImageBytes = () => Math.floor(getPositiveNumber('PHOTO_TO_TEXT_MAX_FILE_MB', DEFAULT_MAX_FILE_MB) * 1024 * 1024);

const getOcrTimeoutMs = () => Math.floor(getPositiveNumber('PHOTO_TO_TEXT_TIMEOUT_MS', DEFAULT_TIMEOUT_MS));

const getMaxDimension = () => Math.floor(getPositiveNumber('PHOTO_TO_TEXT_MAX_DIMENSION', DEFAULT_MAX_DIMENSION));

const getMaxTokens = () => Math.floor(getPositiveNumber('PHOTO_TO_TEXT_MAX_TOKENS', 2048));

const parseImagePayload = (imageBase64 = '') => {
  const value = String(imageBase64 || '').trim();
  const match = value.match(/^data:([^;]+);base64,(.+)$/i);
  if (match) {
    return { mimeType: match[1].toLowerCase(), base64: match[2] };
  }
  return { mimeType: '', base64: value };
};

const normalizeBaseUrl = (baseUrl = '') => String(baseUrl || '').trim().replace(/\/+$/, '');

const buildPhotoToTextConfig = () => {
  const provider = getEnvString('PHOTO_TO_TEXT_PROVIDER', 'nvidia').toLowerCase();

  if (provider === 'nvidia') {
    return {
      provider,
      apiKey: getEnvString('NVIDIA_API_KEY'),
      model: getEnvString('PHOTO_TO_TEXT_MODEL', 'meta/llama-3.2-11b-vision-instruct'),
      baseUrl: normalizeBaseUrl(getEnvString('PHOTO_TO_TEXT_BASE_URL', 'https://integrate.api.nvidia.com/v1'))
    };
  }

  if (provider === 'openai' || provider === 'openai-compatible') {
    return {
      provider,
      apiKey: getEnvString('PHOTO_TO_TEXT_API_KEY'),
      model: getEnvString('PHOTO_TO_TEXT_MODEL', 'gpt-4o-mini'),
      baseUrl: normalizeBaseUrl(
        getEnvString('PHOTO_TO_TEXT_BASE_URL', provider === 'openai' ? 'https://api.openai.com/v1' : '')
      )
    };
  }

  return { provider, apiKey: '', model: '', baseUrl: '' };
};

const OCR_SYSTEM_PROMPT = [
  'You are a strict OCR transcription engine.',
  'Transcribe only text that is visibly present in the image.',
  'Preserve original line breaks, bullets, numbering, punctuation, capitalization, and section spacing as much as possible.',
  'Do not describe the image.',
  'Do not summarize, analyze, translate, correct grammar, or infer missing words.',
  'Do not add headings, labels, markdown fences, commentary, or explanations.',
  'If there is no readable visible text, return an empty string.'
].join(' ');

const buildOcrUserPrompt = (fileName = '') =>
  [
    `OCR transcribe this uploaded image${fileName ? ` (${fileName})` : ''}.`,
    'Return only the exact visible text, with formatting preserved as plain text.'
  ].join(' ');

const normalizeExtractedText = (text = '') => {
  let output = String(text || '')
    .replace(/\r\n/g, '\n')
    .replace(/\r/g, '\n')
    .trim();

  const fenceMatch = output.match(/^```(?:text|plain\s*text|markdown)?\s*\n([\s\S]*?)\n```$/i);
  if (fenceMatch) {
    output = fenceMatch[1].trim();
  }

  output = output
    .replace(/^(?:here(?:'s| is)\s+)?(?:the\s+)?(?:extracted|transcribed|visible|ocr)\s+text\s*[:\-–]\s*/i, '')
    .replace(/^the\s+(?:image|photo|picture)\s+(?:says|reads|contains(?:\s+the\s+following)?\s+text)\s*[:\-–]\s*/i, '')
    .replace(/[ \t]+\n/g, '\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim();

  if (/^(?:i\s+)?(?:cannot|can't)\s+(?:read|extract|transcribe)|^no\s+(?:readable|visible)\s+text/i.test(output)) {
    return '';
  }

  return output;
};

const extractMessageContent = (payload = {}) => {
  const content = payload?.choices?.[0]?.message?.content ?? payload?.choices?.[0]?.delta?.content ?? '';
  if (Array.isArray(content)) {
    return content
      .map((part) => (typeof part === 'string' ? part : part?.text || ''))
      .join('\n');
  }
  return String(content || '');
};

const callVisionChatOcr = async ({ config, base64, mimeType, fileName, timeoutMs }) => {
  if (!config.apiKey) {
    throw new Error(
      config.provider === 'nvidia'
        ? 'Photo to Text OCR is not configured. Add NVIDIA_API_KEY and PHOTO_TO_TEXT_MODEL for a vision-capable NVIDIA model.'
        : 'Photo to Text OCR is not configured. Add PHOTO_TO_TEXT_API_KEY, PHOTO_TO_TEXT_PROVIDER, and PHOTO_TO_TEXT_MODEL.'
    );
  }

  if (!config.model) {
    throw new Error('Photo to Text OCR model is not configured. Add PHOTO_TO_TEXT_MODEL.');
  }

  if (!config.baseUrl) {
    throw new Error('Photo to Text OCR base URL is not configured. Add PHOTO_TO_TEXT_BASE_URL.');
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);
  const startedAt = Date.now();
  const maxTokens = getMaxTokens();

  try {
    const response = await fetch(`${config.baseUrl}/chat/completions`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${config.apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: config.model,
        messages: [
          { role: 'system', content: OCR_SYSTEM_PROMPT },
          {
            role: 'user',
            content: [
              { type: 'text', text: buildOcrUserPrompt(fileName) },
              { type: 'image_url', image_url: { url: `data:${mimeType};base64,${base64}` } }
            ]
          }
        ],
        temperature: 0,
        top_p: 1,
        max_tokens: maxTokens,
        stream: false
      }),
      signal: controller.signal
    });

    console.info('[photo-to-text] upstream complete', {
      provider: config.provider,
      status: response.status,
      durationMs: Date.now() - startedAt
    });

    const payload = await response.json().catch(() => ({}));
    if (!response.ok) {
      throw new Error(payload?.error?.message || `${config.provider} OCR request failed with status ${response.status}.`);
    }

    return normalizeExtractedText(extractMessageContent(payload));
  } catch (error) {
    if (error?.name === 'AbortError') {
      throw new Error('OCR request timed out. Please upload a smaller or clearer image.');
    }
    throw error;
  } finally {
    clearTimeout(timeout);
  }
};

exports.handler = async (event) => {
  const requestStartedAt = Date.now();

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 204, headers: corsHeaders, body: '' };
  }

  if (event.httpMethod !== 'POST') {
    return jsonResponse(405, { error: 'Method not allowed' });
  }

  console.info('[photo-to-text] request start');

  let body = {};
  try {
    body = JSON.parse(event.body || '{}');
  } catch (_error) {
    return jsonResponse(400, { error: 'Invalid JSON body.' });
  }

  const imagePayload = body.imageBase64 || body.imageData || '';
  const { mimeType: dataUrlMimeType, base64 } = parseImagePayload(imagePayload);
  const mimeType = String(body.mimeType || dataUrlMimeType || '').toLowerCase();
  const fileName = String(body.fileName || body.filename || 'uploaded-image').slice(0, 180);
  const width = Number(body.width || 0);
  const height = Number(body.height || 0);
  const timeoutMs = getOcrTimeoutMs();
  const maxDimension = getMaxDimension();

  if (!base64) {
    return jsonResponse(400, { error: 'Image data is required.' });
  }

  if (!ALLOWED_MIME_TYPES.has(mimeType)) {
    return jsonResponse(400, { error: 'Unsupported image type. Please upload a JPEG, PNG, or WEBP image.' });
  }

  const normalizedBase64 = base64.replace(/\s/g, '');
  if (!/^[A-Za-z0-9+/]+={0,2}$/.test(normalizedBase64)) {
    return jsonResponse(400, { error: 'Invalid image data. Please upload the image again.' });
  }

  if ((width && width > maxDimension) || (height && height > maxDimension)) {
    return jsonResponse(413, { error: `Image dimensions are too large. Please upload an image up to ${maxDimension}px on the longest side.` });
  }

  const imageBytes = Buffer.from(normalizedBase64, 'base64');
  const maxImageBytes = getMaxImageBytes();
  if (imageBytes.length > maxImageBytes) {
    const maxMb = Math.max(1, Math.floor(maxImageBytes / (1024 * 1024)));
    return jsonResponse(413, { error: `Image is too large. Please upload an image up to ${maxMb} MB.` });
  }

  console.info('[photo-to-text] request accepted', {
    fileName,
    mimeType,
    sizeBytes: imageBytes.length,
    width: width || null,
    height: height || null,
    timeoutMs
  });

  const config = buildPhotoToTextConfig();
  if (!['nvidia', 'openai', 'openai-compatible'].includes(config.provider)) {
    return jsonResponse(500, {
      error: `Unsupported Photo to Text provider "${config.provider}". Use PHOTO_TO_TEXT_PROVIDER=nvidia, openai, or openai-compatible.`
    });
  }

  try {
    const text = await callVisionChatOcr({ config, base64: normalizedBase64, mimeType, fileName, timeoutMs });

    if (!text) {
      return jsonResponse(422, { error: 'No readable text was found in this image. Try a clearer or higher-resolution photo.' });
    }

    console.info('[photo-to-text] request complete', { durationMs: Date.now() - requestStartedAt });
    return jsonResponse(200, { text });
  } catch (error) {
    console.warn('[photo-to-text] request failed', {
      message: error?.message || 'OCR provider failed.',
      durationMs: Date.now() - requestStartedAt
    });
    const isTimeout = /timed out|abort/i.test(String(error?.message || error?.name || ''));
    return jsonResponse(isTimeout ? 504 : 502, { error: error?.message || 'OCR provider failed. Please try another clear image.' });
  }
};
