import test, { beforeEach, afterEach } from 'node:test';
import assert from 'node:assert/strict';
import handler from '../api/generate-instagram-caption.js';

function createMockReqRes(options = {}) {
  const req = {
    method: options.method || 'POST',
    body: options.body || {}
  };

  const res = {
    headers: {},
    statusCode: 200,
    body: null,
    setHeader(name, value) {
      this.headers[name] = value;
      return this;
    },
    status(code) {
      this.statusCode = code;
      return this;
    },
    json(data) {
      this.body = data;
      return this;
    }
  };

  return { req, res };
}

test('generate-instagram-caption handler tests', async (t) => {
  const originalEnv = { ...process.env };
  const originalFetch = globalThis.fetch;

  beforeEach(() => {
    process.env = { ...originalEnv };
    process.env.OPENAI_API_KEY = 'test-api-key';
  });

  afterEach(() => {
    process.env = { ...originalEnv };
    globalThis.fetch = originalFetch;
  });

  await t.test('returns 405 if HTTP method is not POST', async () => {
    const { req, res } = createMockReqRes({ method: 'GET' });
    await handler(req, res);

    assert.equal(res.statusCode, 405);
    assert.equal(res.headers['Allow'], 'POST');
    assert.deepEqual(res.body, { error: 'Method not allowed. Use POST.' });
  });

  await t.test('returns 500 if API key is not configured', async () => {
    delete process.env.INSTAGRAM_CAPTION_API_KEY;
    delete process.env.VISION_API_KEY;
    delete process.env.OPENAI_API_KEY;

    const { req, res } = createMockReqRes({
      body: { topic: 'test', contentType: 'post', tone: 'casual' }
    });
    await handler(req, res);

    assert.equal(res.statusCode, 500);
    assert.match(res.body.error, /Instagram Caption Generator is not configured/);
  });

  await t.test('returns 400 if topic, contentType, or tone is missing', async () => {
    const { req, res } = createMockReqRes({
      body: { topic: 'test', contentType: '' }
    });
    await handler(req, res);

    assert.equal(res.statusCode, 400);
    assert.deepEqual(res.body, { error: 'topic, contentType, and tone are required.' });
  });

  await t.test('returns 400 if image payload has unsupported mime type', async () => {
    const { req, res } = createMockReqRes({
      body: {
        topic: 'test',
        contentType: 'post',
        tone: 'casual',
        imageBase64: 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7'
      }
    });
    await handler(req, res);

    assert.equal(res.statusCode, 400);
    assert.deepEqual(res.body, { error: 'Unsupported image type. Please upload a JPEG, PNG, or WEBP image.' });
  });

  await t.test('returns 400 if image base64 data is invalid', async () => {
    const { req, res } = createMockReqRes({
      body: {
        topic: 'test',
        contentType: 'post',
        tone: 'casual',
        imageBase64: 'data:image/png;base64,invalid_base64!!!'
      }
    });
    await handler(req, res);

    assert.equal(res.statusCode, 400);
    assert.deepEqual(res.body, { error: 'Invalid image data. Please upload the image again.' });
  });

  await t.test('returns 413 if image size exceeds maximum size', async () => {
    const largeBase64 = Buffer.alloc(4 * 1024 * 1024 + 100).toString('base64');
    const { req, res } = createMockReqRes({
      body: {
        topic: 'test',
        contentType: 'post',
        tone: 'casual',
        imageBase64: `data:image/jpeg;base64,${largeBase64}`
      }
    });
    await handler(req, res);

    assert.equal(res.statusCode, 413);
    assert.deepEqual(res.body, { error: 'Image is too large. Please upload an image up to 4 MB.' });
  });

  await t.test('returns error from OpenAI response when response is not ok', async () => {
    globalThis.fetch = async () => ({
      ok: false,
      status: 401,
      json: async () => ({ error: { message: 'Invalid API key' } })
    });

    const { req, res } = createMockReqRes({
      body: { topic: 'test', contentType: 'post', tone: 'casual' }
    });
    await handler(req, res);

    assert.equal(res.statusCode, 401);
    assert.deepEqual(res.body, { error: 'Invalid API key' });
  });

  await t.test('returns 502 if model content is invalid JSON or lacks 5 captions', async () => {
    globalThis.fetch = async () => ({
      ok: true,
      json: async () => ({
        choices: [{ message: { content: 'not valid json' } }]
      })
    });

    const { req, res } = createMockReqRes({
      body: { topic: 'test', contentType: 'post', tone: 'casual' }
    });
    await handler(req, res);

    assert.equal(res.statusCode, 502);
    assert.deepEqual(res.body, { error: 'Model response was not valid structured JSON.' });
  });

  await t.test('returns 200 with generated captions on successful generation', async () => {
    const mockCaptions = [
      { text: 'Caption 1', style: 'Catchy', bestPick: false, hashtags: ['#tag1'] },
      { text: 'Caption 2', style: 'Minimal', bestPick: false, hashtags: [] },
      { text: 'Caption 3', style: 'Playful', bestPick: false, hashtags: [] },
      { text: 'Caption 4', style: 'Aesthetic', bestPick: false, hashtags: [] },
      { text: 'Caption 5', style: 'CTA-style', bestPick: false, hashtags: [] }
    ];

    globalThis.fetch = async () => ({
      ok: true,
      json: async () => ({
        choices: [
          {
            message: {
              content: JSON.stringify({
                visualAnalysis: 'Based on text input.',
                captions: mockCaptions
              })
            }
          }
        ]
      })
    });

    const { req, res } = createMockReqRes({
      body: { topic: 'Travel', contentType: 'post', tone: 'exciting' }
    });
    await handler(req, res);

    assert.equal(res.statusCode, 200);
    assert.equal(res.body.visualAnalysis, 'Based on text input.');
    assert.equal(res.body.captions.length, 5);
    // Since no bestPick was true, first item should be assigned bestPick=true
    assert.equal(res.body.captions[0].bestPick, true);
  });

  await t.test('catches errors and returns 500 error response (error path test)', async () => {
    globalThis.fetch = async () => {
      throw new Error('Network error or fetch failure');
    };

    const { req, res } = createMockReqRes({
      body: { topic: 'test', contentType: 'post', tone: 'casual' }
    });
    await handler(req, res);

    assert.equal(res.statusCode, 500);
    assert.deepEqual(res.body, {
      error: 'Unable to generate captions at the moment. Please try again.'
    });
  });
});
