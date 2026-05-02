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
  if (!apiKey) return res.status(500).json({ error: 'OPENAI_API_KEY is missing on the server.' });

  const values = req.body?.values || {};
  const name = String(values.name || '').trim();
  const niche = String(values.niche || '').trim();
  const style = String(values.style || 'professional').trim();
  const purpose = String(values.purpose || 'personal').trim();
  const keywords = String(values.keywords || '').trim();
  const cta = String(values.cta || '').trim();

  if (!name || !niche || !style || !purpose) {
    return res.status(400).json({ error: 'Missing required fields for Instagram bio generation.' });
  }

  try {
    const response = await fetch(OPENAI_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: process.env.OPENAI_MODEL || 'gpt-4.1-mini',
        temperature: 0.7,
        messages: [
          { role: 'system', content: 'You create short, catchy, Instagram-friendly bios. Keep them relevant, readable, and natural.' },
          {
            role: 'user',
            content: `Generate 5 Instagram bio options as strict JSON.

Rules:
- Keep each bio short and Instagram-friendly.
- Meaning should match niche, style, and purpose.
- Use emojis naturally (not forced).
- Include one best pick.

Input:
Name/Brand: ${name}
Niche: ${niche}
Bio Style: ${style}
Purpose: ${purpose}
Keywords: ${keywords || 'not provided'}
Call to Action: ${cta || 'not provided'}

Return exact JSON:
{
  "bestPick": { "text": "...", "style": "..." },
  "bios": [
    { "text": "...", "style": "..." }
  ],
  "hashtags": ["...", "..."]
}`
          }
        ],
        response_format: {
          type: 'json_schema',
          json_schema: {
            name: 'instagram_bio_response',
            strict: true,
            schema: {
              type: 'object',
              additionalProperties: false,
              properties: {
                bestPick: {
                  type: 'object',
                  additionalProperties: false,
                  properties: {
                    text: { type: 'string' },
                    style: { type: 'string' }
                  },
                  required: ['text', 'style']
                },
                bios: {
                  type: 'array',
                  minItems: 5,
                  maxItems: 5,
                  items: {
                    type: 'object',
                    additionalProperties: false,
                    properties: {
                      text: { type: 'string' },
                      style: { type: 'string' }
                    },
                    required: ['text', 'style']
                  }
                },
                hashtags: {
                  type: 'array',
                  minItems: 2,
                  maxItems: 6,
                  items: { type: 'string' }
                }
              },
              required: ['bestPick', 'bios', 'hashtags']
            }
          }
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
    return res.status(500).json({ error: 'Unable to generate Instagram bio right now. Please try again.' });
  }
}
