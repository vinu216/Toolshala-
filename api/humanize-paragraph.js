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
  const originalParagraph = String(values.originalParagraph || '').trim();
  const desiredTone = String(values.desiredTone || 'professional').trim();
  const rewriteStyle = String(values.rewriteStyle || 'more-natural').trim();
  const focus = String(values.focus || '').trim();

  if (!originalParagraph || originalParagraph.length < 80) {
    return res.status(400).json({ error: 'Please provide at least 80 characters of paragraph text.' });
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
        temperature: 0.5,
        messages: [
          {
            role: 'system',
            content: 'You are an expert paragraph rewriting assistant. Keep meaning intact while improving clarity, flow, and natural human readability.'
          },
          {
            role: 'user',
            content: `Rewrite the paragraph and return strict JSON.

Rules:
- Keep original meaning intact.
- rewritten: cleaned rewrite aligned to requested tone/style.
- humanized: natural, human-sounding version.
- shortVersion: compact version preserving key meaning.
- bestPick: choose best output for practical use.
- tips: 2-4 concise writing tips.

Input:
Original Paragraph: ${originalParagraph}
Desired Tone: ${desiredTone}
Rewrite Style: ${rewriteStyle}
Optional Focus: ${focus || 'not provided'}

Return exact JSON:
{
  "rewritten": "...",
  "humanized": "...",
  "shortVersion": "...",
  "bestPick": "...",
  "tips": ["...", "..."]
}`
          }
        ],
        response_format: {
          type: 'json_schema',
          json_schema: {
            name: 'humanize_paragraph_response',
            strict: true,
            schema: {
              type: 'object',
              additionalProperties: false,
              properties: {
                rewritten: { type: 'string' },
                humanized: { type: 'string' },
                shortVersion: { type: 'string' },
                bestPick: { type: 'string' },
                tips: {
                  type: 'array',
                  minItems: 2,
                  maxItems: 4,
                  items: { type: 'string' }
                }
              },
              required: ['rewritten', 'humanized', 'shortVersion', 'bestPick', 'tips']
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
    return res.status(500).json({ error: 'Unable to rewrite paragraph right now. Please try again.' });
  }
}
