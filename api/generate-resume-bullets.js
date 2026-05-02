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
  const role = String(values.role || '').trim();
  const experienceType = String(values.experienceType || '').trim();
  const task = String(values.task || '').trim();
  const skills = String(values.skills || '').trim();
  const result = String(values.result || '').trim();
  const tone = String(values.tone || 'professional').trim();

  if (!role || !experienceType || !task || !skills || !result || !tone) {
    return res.status(400).json({ error: 'Missing required fields for resume bullet generation.' });
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
        temperature: 0.55,
        messages: [
          { role: 'system', content: 'You write ATS-friendly resume bullet points. Use action + skill + result structure and keep meaning factual.' },
          {
            role: 'user',
            content: `Generate 3 to 5 resume bullet points as strict JSON.

Rules:
- Use action + skill + result format.
- Keep bullets concise, professional, and ATS-friendly.
- Keep claims realistic and aligned with given input.
- Include one best pick.

Input:
Role / Job Title: ${role}
Experience Type: ${experienceType}
Task / Responsibility: ${task}
Skills Used: ${skills}
Result / Outcome: ${result}
Tone: ${tone}

Return exact JSON:
{
  "bestPick": { "text": "...", "reason": "..." },
  "bullets": [
    { "text": "...", "tone": "..." }
  ],
  "tips": ["...", "..."]
}`
          }
        ],
        response_format: {
          type: 'json_schema',
          json_schema: {
            name: 'resume_bullet_response',
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
                bullets: {
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
              required: ['bestPick', 'bullets', 'tips']
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
    return res.status(500).json({ error: 'Unable to generate resume bullets right now. Please try again.' });
  }
}
