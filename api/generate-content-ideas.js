const OPENAI_API_URL = 'https://api.openai.com/v1/chat/completions';

const CONTENT_IDEA_SCHEMA = {
  name: 'content_idea_response',
  strict: true,
  schema: {
    type: 'object',
    additionalProperties: false,
    properties: {
      bestStarterIdea: { type: 'string' },
      ideas: {
        type: 'array',
        minItems: 10,
        maxItems: 10,
        items: { type: 'string' }
      }
    },
    required: ['bestStarterIdea', 'ideas']
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
  const niche = clean(body.niche);
  const platform = clean(body.platform);
  const contentGoal = clean(body.contentGoal);
  const audienceType = clean(body.audienceType);
  const keywords = clean(body.keywords);

  if (!niche || !platform || !contentGoal || !audienceType) {
    return res.status(400).json({
      error: 'niche, platform, contentGoal, and audienceType are required.'
    });
  }

  const systemPrompt = [
    'You are a creator strategy assistant for students, freshers, and early creators.',
    'Generate practical, audience-first content ideas that are platform-aware.',
    'Include a mix of list post, tutorial, opinion, story, and tip-based formats.',
    'Avoid vague ideas and keep execution practical.'
  ].join(' ');

  const userPrompt = [
    'Generate creator content ideas in structured JSON.',
    `Niche / Topic: ${niche}`,
    `Platform: ${platform}`,
    `Content Goal: ${contentGoal}`,
    `Audience Type: ${audienceType}`,
    `Optional Keywords: ${keywords || 'Not provided'}`,
    'Rules:',
    '- Return exactly 10 ideas.',
    '- Return one bestStarterIdea chosen from the idea list.',
    '- Make ideas practical, specific, and audience-first.',
    '- Ensure idea variety across list, tutorial, opinion, story, and tip-based content.'
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
          json_schema: CONTENT_IDEA_SCHEMA
        }
      })
    });

    const responseJson = await openAiResponse.json();
    if (!openAiResponse.ok) {
      return res.status(openAiResponse.status).json({
        error: responseJson?.error?.message || 'OpenAI request failed.'
      });
    }

    const parsed = parseModelJson(responseJson?.choices?.[0]?.message?.content || '');
    if (!parsed || !Array.isArray(parsed.ideas) || !parsed.bestStarterIdea) {
      return res.status(502).json({ error: 'Model response was not valid structured JSON.' });
    }

    const ideas = parsed.ideas.map((idea) => clean(idea)).filter(Boolean).slice(0, 10);
    const bestStarterIdea = clean(parsed.bestStarterIdea);

    if (ideas.length !== 10 || !bestStarterIdea) {
      return res.status(502).json({ error: 'Content idea response was incomplete.' });
    }

    return res.status(200).json({ bestStarterIdea, ideas });
  } catch (error) {
    return res.status(500).json({ error: 'Unable to generate content ideas right now. Please try again.' });
  }
}
