const SUPABASE_REST_TIMEOUT_MS = 12000;
const MAX_REQUEST_BYTES = 16 * 1024;
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Content-Type': 'application/json'
};

const jsonResponse = (statusCode, body) => ({ statusCode, headers: corsHeaders, body: JSON.stringify(body) });
const normalizeText = (value, maxLength) => String(value || '').trim().slice(0, maxLength);
const isBodyTooLarge = (body = '') => Buffer.byteLength(String(body || ''), 'utf8') > MAX_REQUEST_BYTES;

const readSupabaseEnv = () => {
  const url = String(process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL || '').trim().replace(/\/$/, '');
  const serviceRoleKey = String(process.env.SUPABASE_SERVICE_ROLE_KEY || '').trim();
  return { url, serviceRoleKey };
};

exports.handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') return { statusCode: 204, headers: corsHeaders, body: '' };
  if (event.httpMethod !== 'POST') return jsonResponse(405, { error: 'Method not allowed. Use POST.' });
  if (isBodyTooLarge(event.body)) return jsonResponse(413, { error: 'Request payload is too large.' });

  let body = {};
  try {
    body = JSON.parse(event.body || '{}');
  } catch (_error) {
    return jsonResponse(400, { error: 'Invalid JSON body.' });
  }

  const name = normalizeText(body.name, 120);
  const email = normalizeText(body.email, 254).toLowerCase();
  const subject = normalizeText(body.subject, 180);
  const message = normalizeText(body.message, 4000);
  const page = normalizeText(body.page || event.headers?.referer || event.headers?.referrer || '', 180);

  if (name.length < 2) return jsonResponse(400, { error: 'Please enter your full name.' });
  if (!EMAIL_PATTERN.test(email)) return jsonResponse(400, { error: 'Please enter a valid email address.' });
  if (subject.length < 4) return jsonResponse(400, { error: 'Subject should be at least 4 characters.' });
  if (message.length < 20) return jsonResponse(400, { error: 'Please add more detail in your message.' });

  const { url, serviceRoleKey } = readSupabaseEnv();
  if (!url || !serviceRoleKey) return jsonResponse(500, { error: 'Contact message storage is not configured on the server.' });

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), SUPABASE_REST_TIMEOUT_MS);

  try {
    const response = await fetch(`${url}/rest/v1/contact_messages`, {
      method: 'POST',
      headers: {
        apikey: serviceRoleKey,
        Authorization: `Bearer ${serviceRoleKey}`,
        'Content-Type': 'application/json',
        Prefer: 'return=minimal'
      },
      signal: controller.signal,
      body: JSON.stringify({ name, email, subject, message, page, status: 'new' })
    });

    const data = await response.json().catch(() => ({}));
    if (!response.ok) return jsonResponse(502, { error: String(data?.message || data?.error || '').trim() || 'Could not save your message. Please try again.' });

    return jsonResponse(200, { ok: true });
  } catch (error) {
    if (error?.name === 'AbortError') return jsonResponse(504, { error: 'Contact request timed out. Please try again.' });
    return jsonResponse(502, { error: 'Could not save your message. Please try again.' });
  } finally {
    clearTimeout(timeout);
  }
};
