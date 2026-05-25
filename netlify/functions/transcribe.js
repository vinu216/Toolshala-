const OPENAI_AUDIO_MODEL = process.env.OPENAI_TRANSCRIPTION_MODEL || 'gpt-4o-mini-transcribe';

const headers = { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Headers': 'Content-Type', 'Access-Control-Allow-Methods': 'POST, OPTIONS', 'Content-Type': 'application/json' };
const out = (statusCode, body) => ({ statusCode, headers, body: JSON.stringify(body) });

exports.handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') return { statusCode: 204, headers, body: '' };
  if (event.httpMethod !== 'POST') return out(405, { error: 'Method not allowed' });
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) return out(500, { error: 'OPENAI_API_KEY is missing on the server.' });
  try {
    const body = JSON.parse(event.body || '{}');
    const { fileName, mimeType, contentBase64, language } = body;
    if (!fileName || !mimeType || !contentBase64) return out(400, { error: 'fileName, mimeType, and contentBase64 are required.' });
    const bytes = Buffer.from(contentBase64, 'base64');
    const file = new File([bytes], fileName, { type: mimeType });
    const form = new FormData();
    form.append('file', file);
    form.append('model', OPENAI_AUDIO_MODEL);
    if (language) form.append('language', String(language));
    const response = await fetch('https://api.openai.com/v1/audio/transcriptions', { method: 'POST', headers: { Authorization: `Bearer ${apiKey}` }, body: form });
    const data = await response.json().catch(() => ({}));
    if (!response.ok) return out(response.status >= 500 ? 502 : response.status, { error: data?.error?.message || 'Transcription request failed.' });
    return out(200, { text: String(data?.text || '').trim() });
  } catch (_error) {
    return out(502, { error: 'Transcription request failed. Please try again.' });
  }
};
