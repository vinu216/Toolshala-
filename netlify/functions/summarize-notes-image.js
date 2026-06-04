import visionConfig from './_vision-config.cjs';

const { buildVisionConfig: buildSharedVisionConfig, getEnvString, getVisionConfigError } = visionConfig;

const PROVIDER_TIMEOUT_MS = 45000;
const MAX_SAFE_REQUEST_BYTES = 7 * 1024 * 1024;
const DEFAULT_MAX_FILE_MB = 4;
const ALLOWED_MIME_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp']);

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Content-Type': 'application/json'
};

const jsonResponse = (statusCode, body) => ({ statusCode, headers: corsHeaders, body: JSON.stringify(body) });
const getMaxImageBytes = () => {
  const configuredMaxMb = Number(getEnvString('LECTURE_NOTES_IMAGE_MAX_FILE_MB', String(DEFAULT_MAX_FILE_MB)));
  const maxMb = Number.isFinite(configuredMaxMb) && configuredMaxMb > 0 ? configuredMaxMb : DEFAULT_MAX_FILE_MB;
  return Math.floor(maxMb * 1024 * 1024);
};
const isBodyTooLarge = (body = '') => Buffer.byteLength(String(body || ''), 'utf8') > MAX_SAFE_REQUEST_BYTES;

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
const buildVisionConfig = () => buildSharedVisionConfig({
  providerEnv: 'LECTURE_NOTES_IMAGE_PROVIDER',
  apiKeyEnv: 'LECTURE_NOTES_IMAGE_API_KEY',
  modelEnv: 'LECTURE_NOTES_IMAGE_MODEL',
  baseUrlEnv: 'LECTURE_NOTES_IMAGE_BASE_URL',
  defaultOpenAiModel: 'gpt-4o-mini',
  defaultNvidiaModel: 'meta/llama-3.2-11b-vision-instruct'
});

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

const callVisionSummary = async ({ config, base64, mimeType, fileName, subject, summaryLength, summaryStyle, signal }) => {
  const configError = getVisionConfigError('Lecture Notes image summarizer', config);
  if (configError) throw new Error(configError);

  const response = await fetch(`${config.baseUrl}/chat/completions`, {
    method: 'POST',
    signal,
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

export const handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') return { statusCode: 204, headers: corsHeaders, body: '' };
  if (event.httpMethod !== 'POST') return jsonResponse(405, { error: 'Method not allowed' });
  if (isBodyTooLarge(event.body)) return jsonResponse(413, { error: 'Image payload is too large.' });

  let body = {};
  try { body = JSON.parse(event.body || '{}'); } catch (_error) { return jsonResponse(400, { error: 'Invalid JSON body.' }); }

  const { mimeType: dataUrlMimeType, base64 } = parseImagePayload(body.imageBase64 || body.imageData || '');
  const mimeType = String(body.mimeType || dataUrlMimeType || '').toLowerCase();
  const fileName = String(body.fileName || body.filename || 'lecture-notes-image').slice(0, 180);
  if (!base64) return jsonResponse(400, { error: 'Image data is required.' });
  if (!ALLOWED_MIME_TYPES.has(mimeType)) return jsonResponse(400, { error: 'Unsupported image type. Please upload a JPEG, PNG, or WEBP image.' });
  const normalizedBase64 = base64.replace(/\s/g, '');
  if (!/^[A-Za-z0-9+/]+={0,2}$/.test(normalizedBase64) || normalizedBase64.length % 4 !== 0) return jsonResponse(400, { error: 'Invalid image data. Please upload the image again.' });
  if (Buffer.from(normalizedBase64, 'base64').length > getMaxImageBytes()) {
    return jsonResponse(413, { error: `Image is too large. Please upload an image up to ${DEFAULT_MAX_FILE_MB} MB.` });
  }

  const config = buildVisionConfig();
  const configError = getVisionConfigError('Lecture Notes image summarizer', config);
  if (configError) return jsonResponse(500, { error: configError });

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), PROVIDER_TIMEOUT_MS);

  try {
    const text = await callVisionSummary({
      config,
      base64: normalizedBase64,
      mimeType,
      fileName,
      subject: String(body.subject || '').trim(),
      summaryLength: String(body.summaryLength || 'medium').trim(),
      summaryStyle: String(body.summaryStyle || 'bullet-points').trim(),
      signal: controller.signal
    });
    if (!text) return jsonResponse(422, { error: 'No readable lecture-note content was found in this image. Try a clearer or higher-resolution photo.' });
    return jsonResponse(200, { text });
  } catch (error) {
    if (error?.name === 'AbortError') return jsonResponse(504, { error: 'Vision provider timed out while analyzing the image. The upload was received, but the provider took too long. Please crop to the notes area or try a clearer, smaller image.' });
    return jsonResponse(502, { error: error?.message || 'Vision provider failed. Please try another clear image.' });
  } finally {
    clearTimeout(timeout);
  }
};
