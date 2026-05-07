const DEFAULT_MAX_FILE_MB = 3.5;
const MAX_SAFE_REQUEST_BYTES = Math.floor(5.5 * 1024 * 1024);
const PROVIDER_TIMEOUT_MS = 25000;
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

const getMaxImageBytes = () => {
  const configuredMaxMb = Number(getEnvString('IMAGE_QUIZ_MAX_FILE_MB', String(DEFAULT_MAX_FILE_MB)));
  const maxMb = Number.isFinite(configuredMaxMb) && configuredMaxMb > 0 ? configuredMaxMb : DEFAULT_MAX_FILE_MB;
  return Math.min(Math.floor(maxMb * 1024 * 1024), Math.floor(DEFAULT_MAX_FILE_MB * 1024 * 1024));
};

const parseImagePayload = (imageBase64 = '') => {
  const value = String(imageBase64 || '').trim();
  const match = value.match(/^data:([^;]+);base64,(.+)$/i);
  if (match) {
    return { mimeType: match[1].toLowerCase(), base64: match[2] };
  }
  return { mimeType: '', base64: value };
};

const normalizeBaseUrl = (baseUrl = '') => String(baseUrl || '').trim().replace(/\/+$/, '');

const hasExplicitOpenAiModel = () => Boolean(getEnvString('IMAGE_QUIZ_MODEL') || getEnvString('OPENAI_MODEL'));

// Provider selection is explicit and environment-driven: prefer IMAGE_QUIZ_PROVIDER,
// otherwise use an existing NVIDIA deployment. OpenAI is only auto-selected when
// both OPENAI_API_KEY and an explicit OPENAI_MODEL/IMAGE_QUIZ_MODEL are set.
const resolveImageQuizProvider = () => {
  const explicitProvider = getEnvString('IMAGE_QUIZ_PROVIDER').toLowerCase();
  if (explicitProvider) return explicitProvider;

  const photoProvider = getEnvString('PHOTO_TO_TEXT_PROVIDER').toLowerCase();
  if (photoProvider === 'nvidia' && getEnvString('NVIDIA_API_KEY')) return 'nvidia';

  if (getEnvString('NVIDIA_API_KEY')) return 'nvidia';

  if (getEnvString('OPENAI_API_KEY') && hasExplicitOpenAiModel()) return 'openai';

  return '';
};

const buildVisionConfig = () => {
  const provider = resolveImageQuizProvider();

  if (provider === 'nvidia') {
    return {
      provider,
      apiKey: getEnvString('IMAGE_QUIZ_API_KEY', getEnvString('NVIDIA_API_KEY')),
      model: getEnvString('IMAGE_QUIZ_MODEL', getEnvString('NVIDIA_MODEL', getEnvString('PHOTO_TO_TEXT_MODEL', 'meta/llama-3.2-11b-vision-instruct'))),
      baseUrl: normalizeBaseUrl(getEnvString('IMAGE_QUIZ_BASE_URL', 'https://integrate.api.nvidia.com/v1'))
    };
  }

  if (provider === 'openai') {
    return {
      provider,
      apiKey: getEnvString('IMAGE_QUIZ_API_KEY', getEnvString('OPENAI_API_KEY')),
      model: getEnvString('IMAGE_QUIZ_MODEL', getEnvString('OPENAI_MODEL')),
      baseUrl: normalizeBaseUrl(getEnvString('IMAGE_QUIZ_BASE_URL', 'https://api.openai.com/v1'))
    };
  }

  if (provider === 'openai-compatible') {
    return {
      provider,
      apiKey: getEnvString('IMAGE_QUIZ_API_KEY'),
      model: getEnvString('IMAGE_QUIZ_MODEL'),
      baseUrl: normalizeBaseUrl(getEnvString('IMAGE_QUIZ_BASE_URL'))
    };
  }

  return { provider, apiKey: '', model: '', baseUrl: '' };
};

const extractMessageContent = (payload = {}) => {
  const content = payload?.choices?.[0]?.message?.content ?? payload?.choices?.[0]?.delta?.content ?? '';
  if (Array.isArray(content)) {
    return content.map((part) => (typeof part === 'string' ? part : part?.text || '')).join('\n');
  }
  return String(content || '');
};

const buildSystemPrompt = () => [
  'You are ToolShala Quiz / MCQ Generator with vision understanding.',
  'Analyze only the uploaded image and optional user context.',
  'If the image contains readable text, base the quiz on that visible text.',
  'If the image shows a diagram, chart, page, object, or scene, base questions on clearly visible elements and labels.',
  'Do not invent unsupported facts or include unrelated questions.',
  'If there is not enough visible content for the requested count, create fewer grounded questions and mention that limitation briefly.',
  'Return clean Markdown only. Include a short quiz title and a numbered list.',
  'Each question must include exactly these labels: Difficulty, Question, Options, Correct Answer, Short Explanation.',
  'For MCQ questions, Options must include A, B, C, and D and only one correct answer.',
  'For short-answer questions, write Options: N/A (Short Answer).',
  'Keep explanations concise and useful for revision.'
].join(' ');

const buildUserPrompt = ({ topicSubject, questionCount, difficulty, questionType, fileName }) => [
  `Uploaded image: ${fileName || 'image'}`,
  `Optional topic/subject context: ${topicSubject || 'Not provided'}`,
  `Question count requested: ${questionCount}`,
  `Difficulty: ${difficulty}`,
  `Question type: ${questionType}`,
  'Generate a grounded quiz from the visible image content. Avoid fake or unrelated questions.'
].join('\n');

const isBodyTooLarge = (body = '') => Buffer.byteLength(String(body || ''), 'utf8') > MAX_SAFE_REQUEST_BYTES;

exports.handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 204, headers: corsHeaders, body: '' };
  }

  if (event.httpMethod !== 'POST') {
    return jsonResponse(405, { error: 'Method not allowed' });
  }

  if (isBodyTooLarge(event.body)) {
    return jsonResponse(413, { error: 'Image too large' });
  }

  let body = {};
  try {
    body = JSON.parse(event.body || '{}');
  } catch {
    return jsonResponse(400, { error: 'Invalid image payload' });
  }

  const imagePayload = body.imageBase64 || body.image || body.imageData || '';
  const { mimeType: dataUrlMimeType, base64 } = parseImagePayload(imagePayload);
  const mimeType = String(body.mimeType || dataUrlMimeType || '').toLowerCase();
  const fileName = String(body.fileName || body.filename || 'uploaded-image').slice(0, 180);
  const topicSubject = String(body.topicSubject || '').trim().slice(0, 180);
  const questionCount = Number(body.questionCount || 0);
  const difficulty = String(body.difficulty || '').trim().toLowerCase();
  const questionType = String(body.questionType || '').trim().toLowerCase();

  if (!base64) {
    return jsonResponse(400, { error: 'Invalid image payload' });
  }

  if (!ALLOWED_MIME_TYPES.has(mimeType)) {
    return jsonResponse(400, { error: 'Invalid image payload' });
  }

  if (!Number.isInteger(questionCount) || questionCount < 3 || questionCount > 25) {
    return jsonResponse(400, { error: 'Please choose between 3 and 25 questions.' });
  }

  if (!['easy', 'medium', 'hard'].includes(difficulty)) {
    return jsonResponse(400, { error: 'Please choose a valid difficulty.' });
  }

  if (!['mcq', 'short-answer', 'mixed'].includes(questionType)) {
    return jsonResponse(400, { error: 'Please choose a valid question type.' });
  }

  const normalizedBase64 = base64.replace(/\s/g, '');
  if (!/^[A-Za-z0-9+/]+={0,2}$/.test(normalizedBase64) || normalizedBase64.length % 4 !== 0) {
    return jsonResponse(400, { error: 'Invalid image payload' });
  }

  if (Buffer.byteLength(normalizedBase64, 'utf8') > MAX_SAFE_REQUEST_BYTES) {
    return jsonResponse(413, { error: 'Image too large' });
  }

  const imageBytes = Buffer.from(normalizedBase64, 'base64');
  const maxImageBytes = getMaxImageBytes();
  if (!imageBytes.length) {
    return jsonResponse(400, { error: 'Invalid image payload' });
  }

  if (imageBytes.length > maxImageBytes) {
    return jsonResponse(413, { error: 'Image too large' });
  }

  const config = buildVisionConfig();
  if (!['openai', 'openai-compatible', 'nvidia'].includes(config.provider)) {
    return jsonResponse(500, { error: 'Provider not configured' });
  }

  if (!config.apiKey || !config.model || !config.baseUrl) {
    return jsonResponse(500, { error: 'Provider not configured' });
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), PROVIDER_TIMEOUT_MS);

  try {
    const response = await fetch(`${config.baseUrl}/chat/completions`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${config.apiKey}`,
        'Content-Type': 'application/json'
      },
      signal: controller.signal,
      body: JSON.stringify({
        model: config.model,
        messages: [
          { role: 'system', content: buildSystemPrompt() },
          {
            role: 'user',
            content: [
              { type: 'text', text: buildUserPrompt({ topicSubject, questionCount, difficulty, questionType, fileName }) },
              { type: 'image_url', image_url: { url: `data:${mimeType};base64,${normalizedBase64}` } }
            ]
          }
        ],
        temperature: 0.4,
        top_p: 1,
        max_tokens: 4096,
        stream: false
      })
    });

    const payload = await response.json().catch(() => ({}));
    if (!response.ok) {
      return jsonResponse(response.status, { error: payload?.error?.message || `${config.provider} vision request failed with status ${response.status}.` });
    }

    const text = extractMessageContent(payload).trim();
    if (!text) {
      return jsonResponse(502, { error: 'AI provider returned an empty quiz response.' });
    }

    return jsonResponse(200, { text });
  } catch (error) {
    if (error?.name === 'AbortError') {
      return jsonResponse(504, { error: 'Image quiz generation timed out. Please try a clearer or smaller image.' });
    }
    return jsonResponse(502, { error: error?.message || 'Image quiz generation failed. Please try another clear image.' });
  } finally {
    clearTimeout(timeout);
  }
};
