const OPENAI_API_URL = 'https://api.openai.com/v1/chat/completions';
const ALLOWED_MIME_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp']);
const MAX_IMAGE_BYTES = 4 * 1024 * 1024;

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Content-Type': 'application/json'
};

const CAPTION_SCHEMA = {
  name: 'instagram_caption_response',
  strict: true,
  schema: {
    type: 'object',
    additionalProperties: false,
    properties: {
      visualAnalysis: { type: 'string' },
      captions: {
        type: 'array',
        minItems: 5,
        maxItems: 5,
        items: {
          type: 'object',
          additionalProperties: false,
          properties: {
            text: { type: 'string' },
            style: { type: 'string' },
            bestPick: { type: 'boolean' },
            hashtags: { type: 'array', items: { type: 'string' } }
          },
          required: ['text', 'style', 'bestPick', 'hashtags']
        }
      }
    },
    required: ['visualAnalysis', 'captions']
  }
};

const jsonResponse = (statusCode, body) => ({ statusCode, headers: corsHeaders, body: JSON.stringify(body) });
const clean = (value = '') => String(value || '').trim();

const parseImagePayload = (imageBase64 = '') => {
  const value = clean(imageBase64);
  const match = value.match(/^data:([^;]+);base64,(.+)$/i);
  if (match) return { mimeType: match[1].toLowerCase(), base64: match[2] };
  return { mimeType: '', base64: value };
};

const parseModelJson = (rawContent = '') => {
  try { return JSON.parse(rawContent); } catch (_error) { return null; }
};

const buildUserContent = ({ topic, contentType, tone, keywords, image }) => {
  const prompt = [
    'Generate Instagram caption options in structured JSON.',
    `Topic/Text Input: ${topic}`,
    `Content Type: ${contentType}`,
    `Tone: ${tone}`,
    `Optional Keywords: ${keywords || 'Not provided'}`,
    image ? 'Uploaded Image: Analyze the attached image before writing captions.' : 'Uploaded Image: Not provided. Use only the text inputs.',
    'Rules:',
    '- Always return visualAnalysis as 1-3 concise sentences. If no image is provided, briefly say that captions are based on text inputs only.',
    '- When an image is provided, infer mood, objects, setting, style, vibe, composition, colors, and likely context. Do not claim identities, private attributes, or unsupported facts.',
    '- Return exactly 5 caption options.',
    '- Caption styles must be diverse in this order: catchy, minimal, playful, aesthetic, CTA-style.',
    '- Keep captions short, natural, engaging, Instagram-friendly, and matched to the requested tone/content type.',
    '- Reflect the image analysis in the captions when image context is available.',
    '- Include optional hashtag suggestions (0-5 per caption).',
    '- Exactly one caption must have bestPick=true; all others false.'
  ].join('\n');

  if (!image) return prompt;
  return [
    { type: 'text', text: prompt },
    { type: 'image_url', image_url: { url: `data:${image.mimeType};base64,${image.base64}` } }
  ];
};

export const handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') return { statusCode: 204, headers: corsHeaders, body: '' };
  if (event.httpMethod !== 'POST') return jsonResponse(405, { error: 'Method not allowed. Use POST.' });

  const apiKey = clean(process.env.INSTAGRAM_CAPTION_API_KEY || process.env.VISION_API_KEY || process.env.OPENAI_API_KEY || '');
  if (!apiKey) return jsonResponse(500, { error: 'Instagram Caption Generator is not configured. Add INSTAGRAM_CAPTION_API_KEY, VISION_API_KEY, or OPENAI_API_KEY on the server.' });

  let body = {};
  try { body = JSON.parse(event.body || '{}'); } catch (_error) { return jsonResponse(400, { error: 'Invalid JSON body.' }); }

  const topic = clean(body.topic);
  const contentType = clean(body.contentType);
  const tone = clean(body.tone);
  const keywords = clean(body.keywords);
  const { mimeType: dataUrlMimeType, base64 } = parseImagePayload(body.imageBase64 || body.imageData || '');
  const mimeType = clean(body.mimeType || dataUrlMimeType).toLowerCase();
  let image = null;

  if (!topic || !contentType || !tone) return jsonResponse(400, { error: 'topic, contentType, and tone are required.' });

  if (base64 || mimeType) {
    if (!base64) return jsonResponse(400, { error: 'Image data is required when uploading an image.' });
    if (!ALLOWED_MIME_TYPES.has(mimeType)) return jsonResponse(400, { error: 'Unsupported image type. Please upload a JPEG, PNG, or WEBP image.' });
    const normalizedBase64 = base64.replace(/\s/g, '');
    if (!/^[A-Za-z0-9+/]+={0,2}$/.test(normalizedBase64) || normalizedBase64.length % 4 !== 0) return jsonResponse(400, { error: 'Invalid image data. Please upload the image again.' });
    if (Buffer.from(normalizedBase64, 'base64').length > MAX_IMAGE_BYTES) return jsonResponse(413, { error: 'Image is too large. Please upload an image up to 4 MB.' });
    image = { mimeType, base64: normalizedBase64 };
  }

  try {
    const response = await fetch(OPENAI_API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${apiKey}` },
      body: JSON.stringify({
        model: process.env.INSTAGRAM_CAPTION_MODEL || process.env.VISION_MODEL || process.env.OPENAI_MODEL || 'gpt-4o-mini',
        temperature: 0.7,
        messages: [
          { role: 'system', content: 'You are a social media caption strategist that can analyze images for Instagram context. Return exactly valid JSON matching the schema.' },
          { role: 'user', content: buildUserContent({ topic, contentType, tone, keywords, image }) }
        ],
        response_format: { type: 'json_schema', json_schema: CAPTION_SCHEMA }
      })
    });

    const providerPayload = await response.json().catch(() => ({}));
    if (!response.ok) return jsonResponse(response.status, { error: providerPayload?.error?.message || 'OpenAI request failed.' });

    const parsed = parseModelJson(providerPayload?.choices?.[0]?.message?.content || '');
    if (!parsed || !Array.isArray(parsed?.captions) || parsed.captions.length !== 5) return jsonResponse(502, { error: 'Model response was not valid structured JSON.' });

    const captions = parsed.captions
      .map((entry, index) => ({
        text: clean(entry?.text),
        style: clean(entry?.style) || ['Catchy', 'Minimal', 'Playful', 'Aesthetic', 'CTA-style'][index] || 'General',
        bestPick: Boolean(entry?.bestPick),
        hashtags: Array.isArray(entry?.hashtags) ? entry.hashtags.map((tag) => clean(tag)).filter(Boolean).slice(0, 5) : []
      }))
      .filter((entry) => entry.text);

    if (captions.length !== 5) return jsonResponse(502, { error: 'Caption response was incomplete.' });
    if (!captions.some((entry) => entry.bestPick)) captions[0].bestPick = true;

    return jsonResponse(200, { visualAnalysis: clean(parsed.visualAnalysis), captions });
  } catch (_error) {
    return jsonResponse(500, { error: 'Unable to generate captions at the moment. Please try again.' });
  }
};
