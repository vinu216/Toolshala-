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
  const notes = String(values.notes || '').trim();
  const educationLevel = String(values.educationLevel || '').trim();
  const summaryStyle = String(values.summaryStyle || '').trim();
  const focus = String(values.focus || '').trim();

  if (!topic || !notes || !educationLevel || !summaryStyle) {
    return res.status(400).json({ error: 'Missing required fields for notes summarization.' });
  }

  if (notes.length < 120) {
    return res.status(400).json({ error: 'Please provide at least 120 characters of notes.' });
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
          { role: 'system', content: 'You summarize study notes into concise revision-ready outputs.' },
          {
            role: 'user',
            content: `Summarize notes as strict JSON.

Rules:
- Keep output clear, concise, and exam-revision friendly.
- Focus on important points, keywords, and quick recall.
- Preserve meaning from source notes.

Input:
Topic / Chapter: ${topic}
Notes / Text: ${notes}
Education Level: ${educationLevel}
Summary Style: ${summaryStyle}
Optional Focus: ${focus || 'not provided'}

Return exact JSON:
{
  "summary": "...",
  "bullets": ["...", "..."],
  "keywords": ["...", "..."],
  "bestPick": "...",
  "tips": ["...", "..."]
}`
          }
        ],
        response_format: {
          type: 'json_schema',
          json_schema: {
            name: 'notes_summary_response',
            strict: true,
            schema: {
              type: 'object',
              additionalProperties: false,
              properties: {
                summary: { type: 'string' },
                bullets: {
                  type: 'array',
                  minItems: 3,
                  maxItems: 7,
                  items: { type: 'string' }
                },
                keywords: {
                  type: 'array',
                  minItems: 4,
                  maxItems: 10,
                  items: { type: 'string' }
                },
                bestPick: { type: 'string' },
                tips: {
                  type: 'array',
                  minItems: 2,
                  maxItems: 4,
                  items: { type: 'string' }
                }
              },
              required: ['summary', 'bullets', 'keywords', 'bestPick', 'tips']
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
    return res.status(500).json({ error: 'Unable to summarize notes right now. Please try again.' });
  }
}
