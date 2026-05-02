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
  const letterType = String(values.letterType || '').trim();
  const recipientType = String(values.recipientType || '').trim();
  const subject = String(values.subject || '').trim();
  const message = String(values.message || '').trim();
  const senderName = String(values.senderName || '').trim();
  const tone = String(values.tone || 'formal').trim();

  if (!letterType || !recipientType || !subject || !message || !senderName || !tone) {
    return res.status(400).json({ error: 'Missing required fields for formal letter generation.' });
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
        temperature: 0.4,
        messages: [
          { role: 'system', content: 'You write professional formal letters for school, college, office, and general communication.' },
          {
            role: 'user',
            content: `Generate a complete formal letter in strict JSON.

Rules:
- Keep message clear, respectful, and practical.
- Include date, greeting, body, closing, and signature within the letter text.
- Match tone, recipient type, and letter purpose.

Input:
Letter Type: ${letterType}
Recipient Type: ${recipientType}
Subject: ${subject}
Reason / Message: ${message}
Sender Name: ${senderName}
Tone: ${tone}

Return exact JSON:
{
  "letter": "...",
  "tips": ["...", "..."]
}`
          }
        ],
        response_format: {
          type: 'json_schema',
          json_schema: {
            name: 'formal_letter_response',
            strict: true,
            schema: {
              type: 'object',
              additionalProperties: false,
              properties: {
                letter: { type: 'string' },
                tips: {
                  type: 'array',
                  minItems: 2,
                  maxItems: 4,
                  items: { type: 'string' }
                }
              },
              required: ['letter', 'tips']
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
    return res.status(500).json({ error: 'Unable to generate formal letter right now. Please try again.' });
  }
}
