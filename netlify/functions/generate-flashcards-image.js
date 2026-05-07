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
  const configuredMaxMb = Number(getEnvString('FLASHCARD_IMAGE_MAX_FILE_MB', String(DEFAULT_MAX_FILE_MB)));
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
  const provider = getEnvString('FLASHCARD_IMAGE_PROVIDER', 'openai').toLowerCase();
  if (provider === 'nvidia') {
    return {
      provider,
      apiKey: getEnvString('NVIDIA_API_KEY'),
      model: getEnvString('FLASHCARD_IMAGE_MODEL', 'meta/llama-3.2-90b-vision-instruct'),
      baseUrl: normalizeBaseUrl(getEnvString('FLASHCARD_IMAGE_BASE_URL', 'https://integrate.api.nvidia.com/v1'))
    };
  }
  if (provider === 'openai' || provider === 'openai-compatible') {
    return {
      provider,
      apiKey: getEnvString('FLASHCARD_IMAGE_API_KEY', getEnvString('OPENAI_API_KEY')),
      model: getEnvString('FLASHCARD_IMAGE_MODEL', 'gpt-4o-mini'),
      baseUrl: normalizeBaseUrl(getEnvString('FLASHCARD_IMAGE_BASE_URL', provider === 'openai' ? 'https://api.openai.com/v1' : ''))
    };
  }
  return { provider, apiKey: '', model: '', baseUrl: '' };
};

const clampFlashcardCount = (value) => {
  const count = Number(value || 0);
  if (!Number.isInteger(count)) return 8;
  return Math.min(30, Math.max(3, count));
};

const buildPrompt = ({ topicTitle, flashcardCount, difficulty, outputStyle, fileName }) => [
  `Analyze the uploaded study image${fileName ? ` (${fileName})` : ''} and generate short Q&A flashcards from its visible content.`,
  `Topic / chapter: ${topicTitle || 'not provided'}.`,
  `Number of flashcards: ${clampFlashcardCount(flashcardCount)}.`,
  `Difficulty: ${difficulty || 'medium'}.`,
  `Output style: ${outputStyle || 'simple'}.`,
  '',
  'Read only the visible content in the image: notes, document text, textbook page, slide text, chart labels, diagram labels, or whiteboard content.',
  'Do not invent facts, examples, labels, definitions, or answers that are not visible or strongly supported by the image.',
  'If part of the image is unclear, avoid making flashcards from that unclear part.',
  'Return clean Markdown only with a short heading and numbered flashcards.',
  'Each flashcard must include exactly these labels:',
  '- Question: one short direct question',
  '- Answer: one short accurate answer',
  '- Memory Hint: one mnemonic, recall cue, keyword cue, or visual cue',
  '- Difficulty: Easy, Medium, or Hard',
  'Keep every card revision-friendly and based only on image content.'
].join('\n');

const callVisionFlashcards = async ({ config, base64, mimeType, fileName, topicTitle, flashcardCount, difficulty, outputStyle }) => {
  if (!config.apiKey) throw new Error('Flashcard image generator is not configured. Add a vision-capable provider API key on the server.');
  if (!config.model) throw new Error('Flashcard image generator model is not configured.');
  if (!config.baseUrl) throw new Error('Flashcard image generator base URL is not configured.');

  const response = await fetch(`${config.baseUrl}/chat/completions`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${config.apiKey}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: config.model,
      messages: [
        {
          role: 'system',
          content: 'You are a strict flashcard generator. Read visible image content accurately and generate only supported Q&A flashcards with memory hints.'
        },
        {
          role: 'user',
          content: [
            { type: 'text', text: buildPrompt({ topicTitle, flashcardCount, difficulty, outputStyle, fileName }) },
            { type: 'image_url', image_url: { url: `data:${mimeType};base64,${base64}` } }
          ]
        }
      ],
      temperature: 0.35,
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
  const fileName = String(body.fileName || body.filename || 'flashcard-study-image').slice(0, 180);
  if (!base64) return jsonResponse(400, { error: 'Image data is required.' });
  if (!ALLOWED_MIME_TYPES.has(mimeType)) return jsonResponse(400, { error: 'Unsupported image type. Please upload a JPEG, PNG, or WEBP image.' });
  const normalizedBase64 = base64.replace(/\s/g, '');
  if (!/^[A-Za-z0-9+/]+={0,2}$/.test(normalizedBase64)) return jsonResponse(400, { error: 'Invalid image data. Please upload the image again.' });
  if (Buffer.from(normalizedBase64, 'base64').length > getMaxImageBytes()) {
    return jsonResponse(413, { error: `Image is too large. Please upload an image up to ${DEFAULT_MAX_FILE_MB} MB.` });
  }

  const count = clampFlashcardCount(body.flashcardCount);
  const config = buildVisionConfig();
  if (!['nvidia', 'openai', 'openai-compatible'].includes(config.provider)) {
    return jsonResponse(500, { error: `Unsupported Flashcard image provider "${config.provider}".` });
  }

  try {
    const text = await callVisionFlashcards({
      config,
      base64: normalizedBase64,
      mimeType,
      fileName,
      topicTitle: String(body.topicTitle || '').trim(),
      flashcardCount: count,
      difficulty: String(body.difficulty || 'medium').trim(),
      outputStyle: String(body.outputStyle || 'simple').trim()
    });
    if (!text) return jsonResponse(422, { error: 'No readable study content was found in this image. Try a clearer or higher-resolution photo.' });
    return jsonResponse(200, { text });
  } catch (error) {
    return jsonResponse(502, { error: error?.message || 'Vision provider failed. Please try another clear image.' });
  }
};
