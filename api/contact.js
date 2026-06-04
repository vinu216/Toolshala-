const SUPABASE_REST_TIMEOUT_MS = 12000;
const MAX_REQUEST_BYTES = 16 * 1024;
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;

const json = (res, status, body) => res.status(status).json(body);
const normalizeText = (value, maxLength) => String(value || '').trim().slice(0, maxLength);
const getRequestSize = (body) => Buffer.byteLength(JSON.stringify(body || {}), 'utf8');

const readSupabaseInsertConfig = () => {
  const url = String(
    process.env.SUPABASE_URL ||
      process.env.VITE_SUPABASE_URL ||
      process.env.NEXT_PUBLIC_SUPABASE_URL ||
      process.env.PUBLIC_SUPABASE_URL ||
      ''
  )
    .trim()
    .replace(/\/$/, '');

  const serviceRoleKey = String(process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_ROLE || process.env.SUPABASE_SERVICE_KEY || '').trim();
  const anonKey = String(
    process.env.SUPABASE_ANON_KEY ||
      process.env.SUPABASE_PUBLISHABLE_KEY ||
      process.env.VITE_SUPABASE_ANON_KEY ||
      process.env.VITE_SUPABASE_PUBLISHABLE_KEY ||
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
      process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
      process.env.PUBLIC_SUPABASE_ANON_KEY ||
      process.env.PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
      ''
  ).trim();

  return { url, insertKey: serviceRoleKey || anonKey };
};

const getSupabaseConfigError = ({ url, insertKey }, storageLabel) => {
  if (!url && !insertKey) {
    return `${storageLabel} storage is not configured on the server. Missing Supabase URL and insert key.`;
  }
  if (!url) {
    return `${storageLabel} storage is not configured on the server. Missing Supabase URL.`;
  }
  if (!insertKey) {
    return `${storageLabel} storage is not configured on the server. Missing Supabase service-role or anon insert key.`;
  }
  return '';
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return json(res, 405, { error: 'Method not allowed. Use POST.' });
  }

  if (getRequestSize(req.body) > MAX_REQUEST_BYTES) {
    return json(res, 413, { error: 'Request payload is too large.' });
  }

  const name = normalizeText(req.body?.name, 120);
  const email = normalizeText(req.body?.email, 254).toLowerCase();
  const subject = normalizeText(req.body?.subject, 180);
  const message = normalizeText(req.body?.message, 4000);
  const page = normalizeText(req.body?.page || req.headers.referer || '', 180);

  if (name.length < 2) return json(res, 400, { error: 'Please enter your full name.' });
  if (!EMAIL_PATTERN.test(email)) return json(res, 400, { error: 'Please enter a valid email address.' });
  if (subject.length < 4) return json(res, 400, { error: 'Subject should be at least 4 characters.' });
  if (message.length < 20) return json(res, 400, { error: 'Please add more detail in your message.' });

  const { url, insertKey } = readSupabaseInsertConfig();
  const configError = getSupabaseConfigError({ url, insertKey }, 'Contact message');
  if (configError) {
    return json(res, 500, { error: configError });
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), SUPABASE_REST_TIMEOUT_MS);

  try {
    const response = await fetch(`${url}/rest/v1/contact_messages`, {
      method: 'POST',
      headers: {
        apikey: insertKey,
        Authorization: `Bearer ${insertKey}`,
        'Content-Type': 'application/json',
        Prefer: 'return=minimal'
      },
      signal: controller.signal,
      body: JSON.stringify({ name, email, subject, message, page, status: 'new' })
    });

    const data = await response.json().catch(() => ({}));
    if (!response.ok) {
      const errorMessage = String(data?.message || data?.error || '').trim();
      return json(res, 502, { error: errorMessage || 'Could not save your message. Please try again.' });
    }

    return json(res, 200, { ok: true });
  } catch (error) {
    if (error?.name === 'AbortError') {
      return json(res, 504, { error: 'Contact request timed out. Please try again.' });
    }
    return json(res, 502, { error: 'Could not save your message. Please try again.' });
  } finally {
    clearTimeout(timeout);
  }
}
