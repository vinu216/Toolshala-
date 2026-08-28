import { test, describe, beforeEach, afterEach } from 'node:test';
import assert from 'node:assert/strict';
import handler from '../../api/generate-professional-email.js';

function mockResponse() {
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
    json(payload) {
      res.body = payload;
      return res;
    }
  };
  return res;
}

const validRequestBody = {
  emailPurpose: 'Job Application Follow Up',
  recipientName: 'Hiring Manager',
  senderName: 'John Doe',
  roleContext: 'Software Engineer Applicant',
  mainMessage: 'Inquiring about the status of my application submitted last week.',
  tone: 'Professional and Polite'
};

describe('api/generate-professional-email handler', () => {
  const originalEnv = process.env;
  const originalFetch = globalThis.fetch;

  beforeEach(() => {
    process.env = { ...originalEnv, OPENAI_API_KEY: 'test-api-key' };
  });

  afterEach(() => {
    process.env = originalEnv;
    globalThis.fetch = originalFetch;
  });

  test('returns 405 if method is not POST', async () => {
    const req = { method: 'GET' };
    const res = mockResponse();

    await handler(req, res);

    assert.equal(res.statusCode, 405);
    assert.equal(res.headers['Allow'], 'POST');
    assert.deepEqual(res.body, { error: 'Method not allowed. Use POST.' });
  });

  test('returns 500 if OPENAI_API_KEY is missing', async () => {
    delete process.env.OPENAI_API_KEY;
    const req = { method: 'POST', body: validRequestBody };
    const res = mockResponse();

    await handler(req, res);

    assert.equal(res.statusCode, 500);
    assert.deepEqual(res.body, {
      error: 'OPENAI_API_KEY is missing on the server. Add it in your deployment environment variables.'
    });
  });

  test('returns 400 if required body parameters are missing', async () => {
    const req = {
      method: 'POST',
      body: { emailPurpose: 'Follow up' } // missing recipientName, senderName, etc.
    };
    const res = mockResponse();

    await handler(req, res);

    assert.equal(res.statusCode, 400);
    assert.deepEqual(res.body, {
      error: 'emailPurpose, recipientName, senderName, roleContext, mainMessage, and tone are required.'
    });
  });

  test('returns 500 on fetch / network error in try-catch block', async () => {
    globalThis.fetch = async () => {
      throw new Error('Network failure');
    };

    const req = { method: 'POST', body: validRequestBody };
    const res = mockResponse();

    await handler(req, res);

    assert.equal(res.statusCode, 500);
    assert.deepEqual(res.body, {
      error: 'Unable to generate professional email right now. Please try again.'
    });
  });

  test('returns OpenAI status and error message when OpenAI API returns non-ok response', async () => {
    globalThis.fetch = async () => ({
      ok: false,
      status: 401,
      json: async () => ({ error: { message: 'Invalid API key provided' } })
    });

    const req = { method: 'POST', body: validRequestBody };
    const res = mockResponse();

    await handler(req, res);

    assert.equal(res.statusCode, 401);
    assert.deepEqual(res.body, { error: 'Invalid API key provided' });
  });

  test('returns 502 when OpenAI content is invalid JSON', async () => {
    globalThis.fetch = async () => ({
      ok: true,
      json: async () => ({
        choices: [
          {
            message: {
              content: 'Invalid JSON response from model'
            }
          }
        ]
      })
    });

    const req = { method: 'POST', body: validRequestBody };
    const res = mockResponse();

    await handler(req, res);

    assert.equal(res.statusCode, 502);
    assert.deepEqual(res.body, { error: 'Model response was not valid structured JSON.' });
  });

  test('returns 502 when OpenAI parsed response is incomplete or invalid format', async () => {
    globalThis.fetch = async () => ({
      ok: true,
      json: async () => ({
        choices: [
          {
            message: {
              content: JSON.stringify({
                subjects: ['Only one subject'],
                email: 'Draft email content'
              })
            }
          }
        ]
      })
    });

    const req = { method: 'POST', body: validRequestBody };
    const res = mockResponse();

    await handler(req, res);

    assert.equal(res.statusCode, 502);
    assert.deepEqual(res.body, { error: 'Model response was not valid structured JSON.' });
  });

  test('returns 200 with subjects and email on successful generation', async () => {
    const mockOutput = {
      subjects: ['Subject Option 1', 'Subject Option 2'],
      email: 'Dear Hiring Manager,\n\nI am following up on my application.\n\nBest regards,\nJohn Doe'
    };

    globalThis.fetch = async (url, options) => {
      assert.equal(url, 'https://api.openai.com/v1/chat/completions');
      assert.equal(options.method, 'POST');
      const body = JSON.parse(options.body);
      assert.equal(body.model, 'gpt-4.1-mini');
      return {
        ok: true,
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

    const req = { method: 'POST', body: validRequestBody };
    const res = mockResponse();

    await handler(req, res);

    assert.equal(res.statusCode, 200);
    assert.deepEqual(res.body, mockOutput);
  });
});
