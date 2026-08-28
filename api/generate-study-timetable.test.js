import { test, describe, beforeEach, afterEach } from 'node:test';
import assert from 'node:assert/strict';
import handler from './generate-study-timetable.js';

function createMockReqRes(options = {}) {
  const req = {
    method: options.method || 'POST',
    body: options.body || {}
  };
  const res = {
    statusCode: 200,
    headers: {},
    responseData: null,
    setHeader(name, value) {
      this.headers[name] = value;
    },
    status(code) {
      this.statusCode = code;
      return this;
    },
    json(data) {
      this.responseData = data;
      return this;
    }
  };
  return { req, res };
}

describe('generate-study-timetable API handler', () => {
  const originalFetch = globalThis.fetch;
  const originalEnvApiKey = process.env.OPENAI_API_KEY;

  beforeEach(() => {
    process.env.OPENAI_API_KEY = 'mock-api-key';
  });

  afterEach(() => {
    globalThis.fetch = originalFetch;
    process.env.OPENAI_API_KEY = originalEnvApiKey;
  });

  const validRequestBody = {
    level: '10th Grade',
    subjects: 'Math, Science, History',
    hoursPerDay: 4,
    studyTime: 'Evening',
    examGoal: 'Score above 90%',
    weakSubjects: 'Math'
  };

  const sampleValidOpenAiContent = JSON.stringify({
    planTitle: '10th Grade High Score Strategy',
    weeklyPlan: [
      { day: 'Monday', slots: ['Math - 1h', 'Break - 15m', 'Science - 1h'] },
      { day: 'Tuesday', slots: ['History - 1h', 'Break - 15m', 'Math - 1h'] },
      { day: 'Wednesday', slots: ['Science - 1h', 'Break - 15m', 'Revision - 1h'] },
      { day: 'Thursday', slots: ['Math - 1h', 'Break - 15m', 'Practice - 1h'] },
      { day: 'Friday', slots: ['History - 1h', 'Break - 15m', 'Science - 1h'] },
      { day: 'Saturday', slots: ['Math - 1h', 'Break - 15m', 'Practice - 1h'] },
      { day: 'Sunday', slots: ['Revision - 1h', 'Break - 15m', 'Mock Test - 1h'] }
    ],
    tips: [
      'Take regular 15-minute breaks.',
      'Focus more time on Math practice.'
    ]
  });

  test('Error Path: returns 500 when fetch throws/rejects an error', async () => {
    globalThis.fetch = async () => {
      throw new Error('Network failure or API connection error');
    };

    const { req, res } = createMockReqRes({ body: validRequestBody });
    await handler(req, res);

    assert.equal(res.statusCode, 500);
    assert.deepEqual(res.responseData, {
      error: 'Unable to generate study timetable right now. Please try again.'
    });
  });

  test('Happy Path: returns 200 and formatted study timetable when OpenAI response is valid', async () => {
    globalThis.fetch = async () => {
      return {
        ok: true,
        status: 200,
        json: async () => ({
          choices: [
            {
              message: {
                content: sampleValidOpenAiContent
              }
            }
          ]
        })
      };
    };

    const { req, res } = createMockReqRes({ body: validRequestBody });
    await handler(req, res);

    assert.equal(res.statusCode, 200);
    assert.equal(res.responseData.planTitle, '10th Grade High Score Strategy');
    assert.equal(res.responseData.weeklyPlan.length, 7);
    assert.equal(res.responseData.tips.length, 2);
  });

  test('Method validation: returns 405 if HTTP method is not POST', async () => {
    const { req, res } = createMockReqRes({ method: 'GET' });
    await handler(req, res);

    assert.equal(res.statusCode, 405);
    assert.equal(res.headers['Allow'], 'POST');
    assert.deepEqual(res.responseData, { error: 'Method not allowed. Use POST.' });
  });

  test('Environment validation: returns 500 if OPENAI_API_KEY is missing', async () => {
    delete process.env.OPENAI_API_KEY;

    const { req, res } = createMockReqRes({ body: validRequestBody });
    await handler(req, res);

    assert.equal(res.statusCode, 500);
    assert.deepEqual(res.responseData, {
      error: 'OPENAI_API_KEY is missing on the server. Add it in your deployment environment variables.'
    });
  });

  test('Input validation: returns 400 when required fields are missing', async () => {
    const { req, res } = createMockReqRes({
      body: { level: '10th Grade' } // missing subjects, hoursPerDay, etc.
    });
    await handler(req, res);

    assert.equal(res.statusCode, 400);
    assert.deepEqual(res.responseData, {
      error: 'level, subjects, hoursPerDay, studyTime, and examGoal are required.'
    });
  });

  test('Input validation: returns 400 when hoursPerDay is out of range', async () => {
    const { req, res } = createMockReqRes({
      body: { ...validRequestBody, hoursPerDay: 15 }
    });
    await handler(req, res);

    assert.equal(res.statusCode, 400);
    assert.deepEqual(res.responseData, {
      error: 'hoursPerDay must be a number between 1 and 12.'
    });
  });

  test('OpenAI API Error: returns OpenAI status code and error message when response is not ok', async () => {
    globalThis.fetch = async () => {
      return {
        ok: false,
        status: 429,
        json: async () => ({
          error: { message: 'Rate limit exceeded' }
        })
      };
    };

    const { req, res } = createMockReqRes({ body: validRequestBody });
    await handler(req, res);

    assert.equal(res.statusCode, 429);
    assert.deepEqual(res.responseData, {
      error: 'Rate limit exceeded'
    });
  });

  test('Model Response Error: returns 502 when OpenAI content is not valid JSON schema structure', async () => {
    globalThis.fetch = async () => {
      return {
        ok: true,
        status: 200,
        json: async () => ({
          choices: [{ message: { content: 'not-json-content' } }]
        })
      };
    };

    const { req, res } = createMockReqRes({ body: validRequestBody });
    await handler(req, res);

    assert.equal(res.statusCode, 502);
    assert.deepEqual(res.responseData, {
      error: 'Model response was not valid structured JSON.'
    });
  });

  test('Model Response Error: returns 502 when weeklyPlan or tips are incomplete', async () => {
    const incompleteContent = JSON.stringify({
      planTitle: 'Incomplete Plan',
      weeklyPlan: [
        { day: 'Monday', slots: ['Math - 1h', 'Break - 15m', 'Science - 1h'] }
      ], // Only 1 day instead of 7
      tips: ['One tip only'] // Less than 2 tips
    });

    globalThis.fetch = async () => {
      return {
        ok: true,
        status: 200,
        json: async () => ({
          choices: [{ message: { content: incompleteContent } }]
        })
      };
    };

    const { req, res } = createMockReqRes({ body: validRequestBody });
    await handler(req, res);

    assert.equal(res.statusCode, 502);
    assert.deepEqual(res.responseData, {
      error: 'Timetable response was incomplete.'
    });
  });
});
