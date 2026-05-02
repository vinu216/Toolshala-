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
  const emailPurpose = String(values.emailPurpose || '').trim();
  const recipientType = String(values.recipientType || '').trim();
  const tone = String(values.tone || '').trim();
  const keywords = String(values.keywords || '').trim();
  const style = String(values.style || 'clear').trim();

  if (!emailPurpose || !recipientType || !tone) {
    return res.status(400).json({ error: 'Missing required fields for email subject generation.' });
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
        temperature: 0.6,
        messages: [
          { role: 'system', content: 'You generate concise, professional, high-performing email subject lines.' },
          {
            role: 'user',
            content: `Generate 5 subject line options as strict JSON.

Rules:
- Keep lines concise and relevant.
- Match purpose, recipient type, tone, and style.
- Avoid spammy clickbait words.
- Include one best pick.

Input:
Email Purpose: ${emailPurpose}
Recipient Type: ${recipientType}
Tone: ${tone}
Optional Keywords/Context: ${keywords || 'not provided'}
Optional Style: ${style}

Return exact JSON:
{
  "bestPick": { "text": "...", "reason": "..." },
  "subjects": [
    { "text": "...", "style": "..." }
  ],
  "tips": ["...", "..."]
}`
          }
        ],
        response_format: {
          type: 'json_schema',
          json_schema: {
            name: 'email_subject_response',
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
                    reason: { type: 'string' }
                  },
                  required: ['text', 'reason']
                },
                subjects: {
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
                tips: {
                  type: 'array',
                  minItems: 2,
                  maxItems: 4,
                  items: { type: 'string' }
                }
              },
              required: ['bestPick', 'subjects', 'tips']
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
    return res.status(500).json({ error: 'Unable to generate email subjects right now. Please try again.' });
  }
}
