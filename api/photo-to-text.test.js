import { test, describe, beforeEach, afterEach } from 'node:test';
import assert from 'node:assert/strict';
import handler from './photo-to-text.js';

function createMockRes() {
  const res = {
    statusCode: 200,
    headers: {},
    body: null,
    ended: false,
    status(code) {
      res.statusCode = code;
      return res;
    },
    json(data) {
      res.body = data;
      return res;
    },
    setHeader(key, val) {
      res.headers[key] = val;
      return res;
    },
    end() {
      res.ended = true;
      return res;
    }
  };
  return res;
}

const VALID_BASE64_IMAGE = 'data:image/jpeg;base64,' + Buffer.from('test image content').toString('base64');

describe('api/photo-to-text.js', () => {
  const originalEnv = process.env;
  const originalFetch = globalThis.fetch;

  beforeEach(() => {
    process.env = { ...originalEnv, PHOTO_TO_TEXT_API_KEY: 'test-api-key' };
  });

  afterEach(() => {
    process.env = originalEnv;
    globalThis.fetch = originalFetch;
  });

  test('returns 204 for OPTIONS method', async () => {
    const req = { method: 'OPTIONS' };
    const res = createMockRes();
    await handler(req, res);
    assert.equal(res.statusCode, 204);
    assert.equal(res.ended, true);
  });

  test('returns 405 for unsupported HTTP methods', async () => {
    const req = { method: 'GET' };
    const res = createMockRes();
    await handler(req, res);
    assert.equal(res.statusCode, 405);
    assert.equal(res.headers['Allow'], 'POST, OPTIONS');
    assert.deepEqual(res.body, { error: 'Method not allowed. Use POST.' });
  });

  test('returns 500 when API key is missing', async () => {
    delete process.env.PHOTO_TO_TEXT_API_KEY;
    delete process.env.NVIDIA_API_KEY;

    const req = { method: 'POST', body: {} };
    const res = createMockRes();
    await handler(req, res);
    assert.equal(res.statusCode, 500);
    assert.deepEqual(res.body, {
      error: 'Photo to Text OCR is not configured. Add PHOTO_TO_TEXT_API_KEY or NVIDIA_API_KEY on the server.'
    });
  });

  test('returns 400 when image data is missing', async () => {
    const req = { method: 'POST', body: {} };
    const res = createMockRes();
    await handler(req, res);
    assert.equal(res.statusCode, 400);
    assert.deepEqual(res.body, { error: 'Image data is required.' });
  });

  test('returns 400 when image mime type is unsupported', async () => {
    const req = {
      method: 'POST',
      body: { imageBase64: 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7' }
    };
    const res = createMockRes();
    await handler(req, res);
    assert.equal(res.statusCode, 400);
    assert.deepEqual(res.body, {
      error: 'Unsupported image type. Please upload a JPEG, PNG, or WEBP image.'
    });
  });

  test('returns 400 when base64 payload has invalid format', async () => {
    const req = {
      method: 'POST',
      body: { mimeType: 'image/png', imageData: '!!!invalid_base64!!!' }
    };
    const res = createMockRes();
    await handler(req, res);
    assert.equal(res.statusCode, 400);
    assert.deepEqual(res.body, {
      error: 'Invalid image data. Please upload the image again.'
    });
  });

  test('returns 413 when image exceeds size limit', async () => {
    const largeBuffer = Buffer.alloc(8 * 1024 * 1024 + 1, 'a');
    const req = {
      method: 'POST',
      body: { mimeType: 'image/jpeg', imageData: largeBuffer.toString('base64') }
    };
    const res = createMockRes();
    await handler(req, res);
    assert.equal(res.statusCode, 413);
    assert.deepEqual(res.body, {
      error: 'Image is too large. Please upload an image up to 8 MB.'
    });
  });

  test('returns 200 with extracted text on success', async () => {
    globalThis.fetch = async () => ({
      ok: true,
      json: async () => ({
        choices: [
          { message: { content: "Here's the extracted text:\nHello World" } }
        ]
      })
    });

    const req = {
      method: 'POST',
      body: { imageBase64: VALID_BASE64_IMAGE }
    };
    const res = createMockRes();
    await handler(req, res);
    assert.equal(res.statusCode, 200);
    assert.deepEqual(res.body, { text: 'Hello World' });
  });

  test('returns API error response when upstream request fails', async () => {
    globalThis.fetch = async () => ({
      ok: false,
      status: 502,
      json: async () => ({ error: { message: 'Upstream gateway error' } })
    });

    const req = {
      method: 'POST',
      body: { imageBase64: VALID_BASE64_IMAGE }
    };
    const res = createMockRes();
    await handler(req, res);
    assert.equal(res.statusCode, 502);
    assert.deepEqual(res.body, { error: 'Upstream gateway error' });
  });

  test('returns 422 when extracted text is empty after normalization', async () => {
    globalThis.fetch = async () => ({
      ok: true,
      json: async () => ({ choices: [{ message: { content: '   ' } }] })
    });

    const req = {
      method: 'POST',
      body: { imageBase64: VALID_BASE64_IMAGE }
    };
    const res = createMockRes();
    await handler(req, res);
    assert.equal(res.statusCode, 422);
    assert.deepEqual(res.body, {
      error: 'No readable text was found in this image. Try a clearer or higher-resolution photo.'
    });
  });

  test('returns 500 on unexpected network failure during fetch (error path catch block)', async () => {
    globalThis.fetch = async () => {
      throw new Error('Network error during fetch');
    };

    const req = {
      method: 'POST',
      body: { imageBase64: VALID_BASE64_IMAGE }
    };
    const res = createMockRes();
    await handler(req, res);

    assert.equal(res.statusCode, 500);
    assert.deepEqual(res.body, {
      error: 'Unable to extract text from the image right now. Please try again.'
    });
  });
});
