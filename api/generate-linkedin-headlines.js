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
  const currentStatus = String(values.currentStatus || '').trim();
  const targetRole = String(values.targetRole || '').trim();
  const skills = String(values.skills || '').trim();
  const industry = String(values.industry || '').trim();
  const goal = String(values.goal || '').trim();
  const tone = String(values.tone || 'professional').trim();

  if (!name || !currentStatus || !targetRole || !skills || !industry) {
    return res.status(400).json({ error: 'Missing required fields for LinkedIn headline generation.' });
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
          { role: 'system', content: 'You write concise, recruiter-friendly LinkedIn headlines with strong keyword relevance.' },
          {
            role: 'user',
            content: `Generate 5 LinkedIn headline options as strict JSON.

Rules:
- Keep headlines concise and keyword-friendly.
- Match profile stage, role, industry, and tone.
- Avoid exaggerated or fake claims.
- Include one best pick.

Input:
Name: ${name}
Current Status: ${currentStatus}
Target Role / Field: ${targetRole}
Key Skills: ${skills}
Industry / Niche: ${industry}
Optional Goal: ${goal || 'not provided'}
Optional Tone: ${tone}

Return exact JSON:
{
  "bestPick": { "text": "...", "reason": "..." },
  "headlines": [
    { "text": "...", "tone": "..." }
  ],
  "tips": ["...", "..."]
}`
          }
        ],
        response_format: {
          type: 'json_schema',
          json_schema: {
            name: 'linkedin_headline_response',
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
                headlines: {
                  type: 'array',
                  minItems: 5,
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
              required: ['bestPick', 'headlines', 'tips']
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
    return res.status(500).json({ error: 'Unable to generate LinkedIn headlines right now. Please try again.' });
  }
}
