const OPENAI_API_URL = 'https://api.openai.com/v1/chat/completions';

const PROFESSIONAL_EMAIL_SCHEMA = {
  name: 'professional_email_response',
  strict: true,
  schema: {
    type: 'object',
    additionalProperties: false,
    properties: {
      subjects: {
        type: 'array',
        minItems: 2,
        maxItems: 2,
        items: { type: 'string' }
      },
      email: { type: 'string' }
    },
    required: ['subjects', 'email']
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
  const emailPurpose = clean(body.emailPurpose);
  const recipientName = clean(body.recipientName);
  const senderName = clean(body.senderName);
  const roleContext = clean(body.roleContext);
  const mainMessage = clean(body.mainMessage);
  const tone = clean(body.tone);

  if (!emailPurpose || !recipientName || !senderName || !roleContext || !mainMessage || !tone) {
    return res.status(400).json({
      error: 'emailPurpose, recipientName, senderName, roleContext, mainMessage, and tone are required.'
    });
  }

  const systemPrompt = [
    'You are a professional email assistant for students and freshers.',
    'Write concise, polished emails for formal and polite professional communication.',
    'Output must include exactly 2 subject line options and one complete email draft.',
    'Keep email ready to edit and send.'
  ].join(' ');

  const userPrompt = [
    'Generate professional email output in structured JSON.',
    `Email Purpose: ${emailPurpose}`,
    `Recipient Name: ${recipientName}`,
    `Sender Name: ${senderName}`,
    `Role / Context: ${roleContext}`,
    `Main Message: ${mainMessage}`,
    `Tone: ${tone}`,
    'Rules:',
    '- Return exactly 2 concise subject suggestions.',
    '- Return one full email draft with greeting, opening, body, and closing.',
    '- Keep tone aligned with formal/polite/professional setting.',
    '- Keep concise and easy to scan/edit.'
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
          json_schema: PROFESSIONAL_EMAIL_SCHEMA
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
    if (!parsed || !Array.isArray(parsed.subjects) || parsed.subjects.length !== 2 || !parsed.email) {
      return res.status(502).json({ error: 'Model response was not valid structured JSON.' });
    }

    const subjects = parsed.subjects.map((item) => clean(item)).filter(Boolean).slice(0, 2);
    const email = clean(parsed.email);

    if (subjects.length !== 2 || !email) {
      return res.status(502).json({ error: 'Professional email response was incomplete.' });
    }

    return res.status(200).json({ subjects, email });
  } catch (error) {
    return res.status(500).json({
      error: 'Unable to generate professional email right now. Please try again.'
    });
  }
}
