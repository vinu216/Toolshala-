import { getToolConfig, sanitizeValues } from './_tool-config.js';

const OPENAI_API_URL = 'https://api.openai.com/v1/chat/completions';

const parseModelJson = (raw = '') => {
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed. Use POST.' });
  }

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'OPENAI_API_KEY is missing on the server.' });
  }

  const toolId = String(req.body?.toolId || '').trim();
  const values = sanitizeValues(req.body?.values || {});

  const config = getToolConfig(toolId);
  if (!config) {
    return res.status(400).json({ error: 'Unsupported toolId.' });
  }

  if (!config.validate(values)) {
    return res.status(400).json({ error: 'Missing required fields for this tool.' });
  }

  const prompts = config.prompt(values);

  try {
    const response = await fetch(OPENAI_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: process.env.OPENAI_MODEL || 'gpt-4.1-mini',
        temperature: 0.6,
        messages: [
          { role: 'system', content: prompts.system },
          { role: 'user', content: prompts.user }
        ],
        response_format: {
          type: 'json_schema',
          json_schema: config.schema
        }
      })
    });

    const payload = await response.json();
    if (!response.ok) {
      return res.status(response.status).json({ error: payload?.error?.message || 'OpenAI request failed.' });
    }

    const parsed = parseModelJson(payload?.choices?.[0]?.message?.content || '');
    if (!parsed || typeof parsed !== 'object') {
      return res.status(502).json({ error: 'Model response was not valid structured JSON.' });
    }

    return res.status(200).json(parsed);
  } catch {
    return res.status(500).json({ error: 'Unable to generate output right now. Please try again.' });
  }
}
