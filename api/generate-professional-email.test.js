import { test, beforeEach, afterEach } from 'node:test';
import assert from 'node:assert/strict';
import handler from './generate-professional-email.js';

function createMockRes() {
  const res = {
    statusCode: 200,
    headers: {},
    body: null,
    setHeader(key, value) {
      res.headers[key] = value;
      return res;
    },
    status(code) {
      res.statusCode = code;
      return res;
    },
    json(data) {
      res.body = data;
      return res;
    }
  };
  return res;
}

const originalEnv = { ...process.env };
const originalFetch = globalThis.fetch;

beforeEach(() => {
  process.env.OPENAI_API_KEY = 'test-api-key';
  delete process.env.OPENAI_MODEL;
});

afterEach(() => {
  process.env = { ...originalEnv };
  globalThis.fetch = originalFetch;
});

test('returns 405 if method is not POST', async () => {
  const req = { method: 'GET' };
  const res = createMockRes();

  await handler(req, res);

  assert.equal(res.statusCode, 405);
  assert.equal(res.headers['Allow'], 'POST');
  assert.deepEqual(res.body, { error: 'Method not allowed. Use POST.' });
});

test('returns 500 if OPENAI_API_KEY is missing', async () => {
  delete process.env.OPENAI_API_KEY;
  const req = { method: 'POST', body: {} };
  const res = createMockRes();

  await handler(req, res);

  assert.equal(res.statusCode, 500);
  assert.deepEqual(res.body, {
    error: 'OPENAI_API_KEY is missing on the server. Add it in your deployment environment variables.'
  });
});

test('returns 400 if required fields are missing', async () => {
  const req = {
    method: 'POST',
    body: {
      emailPurpose: 'Job Application',
      recipientName: 'HR Manager'
      // missing senderName, roleContext, mainMessage, tone
    }
  };
  const res = createMockRes();

  await handler(req, res);

  assert.equal(res.statusCode, 400);
  assert.deepEqual(res.body, {
    error: 'emailPurpose, recipientName, senderName, roleContext, mainMessage, and tone are required.'
  });
});

test('returns 200 with subjects and email when OpenAI API succeeds', async () => {
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
              content: JSON.stringify({
                subjects: ['Subject 1', 'Subject 2'],
                email: 'Dear HR,\n\nI am writing to apply...\n\nSincerely,\nJohn'
              })
            }
          }
        ]
      })
    };
  };

  const req = {
    method: 'POST',
    body: {
      emailPurpose: 'Job Application',
      recipientName: 'Hiring Manager',
      senderName: 'Jane Doe',
      roleContext: 'Software Engineer Applicant',
      mainMessage: 'Applying for the position',
      tone: 'Formal'
    }
  };
  const res = createMockRes();

  await handler(req, res);

  assert.equal(res.statusCode, 200);
  assert.deepEqual(res.body, {
    subjects: ['Subject 1', 'Subject 2'],
    email: 'Dear HR,\n\nI am writing to apply...\n\nSincerely,\nJohn'
  });
  assert.equal(fetchedUrl, 'https://api.openai.com/v1/chat/completions');
  assert.equal(fetchedOptions.headers.Authorization, 'Bearer test-api-key');

  const payload = JSON.parse(fetchedOptions.body);
  assert.equal(payload.model, 'gpt-4.1-mini');
});

test('uses custom OPENAI_MODEL environment variable when provided', async () => {
  process.env.OPENAI_MODEL = 'gpt-4o';
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
                subjects: ['Option A', 'Option B'],
                email: 'Hello Sir/Madam...'
              })
            }
          }
        ]
      })
    };
  };

  const req = {
    method: 'POST',
    body: {
      emailPurpose: 'Follow-up',
      recipientName: 'Manager',
      senderName: 'Alice',
      roleContext: 'Intern',
      mainMessage: 'Following up on interview',
      tone: 'Polite'
    }
  };
  const res = createMockRes();

  await handler(req, res);

  assert.equal(res.statusCode, 200);
  const payload = JSON.parse(fetchedOptions.body);
  assert.equal(payload.model, 'gpt-4o');
});

test('returns error status and message when OpenAI API returns non-OK status', async () => {
  globalThis.fetch = async () => ({
    ok: false,
    status: 401,
    json: async () => ({
      error: { message: 'Invalid API Key provided.' }
    })
  });

  const req = {
    method: 'POST',
    body: {
      emailPurpose: 'Inquiry',
      recipientName: 'Support',
      senderName: 'Bob',
      roleContext: 'User',
      mainMessage: 'Need help',
      tone: 'Polite'
    }
  };
  const res = createMockRes();

  await handler(req, res);

  assert.equal(res.statusCode, 401);
  assert.deepEqual(res.body, { error: 'Invalid API Key provided.' });
});

test('returns 502 if OpenAI response message content is invalid JSON or wrong schema', async () => {
  globalThis.fetch = async () => ({
    ok: true,
    status: 200,
    json: async () => ({
      choices: [
        {
          message: {
            content: 'Not valid JSON'
          }
        }
      ]
    })
  });

  const req = {
    method: 'POST',
    body: {
      emailPurpose: 'Leave Request',
      recipientName: 'Boss',
      senderName: 'Charlie',
      roleContext: 'Employee',
      mainMessage: 'Taking leave tomorrow',
      tone: 'Formal'
    }
  };
  const res = createMockRes();

  await handler(req, res);

  assert.equal(res.statusCode, 502);
  assert.deepEqual(res.body, { error: 'Model response was not valid structured JSON.' });
});

test('returns 502 if subjects array does not have exactly 2 items after cleaning', async () => {
  globalThis.fetch = async () => ({
    ok: true,
    status: 200,
    json: async () => ({
      choices: [
        {
          message: {
            content: JSON.stringify({
              subjects: ['    ', 'Subject 2'],
              email: 'Valid Email'
            })
          }
        }
      ]
    })
  });

  const req = {
    method: 'POST',
    body: {
      emailPurpose: 'Resignation',
      recipientName: 'HR',
      senderName: 'David',
      roleContext: 'Senior Dev',
      mainMessage: 'Resigning from post',
      tone: 'Formal'
    }
  };
  const res = createMockRes();

  await handler(req, res);

  assert.equal(res.statusCode, 502);
  assert.deepEqual(res.body, { error: 'Professional email response was incomplete.' });
});

test('returns 500 when fetch throws an error', async () => {
  globalThis.fetch = async () => {
    throw new Error('Network timeout');
  };

  const req = {
    method: 'POST',
    body: {
      emailPurpose: 'Network test',
      recipientName: 'Admin',
      senderName: 'Eve',
      roleContext: 'Tester',
      mainMessage: 'Test network failure',
      tone: 'Direct'
    }
  };
  const res = createMockRes();

  await handler(req, res);

  assert.equal(res.statusCode, 500);
  assert.deepEqual(res.body, {
    error: 'Unable to generate professional email right now. Please try again.'
  });
});
