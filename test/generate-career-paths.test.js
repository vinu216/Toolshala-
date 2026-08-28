import { describe, it, beforeEach, afterEach } from 'node:test';
import assert from 'node:assert/strict';
import handler from '../api/generate-career-paths.js';

function createMockReq(options = {}) {
  return {
    method: options.method || 'POST',
    body: options.body || {}
  };
}

function createMockRes() {
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
  return res;
}

describe('api/generate-career-paths handler', () => {
  const originalEnvKey = process.env.OPENAI_API_KEY;
  const originalFetch = globalThis.fetch;

  beforeEach(() => {
    process.env.OPENAI_API_KEY = 'test-openai-api-key';
  });

  afterEach(() => {
    if (originalEnvKey === undefined) {
      delete process.env.OPENAI_API_KEY;
    } else {
      process.env.OPENAI_API_KEY = originalEnvKey;
    }
    globalThis.fetch = originalFetch;
  });

  it('returns 405 when HTTP method is not POST', async () => {
    const req = createMockReq({ method: 'GET' });
    const res = createMockRes();

    await handler(req, res);

    assert.equal(res.statusCode, 405);
    assert.equal(res.headers['Allow'], 'POST');
    assert.deepEqual(res.jsonData, { error: 'Method not allowed. Use POST.' });
  });

  it('returns 500 when OPENAI_API_KEY environment variable is missing', async () => {
    delete process.env.OPENAI_API_KEY;
    const req = createMockReq({ method: 'POST' });
    const res = createMockRes();

    await handler(req, res);

    assert.equal(res.statusCode, 500);
    assert.deepEqual(res.jsonData, {
      error: 'OPENAI_API_KEY is missing on the server. Add it in your deployment environment variables.'
    });
  });

  it('returns 400 when required fields are missing in payload', async () => {
    const req = createMockReq({
      method: 'POST',
      body: { stage: 'College Student', interests: 'Web Dev' } // missing workStyle and strengths
    });
    const res = createMockRes();

    await handler(req, res);

    assert.equal(res.statusCode, 400);
    assert.deepEqual(res.jsonData, {
      error: 'stage, interests, workStyle, and strengths are required.'
    });
  });

  it('returns 200 with structured recommendations when fetch succeeds with valid response', async () => {
    const mockModelContent = JSON.stringify({
      bestMatch: {
        careerTitle: 'Frontend Developer',
        whyItFits: 'Fits coding interest and problem solving.',
        skillsToLearn: ['HTML', 'CSS', 'JavaScript'],
        nextStep: 'Build starter projects'
      },
      paths: [
        {
          careerTitle: 'Frontend Developer',
          whyItFits: 'Fits coding interest and problem solving.',
          skillsToLearn: ['HTML', 'CSS', 'JavaScript'],
          nextStep: 'Build starter projects'
        },
        {
          careerTitle: 'Backend Developer',
          whyItFits: 'Fits system design and logic.',
          skillsToLearn: ['Node.js', 'Express', 'SQL'],
          nextStep: 'Create REST APIs'
        },
        {
          careerTitle: 'Full Stack Developer',
          whyItFits: 'Combines frontend and backend skills.',
          skillsToLearn: ['React', 'Node.js', 'MongoDB'],
          nextStep: 'Build a full stack app'
        }
      ]
    });

    globalThis.fetch = async () => ({
      ok: true,
      status: 200,
      json: async () => ({
        choices: [
          {
            message: {
              content: mockModelContent
            }
          }
        ]
      })
    });

    const req = createMockReq({
      method: 'POST',
      body: {
        stage: 'Final Year Student',
        interests: 'Web Development',
        workStyle: 'Collaborative',
        strengths: 'Problem Solving'
      }
    });
    const res = createMockRes();

    await handler(req, res);

    assert.equal(res.statusCode, 200);
    assert.equal(res.jsonData.bestMatch.careerTitle, 'Frontend Developer');
    assert.equal(res.jsonData.paths.length, 3);
  });

  it('returns OpenAI error status and message when OpenAI API call fails', async () => {
    globalThis.fetch = async () => ({
      ok: false,
      status: 401,
      json: async () => ({
        error: { message: 'Incorrect API key provided.' }
      })
    });

    const req = createMockReq({
      method: 'POST',
      body: {
        stage: 'Student',
        interests: 'Design',
        workStyle: 'Remote',
        strengths: 'UI Design'
      }
    });
    const res = createMockRes();

    await handler(req, res);

    assert.equal(res.statusCode, 401);
    assert.deepEqual(res.jsonData, { error: 'Incorrect API key provided.' });
  });

  it('returns 502 when OpenAI returns invalid JSON content', async () => {
    globalThis.fetch = async () => ({
      ok: true,
      status: 200,
      json: async () => ({
        choices: [
          {
            message: {
              content: 'invalid json content'
            }
          }
        ]
      })
    });

    const req = createMockReq({
      method: 'POST',
      body: {
        stage: 'Student',
        interests: 'Design',
        workStyle: 'Remote',
        strengths: 'UI Design'
      }
    });
    const res = createMockRes();

    await handler(req, res);

    assert.equal(res.statusCode, 502);
    assert.deepEqual(res.jsonData, { error: 'Model response was not valid structured JSON.' });
  });

  it('returns 502 when OpenAI returns incomplete career path options', async () => {
    const mockModelContent = JSON.stringify({
      bestMatch: {
        careerTitle: 'Frontend Developer',
        whyItFits: 'Fits coding interest.',
        skillsToLearn: ['HTML', 'CSS'],
        nextStep: 'Build projects'
      },
      paths: [
        {
          careerTitle: 'Frontend Developer',
          whyItFits: 'Fits coding interest.',
          skillsToLearn: ['HTML', 'CSS'],
          nextStep: 'Build projects'
        }
        // less than 3 paths
      ]
    });

    globalThis.fetch = async () => ({
      ok: true,
      status: 200,
      json: async () => ({
        choices: [
          {
            message: {
              content: mockModelContent
            }
          }
        ]
      })
    });

    const req = createMockReq({
      method: 'POST',
      body: {
        stage: 'Student',
        interests: 'Design',
        workStyle: 'Remote',
        strengths: 'UI Design'
      }
    });
    const res = createMockRes();

    await handler(req, res);

    assert.equal(res.statusCode, 502);
    assert.deepEqual(res.jsonData, { error: 'Career path response was incomplete.' });
  });

  it('returns 500 when fetch rejects with an error (error path in catch block)', async () => {
    globalThis.fetch = async () => {
      throw new Error('Network failure');
    };

    const req = createMockReq({
      method: 'POST',
      body: {
        stage: 'Student',
        interests: 'Design',
        workStyle: 'Remote',
        strengths: 'UI Design'
      }
    });
    const res = createMockRes();

    await handler(req, res);

    assert.equal(res.statusCode, 500);
    assert.deepEqual(res.jsonData, {
      error: 'Unable to generate career suggestions right now. Please try again.'
    });
  });

  it('returns 500 when response.json() throws an error (error path in catch block)', async () => {
    globalThis.fetch = async () => ({
      ok: true,
      status: 200,
      json: async () => {
        throw new Error('JSON parse failed in body');
      }
    });

    const req = createMockReq({
      method: 'POST',
      body: {
        stage: 'Student',
        interests: 'Design',
        workStyle: 'Remote',
        strengths: 'UI Design'
      }
    });
    const res = createMockRes();

    await handler(req, res);

    assert.equal(res.statusCode, 500);
    assert.deepEqual(res.jsonData, {
      error: 'Unable to generate career suggestions right now. Please try again.'
    });
  });
});
