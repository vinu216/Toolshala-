const NVIDIA_CHAT_COMPLETIONS_ENDPOINT = 'https://integrate.api.nvidia.com/v1/chat/completions';
const NVIDIA_PHOTO_TO_TEXT_MODEL = 'meta/llama-3.2-11b-vision-instruct';
const ALLOWED_MIME_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp']);
const MAX_IMAGE_BYTES = 8 * 1024 * 1024;

const parseImagePayload = (imageBase64 = '') => {
  const value = String(imageBase64 || '').trim();
  const match = value.match(/^data:([^;]+);base64,(.+)$/i);
  if (match) return { mimeType: match[1].toLowerCase(), base64: match[2] };
  return { mimeType: '', base64: value };
};

const normalizeText = (value = '') => String(value || '')
  .replace(/\r\n/g, '\n')
  .replace(/\r/g, '\n')
  .replace(/^```(?:text|plain\s*text|markdown)?\s*\n([\s\S]*?)\n```$/i, '$1')
  .replace(/^(?:here(?:'s| is)\s+)?(?:the\s+)?(?:extracted|transcribed|visible|ocr)\s+text\s*[:\-–]\s*/i, '')
  .trim();

export default async function handler(req, res) {
  if (req.method === 'OPTIONS') return res.status(204).end();
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST, OPTIONS');
    return res.status(405).json({ error: 'Method not allowed. Use POST.' });
  }

  const apiKey = String(process.env.PHOTO_TO_TEXT_API_KEY || process.env.NVIDIA_API_KEY || '').trim();
  if (!apiKey) return res.status(500).json({ error: 'Photo to Text OCR is not configured. Add PHOTO_TO_TEXT_API_KEY or NVIDIA_API_KEY on the server.' });

  const { mimeType: dataUrlMimeType, base64 } = parseImagePayload(req.body?.imageBase64 || req.body?.imageData || '');
  const mimeType = String(req.body?.mimeType || dataUrlMimeType || '').toLowerCase();
  const fileName = String(req.body?.fileName || req.body?.filename || 'uploaded-image').slice(0, 180);

  if (!base64) return res.status(400).json({ error: 'Image data is required.' });
  if (!ALLOWED_MIME_TYPES.has(mimeType)) return res.status(400).json({ error: 'Unsupported image type. Please upload a JPEG, PNG, or WEBP image.' });

  const normalizedBase64 = base64.replace(/\s/g, '');
  if (!/^[A-Za-z0-9+/]+={0,2}$/.test(normalizedBase64)) return res.status(400).json({ error: 'Invalid image data. Please upload the image again.' });
  if (Buffer.from(normalizedBase64, 'base64').length > MAX_IMAGE_BYTES) return res.status(413).json({ error: 'Image is too large. Please upload an image up to 8 MB.' });

  try {
    const response = await fetch(NVIDIA_CHAT_COMPLETIONS_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${apiKey}` },
      body: JSON.stringify({
        model: NVIDIA_PHOTO_TO_TEXT_MODEL,
        temperature: 0,
        max_tokens: 4096,
        messages: [
          { role: 'system', content: 'You are a strict OCR engine. Return only visibly present text, preserving line breaks. Do not summarize or describe the image.' },
          {
            role: 'user',
            content: [
              { type: 'text', text: `OCR transcribe this uploaded image (${fileName}). Return only exact visible text.` },
              { type: 'image_url', image_url: { url: `data:${mimeType};base64,${normalizedBase64}` } }
            ]
          }
        ]
      })
    });

    const payload = await response.json().catch(() => ({}));
    if (!response.ok) return res.status(response.status).json({ error: payload?.error?.message || 'NVIDIA OCR request failed.' });
    const text = normalizeText(payload?.choices?.[0]?.message?.content || '');
    if (!text) return res.status(422).json({ error: 'No readable text was found in this image. Try a clearer or higher-resolution photo.' });
    return res.status(200).json({ text });
  } catch {
    return res.status(500).json({ error: 'Unable to extract text from the image right now. Please try again.' });
  }
}
