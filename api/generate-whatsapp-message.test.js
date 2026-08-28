import test, { describe, beforeEach, afterEach } from 'node:test';
import assert from 'node:assert/strict';
import handler from './generate-whatsapp-message.js';

function createMockReqRes({ method = 'POST', body = {} } = {}) {
  const req = {
    method,
    body
  };

  const res = {
    statusCode: null,
    headers: {},
    jsonData: null,
    setHeader(key, value) {
      this.headers[key] = value;
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

describe('POST /api/generate-whatsapp-message', () => {
  const originalEnv = { ...process.env };
  const originalFetch = globalThis.fetch;

  beforeEach(() => {
    process.env.OPENAI_API_KEY = 'test-openai-key';
    delete process.env.OPENAI_MODEL;
  });

  afterEach(() => {
    process.env = { ...originalEnv };
    globalThis.fetch = originalFetch;
  });

  test('should return 405 Method Not Allowed when method is not POST', async () => {
    const { req, res } = createMockReqRes({ method: 'GET' });

    await handler(req, res);

    assert.equal(res.statusCode, 405);
    assert.equal(res.headers['Allow'], 'POST');
    assert.deepEqual(res.jsonData, { error: 'Method not allowed. Use POST.' });
  });

  test('should return 500 Internal Server Error when OPENAI_API_KEY is missing', async () => {
    delete process.env.OPENAI_API_KEY;
    const { req, res } = createMockReqRes({
      method: 'POST',
      body: {
        values: {
          purpose: 'Leave request',
          recipientType: 'Manager',
          tone: 'Polite'
        }
      }
    });

    await handler(req, res);

    assert.equal(res.statusCode, 500);
    assert.deepEqual(res.jsonData, { error: 'OPENAI_API_KEY is missing on the server.' });
  });

  test('should return 400 Bad Request when required fields are missing or empty', async () => {
    const invalidBodies = [
      {},
      { values: {} },
      { values: { purpose: '  ', recipientType: 'Client', tone: 'Professional' } },
      { values: { purpose: 'Follow up', recipientType: '', tone: 'Professional' } },
      { values: { purpose: 'Follow up', recipientType: 'Client', tone: '   ' } }
    ];

    for (const body of invalidBodies) {
      const { req, res } = createMockReqRes({ method: 'POST', body });

      await handler(req, res);

      assert.equal(res.statusCode, 400);
      assert.deepEqual(res.jsonData, { error: 'Missing required fields for WhatsApp message generation.' });
    }
  });

  test('should successfully generate WhatsApp messages on valid input (happy path)', async () => {
    let capturedUrl = '';
    let capturedOptions = {};

    const mockOpenAIResponse = {
      bestPick: { text: 'Hi Team, please find the update attached.', tone: 'Professional' },
      messages: [
        { text: 'Hi Team, please find the update attached.', tone: 'Professional' },
        { text: 'Hey guys, quick update attached here!', tone: 'Casual' },
        { text: 'Hello everyone, kindly review the attached updates.', tone: 'Formal' }
      ],
      tips: ['Keep messages concise.', 'Add clear call to action.']
    };

    globalThis.fetch = async (url, options) => {
      capturedUrl = url;
      capturedOptions = options;
      return {
        ok: true,
        status: 200,
        json: async () => ({
          choices: [
            {
              message: {
                content: JSON.stringify(mockOpenAIResponse)
              }
            }
          ]
        })
      };
    };

    const { req, res } = createMockReqRes({
      method: 'POST',
      body: {
        values: {
          purpose: 'Weekly Status Update',
          recipientType: 'Team',
          tone: 'Professional',
          details: 'Sprint 5 completed',
          length: 'short'
        }
      }
    });

    await handler(req, res);

    assert.equal(res.statusCode, 200);
    assert.deepEqual(res.jsonData, mockOpenAIResponse);

    assert.equal(capturedUrl, 'https://api.openai.com/v1/chat/completions');
    assert.equal(capturedOptions.method, 'POST');
    assert.equal(capturedOptions.headers['Authorization'], 'Bearer test-openai-key');
    assert.equal(capturedOptions.headers['Content-Type'], 'application/json');

    const parsedBody = JSON.parse(capturedOptions.body);
    assert.equal(parsedBody.model, 'gpt-4.1-mini');
    assert.equal(parsedBody.temperature, 0.7);
    assert.equal(parsedBody.messages[0].role, 'system');
    assert.ok(parsedBody.messages[1].content.includes('Message Purpose: Weekly Status Update'));
    assert.ok(parsedBody.messages[1].content.includes('Recipient Type: Team'));
    assert.ok(parsedBody.messages[1].content.includes('Tone: Professional'));
    assert.ok(parsedBody.messages[1].content.includes('Optional Details: Sprint 5 completed'));
    assert.ok(parsedBody.messages[1].content.includes('Optional Length: short'));
  });

  test('should default length to "medium" and details to "not provided" when omitted', async () => {
    let capturedRequestBody = null;

    globalThis.fetch = async (url, options) => {
      capturedRequestBody = JSON.parse(options.body);
      return {
        ok: true,
        status: 200,
        json: async () => ({
          choices: [
            {
              message: {
                content: JSON.stringify({
                  bestPick: { text: 'Hello', tone: 'Friendly' },
                  messages: [{ text: 'Hello', tone: 'Friendly' }, { text: 'Hi', tone: 'Casual' }, { text: 'Greetings', tone: 'Formal' }],
                  tips: ['Tip 1', 'Tip 2']
                })
              }
            }
          ]
        })
      };
    };

    const { req, res } = createMockReqRes({
      method: 'POST',
      body: {
        values: {
          purpose: 'Greeting',
          recipientType: 'Friend',
          tone: 'Friendly'
        }
      }
    });

    await handler(req, res);

    assert.equal(res.statusCode, 200);
    const userPrompt = capturedRequestBody.messages[1].content;
    assert.ok(userPrompt.includes('Optional Details: not provided'));
    assert.ok(userPrompt.includes('Optional Length: medium'));
  });

  test('should use process.env.OPENAI_MODEL when provided', async () => {
    process.env.OPENAI_MODEL = 'gpt-4o';
    let capturedRequestBody = null;

    globalThis.fetch = async (url, options) => {
      capturedRequestBody = JSON.parse(options.body);
      return {
        ok: true,
        status: 200,
        json: async () => ({
          choices: [
            {
              message: {
                content: JSON.stringify({
                  bestPick: { text: 'Hello', tone: 'Friendly' },
                  messages: [{ text: 'Hello', tone: 'Friendly' }, { text: 'Hi', tone: 'Casual' }, { text: 'Greetings', tone: 'Formal' }],
                  tips: ['Tip 1', 'Tip 2']
                })
              }
            }
          ]
        })
      };
    };

    const { req, res } = createMockReqRes({
      method: 'POST',
      body: {
        values: {
          purpose: 'Greeting',
          recipientType: 'Friend',
          tone: 'Friendly'
        }
      }
    });

    await handler(req, res);

    assert.equal(res.statusCode, 200);
    assert.equal(capturedRequestBody.model, 'gpt-4o');
  });

  test('should handle OpenAI API error response', async () => {
    globalThis.fetch = async () => ({
      ok: false,
      status: 429,
      json: async () => ({
        error: { message: 'Rate limit exceeded.' }
      })
    });

    const { req, res } = createMockReqRes({
      method: 'POST',
      body: {
        values: {
          purpose: 'Follow up',
          recipientType: 'Client',
          tone: 'Professional'
        }
      }
    });

    await handler(req, res);

    assert.equal(res.statusCode, 429);
    assert.deepEqual(res.jsonData, { error: 'Rate limit exceeded.' });
  });

  test('should handle OpenAI API error response fallback message', async () => {
    globalThis.fetch = async () => ({
      ok: false,
      status: 500,
      json: async () => ({})
    });

    const { req, res } = createMockReqRes({
      method: 'POST',
      body: {
        values: {
          purpose: 'Follow up',
          recipientType: 'Client',
          tone: 'Professional'
        }
      }
    });

    await handler(req, res);

    assert.equal(res.statusCode, 500);
    assert.deepEqual(res.jsonData, { error: 'OpenAI request failed.' });
  });

  test('should return 502 Bad Gateway when OpenAI returns non-JSON or invalid response content', async () => {
    globalThis.fetch = async () => ({
      ok: true,
      status: 200,
      json: async () => ({
        choices: [
          {
            message: {
              content: 'Invalid JSON string from model'
            }
          }
        ]
      })
    });

    const { req, res } = createMockReqRes({
      method: 'POST',
      body: {
        values: {
          purpose: 'Follow up',
          recipientType: 'Client',
          tone: 'Professional'
        }
      }
    });

    await handler(req, res);

    assert.equal(res.statusCode, 502);
    assert.deepEqual(res.jsonData, { error: 'Model response was not valid structured JSON.' });
  });

  test('should return 500 Internal Server Error when fetch throws network error', async () => {
    globalThis.fetch = async () => {
      throw new Error('Network connection failed');
    };

    const { req, res } = createMockReqRes({
      method: 'POST',
      body: {
        values: {
          purpose: 'Follow up',
          recipientType: 'Client',
          tone: 'Professional'
        }
      }
    });

    await handler(req, res);

    assert.equal(res.statusCode, 500);
    assert.deepEqual(res.jsonData, { error: 'Unable to generate WhatsApp messages right now. Please try again.' });
  });
});
