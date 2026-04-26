const OPENAI_API_URL = 'https://api.openai.com/v1/chat/completions';

const SCHOLARSHIP_SCHEMA = {
  name: 'scholarship_recommendation_response',
  strict: true,
  schema: {
    type: 'object',
    additionalProperties: false,
    properties: {
      recommendations: {
        type: 'array',
        minItems: 3,
        maxItems: 5,
        items: {
          type: 'object',
          additionalProperties: false,
          properties: {
            scholarshipType: { type: 'string' },
            suitableFor: { type: 'string' },
            whatToPrepare: {
              type: 'array',
              minItems: 2,
              maxItems: 6,
              items: { type: 'string' }
            },
            nextStep: { type: 'string' }
          },
          required: ['scholarshipType', 'suitableFor', 'whatToPrepare', 'nextStep']
        }
      },
      verificationReminder: { type: 'string' }
    },
    required: ['recommendations', 'verificationReminder']
  }
};

const clean = (value = '') => String(value).trim();
const parseModelJson = (rawContent = '') => {
  try { return JSON.parse(rawContent); } catch { return null; }
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed. Use POST.' });
  }

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'OPENAI_API_KEY is missing on the server. Add it in your deployment environment variables.' });
  }

  const body = req.body || {};
  const currentEducationLevel = clean(body.currentEducationLevel);
  const stateOrRegion = clean(body.stateOrRegion);
  const category = clean(body.category);
  const academicPerformance = clean(body.academicPerformance);
  const needType = clean(body.needType);
  const fieldOfStudy = clean(body.fieldOfStudy);

  if (!currentEducationLevel || !stateOrRegion || !academicPerformance || !needType) {
    return res.status(400).json({
      error: 'currentEducationLevel, stateOrRegion, academicPerformance, and needType are required.'
    });
  }

  const systemPrompt = [
    'You are a scholarship guidance assistant for students in India.',
    'Recommend scholarship categories/types, not guaranteed scholarship awards.',
    'Keep guidance practical, non-misleading, and suitable for student planning.',
    'Always include a reminder to verify eligibility and deadlines from official sources.'
  ].join(' ');

  const userPrompt = [
    'Generate structured scholarship recommendations in JSON.',
    `Current Education Level: ${currentEducationLevel}`,
    `State / Region: ${stateOrRegion}`,
    `Category: ${category || 'Not provided'}`,
    `Academic Performance: ${academicPerformance}`,
    `Need Type: ${needType}`,
    `Field of Study: ${fieldOfStudy || 'Not provided'}`,
    'Rules:',
    '- Return 3 to 5 scholarship types/categories.',
    '- Do not claim guaranteed outcomes.',
    '- For each recommendation include scholarshipType, suitableFor, whatToPrepare, and nextStep.',
    '- Keep output practical for students and freshers.',
    '- Include verificationReminder in output.'
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
        temperature: 0.55,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        response_format: {
          type: 'json_schema',
          json_schema: SCHOLARSHIP_SCHEMA
        }
      })
    });

    const responseJson = await openAiResponse.json();
    if (!openAiResponse.ok) {
      return res.status(openAiResponse.status).json({ error: responseJson?.error?.message || 'OpenAI request failed.' });
    }

    const parsed = parseModelJson(responseJson?.choices?.[0]?.message?.content || '');
    if (!parsed || !Array.isArray(parsed.recommendations)) {
      return res.status(502).json({ error: 'Model response was not valid structured JSON.' });
    }

    const recommendations = parsed.recommendations
      .map((entry) => ({
        scholarshipType: clean(entry?.scholarshipType),
        suitableFor: clean(entry?.suitableFor),
        whatToPrepare: Array.isArray(entry?.whatToPrepare)
          ? entry.whatToPrepare.map((item) => clean(item)).filter(Boolean).slice(0, 6)
          : [],
        nextStep: clean(entry?.nextStep)
      }))
      .filter((entry) => entry.scholarshipType && entry.suitableFor && entry.whatToPrepare.length && entry.nextStep)
      .slice(0, 5);

    if (recommendations.length < 3) {
      return res.status(502).json({ error: 'Scholarship recommendation response was incomplete.' });
    }

    return res.status(200).json({
      recommendations,
      verificationReminder: clean(parsed.verificationReminder) || 'Always verify final eligibility and deadlines from the official scholarship source.'
    });
  } catch (error) {
    return res.status(500).json({ error: 'Unable to recommend scholarships right now. Please try again.' });
  }
}
