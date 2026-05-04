const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS'
};

const jsonResponse = (statusCode, payload) => ({
  statusCode,
  headers: {
    ...CORS_HEADERS,
    'Content-Type': 'application/json; charset=utf-8'
  },
  body: JSON.stringify(payload)
});

exports.handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 204, headers: CORS_HEADERS, body: '' };
  }

  if (event.httpMethod !== 'POST') {
    return jsonResponse(405, { error: 'Method not allowed. Use POST.' });
  }

  let parsedBody;
  try {
    parsedBody = JSON.parse(event.body || '{}');
  } catch (_error) {
    return jsonResponse(400, { error: 'Invalid JSON body.' });
  }

  const prompt = String(parsedBody?.prompt || '').trim();
  if (!prompt) {
    return jsonResponse(400, { error: 'Missing prompt.' });
  }

  const apiKey = String(process.env.NVIDIA_API_KEY || '').trim();
  if (!apiKey) {
    return jsonResponse(500, { error: 'Server configuration error: missing NVIDIA_API_KEY.' });
  }

  try {
    const response = await fetch('https://integrate.api.nvidia.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: 'moonshotai/kimi-k2.6',
        messages: [{ role: 'user', content: prompt }],
        stream: false,
        chat_template_kwargs: { thinking: true }
      })
    });

    let payload = {};
    const raw = await response.text();
    if (raw) {
      try {
        payload = JSON.parse(raw);
      } catch (_error) {
        if (!response.ok) {
          return jsonResponse(response.status, { error: 'NVIDIA API returned a non-JSON error response.' });
        }
        return jsonResponse(502, { error: 'NVIDIA API returned an invalid JSON response.' });
      }
    }

    if (!response.ok) {
      const apiError = String(
        payload?.error?.message
        || payload?.message
        || payload?.error
        || 'NVIDIA API request failed.'
      ).trim();
      return jsonResponse(response.status, { error: apiError });
    }

    const messageContent = payload?.choices?.[0]?.message?.content;
    const text = Array.isArray(messageContent)
      ? messageContent
          .map((part) => (typeof part === 'string' ? part : String(part?.text || '')))
          .join('')
          .trim()
      : String(messageContent || payload?.text || '').trim();
    if (!text) {
      return jsonResponse(502, { error: 'NVIDIA API returned an empty response.' });
    }

    return jsonResponse(200, { text });
  } catch (_error) {
    return jsonResponse(500, { error: 'Failed to reach NVIDIA API.' });
  }
};
