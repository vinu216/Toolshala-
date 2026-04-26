const OPENAI_API_URL = 'https://api.openai.com/v1/chat/completions';

const LEAVE_SCHEMA = {
  name: 'leave_application_response',
  strict: true,
  schema: {
    type: 'object',
    additionalProperties: false,
    properties: {
      subject: { type: 'string' },
      letter: { type: 'string' },
      closing: { type: 'string' }
    },
    required: ['subject', 'letter', 'closing']
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
  const recipientType = clean(body.recipientType);
  const reason = clean(body.reason);
  const startDate = clean(body.startDate);
  const endDate = clean(body.endDate);
  const additionalNote = clean(body.additionalNote);

  if (!name || !recipientType || !reason || !startDate || !endDate) {
    return res.status(400).json({
      error: 'name, recipientType, reason, startDate, and endDate are required.'
    });
  }

  if (Number.isNaN(new Date(startDate).getTime()) || Number.isNaN(new Date(endDate).getTime())) {
    return res.status(400).json({ error: 'startDate and endDate must be valid dates.' });
  }

  if (new Date(endDate).getTime() < new Date(startDate).getTime()) {
    return res.status(400).json({ error: 'endDate must be on or after startDate.' });
  }

  const systemPrompt = [
    'You are a professional HR and academic writing assistant.',
    'Write polished and concise leave applications in formal English.',
    'Adjust tone slightly based on recipientType: teacher, principal, or manager.',
    'Avoid repetition, keep practical and submission-ready.'
  ].join(' ');

  const userPrompt = [
    'Generate a leave application in structured JSON.',
    `Name: ${name}`,
    `Recipient Type: ${recipientType}`,
    `Reason for Leave: ${reason}`,
    `Start Date: ${startDate}`,
    `End Date: ${endDate}`,
    `Additional Note: ${additionalNote || 'Not provided'}`,
    'Rules:',
    '- Reflect dates and reason clearly.',
    '- Keep it formal and not overly long.',
    '- letter should include salutation and body only (without closing or signature).',
    '- closing should include a polite sign-off and sender name.'
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
        temperature: 0.5,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        response_format: {
          type: 'json_schema',
          json_schema: LEAVE_SCHEMA
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

    if (!parsed?.subject || !parsed?.letter || !parsed?.closing) {
      return res.status(502).json({
        error: 'Model response was not valid structured JSON.'
      });
    }

    return res.status(200).json({
      subject: clean(parsed.subject),
      letter: clean(parsed.letter),
      closing: clean(parsed.closing)
    });
  } catch (error) {
    return res.status(500).json({
      error: 'Unable to generate leave application at the moment. Please try again.'
    });
  }
}
