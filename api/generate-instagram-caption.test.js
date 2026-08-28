import test, { describe, beforeEach, afterEach } from 'node:test';
import assert from 'node:assert/strict';
import handler from './generate-instagram-caption.js';

function createMockReqRes({ method = 'POST', body = {}, headers = {} } = {}) {
  const req = {
    method,
    body,
    headers
  };

  const res = {
    statusCode: 200,
    headers: {},
    body: null,
    setHeader(key, value) {
      this.headers[key] = value;
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

describe('api/generate-instagram-caption handler', () => {
  const originalEnv = process.env;
  const originalFetch = globalThis.fetch;

  beforeEach(() => {
    process.env = { ...originalEnv, INSTAGRAM_CAPTION_API_KEY: 'test-api-key' };
  });

  afterEach(() => {
    process.env = originalEnv;
    globalThis.fetch = originalFetch;
  });

  test('returns 405 Method Not Allowed for non-POST requests', async () => {
    const { req, res } = createMockReqRes({ method: 'GET' });
    await handler(req, res);

    assert.equal(res.statusCode, 405);
    assert.equal(res.headers['Allow'], 'POST');
    assert.deepEqual(res.body, { error: 'Method not allowed. Use POST.' });
  });

  test('returns 500 if no API key is set in environment', async () => {
    delete process.env.INSTAGRAM_CAPTION_API_KEY;
    delete process.env.VISION_API_KEY;
    delete process.env.OPENAI_API_KEY;

    const { req, res } = createMockReqRes();
    await handler(req, res);

    assert.equal(res.statusCode, 500);
    assert.match(res.body.error, /Instagram Caption Generator is not configured/);
  });

  test('returns 400 if topic, contentType, or tone are missing', async () => {
    const { req, res } = createMockReqRes({
      body: { topic: 'Travel', contentType: 'Reel' } // missing tone
    });
    await handler(req, res);

    assert.equal(res.statusCode, 400);
    assert.deepEqual(res.body, { error: 'topic, contentType, and tone are required.' });
  });

  test('returns 400 if image mimeType is provided without base64 data', async () => {
    const { req, res } = createMockReqRes({
      body: {
        topic: 'Travel',
        contentType: 'Reel',
        tone: 'Casual',
        mimeType: 'image/jpeg'
      }
    });
    await handler(req, res);

    assert.equal(res.statusCode, 400);
    assert.deepEqual(res.body, { error: 'Image data is required when uploading an image.' });
  });

  test('returns 400 for unsupported image mimeType', async () => {
    const { req, res } = createMockReqRes({
      body: {
        topic: 'Travel',
        contentType: 'Reel',
        tone: 'Casual',
        mimeType: 'image/gif',
        imageBase64: 'R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7'
      }
    });
    await handler(req, res);

    assert.equal(res.statusCode, 400);
    assert.deepEqual(res.body, { error: 'Unsupported image type. Please upload a JPEG, PNG, or WEBP image.' });
  });

  test('returns 400 for invalid base64 string encoding', async () => {
    const { req, res } = createMockReqRes({
      body: {
        topic: 'Travel',
        contentType: 'Reel',
        tone: 'Casual',
        mimeType: 'image/jpeg',
        imageBase64: 'invalid-base64-string!'
      }
    });
    await handler(req, res);

    assert.equal(res.statusCode, 400);
    assert.deepEqual(res.body, { error: 'Invalid image data. Please upload the image again.' });
  });

  test('returns 413 if image exceeds 4 MB', async () => {
    // 4MB + 1 byte in base64
    const largeBase64 = Buffer.alloc(4 * 1024 * 1024 + 4).toString('base64');
    const { req, res } = createMockReqRes({
      body: {
        topic: 'Travel',
        contentType: 'Reel',
        tone: 'Casual',
        mimeType: 'image/jpeg',
        imageBase64: largeBase64
      }
    });
    await handler(req, res);

    assert.equal(res.statusCode, 413);
    assert.deepEqual(res.body, { error: 'Image is too large. Please upload an image up to 4 MB.' });
  });

  test('returns OpenAI error status and message when OpenAI API fails', async () => {
    globalThis.fetch = async () => ({
      ok: false,
      status: 401,
      json: async () => ({ error: { message: 'Invalid API Key' } })
    });

    const { req, res } = createMockReqRes({
      body: { topic: 'Tech', contentType: 'Post', tone: 'Informative' }
    });
    await handler(req, res);

    assert.equal(res.statusCode, 401);
    assert.deepEqual(res.body, { error: 'Invalid API Key' });
  });

  test('returns 502 when OpenAI returns invalid JSON structure', async () => {
    globalThis.fetch = async () => ({
      ok: true,
      json: async () => ({
        choices: [
          {
            message: {
              content: 'not valid json'
            }
          }
        ]
      })
    });

    const { req, res } = createMockReqRes({
      body: { topic: 'Tech', contentType: 'Post', tone: 'Informative' }
    });
    await handler(req, res);

    assert.equal(res.statusCode, 502);
    assert.deepEqual(res.body, { error: 'Model response was not valid structured JSON.' });
  });

  test('returns 502 when OpenAI returns array with wrong number of captions', async () => {
    globalThis.fetch = async () => ({
      ok: true,
      json: async () => ({
        choices: [
          {
            message: {
              content: JSON.stringify({
                visualAnalysis: 'N/A',
                captions: [{ text: 'Only one caption', style: 'Catchy', bestPick: true, hashtags: [] }]
              })
            }
          }
        ]
      })
    });

    const { req, res } = createMockReqRes({
      body: { topic: 'Tech', contentType: 'Post', tone: 'Informative' }
    });
    await handler(req, res);

    assert.equal(res.statusCode, 502);
    assert.deepEqual(res.body, { error: 'Model response was not valid structured JSON.' });
  });

  test('returns 502 when normalized captions count is incomplete due to empty text', async () => {
    globalThis.fetch = async () => ({
      ok: true,
      json: async () => ({
        choices: [
          {
            message: {
              content: JSON.stringify({
                visualAnalysis: 'N/A',
                captions: [
                  { text: 'Cap 1', style: 'Catchy', bestPick: true, hashtags: [] },
                  { text: 'Cap 2', style: 'Minimal', bestPick: false, hashtags: [] },
                  { text: 'Cap 3', style: 'Playful', bestPick: false, hashtags: [] },
                  { text: 'Cap 4', style: 'Aesthetic', bestPick: false, hashtags: [] },
                  { text: '', style: 'CTA-style', bestPick: false, hashtags: [] } // empty text
                ]
              })
            }
          }
        ]
      })
    });

    const { req, res } = createMockReqRes({
      body: { topic: 'Tech', contentType: 'Post', tone: 'Informative' }
    });
    await handler(req, res);

    assert.equal(res.statusCode, 502);
    assert.deepEqual(res.body, { error: 'Caption response was incomplete.' });
  });

  test('returns 500 when fetch throws an exception', async () => {
    globalThis.fetch = async () => {
      throw new Error('Network error');
    };

    const { req, res } = createMockReqRes({
      body: { topic: 'Tech', contentType: 'Post', tone: 'Informative' }
    });
    await handler(req, res);

    assert.equal(res.statusCode, 500);
    assert.deepEqual(res.body, {
      error: 'Unable to generate captions at the moment. Please try again.'
    });
  });

  test('successfully generates text-only captions and normalizes bestPick if none set', async () => {
    let capturedOptions;
    globalThis.fetch = async (url, options) => {
      capturedOptions = options;
      return {
        ok: true,
        json: async () => ({
          choices: [
            {
              message: {
                content: JSON.stringify({
                  visualAnalysis: 'Based on text inputs only.',
                  captions: [
                    { text: 'Caption 1', style: '', bestPick: false, hashtags: ['#tag1'] },
                    { text: 'Caption 2', style: 'Minimal', bestPick: false, hashtags: ['#tag2'] },
                    { text: 'Caption 3', style: 'Playful', bestPick: false, hashtags: [] },
                    { text: 'Caption 4', style: 'Aesthetic', bestPick: false, hashtags: [] },
                    { text: 'Caption 5', style: 'CTA-style', bestPick: false, hashtags: [] }
                  ]
                })
              }
            }
          ]
        })
      };
    };

    const { req, res } = createMockReqRes({
      body: {
        topic: 'Coffee Morning',
        contentType: 'Post',
        tone: 'Energetic',
        keywords: 'espresso, morning'
      }
    });
    await handler(req, res);

    assert.equal(res.statusCode, 200);
    assert.equal(res.body.visualAnalysis, 'Based on text inputs only.');
    assert.equal(res.body.captions.length, 5);
    // Best pick should be set on first item since none were true
    assert.equal(res.body.captions[0].bestPick, true);
    assert.equal(res.body.captions[0].style, 'Catchy'); // defaulted empty style based on index

    const payload = JSON.parse(capturedOptions.body);
    assert.equal(payload.model, 'gpt-4o-mini');
    assert.equal(capturedOptions.headers.Authorization, 'Bearer test-api-key');
  });

  test('successfully generates captions with image data URL', async () => {
    let capturedOptions;
    const base64Sample = Buffer.from('fake image content').toString('base64');
    globalThis.fetch = async (url, options) => {
      capturedOptions = options;
      return {
        ok: true,
        json: async () => ({
          choices: [
            {
              message: {
                content: JSON.stringify({
                  visualAnalysis: 'A warm cup of coffee on a wooden table.',
                  captions: [
                    { text: 'Caption 1', style: 'Catchy', bestPick: true, hashtags: ['#coffee'] },
                    { text: 'Caption 2', style: 'Minimal', bestPick: false, hashtags: [] },
                    { text: 'Caption 3', style: 'Playful', bestPick: false, hashtags: [] },
                    { text: 'Caption 4', style: 'Aesthetic', bestPick: false, hashtags: [] },
                    { text: 'Caption 5', style: 'CTA-style', bestPick: false, hashtags: [] }
                  ]
                })
              }
            }
          ]
        })
      };
    };

    const { req, res } = createMockReqRes({
      body: {
        topic: 'Morning Coffee',
        contentType: 'Story',
        tone: 'Cozy',
        imageBase64: `data:image/png;base64,${base64Sample}`
      }
    });
    await handler(req, res);

    assert.equal(res.statusCode, 200);
    assert.equal(res.body.visualAnalysis, 'A warm cup of coffee on a wooden table.');
    assert.equal(res.body.captions.length, 5);

    const payload = JSON.parse(capturedOptions.body);
    const userMessageContent = payload.messages.find((m) => m.role === 'user').content;
    assert.ok(Array.isArray(userMessageContent));
    assert.equal(userMessageContent[1].image_url.url, `data:image/png;base64,${base64Sample}`);
  });
});
