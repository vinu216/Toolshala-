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

  if (!process.env.OPENAI_API_KEY) {
    return jsonResponse(500, { error: 'Server configuration error: missing OPENAI_API_KEY.' });
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

  try {
    const response = await fetch('https://api.openai.com/v1/responses', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: 'gpt-4.1-mini',
        input: prompt
      })
    });

    const payload = await response.json().catch(() => ({}));
    if (!response.ok) {
      const apiError = String(payload?.error?.message || 'OpenAI API request failed.').trim();
      return jsonResponse(response.status, { error: apiError });
    }

    const text = String(payload?.output_text || '').trim();
    if (!text) {
      return jsonResponse(502, { error: 'OpenAI API returned an empty response.' });
    }

    return jsonResponse(200, { text });
  } catch (_error) {
    return jsonResponse(500, { error: 'Failed to reach OpenAI API.' });
  }
};
