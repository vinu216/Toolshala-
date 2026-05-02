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
  const purpose = String(values.purpose || '').trim();
  const recipientType = String(values.recipientType || '').trim();
  const tone = String(values.tone || '').trim();
  const details = String(values.details || '').trim();
  const length = String(values.length || 'medium').trim();

  if (!purpose || !recipientType || !tone) {
    return res.status(400).json({ error: 'Missing required fields for WhatsApp message generation.' });
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
          { role: 'system', content: 'You write polite, clear, natural WhatsApp messages for personal, academic, and professional contexts.' },
          {
            role: 'user',
            content: `Generate 3 to 5 WhatsApp message variations as strict JSON.

Rules:
- Keep messages natural, practical, and WhatsApp-friendly.
- Match requested tone, recipient, and purpose.
- Keep wording respectful and clear.
- Include one best pick.

Input:
Message Purpose: ${purpose}
Recipient Type: ${recipientType}
Tone: ${tone}
Optional Details: ${details || 'not provided'}
Optional Length: ${length}

Return exact JSON:
{
  "bestPick": { "text": "...", "tone": "..." },
  "messages": [
    { "text": "...", "tone": "..." }
  ],
  "tips": ["...", "..."]
}`
          }
        ],
        response_format: {
          type: 'json_schema',
          json_schema: {
            name: 'whatsapp_message_response',
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
                    tone: { type: 'string' }
                  },
                  required: ['text', 'tone']
                },
                messages: {
                  type: 'array',
                  minItems: 3,
                  maxItems: 5,
                  items: {
                    type: 'object',
                    additionalProperties: false,
                    properties: {
                      text: { type: 'string' },
                      tone: { type: 'string' }
                    },
                    required: ['text', 'tone']
                  }
                },
                tips: {
                  type: 'array',
                  minItems: 2,
                  maxItems: 4,
                  items: { type: 'string' }
                }
              },
              required: ['bestPick', 'messages', 'tips']
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
    return res.status(500).json({ error: 'Unable to generate WhatsApp messages right now. Please try again.' });
  }
}
