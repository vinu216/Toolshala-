const OPENAI_API_URL = 'https://api.openai.com/v1/chat/completions';

const CAPTION_SCHEMA = {
  name: 'instagram_caption_response',
  strict: true,
  schema: {
    type: 'object',
    additionalProperties: false,
    properties: {
      captions: {
        type: 'array',
        minItems: 5,
        maxItems: 5,
        items: {
          type: 'object',
          additionalProperties: false,
          properties: {
            text: { type: 'string' },
            style: { type: 'string' },
            bestPick: { type: 'boolean' },
            hashtags: {
              type: 'array',
              items: { type: 'string' }
            }
          },
          required: ['text', 'style', 'bestPick', 'hashtags']
        }
      }
    },
    required: ['captions']
  }
};

const clean = (value = '') => String(value).trim();

const parseModelJson = (rawContent = '') => {
  try {
    return JSON.parse(rawContent);
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
    return res.status(500).json({
      error: 'OPENAI_API_KEY is missing on the server. Add it in your deployment environment variables.'
    });
  }

  const body = req.body || {};
  const topic = clean(body.topic);
  const contentType = clean(body.contentType);
  const tone = clean(body.tone);
  const keywords = clean(body.keywords);

  if (!topic || !contentType || !tone) {
    return res.status(400).json({
      error: 'topic, contentType, and tone are required.'
    });
  }

  const systemPrompt = [
    'You are a social media caption strategist for creators, students, and personal brands.',
    'Generate natural, engaging, platform-ready Instagram captions in clean English.',
    'Mix lengths and styles across options and include emojis only when they fit naturally.',
    'Return exactly 5 captions, and mark exactly one as bestPick=true.'
  ].join(' ');

  const userPrompt = [
    'Generate caption options in structured JSON.',
    `Topic: ${topic}`,
    `Content Type: ${contentType}`,
    `Tone: ${tone}`,
    `Optional Keywords: ${keywords || 'Not provided'}`,
    'Rules:',
    '- Return exactly 5 caption options.',
    '- Keep wording natural and shareable for Instagram.',
    '- Vary styles (short, medium, slightly longer).',
    '- Include optional hashtag suggestions (0-5 per caption).',
    '- Exactly one caption must have bestPick=true; all others false.'
  ].join('\n');

  try {
    const openAiResponse = await fetch(OPENAI_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: process.env.OPENAI_MODEL || 'gpt-4.1-mini',
        temperature: 0.7,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        response_format: {
          type: 'json_schema',
          json_schema: CAPTION_SCHEMA
        }
      })
    });

    const responseJson = await openAiResponse.json();
    if (!openAiResponse.ok) {
      return res.status(openAiResponse.status).json({
        error: responseJson?.error?.message || 'OpenAI request failed.'
      });
    }

    const modelContent = responseJson?.choices?.[0]?.message?.content || '';
    const parsed = parseModelJson(modelContent);

    if (!Array.isArray(parsed?.captions) || parsed.captions.length !== 5) {
      return res.status(502).json({ error: 'Model response was not valid structured JSON.' });
    }

    const normalized = parsed.captions
      .map((entry) => ({
        text: clean(entry?.text),
        style: clean(entry?.style) || 'General',
        bestPick: Boolean(entry?.bestPick),
        hashtags: Array.isArray(entry?.hashtags)
          ? entry.hashtags.map((tag) => clean(tag)).filter(Boolean).slice(0, 5)
          : []
      }))
      .filter((entry) => entry.text);

    if (normalized.length !== 5) {
      return res.status(502).json({ error: 'Caption response was incomplete.' });
    }

    const hasBestPick = normalized.some((entry) => entry.bestPick);
    if (!hasBestPick) {
      normalized[0].bestPick = true;
    }

    return res.status(200).json({ captions: normalized });
  } catch (error) {
    return res.status(500).json({
      error: 'Unable to generate captions at the moment. Please try again.'
    });
  }
}
