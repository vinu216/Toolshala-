const OPENAI_API_URL = 'https://api.openai.com/v1/chat/completions';
const ALLOWED_MIME_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp']);
const MAX_IMAGE_BYTES = 4 * 1024 * 1024;

const parseImagePayload = (imageBase64 = '') => {
  const value = String(imageBase64 || '').trim();
  const match = value.match(/^data:([^;]+);base64,(.+)$/i);
  if (match) return { mimeType: match[1].toLowerCase(), base64: match[2] };
  return { mimeType: '', base64: value };
};

const normalizeText = (value = '') => String(value || '')
  .replace(/\r\n/g, '\n')
  .replace(/\r/g, '\n')
  .replace(/^```(?:markdown|text)?\s*\n([\s\S]*?)\n```$/i, '$1')
  .trim();

const buildPrompt = ({ topic, educationLevel, summaryStyle, focus, fileName }) => [
  `Analyze the uploaded notes image${fileName ? ` (${fileName})` : ''} and convert visible content into concise bullet points.`,
  `Topic / chapter, if provided: ${topic || 'not provided'}.`,
  `Education level: ${educationLevel || 'not provided'}.`,
  `Bullet style: ${summaryStyle || 'short-bullets'}.`,
  `Optional focus: ${focus || 'not provided'}.`,
  'Use only visible image content. Do not invent unsupported facts.',
  'Return clean Markdown with: Bullet Points, Important Keywords, and Quick Revision Points. Use nested bullets only when the source has clear hierarchy.'
].join('\n');

export default async function handler(req, res) {
  if (req.method === 'OPTIONS') return res.status(204).end();
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST, OPTIONS');
    return res.status(405).json({ error: 'Method not allowed. Use POST.' });
  }

  const apiKey = String(process.env.NOTES_TO_BULLETS_IMAGE_API_KEY || process.env.VISION_API_KEY || process.env.OPENAI_API_KEY || '').trim();
  if (!apiKey) return res.status(500).json({ error: 'Notes image bullet converter is not configured. Add NOTES_TO_BULLETS_IMAGE_API_KEY, VISION_API_KEY, or OPENAI_API_KEY on the server.' });

  const { mimeType: dataUrlMimeType, base64 } = parseImagePayload(req.body?.imageBase64 || req.body?.imageData || '');
  const mimeType = String(req.body?.mimeType || dataUrlMimeType || '').toLowerCase();
  const fileName = String(req.body?.fileName || req.body?.filename || 'notes-to-bullets-image').slice(0, 180);

  if (!base64) return res.status(400).json({ error: 'Image data is required.' });
  if (!ALLOWED_MIME_TYPES.has(mimeType)) return res.status(400).json({ error: 'Unsupported image type. Please upload a JPEG, PNG, or WEBP image.' });

  const normalizedBase64 = base64.replace(/\s/g, '');
  if (!/^[A-Za-z0-9+/]+={0,2}$/.test(normalizedBase64)) return res.status(400).json({ error: 'Invalid image data. Please upload the image again.' });
  if (Buffer.from(normalizedBase64, 'base64').length > MAX_IMAGE_BYTES) return res.status(413).json({ error: 'Image is too large. Please upload an image up to 4 MB.' });

  try {
    const response = await fetch(OPENAI_API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${apiKey}` },
      body: JSON.stringify({
        model: process.env.NOTES_TO_BULLETS_IMAGE_MODEL || 'gpt-4o-mini',
        temperature: 0.25,
        max_tokens: 1800,
        messages: [
          { role: 'system', content: 'You are a strict notes-to-bullet-points converter. Convert only visible image content into concise Markdown bullet points.' },
          {
            role: 'user',
            content: [
              { type: 'text', text: buildPrompt({ topic: req.body?.topic, educationLevel: req.body?.educationLevel, summaryStyle: req.body?.summaryStyle, focus: req.body?.focus, fileName }) },
              { type: 'image_url', image_url: { url: `data:${mimeType};base64,${normalizedBase64}` } }
            ]
          }
        ]
      })
    });

    const payload = await response.json().catch(() => ({}));
    if (!response.ok) return res.status(response.status).json({ error: payload?.error?.message || 'OpenAI vision request failed.' });
    const text = normalizeText(payload?.choices?.[0]?.message?.content || '');
    if (!text) return res.status(422).json({ error: 'No readable notes content was found in this image. Try a clearer or higher-resolution photo.' });
    return res.status(200).json({ text });
  } catch {
    return res.status(500).json({ error: 'Unable to convert the image right now. Please try again.' });
  }
}
