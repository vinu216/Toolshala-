import { test, describe, beforeEach, afterEach } from 'node:test';
import assert from 'node:assert/strict';
import handler from './photo-to-text.js';

function createMockResponse() {
  const res = {
    statusCode: 200,
    headers: {},
    ended: false,
    jsonData: null,
    status(code) {
      this.statusCode = code;
      return this;
    },
    setHeader(name, value) {
      this.headers[name] = value;
      return this;
    },
    json(data) {
      this.jsonData = data;
      this.ended = true;
      return this;
    },
    end() {
      this.ended = true;
      return this;
    }
  };
  return res;
}

describe('Photo to Text API Handler (api/photo-to-text.js)', () => {
  let originalEnv;
  let originalFetch;

  beforeEach(() => {
    originalEnv = { ...process.env };
    originalFetch = globalThis.fetch;
    process.env.PHOTO_TO_TEXT_API_KEY = 'test-photo-key';
  });

  afterEach(() => {
    process.env = originalEnv;
    globalThis.fetch = originalFetch;
  });

  describe('HTTP Method Handling', () => {
    test('should respond with 204 for OPTIONS request', async () => {
      const req = { method: 'OPTIONS' };
      const res = createMockResponse();

      await handler(req, res);

      assert.equal(res.statusCode, 204);
      assert.equal(res.ended, true);
    });

    test('should respond with 405 and Allow header for non-POST methods', async () => {
      const methods = ['GET', 'PUT', 'DELETE', 'PATCH'];

      for (const method of methods) {
        const req = { method };
        const res = createMockResponse();

        await handler(req, res);

        assert.equal(res.statusCode, 405);
        assert.equal(res.headers['Allow'], 'POST, OPTIONS');
        assert.deepEqual(res.jsonData, { error: 'Method not allowed. Use POST.' });
      }
    });
  });

  describe('API Key Configuration', () => {
    test('should respond with 500 when neither PHOTO_TO_TEXT_API_KEY nor NVIDIA_API_KEY is configured', async () => {
      delete process.env.PHOTO_TO_TEXT_API_KEY;
      delete process.env.NVIDIA_API_KEY;

      const req = { method: 'POST', body: {} };
      const res = createMockResponse();

      await handler(req, res);

      assert.equal(res.statusCode, 500);
      assert.match(res.jsonData.error, /Photo to Text OCR is not configured/);
    });

    test('should accept NVIDIA_API_KEY if PHOTO_TO_TEXT_API_KEY is not set', async () => {
      delete process.env.PHOTO_TO_TEXT_API_KEY;
      process.env.NVIDIA_API_KEY = 'nvidia-test-key';

      let capturedFetchOptions;
      globalThis.fetch = async (url, options) => {
        capturedFetchOptions = options;
        return {
          ok: true,
          json: async () => ({
            choices: [{ message: { content: 'Sample Extracted Text' } }]
          })
        };
      };

      const req = {
        method: 'POST',
        body: {
          imageBase64: 'data:image/jpeg;base64,aGVsbG8='
        }
      };
      const res = createMockResponse();

      await handler(req, res);

      assert.equal(res.statusCode, 200);
      assert.equal(capturedFetchOptions.headers.Authorization, 'Bearer nvidia-test-key');
    });
  });

  describe('Request Payload Validation', () => {
    test('should respond with 400 if image data is missing', async () => {
      const req = { method: 'POST', body: {} };
      const res = createMockResponse();

      await handler(req, res);

      assert.equal(res.statusCode, 400);
      assert.deepEqual(res.jsonData, { error: 'Image data is required.' });
    });

    test('should respond with 400 for unsupported mime types', async () => {
      const req = {
        method: 'POST',
        body: {
          imageBase64: 'aGVsbG8=',
          mimeType: 'image/gif'
        }
      };
      const res = createMockResponse();

      await handler(req, res);

      assert.equal(res.statusCode, 400);
      assert.deepEqual(res.jsonData, {
        error: 'Unsupported image type. Please upload a JPEG, PNG, or WEBP image.'
      });
    });

    test('should extract mimeType from data URL format', async () => {
      let fetchCalled = false;
      globalThis.fetch = async () => {
        fetchCalled = true;
        return {
          ok: true,
          json: async () => ({
            choices: [{ message: { content: 'Extracted text' } }]
          })
        };
      };

      const req = {
        method: 'POST',
        body: {
          imageData: 'data:image/webp;base64,aGVsbG8='
        }
      };
      const res = createMockResponse();

      await handler(req, res);

      assert.equal(res.statusCode, 200);
      assert.equal(fetchCalled, true);
    });

    test('should respond with 400 for invalid base64 string format', async () => {
      const req = {
        method: 'POST',
        body: {
          imageBase64: 'invalid!base64#@$',
          mimeType: 'image/png'
        }
      };
      const res = createMockResponse();

      await handler(req, res);

      assert.equal(res.statusCode, 400);
      assert.deepEqual(res.jsonData, {
        error: 'Invalid image data. Please upload the image again.'
      });
    });

    test('should respond with 413 if image size exceeds 8 MB', async () => {
      // 8MB + 1 byte in base64
      const largeBase64 = Buffer.alloc(8 * 1024 * 1024 + 1, 'a').toString('base64');

      const req = {
        method: 'POST',
        body: {
          imageBase64: largeBase64,
          mimeType: 'image/jpeg'
        }
      };
      const res = createMockResponse();

      await handler(req, res);

      assert.equal(res.statusCode, 413);
      assert.deepEqual(res.jsonData, {
        error: 'Image is too large. Please upload an image up to 8 MB.'
      });
    });
  });

  describe('NVIDIA Vision API Integration & Text Normalization', () => {
    test('should successfully call API and return normalized text output', async () => {
      let capturedUrl;
      let capturedOptions;

      globalThis.fetch = async (url, options) => {
        capturedUrl = url;
        capturedOptions = options;
        return {
          ok: true,
          json: async () => ({
            choices: [
              {
                message: {
                  content: "```text\nLine 1\r\nLine 2\n```"
                }
              }
            ]
          })
        };
      };

      const req = {
        method: 'POST',
        body: {
          imageBase64: 'aGVsbG8=',
          mimeType: 'image/png',
          fileName: 'test-doc.png'
        }
      };
      const res = createMockResponse();

      await handler(req, res);

      assert.equal(res.statusCode, 200);
      assert.equal(capturedUrl, 'https://integrate.api.nvidia.com/v1/chat/completions');
      assert.equal(capturedOptions.method, 'POST');
      assert.equal(capturedOptions.headers['Content-Type'], 'application/json');
      assert.equal(capturedOptions.headers.Authorization, 'Bearer test-photo-key');

      const requestBody = JSON.parse(capturedOptions.body);
      assert.equal(requestBody.model, 'meta/llama-3.2-11b-vision-instruct');
      assert.equal(requestBody.temperature, 0);
      assert.equal(requestBody.messages[1].content[0].text, 'OCR transcribe this uploaded image (test-doc.png). Return only exact visible text.');
      assert.equal(requestBody.messages[1].content[1].image_url.url, 'data:image/png;base64,aGVsbG8=');

      // Check normalized text
      assert.deepEqual(res.jsonData, { text: 'Line 1\nLine 2' });
    });

    test('should return 422 if extracted text is empty after normalization', async () => {
      globalThis.fetch = async () => ({
        ok: true,
        json: async () => ({
          choices: [{ message: { content: '   ' } }]
        })
      });

      const req = {
        method: 'POST',
        body: {
          imageBase64: 'aGVsbG8=',
          mimeType: 'image/jpeg'
        }
      };
      const res = createMockResponse();

      await handler(req, res);

      assert.equal(res.statusCode, 422);
      assert.deepEqual(res.jsonData, {
        error: 'No readable text was found in this image. Try a clearer or higher-resolution photo.'
      });
    });

    test('should return error status and message when NVIDIA API returns non-OK status', async () => {
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
          imageBase64: 'aGVsbG8=',
          mimeType: 'image/png'
        }
      };
      const res = createMockResponse();

      await handler(req, res);

      assert.equal(res.statusCode, 401);
      assert.deepEqual(res.jsonData, { error: 'Invalid API Key provided.' });
    });

    test('should fallback to default error message if non-OK response has invalid JSON body', async () => {
      globalThis.fetch = async () => ({
        ok: false,
        status: 503,
        json: async () => {
          throw new Error('Invalid JSON');
        }
      });

      const req = {
        method: 'POST',
        body: {
          imageBase64: 'aGVsbG8=',
          mimeType: 'image/png'
        }
      };
      const res = createMockResponse();

      await handler(req, res);

      assert.equal(res.statusCode, 503);
      assert.deepEqual(res.jsonData, { error: 'NVIDIA OCR request failed.' });
    });

    test('should return 500 when fetch throws network/unexpected error', async () => {
      globalThis.fetch = async () => {
        throw new Error('Network failure');
      };

      const req = {
        method: 'POST',
        body: {
          imageBase64: 'aGVsbG8=',
          mimeType: 'image/jpeg'
        }
      };
      const res = createMockResponse();

      await handler(req, res);

      assert.equal(res.statusCode, 500);
      assert.deepEqual(res.jsonData, {
        error: 'Unable to extract text from the image right now. Please try again.'
      });
    });
  });
});
