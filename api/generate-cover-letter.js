const OPENAI_API_URL = 'https://api.openai.com/v1/chat/completions';

const COVER_LETTER_SCHEMA = {
  name: 'cover_letter_response',
  strict: true,
  schema: {
    type: 'object',
    additionalProperties: false,
    properties: {
      subject: { type: 'string' },
      letter: { type: 'string' }
    },
    required: ['subject', 'letter']
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
  const name = clean(body.name);
  const role = clean(body.role);
  const company = clean(body.company);
  const skills = clean(body.skills);
  const interestReason = clean(body.interestReason);
  const experienceLevel = clean(body.experienceLevel);
  const achievement = clean(body.achievement);

  if (!name || !role || !company || !skills || !interestReason || !experienceLevel) {
    return res.status(400).json({
      error: 'name, role, company, skills, interestReason, and experienceLevel are required.'
    });
  }

  const systemPrompt = [
    'You are a cover letter assistant for internship and entry-level applications.',
    'Write polished, clear, beginner-friendly cover letters in formal English.',
    'Avoid fake experience, inflated claims, or unrealistic achievements.',
    'Keep it practical and job-application ready.'
  ].join(' ');

  const userPrompt = [
    'Generate a structured JSON response for a cover letter.',
    `Name: ${name}`,
    `Role Applying For: ${role}`,
    `Company Name: ${company}`,
    `Skills: ${skills}`,
    `Why Interested: ${interestReason}`,
    `Experience Level: ${experienceLevel}`,
    `Optional Achievement / Project: ${achievement || 'Not provided'}`,
    'Rules:',
    '- Subject should be professional and concise.',
    '- Letter should feel personalized to company and role.',
    '- Mention skills and interest naturally.',
    '- Keep suitable for internships/freshers and avoid exaggerated claims.',
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
          json_schema: COVER_LETTER_SCHEMA
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

    if (!parsed?.subject || !parsed?.letter) {
      return res.status(502).json({ error: 'Model response was not valid structured JSON.' });
    }

    return res.status(200).json({
      subject: clean(parsed.subject),
      letter: clean(parsed.letter)
    });
  } catch (error) {
    return res.status(500).json({
      error: 'Unable to generate cover letter at the moment. Please try again.'
    });
  }
}
