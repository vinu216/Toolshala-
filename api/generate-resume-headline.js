const OPENAI_API_URL = 'https://api.openai.com/v1/chat/completions';

const HEADLINE_SCHEMA = {
  name: 'resume_headline_response',
  strict: true,
  schema: {
    type: 'object',
    additionalProperties: false,
    properties: {
      headlines: {
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
      }
    },
    required: ['headlines']
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

const toHeadlineCardResult = (payload = {}) => {
  const safeItems = Array.isArray(payload.headlines) ? payload.headlines : [];
  const items = safeItems
    .map((entry, index) => {
      const text = clean(entry?.text);
      if (!text) {
        return null;
      }
      return {
        label: `Headline ${index + 1}`,
        text,
        note: clean(entry?.tone) ? `Tone: ${clean(entry.tone)}` : 'Tone: Professional',
        copyText: text
      };
    })
    .filter(Boolean)
    .slice(0, 5);

  return {
    type: 'cards',
    items
  };
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
  const name = clean(body.name);
  const role = clean(body.role);
  const experience = clean(body.experience);
  const skills = clean(body.skills);
  const strength = clean(body.strength);

  if (!name || !role || !experience || !skills) {
    return res.status(400).json({
      error: 'name, role, experience, and skills are required.'
    });
  }

  const systemPrompt = [
    'You are a resume writing assistant for students and freshers.',
    'Generate concise and professional resume headline options suitable for internships and entry-level hiring.',
    'Do not invent achievements, seniority, or fake years of experience.',
    'Keep headlines role-relevant, truthful, and ATS-friendly.'
  ].join(' ');

  const userPrompt = [
    'Create 3 to 5 resume headline options in JSON for this candidate:',
    `Full Name: ${name}`,
    `Target Role: ${role}`,
    `Experience Level: ${experience}`,
    `Key Skills: ${skills}`,
    `Strength / Focus Area: ${strength || 'Not provided'}`,
    'Rules:',
    '- Each headline should be concise (about 8-16 words).',
    '- Suitable for internship, fresher, and entry-level profiles.',
    '- Avoid exaggerated claims or fake experience.',
    '- Return JSON that exactly matches the provided schema.'
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
          json_schema: HEADLINE_SCHEMA
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
    if (!parsed || !Array.isArray(parsed.headlines)) {
      return res.status(502).json({
        error: 'Model response was not valid structured JSON.'
      });
    }

    const result = toHeadlineCardResult(parsed);
    if (!result.items.length) {
      return res.status(502).json({
        error: 'No usable headlines were generated.'
      });
    }

    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({
      error: 'Unable to generate headlines at the moment. Please try again.'
    });
  }
}
