import { test, beforeEach, afterEach } from 'node:test';
import assert from 'node:assert/strict';
import handler from './generate-leave-application.js';

function createMockReqRes(options = {}) {
  const req = {
    method: options.method || 'POST',
    body: options.body || {}
  };

  const res = {
    statusCode: null,
    headers: {},
    jsonData: null,
    setHeader(name, value) {
      this.headers[name] = value;
      return this;
    },
    status(code) {
      this.statusCode = code;
      return this;
    },
    json(data) {
      this.jsonData = data;
      return this;
    }
  };

  return { req, res };
}

const originalEnv = { ...process.env };
const originalFetch = globalThis.fetch;

beforeEach(() => {
  process.env = { ...originalEnv, OPENAI_API_KEY: 'test-api-key' };
  delete process.env.OPENAI_MODEL;
});

afterEach(() => {
  process.env = { ...originalEnv };
  globalThis.fetch = originalFetch;
});

test('returns 405 if HTTP method is not POST', async () => {
  const { req, res } = createMockReqRes({ method: 'GET' });

  await handler(req, res);

  assert.equal(res.statusCode, 405);
  assert.equal(res.headers['Allow'], 'POST');
  assert.deepEqual(res.jsonData, { error: 'Method not allowed. Use POST.' });
});

test('returns 500 if OPENAI_API_KEY environment variable is missing', async () => {
  delete process.env.OPENAI_API_KEY;
  const { req, res } = createMockReqRes({
    body: {
      name: 'John Doe',
      recipientType: 'manager',
      reason: 'Sick leave',
      startDate: '2025-06-01',
      endDate: '2025-06-03'
    }
  });

  await handler(req, res);

  assert.equal(res.statusCode, 500);
  assert.deepEqual(res.jsonData, {
    error: 'OPENAI_API_KEY is missing on the server. Add it in your deployment environment variables.'
  });
});

test('returns 400 when required fields are missing or empty strings', async () => {
  const invalidBodies = [
    {},
    { recipientType: 'manager', reason: 'Sick', startDate: '2025-06-01', endDate: '2025-06-03' }, // missing name
    { name: 'John', reason: 'Sick', startDate: '2025-06-01', endDate: '2025-06-03' }, // missing recipientType
    { name: 'John', recipientType: 'manager', startDate: '2025-06-01', endDate: '2025-06-03' }, // missing reason
    { name: 'John', recipientType: 'manager', reason: 'Sick', endDate: '2025-06-03' }, // missing startDate
    { name: 'John', recipientType: 'manager', reason: 'Sick', startDate: '2025-06-01' }, // missing endDate
    { name: '   ', recipientType: 'manager', reason: 'Sick', startDate: '2025-06-01', endDate: '2025-06-03' } // whitespace name
  ];

  for (const body of invalidBodies) {
    const { req, res } = createMockReqRes({ body });
    await handler(req, res);

    assert.equal(res.statusCode, 400);
    assert.deepEqual(res.jsonData, {
      error: 'name, recipientType, reason, startDate, and endDate are required.'
    });
  }
});

test('returns 400 when dates are invalid strings', async () => {
  const { req, res } = createMockReqRes({
    body: {
      name: 'John Doe',
      recipientType: 'manager',
      reason: 'Medical appointment',
      startDate: 'invalid-date',
      endDate: '2025-06-03'
    }
  });

  await handler(req, res);

  assert.equal(res.statusCode, 400);
  assert.deepEqual(res.jsonData, {
    error: 'startDate and endDate must be valid dates.'
  });
});

test('returns 400 when endDate is before startDate', async () => {
  const { req, res } = createMockReqRes({
    body: {
      name: 'John Doe',
      recipientType: 'manager',
      reason: 'Personal work',
      startDate: '2025-06-10',
      endDate: '2025-06-05'
    }
  });

  await handler(req, res);

  assert.equal(res.statusCode, 400);
  assert.deepEqual(res.jsonData, {
    error: 'endDate must be on or after startDate.'
  });
});

test('returns OpenAI status and error message when OpenAI API call fails', async () => {
  globalThis.fetch = async () => ({
    ok: false,
    status: 401,
    json: async () => ({
      error: { message: 'Incorrect API key provided.' }
    })
  });

  const { req, res } = createMockReqRes({
    body: {
      name: 'John Doe',
      recipientType: 'principal',
      reason: 'Fever',
      startDate: '2025-06-01',
      endDate: '2025-06-02'
    }
  });

  await handler(req, res);

  assert.equal(res.statusCode, 401);
  assert.deepEqual(res.jsonData, {
    error: 'Incorrect API key provided.'
  });
});

test('returns default fallback error message when OpenAI API fails without error message', async () => {
  globalThis.fetch = async () => ({
    ok: false,
    status: 503,
    json: async () => ({})
  });

  const { req, res } = createMockReqRes({
    body: {
      name: 'John Doe',
      recipientType: 'teacher',
      reason: 'Fever',
      startDate: '2025-06-01',
      endDate: '2025-06-02'
    }
  });

  await handler(req, res);

  assert.equal(res.statusCode, 503);
  assert.deepEqual(res.jsonData, {
    error: 'OpenAI request failed.'
  });
});

test('returns 502 Bad Gateway when OpenAI returns unparseable JSON content', async () => {
  globalThis.fetch = async () => ({
    ok: true,
    status: 200,
    json: async () => ({
      choices: [
        {
          message: {
            content: 'Not a JSON string'
          }
        }
      ]
    })
  });

  const { req, res } = createMockReqRes({
    body: {
      name: 'John Doe',
      recipientType: 'manager',
      reason: 'Vacation',
      startDate: '2025-07-01',
      endDate: '2025-07-05'
    }
  });

  await handler(req, res);

  assert.equal(res.statusCode, 502);
  assert.deepEqual(res.jsonData, {
    error: 'Model response was not valid structured JSON.'
  });
});

test('returns 502 Bad Gateway when parsed JSON is missing required keys', async () => {
  globalThis.fetch = async () => ({
    ok: true,
    status: 200,
    json: async () => ({
      choices: [
        {
          message: {
            content: JSON.stringify({
              subject: 'Leave Application',
              letter: 'Dear Manager...'
              // missing closing
            })
          }
        }
      ]
    })
  });

  const { req, res } = createMockReqRes({
    body: {
      name: 'John Doe',
      recipientType: 'manager',
      reason: 'Vacation',
      startDate: '2025-07-01',
      endDate: '2025-07-05'
    }
  });

  await handler(req, res);

  assert.equal(res.statusCode, 502);
  assert.deepEqual(res.jsonData, {
    error: 'Model response was not valid structured JSON.'
  });
});

test('returns 500 when fetch throws an exception', async () => {
  globalThis.fetch = async () => {
    throw new Error('Network error');
  };

  const { req, res } = createMockReqRes({
    body: {
      name: 'John Doe',
      recipientType: 'manager',
      reason: 'Family emergency',
      startDate: '2025-06-01',
      endDate: '2025-06-02'
    }
  });

  await handler(req, res);

  assert.equal(res.statusCode, 500);
  assert.deepEqual(res.jsonData, {
    error: 'Unable to generate leave application at the moment. Please try again.'
  });
});

test('successfully generates leave application with custom model env var and additional note', async () => {
  process.env.OPENAI_MODEL = 'gpt-4o-mini';

  const mockOutput = {
    subject: '  Leave Application for Urgent Work  ',
    letter: '  Dear Sir, I am writing to request leave...  ',
    closing: '  Sincerely, John Doe  '
  };

  let fetchedUrl = '';
  let fetchedOptions = {};

  globalThis.fetch = async (url, options) => {
    fetchedUrl = url;
    fetchedOptions = options;
    return {
      ok: true,
      status: 200,
      json: async () => ({
        choices: [
          {
            message: {
              content: JSON.stringify(mockOutput)
            }
          }
        ]
      })
    };
  };

  const { req, res } = createMockReqRes({
    body: {
      name: 'John Doe',
      recipientType: 'manager',
      reason: 'Urgent family work',
      startDate: '2025-06-10',
      endDate: '2025-06-12',
      additionalNote: 'Will be available on phone'
    }
  });

  await handler(req, res);

  assert.equal(res.statusCode, 200);
  assert.deepEqual(res.jsonData, {
    subject: 'Leave Application for Urgent Work',
    letter: 'Dear Sir, I am writing to request leave...',
    closing: 'Sincerely, John Doe'
  });

  assert.equal(fetchedUrl, 'https://api.openai.com/v1/chat/completions');
  assert.equal(fetchedOptions.method, 'POST');
  assert.deepEqual(fetchedOptions.headers, {
    'Content-Type': 'application/json',
    Authorization: 'Bearer test-api-key'
  });

  const payload = JSON.parse(fetchedOptions.body);
  assert.equal(payload.model, 'gpt-4o-mini');
  assert.equal(payload.temperature, 0.5);
  assert.ok(payload.messages[1].content.includes('Name: John Doe'));
  assert.ok(payload.messages[1].content.includes('Recipient Type: manager'));
  assert.ok(payload.messages[1].content.includes('Reason for Leave: Urgent family work'));
  assert.ok(payload.messages[1].content.includes('Start Date: 2025-06-10'));
  assert.ok(payload.messages[1].content.includes('End Date: 2025-06-12'));
  assert.ok(payload.messages[1].content.includes('Additional Note: Will be available on phone'));
});

test('uses default model and default note when optional parameters are omitted', async () => {
  delete process.env.OPENAI_MODEL;

  let fetchedOptions = {};

  globalThis.fetch = async (url, options) => {
    fetchedOptions = options;
    return {
      ok: true,
      status: 200,
      json: async () => ({
        choices: [
          {
            message: {
              content: JSON.stringify({
                subject: 'Leave Request',
                letter: 'Respected Teacher...',
                closing: 'Yours obediently, Jane'
              })
            }
          }
        ]
      })
    };
  };

  const { req, res } = createMockReqRes({
    body: {
      name: 'Jane Smith',
      recipientType: 'teacher',
      reason: 'Sickness',
      startDate: '2025-08-01',
      endDate: '2025-08-01'
    }
  });

  await handler(req, res);

  assert.equal(res.statusCode, 200);
  const payload = JSON.parse(fetchedOptions.body);
  assert.equal(payload.model, 'gpt-4.1-mini');
  assert.ok(payload.messages[1].content.includes('Additional Note: Not provided'));
});
