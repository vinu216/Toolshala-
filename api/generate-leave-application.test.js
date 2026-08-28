import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import handler from './generate-leave-application.js';

function createMockReqRes(options = {}) {
  const req = {
    method: options.method || 'POST',
    body: options.body || {}
  };

  const res = {
    statusCode: null,
    headers: {},
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

describe('api/generate-leave-application handler', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    process.env = { ...originalEnv, OPENAI_API_KEY: 'test-api-key' };
    vi.stubGlobal('fetch', vi.fn());
  });

  afterEach(() => {
    process.env = originalEnv;
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
  });

  it('returns 405 if HTTP method is not POST', async () => {
    const { req, res } = createMockReqRes({ method: 'GET' });

    await handler(req, res);

    expect(res.statusCode).toBe(405);
    expect(res.headers['Allow']).toBe('POST');
    expect(res.jsonData).toEqual({ error: 'Method not allowed. Use POST.' });
  });

  it('returns 500 if OPENAI_API_KEY environment variable is missing', async () => {
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

    expect(res.statusCode).toBe(500);
    expect(res.jsonData).toEqual({
      error: 'OPENAI_API_KEY is missing on the server. Add it in your deployment environment variables.'
    });
  });

  it('returns 400 when required fields are missing or empty strings', async () => {
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

      expect(res.statusCode).toBe(400);
      expect(res.jsonData).toEqual({
        error: 'name, recipientType, reason, startDate, and endDate are required.'
      });
    }
  });

  it('returns 400 when dates are invalid strings', async () => {
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

    expect(res.statusCode).toBe(400);
    expect(res.jsonData).toEqual({
      error: 'startDate and endDate must be valid dates.'
    });
  });

  it('returns 400 when endDate is before startDate', async () => {
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

    expect(res.statusCode).toBe(400);
    expect(res.jsonData).toEqual({
      error: 'endDate must be on or after startDate.'
    });
  });

  it('returns OpenAI status and error message when OpenAI API call fails', async () => {
    fetch.mockResolvedValueOnce({
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

    expect(res.statusCode).toBe(401);
    expect(res.jsonData).toEqual({
      error: 'Incorrect API key provided.'
    });
  });

  it('returns default fallback error message when OpenAI API fails without error message', async () => {
    fetch.mockResolvedValueOnce({
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

    expect(res.statusCode).toBe(503);
    expect(res.jsonData).toEqual({
      error: 'OpenAI request failed.'
    });
  });

  it('returns 502 Bad Gateway when OpenAI returns unparseable JSON content', async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
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

    expect(res.statusCode).toBe(502);
    expect(res.jsonData).toEqual({
      error: 'Model response was not valid structured JSON.'
    });
  });

  it('returns 502 Bad Gateway when parsed JSON is missing required keys', async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
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

    expect(res.statusCode).toBe(502);
    expect(res.jsonData).toEqual({
      error: 'Model response was not valid structured JSON.'
    });
  });

  it('returns 500 when fetch throws an exception', async () => {
    fetch.mockRejectedValueOnce(new Error('Network error'));

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

    expect(res.statusCode).toBe(500);
    expect(res.jsonData).toEqual({
      error: 'Unable to generate leave application at the moment. Please try again.'
    });
  });

  it('successfully generates leave application with custom model env var and additional note', async () => {
    process.env.OPENAI_MODEL = 'gpt-4o-mini';

    const mockOutput = {
      subject: '  Leave Application for Urgent Work  ',
      letter: '  Dear Sir, I am writing to request leave...  ',
      closing: '  Sincerely, John Doe  '
    };

    fetch.mockResolvedValueOnce({
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
    });

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

    expect(res.statusCode).toBe(200);
    expect(res.jsonData).toEqual({
      subject: 'Leave Application for Urgent Work',
      letter: 'Dear Sir, I am writing to request leave...',
      closing: 'Sincerely, John Doe'
    });

    expect(fetch).toHaveBeenCalledTimes(1);
    const [url, options] = fetch.mock.calls[0];

    expect(url).toBe('https://api.openai.com/v1/chat/completions');
    expect(options.method).toBe('POST');
    expect(options.headers).toEqual({
      'Content-Type': 'application/json',
      Authorization: 'Bearer test-api-key'
    });

    const payload = JSON.parse(options.body);
    expect(payload.model).toBe('gpt-4o-mini');
    expect(payload.temperature).toBe(0.5);
    expect(payload.messages[1].content).toContain('Name: John Doe');
    expect(payload.messages[1].content).toContain('Recipient Type: manager');
    expect(payload.messages[1].content).toContain('Reason for Leave: Urgent family work');
    expect(payload.messages[1].content).toContain('Start Date: 2025-06-10');
    expect(payload.messages[1].content).toContain('End Date: 2025-06-12');
    expect(payload.messages[1].content).toContain('Additional Note: Will be available on phone');
  });

  it('uses default model and default note when optional parameters are omitted', async () => {
    delete process.env.OPENAI_MODEL;

    fetch.mockResolvedValueOnce({
      ok: true,
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
    });

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

    expect(res.statusCode).toBe(200);
    const payload = JSON.parse(fetch.mock.calls[0][1].body);
    expect(payload.model).toBe('gpt-4.1-mini');
    expect(payload.messages[1].content).toContain('Additional Note: Not provided');
  });
});
