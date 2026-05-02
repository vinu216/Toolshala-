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
  const topic = String(values.topic || '').trim();
  const platform = String(values.platform || '').trim();
  const contentType = String(values.contentType || '').trim();
  const tone = String(values.tone || '').trim();
  const keywords = String(values.keywords || '').trim();

  if (!topic || !platform || !contentType || !tone) {
    return res.status(400).json({ error: 'Missing required fields for hashtag generation.' });
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
          { role: 'system', content: 'You generate practical social-media hashtag sets with a mix of broad and niche tags.' },
          {
            role: 'user',
            content: `Generate 3 to 5 hashtag sets as strict JSON.

Rules:
- Include both broad and niche hashtags.
- Keep hashtags platform-friendly and relevant.
- Avoid spammy or irrelevant tags.
- Include one best pick set.

Input:
Topic / Niche: ${topic}
Platform: ${platform}
Content Type: ${contentType}
Tone: ${tone}
Optional Keywords: ${keywords || 'not provided'}

Return exact JSON:
{
  "bestPick": { "title": "...", "reason": "..." },
  "sets": [
    {
      "title": "...",
      "hashtags": ["#...", "#..."]
    }
  ],
  "tips": ["...", "..."]
}`
          }
        ],
        response_format: {
          type: 'json_schema',
          json_schema: {
            name: 'hashtag_sets_response',
            strict: true,
            schema: {
              type: 'object',
              additionalProperties: false,
              properties: {
                bestPick: {
                  type: 'object',
                  additionalProperties: false,
                  properties: {
                    title: { type: 'string' },
                    reason: { type: 'string' }
                  },
                  required: ['title', 'reason']
                },
                sets: {
                  type: 'array',
                  minItems: 3,
                  maxItems: 5,
                  items: {
                    type: 'object',
                    additionalProperties: false,
                    properties: {
                      title: { type: 'string' },
                      hashtags: {
                        type: 'array',
                        minItems: 5,
                        maxItems: 10,
                        items: { type: 'string' }
                      }
                    },
                    required: ['title', 'hashtags']
                  }
                },
                tips: {
                  type: 'array',
                  minItems: 2,
                  maxItems: 4,
                  items: { type: 'string' }
                }
              },
              required: ['bestPick', 'sets', 'tips']
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
    return res.status(500).json({ error: 'Unable to generate hashtags right now. Please try again.' });
  }
}
