const SUPABASE_REST_TIMEOUT_MS = 12000;
const MAX_REQUEST_BYTES = 8 * 1024;
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;

const json = (res, status, body) => res.status(status).json(body);

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

const normalizeText = (value, maxLength = 120) => String(value || '').trim().slice(0, maxLength);

const getRequestSize = (body) => Buffer.byteLength(JSON.stringify(body || {}), 'utf8');

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return json(res, 405, { error: 'Method not allowed. Use POST.' });
  }

  if (getRequestSize(req.body) > MAX_REQUEST_BYTES) {
    return json(res, 413, { error: 'Request payload is too large.' });
  }

  const email = normalizeText(req.body?.email, 254).toLowerCase();
  if (!EMAIL_PATTERN.test(email)) {
    return json(res, 400, { error: 'Please enter a valid email address.' });
  }

  const supabaseConfig = readSupabaseInsertConfig();
  const { url, insertKey } = supabaseConfig;
  const configError = getSupabaseConfigError(supabaseConfig, 'Newsletter');
  if (configError) {
    return json(res, 500, { error: configError });
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), SUPABASE_REST_TIMEOUT_MS);

  try {
    const supabase = createSupabaseRestClient(url, insertKey, controller.signal);
    const { data, error, status } = await supabase
      .from('subscribers')
      .insert([{ email }]);

    if (error) {
      if (status === 409 || data?.code === '23505') {
        return json(res, 200, { ok: true, duplicate: true });
      }
      const message = String(data?.message || data?.error || '').trim();
      return json(res, 502, { error: message || 'Could not save the subscriber. Please try again.' });
    }

    return json(res, 200, { ok: true });
  } catch (error) {
    if (error?.name === 'AbortError') {
      return json(res, 504, { error: 'Newsletter request timed out. Please try again.' });
    }
    return json(res, 502, { error: 'Could not save the subscriber. Please try again.' });
  } finally {
    clearTimeout(timeout);
  }
}
