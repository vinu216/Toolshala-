const OPENAI_API_URL = 'https://api.openai.com/v1/chat/completions';

const LINKEDIN_BIO_SCHEMA = {
  name: 'linkedin_bio_response',
  strict: true,
  schema: {
    type: 'object',
    additionalProperties: false,
    properties: {
      bios: {
        type: 'array',
        minItems: 2,
        maxItems: 4,
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
    required: ['bios']
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
  const status = clean(body.status);
  const domain = clean(body.domain);
  const skills = clean(body.skills);
  const careerGoal = clean(body.careerGoal);
  const tone = clean(body.tone) || 'professional';

  if (!name || !status || !domain || !skills || !careerGoal) {
    return res.status(400).json({
      error: 'name, status, domain, skills, and careerGoal are required.'
    });
  }

  const systemPrompt = [
    'You are a LinkedIn profile writing assistant for students, freshers, freelancers, and creators.',
    'Write concise but real-sounding LinkedIn About section options.',
    'Keep the tone professional but human, and avoid fake achievements or exaggerated claims.',
    'Make outputs practical and profile-ready.'
  ].join(' ');

  const userPrompt = [
    'Generate 2 to 4 LinkedIn bio versions in strict JSON format.',
    `Name: ${name}`,
    `Current Status: ${status}`,
    `Field / Domain: ${domain}`,
    `Skills: ${skills}`,
    `Career Goal: ${careerGoal}`,
    `Personality Tone: ${tone}`,
    'Rules:',
    '- Each bio should be concise enough for LinkedIn About section usage.',
    '- Keep language natural and professional.',
    '- Mention skills and goals in a believable way.',
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
        temperature: 0.65,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        response_format: {
          type: 'json_schema',
          json_schema: LINKEDIN_BIO_SCHEMA
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

    if (!Array.isArray(parsed?.bios) || parsed.bios.length < 2 || parsed.bios.length > 4) {
      return res.status(502).json({ error: 'Model response was not valid structured JSON.' });
    }

    const bios = parsed.bios
      .map((entry) => ({
        text: clean(entry?.text),
        tone: clean(entry?.tone) || tone
      }))
      .filter((entry) => entry.text)
      .slice(0, 4);

    if (bios.length < 2) {
      return res.status(502).json({ error: 'LinkedIn bio response was incomplete.' });
    }

    return res.status(200).json({ bios });
  } catch (error) {
    return res.status(500).json({
      error: 'Unable to generate LinkedIn bio right now. Please try again.'
    });
  }
}
