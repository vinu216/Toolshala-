const OPENAI_API_URL = 'https://api.openai.com/v1/chat/completions';

const STUDY_TIMETABLE_SCHEMA = {
  name: 'study_timetable_response',
  strict: true,
  schema: {
    type: 'object',
    additionalProperties: false,
    properties: {
      planTitle: { type: 'string' },
      weeklyPlan: {
        type: 'array',
        minItems: 7,
        maxItems: 7,
        items: {
          type: 'object',
          additionalProperties: false,
          properties: {
            day: { type: 'string' },
            slots: {
              type: 'array',
              minItems: 3,
              maxItems: 8,
              items: { type: 'string' }
            }
          },
          required: ['day', 'slots']
        }
      },
      tips: {
        type: 'array',
        minItems: 2,
        maxItems: 4,
        items: { type: 'string' }
      }
    },
    required: ['planTitle', 'weeklyPlan', 'tips']
  }
};

const clean = (value = '') => String(value).trim();
const normalizeCommaList = (value = '') =>
  String(value)
    .split(',')
    .map((part) => part.trim())
    .filter(Boolean);

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
  const level = clean(body.level);
  const subjects = normalizeCommaList(body.subjects);
  const hoursPerDay = Number(body.hoursPerDay);
  const studyTime = clean(body.studyTime);
  const examGoal = clean(body.examGoal);
  const weakSubjects = normalizeCommaList(body.weakSubjects);

  if (!level || !subjects.length || !hoursPerDay || !studyTime || !examGoal) {
    return res.status(400).json({
      error: 'level, subjects, hoursPerDay, studyTime, and examGoal are required.'
    });
  }

  if (Number.isNaN(hoursPerDay) || hoursPerDay < 1 || hoursPerDay > 12) {
    return res.status(400).json({
      error: 'hoursPerDay must be a number between 1 and 12.'
    });
  }

  const systemPrompt = [
    'You are a student study planner assistant.',
    'Create practical weekly study timetables that are realistic and easy to follow.',
    'Prioritize weak subjects slightly more, include revision, practice, and breaks.',
    'Do not overcomplicate the schedule.'
  ].join(' ');

  const userPrompt = [
    'Generate a weekly study timetable in strict JSON format.',
    `Class / Level: ${level}`,
    `Subjects: ${subjects.join(', ')}`,
    `Daily Study Hours: ${hoursPerDay}`,
    `Preferred Study Time: ${studyTime}`,
    `Exam Goal: ${examGoal}`,
    `Weak Subjects: ${weakSubjects.length ? weakSubjects.join(', ') : 'Not provided'}`,
    'Rules:',
    '- Return exactly 7 days in weeklyPlan (Monday to Sunday).',
    '- Each day should include clear slot lines with study, break, revision, and practice.',
    '- Keep plan simple and student-friendly.',
    '- tips must be short, practical and motivating.'
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
          json_schema: STUDY_TIMETABLE_SCHEMA
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

    if (!parsed?.planTitle || !Array.isArray(parsed?.weeklyPlan) || !Array.isArray(parsed?.tips)) {
      return res.status(502).json({ error: 'Model response was not valid structured JSON.' });
    }

    const weeklyPlan = parsed.weeklyPlan
      .map((entry) => ({
        day: clean(entry?.day),
        slots: Array.isArray(entry?.slots)
          ? entry.slots.map((slot) => clean(slot)).filter(Boolean).slice(0, 8)
          : []
      }))
      .filter((entry) => entry.day && entry.slots.length >= 3)
      .slice(0, 7);

    const tips = parsed.tips.map((tip) => clean(tip)).filter(Boolean).slice(0, 4);

    if (weeklyPlan.length !== 7 || tips.length < 2) {
      return res.status(502).json({ error: 'Timetable response was incomplete.' });
    }

    return res.status(200).json({
      planTitle: clean(parsed.planTitle),
      weeklyPlan,
      tips
    });
  } catch (error) {
    return res.status(500).json({
      error: 'Unable to generate study timetable right now. Please try again.'
    });
  }
}
