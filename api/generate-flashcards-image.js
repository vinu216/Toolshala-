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

const clampFlashcardCount = (value) => {
  const count = Number(value || 0);
  if (!Number.isInteger(count)) return 8;
  return Math.min(30, Math.max(3, count));
};

const buildPrompt = ({ topicTitle, flashcardCount, difficulty, outputStyle, fileName }) => [
  `Analyze the uploaded study image${fileName ? ` (${fileName})` : ''} and generate ${clampFlashcardCount(flashcardCount)} short Q&A flashcards from visible content.`,
  `Topic / chapter: ${topicTitle || 'not provided'}.`,
  `Difficulty: ${difficulty || 'medium'}.`,
  `Output style: ${outputStyle || 'simple'}.`,
  'Use only visible image content. Do not invent unsupported facts.',
  'If image text or diagram elements are unclear, do not create cards from unclear content.',
  'Return clean Markdown with numbered flashcards. Each card must include Question, Answer, Memory Hint, and optional Difficulty.'
].join('\n');

export default async function handler(req, res) {
  if (req.method === 'OPTIONS') return res.status(204).end();
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST, OPTIONS');
    return res.status(405).json({ error: 'Method not allowed. Use POST.' });
  }

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) return res.status(500).json({ error: 'OPENAI_API_KEY is missing on the server.' });

  const { mimeType: dataUrlMimeType, base64 } = parseImagePayload(req.body?.imageBase64 || req.body?.imageData || '');
  const mimeType = String(req.body?.mimeType || dataUrlMimeType || '').toLowerCase();
  const fileName = String(req.body?.fileName || req.body?.filename || 'flashcard-study-image').slice(0, 180);

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
        model: process.env.FLASHCARD_IMAGE_MODEL || 'gpt-4o-mini',
        temperature: 0.35,
        max_tokens: 2200,
        messages: [
          { role: 'system', content: 'You are a strict flashcard generator. Generate only supported Q&A flashcards with memory hints from visible image content.' },
          {
            role: 'user',
            content: [
              { type: 'text', text: buildPrompt({ topicTitle: req.body?.topicTitle, flashcardCount: req.body?.flashcardCount, difficulty: req.body?.difficulty, outputStyle: req.body?.outputStyle, fileName }) },
              { type: 'image_url', image_url: { url: `data:${mimeType};base64,${normalizedBase64}` } }
            ]
          }
        ]
      })
    });

    const payload = await response.json().catch(() => ({}));
    if (!response.ok) return res.status(response.status).json({ error: payload?.error?.message || 'OpenAI vision request failed.' });
    const text = normalizeText(payload?.choices?.[0]?.message?.content || '');
    if (!text) return res.status(422).json({ error: 'No readable study content was found in this image. Try a clearer or higher-resolution photo.' });
    return res.status(200).json({ text });
  } catch {
    return res.status(500).json({ error: 'Unable to generate flashcards from the image right now. Please try again.' });
  }
}
