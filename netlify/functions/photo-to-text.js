import visionConfig from './_vision-config.cjs';

const { buildVisionConfig: buildSharedVisionConfig, getEnvString, getVisionConfigError } = visionConfig;

const PROVIDER_TIMEOUT_MS = 25000;
const MAX_SAFE_REQUEST_BYTES = 11 * 1024 * 1024;
const DEFAULT_MAX_FILE_MB = 8;
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

const getMaxImageBytes = () => {
  const configuredMaxMb = Number(getEnvString('PHOTO_TO_TEXT_MAX_FILE_MB', String(DEFAULT_MAX_FILE_MB)));
  const maxMb = Number.isFinite(configuredMaxMb) && configuredMaxMb > 0 ? configuredMaxMb : DEFAULT_MAX_FILE_MB;
  return Math.floor(maxMb * 1024 * 1024);
};

const isBodyTooLarge = (body = '') => Buffer.byteLength(String(body || ''), 'utf8') > MAX_SAFE_REQUEST_BYTES;

const parseImagePayload = (imageBase64 = '') => {
  const value = String(imageBase64 || '').trim();
  const match = value.match(/^data:([^;]+);base64,(.+)$/i);
  if (match) {
    return { mimeType: match[1].toLowerCase(), base64: match[2] };
  }
  return { mimeType: '', base64: value };
};

const buildPhotoToTextConfig = () => buildSharedVisionConfig({
  providerEnv: 'PHOTO_TO_TEXT_PROVIDER',
  apiKeyEnv: 'PHOTO_TO_TEXT_API_KEY',
  modelEnv: 'PHOTO_TO_TEXT_MODEL',
  baseUrlEnv: 'PHOTO_TO_TEXT_BASE_URL',
  defaultOpenAiModel: 'gpt-4o-mini',
  defaultNvidiaModel: 'meta/llama-3.2-11b-vision-instruct'
});

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

const callVisionChatOcr = async ({ config, base64, mimeType, fileName, signal }) => {
  const configError = getVisionConfigError('Photo to Text OCR', config);
  if (configError) {
    throw new Error(configError);
  }

  const response = await fetch(`${config.baseUrl}/chat/completions`, {
    method: 'POST',
    signal,
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
      max_tokens: 4096,
      stream: false
    })
  });

  const payload = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(payload?.error?.message || `${config.provider} OCR request failed with status ${response.status}.`);
  }

  return normalizeExtractedText(extractMessageContent(payload));
};

export const handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 204, headers: corsHeaders, body: '' };
  }

  if (event.httpMethod !== 'POST') {
    return jsonResponse(405, { error: 'Method not allowed' });
  }

  if (isBodyTooLarge(event.body)) {
    return jsonResponse(413, { error: 'Image payload is too large.' });
  }

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

  if (!base64) {
    return jsonResponse(400, { error: 'Image data is required.' });
  }

  if (!ALLOWED_MIME_TYPES.has(mimeType)) {
    return jsonResponse(400, { error: 'Unsupported image type. Please upload a JPEG, PNG, or WEBP image.' });
  }

  const normalizedBase64 = base64.replace(/\s/g, '');
  if (!/^[A-Za-z0-9+/]+={0,2}$/.test(normalizedBase64) || normalizedBase64.length % 4 !== 0) {
    return jsonResponse(400, { error: 'Invalid image data. Please upload the image again.' });
  }

  const imageBytes = Buffer.from(normalizedBase64, 'base64');
  const maxImageBytes = getMaxImageBytes();
  if (imageBytes.length > maxImageBytes) {
    const maxMb = Math.max(1, Math.floor(maxImageBytes / (1024 * 1024)));
    return jsonResponse(413, { error: `Image is too large. Please upload an image up to ${maxMb} MB.` });
  }

  const config = buildPhotoToTextConfig();
  const configError = getVisionConfigError('Photo to Text OCR', config);
  if (configError) return jsonResponse(500, { error: configError });

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), PROVIDER_TIMEOUT_MS);

  try {
    const text = await callVisionChatOcr({ config, base64: normalizedBase64, mimeType, fileName, signal: controller.signal });

    if (!text) {
      return jsonResponse(422, { error: 'No readable text was found in this image. Try a clearer or higher-resolution photo.' });
    }

    return jsonResponse(200, { text });
  } catch (error) {
    if (error?.name === 'AbortError') return jsonResponse(504, { error: 'OCR provider timed out. Please try a smaller or clearer image.' });
    return jsonResponse(502, { error: error?.message || 'OCR provider failed. Please try another clear image.' });
  } finally {
    clearTimeout(timeout);
  }
};
