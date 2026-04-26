const OPENAI_API_URL = 'https://api.openai.com/v1/chat/completions';

const CAREER_PATH_SCHEMA = {
  name: 'career_path_response',
  strict: true,
  schema: {
    type: 'object',
    additionalProperties: false,
    properties: {
      bestMatch: {
        type: 'object',
        additionalProperties: false,
        properties: {
          careerTitle: { type: 'string' },
          whyItFits: { type: 'string' },
          skillsToLearn: {
            type: 'array',
            minItems: 2,
            maxItems: 5,
            items: { type: 'string' }
          },
          nextStep: { type: 'string' }
        },
        required: ['careerTitle', 'whyItFits', 'skillsToLearn', 'nextStep']
      },
      paths: {
        type: 'array',
        minItems: 3,
        maxItems: 5,
        items: {
          type: 'object',
          additionalProperties: false,
          properties: {
            careerTitle: { type: 'string' },
            whyItFits: { type: 'string' },
            skillsToLearn: {
              type: 'array',
              minItems: 2,
              maxItems: 5,
              items: { type: 'string' }
            },
            nextStep: { type: 'string' }
          },
          required: ['careerTitle', 'whyItFits', 'skillsToLearn', 'nextStep']
        }
      }
    },
    required: ['bestMatch', 'paths']
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

const normalizePath = (entry = {}) => ({
  careerTitle: clean(entry.careerTitle),
  whyItFits: clean(entry.whyItFits),
  skillsToLearn: Array.isArray(entry.skillsToLearn)
    ? entry.skillsToLearn.map((skill) => clean(skill)).filter(Boolean).slice(0, 5)
    : [],
  nextStep: clean(entry.nextStep)
});

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
  const stage = clean(body.stage);
  const interests = clean(body.interests);
  const workStyle = clean(body.workStyle);
  const strengths = clean(body.strengths);
  const codingPreference = clean(body.codingPreference || 'not specified');

  if (!stage || !interests || !workStyle || !strengths) {
    return res.status(400).json({
      error: 'stage, interests, workStyle, and strengths are required.'
    });
  }

  const systemPrompt = [
    'You are a practical career guidance assistant for students and freshers.',
    'Recommend realistic career paths based on profile signals.',
    'Keep recommendations specific, practical, and entry-level friendly.',
    'Avoid unrealistic career jumps, vague suggestions, or exaggerated claims.'
  ].join(' ');

  const userPrompt = [
    'Generate structured career path recommendations in JSON.',
    `Current Stage: ${stage}`,
    `Interests: ${interests}`,
    `Preferred Work Style: ${workStyle}`,
    `Skills / Strengths: ${strengths}`,
    `Coding Preference: ${codingPreference}`,
    'Rules:',
    '- Return 3 to 5 career paths in total.',
    '- bestMatch must be one of the listed path options (same careerTitle).',
    '- For each path provide careerTitle, whyItFits, skillsToLearn, and nextStep.',
    '- Keep recommendations practical for students/freshers.',
    '- Return only JSON matching the schema.'
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
        temperature: 0.6,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        response_format: {
          type: 'json_schema',
          json_schema: CAREER_PATH_SCHEMA
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

    if (!parsed?.bestMatch || !Array.isArray(parsed?.paths)) {
      return res.status(502).json({ error: 'Model response was not valid structured JSON.' });
    }

    const bestMatch = normalizePath(parsed.bestMatch);
    const paths = parsed.paths.map((path) => normalizePath(path))
      .filter((path) => path.careerTitle && path.whyItFits && path.skillsToLearn.length && path.nextStep)
      .slice(0, 5);

    if (paths.length < 3 || !bestMatch.careerTitle) {
      return res.status(502).json({ error: 'Career path response was incomplete.' });
    }

    const hasBestInPaths = paths.some((path) => path.careerTitle.toLowerCase() === bestMatch.careerTitle.toLowerCase());
    if (!hasBestInPaths) {
      paths[0] = { ...bestMatch };
    }

    return res.status(200).json({
      bestMatch,
      paths
    });
  } catch (error) {
    return res.status(500).json({
      error: 'Unable to generate career suggestions right now. Please try again.'
    });
  }
}
