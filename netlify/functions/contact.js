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

const normalizeSupabaseProjectUrl = (rawUrl) => {
  const value = String(rawUrl || '').trim();
  if (!value) {
    return { url: '', error: '' };
  }

  try {
    const parsed = new URL(value);
    if (!['http:', 'https:'].includes(parsed.protocol)) {
      return { url: '', error: 'Supabase URL must start with http:// or https://.' };
    }

    return { url: parsed.origin, error: '' };
  } catch (_error) {
    return { url: '', error: 'Supabase URL is invalid. Use your project URL, for example https://your-project-ref.supabase.co.' };
  }
};

const PUBLIC_SUPABASE_SCHEMA = 'public';

const buildSupabaseRestUrl = (projectUrl, tableName) => {
  if (String(tableName).includes('.')) {
    throw new Error('Supabase table names must not include a schema prefix.');
  }
  return new URL(`/rest/v1/${tableName}`, projectUrl).toString();
};

const shouldSendBearerAuth = (key) => !String(key || '').trim().startsWith('sb_');

const createSupabaseRestClient = (projectUrl, insertKey, signal) => ({
  from(tableName) {
    return {
      async insert(rows) {
        const headers = {
          apikey: insertKey,
          'Content-Type': 'application/json',
          'Accept-Profile': PUBLIC_SUPABASE_SCHEMA,
          'Content-Profile': PUBLIC_SUPABASE_SCHEMA,
          Prefer: 'return=minimal'
        };
        if (shouldSendBearerAuth(insertKey)) {
          headers.Authorization = `Bearer ${insertKey}`;
        }

        const response = await fetch(buildSupabaseRestUrl(projectUrl, tableName), {
          method: 'POST',
          headers,
          signal,
          body: JSON.stringify(rows)
        });
        const data = await response.json().catch(() => null);
        return { data, error: response.ok ? null : data || { message: response.statusText }, status: response.status };
      }
    };
  }
});

const readSupabaseInsertConfig = () => {
  const rawUrl =
    process.env.SUPABASE_URL ||
    process.env.VITE_SUPABASE_URL ||
    process.env.NEXT_PUBLIC_SUPABASE_URL ||
    process.env.PUBLIC_SUPABASE_URL ||
    '';
  const { url, error: urlError } = normalizeSupabaseProjectUrl(rawUrl);

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

  return { url, insertKey: serviceRoleKey || anonKey, urlError };
};

const getSupabaseConfigError = ({ url, insertKey, urlError }, storageLabel) => {
  if (urlError) {
    return `${storageLabel} storage is not configured correctly on the server. ${urlError}`;
  }
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

  if (name.length < 2) return jsonResponse(400, { error: 'Please enter your full name.' });
  if (!EMAIL_PATTERN.test(email)) return jsonResponse(400, { error: 'Please enter a valid email address.' });
  if (subject.length < 4) return jsonResponse(400, { error: 'Subject should be at least 4 characters.' });
  if (message.length < 20) return jsonResponse(400, { error: 'Please add more detail in your message.' });

  const supabaseConfig = readSupabaseInsertConfig();
  const { url, insertKey } = supabaseConfig;
  const configError = getSupabaseConfigError(supabaseConfig, 'Contact message');
  if (configError) return jsonResponse(500, { error: configError });

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), SUPABASE_REST_TIMEOUT_MS);

  try {
    const supabase = createSupabaseRestClient(url, insertKey, controller.signal);
    const { data, error } = await supabase
      .from('contact_messages')
      .insert([{ name, email, subject, message }]);

    if (error) return jsonResponse(502, { error: String(data?.message || data?.error || '').trim() || 'Could not save your message. Please try again.' });

    return jsonResponse(200, { ok: true });
  } catch (error) {
    if (error?.name === 'AbortError') return jsonResponse(504, { error: 'Contact request timed out. Please try again.' });
    return jsonResponse(502, { error: 'Could not save your message. Please try again.' });
  } finally {
    clearTimeout(timeout);
  }
};
