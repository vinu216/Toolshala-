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

  const values = req.body?.values || {};
  const originalText = String(values.originalText || '').trim();
  const outputStyle = String(values.outputStyle || 'simple').trim();
  const improvementLevel = String(values.improvementLevel || 'light-correction').trim();
  const tone = String(values.tone || '').trim();

  if (!originalText || originalText.length < 20) {
    return res.status(400).json({ error: 'Please provide at least 20 characters of original text.' });
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
          {
            role: 'system',
            content: 'You are a grammar and writing assistant. Keep original meaning unchanged while improving grammar, clarity, and tone naturally.'
          },
          {
            role: 'user',
            content: `Improve the text and return strict JSON with keys corrected, improved, bestPick, tips.

Rules:
- Keep original meaning same.
- corrected: grammar fixed with minimal edits.
- improved: more readable version based on style and improvement level.
- bestPick: choose corrected or improved, whichever is more natural and useful.
- tips: 2-4 concise writing tips.

Input:
Original Text: ${originalText}
Output Style: ${outputStyle}
Improvement Level: ${improvementLevel}
Optional Tone: ${tone || 'not provided'}

Return JSON format exactly:
{
  "corrected": "...",
  "improved": "...",
  "bestPick": "...",
  "tips": ["...", "..."]
}`
          }
        ],
        response_format: {
          type: 'json_schema',
          json_schema: {
            name: 'improve_text_response',
            strict: true,
            schema: {
              type: 'object',
              additionalProperties: false,
              properties: {
                corrected: { type: 'string' },
                improved: { type: 'string' },
                bestPick: { type: 'string' },
                tips: {
                  type: 'array',
                  minItems: 2,
                  maxItems: 4,
                  items: { type: 'string' }
                }
              },
              required: ['corrected', 'improved', 'bestPick', 'tips']
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
    return res.status(500).json({ error: 'Unable to improve text right now. Please try again.' });
  }
}
