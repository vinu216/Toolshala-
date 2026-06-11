const OPENAI_AUDIO_MODEL = process.env.OPENAI_TRANSCRIPTION_MODEL || 'gpt-4o-mini-transcribe';
const MAX_AUDIO_BYTES = 25 * 1024 * 1024;
const ALLOWED_MIME_TYPES = new Set(['audio/mpeg', 'audio/mp3', 'audio/mpga', 'audio/wav', 'audio/x-wav', 'audio/webm', 'audio/mp4', 'audio/x-m4a', 'audio/m4a', 'audio/ogg', 'video/mp4', 'video/webm']);

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) return res.status(500).json({ error: 'OPENAI_API_KEY is missing on the server.' });

  const { fileName, mimeType, contentBase64, language } = req.body || {};
  if (!fileName || !mimeType || !contentBase64) return res.status(400).json({ error: 'fileName, mimeType, and contentBase64 are required.' });
  if (!ALLOWED_MIME_TYPES.has(String(mimeType).toLowerCase())) return res.status(400).json({ error: 'Unsupported audio type. Use mp3, wav, m4a, mp4, ogg, or webm.' });

  try {
    const normalizedBase64 = String(contentBase64).replace(/\s/g, '');
    if (!/^[A-Za-z0-9+/]+={0,2}$/.test(normalizedBase64) || normalizedBase64.length % 4 !== 0) return res.status(400).json({ error: 'Invalid audio data. Please upload or record again.' });
    const bytes = Buffer.from(normalizedBase64, 'base64');
    if (bytes.length > MAX_AUDIO_BYTES) return res.status(413).json({ error: 'Audio file is too large. Max 25MB.' });
    const file = new Blob([bytes], { type: mimeType });
    const form = new FormData();
    form.append('file', file, fileName);
    form.append('model', OPENAI_AUDIO_MODEL);
    if (language) form.append('language', String(language));

    const response = await fetch('https://api.openai.com/v1/audio/transcriptions', {
      method: 'POST',
      headers: { Authorization: `Bearer ${apiKey}` },
      body: form
    });
    const data = await response.json().catch(() => ({}));
    if (!response.ok) return res.status(response.status >= 500 ? 502 : response.status).json({ error: data?.error?.message || 'Transcription request failed.' });
    return res.status(200).json({ text: String(data?.text || '').trim() });
  } catch (_error) {
    return res.status(502).json({ error: 'Transcription request failed. Please try again.' });
  }
}
