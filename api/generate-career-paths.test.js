import { describe, it, beforeEach, afterEach } from 'node:test';
import assert from 'node:assert/strict';
import handler from './generate-career-paths.js';

function createMockReqRes(overrides = {}) {
  const req = {
    method: 'POST',
    body: {
      stage: 'College Student',
      interests: 'Web Development, UI Design',
      workStyle: 'Remote / Independent',
      strengths: 'JavaScript, Problem Solving',
      codingPreference: 'High'
    },
    ...overrides.req
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

const sampleValidOpenAiResponse = {
  choices: [
    {
      message: {
        content: JSON.stringify({
          bestMatch: {
            careerTitle: 'Frontend Developer',
            whyItFits: 'Fits interest in UI design and JavaScript strengths.',
            skillsToLearn: ['React', 'TypeScript', 'CSS/Tailwind'],
            nextStep: 'Build 2 responsive web app projects.'
          },
          paths: [
            {
              careerTitle: 'Frontend Developer',
              whyItFits: 'Fits interest in UI design and JavaScript strengths.',
              skillsToLearn: ['React', 'TypeScript', 'CSS/Tailwind'],
              nextStep: 'Build 2 responsive web app projects.'
            },
            {
              careerTitle: 'UI/UX Engineer',
              whyItFits: 'Bridges design and frontend code.',
              skillsToLearn: ['Figma', 'Design Systems', 'HTML/CSS'],
              nextStep: 'Create a design portfolio on Figma.'
            },
            {
              careerTitle: 'Fullstack Developer',
              whyItFits: 'Extends web development skills to backend.',
              skillsToLearn: ['Node.js', 'Express', 'Databases'],
              nextStep: 'Build a fullstack CRUD application.'
            }
          ]
        })
      }
    }
  ]
};

describe('api/generate-career-paths handler', () => {
  let originalApiKey;
  let originalFetch;

  beforeEach(() => {
    originalApiKey = process.env.OPENAI_API_KEY;
    originalFetch = globalThis.fetch;
    process.env.OPENAI_API_KEY = 'test-api-key';
  });

  afterEach(() => {
    if (originalApiKey !== undefined) {
      process.env.OPENAI_API_KEY = originalApiKey;
    } else {
      delete process.env.OPENAI_API_KEY;
    }
    globalThis.fetch = originalFetch;
  });

  it('should reject non-POST requests with 405 Method Not Allowed', async () => {
    const { req, res } = createMockReqRes({ req: { method: 'GET' } });

    await handler(req, res);

    assert.strictEqual(res.statusCode, 405);
    assert.strictEqual(res.headers['Allow'], 'POST');
    assert.deepStrictEqual(res.body, { error: 'Method not allowed. Use POST.' });
  });

  it('should return 500 if OPENAI_API_KEY is missing', async () => {
    delete process.env.OPENAI_API_KEY;
    const { req, res } = createMockReqRes();

    await handler(req, res);

    assert.strictEqual(res.statusCode, 500);
    assert.strictEqual(
      res.body.error,
      'OPENAI_API_KEY is missing on the server. Add it in your deployment environment variables.'
    );
  });

  it('should return 400 if required body fields are missing or empty', async () => {
    const invalidBodies = [
      {},
      { stage: '', interests: 'Tech', workStyle: 'Remote', strengths: 'Coding' },
      { stage: 'Student', interests: ' ', workStyle: 'Remote', strengths: 'Coding' },
      { stage: 'Student', interests: 'Tech', workStyle: '', strengths: 'Coding' },
      { stage: 'Student', interests: 'Tech', workStyle: 'Remote', strengths: '   ' }
    ];

    for (const body of invalidBodies) {
      const { req, res } = createMockReqRes({ req: { body } });

      await handler(req, res);

      assert.strictEqual(res.statusCode, 400);
      assert.strictEqual(
        res.body.error,
        'stage, interests, workStyle, and strengths are required.'
      );
    }
  });

  it('should forward error from OpenAI API when openAiResponse.ok is false', async () => {
    globalThis.fetch = async () => ({
      ok: false,
      status: 401,
      json: async () => ({ error: { message: 'Incorrect API key provided.' } })
    });

    const { req, res } = createMockReqRes();

    await handler(req, res);

    assert.strictEqual(res.statusCode, 401);
    assert.strictEqual(res.body.error, 'Incorrect API key provided.');
  });

  it('should return fallback error message when OpenAI error response lacks detailed message', async () => {
    globalThis.fetch = async () => ({
      ok: false,
      status: 500,
      json: async () => ({})
    });

    const { req, res } = createMockReqRes();

    await handler(req, res);

    assert.strictEqual(res.statusCode, 500);
    assert.strictEqual(res.body.error, 'OpenAI request failed.');
  });

  it('should return 500 when fetch throws an error (network failure)', async () => {
    globalThis.fetch = async () => {
      throw new Error('Connection timed out');
    };

    const { req, res } = createMockReqRes();

    await handler(req, res);

    assert.strictEqual(res.statusCode, 500);
    assert.strictEqual(
      res.body.error,
      'Unable to generate career suggestions right now. Please try again.'
    );
  });

  it('should return 502 when OpenAI response content is not valid JSON', async () => {
    globalThis.fetch = async () => ({
      ok: true,
      json: async () => ({
        choices: [{ message: { content: 'Invalid JSON Content' } }]
      })
    });

    const { req, res } = createMockReqRes();

    await handler(req, res);

    assert.strictEqual(res.statusCode, 502);
    assert.strictEqual(res.body.error, 'Model response was not valid structured JSON.');
  });

  it('should return 502 when response JSON misses bestMatch or paths array', async () => {
    globalThis.fetch = async () => ({
      ok: true,
      json: async () => ({
        choices: [{ message: { content: JSON.stringify({ bestMatch: {} }) } }]
      })
    });

    const { req, res } = createMockReqRes();

    await handler(req, res);

    assert.strictEqual(res.statusCode, 502);
    assert.strictEqual(res.body.error, 'Model response was not valid structured JSON.');
  });

  it('should return 502 when filtered paths count is fewer than 3', async () => {
    globalThis.fetch = async () => ({
      ok: true,
      json: async () => ({
        choices: [
          {
            message: {
              content: JSON.stringify({
                bestMatch: {
                  careerTitle: 'Frontend Developer',
                  whyItFits: 'Fits well.',
                  skillsToLearn: ['JS'],
                  nextStep: 'Learn'
                },
                paths: [
                  {
                    careerTitle: 'Frontend Developer',
                    whyItFits: 'Fits well.',
                    skillsToLearn: ['JS'],
                    nextStep: 'Learn'
                  },
                  {
                    careerTitle: 'Backend Developer',
                    whyItFits: 'Good fit.',
                    skillsToLearn: ['Node'],
                    nextStep: 'Learn'
                  }
                  // Only 2 paths provided
                ]
              })
            }
          }
        ]
      })
    });

    const { req, res } = createMockReqRes();

    await handler(req, res);

    assert.strictEqual(res.statusCode, 502);
    assert.strictEqual(res.body.error, 'Career path response was incomplete.');
  });

  it('should return 200 with normalized bestMatch and paths on valid response', async () => {
    let capturedUrl;
    let capturedOptions;

    globalThis.fetch = async (url, options) => {
      capturedUrl = url;
      capturedOptions = options;
      return {
        ok: true,
        json: async () => sampleValidOpenAiResponse
      };
    };

    const { req, res } = createMockReqRes();

    await handler(req, res);

    assert.strictEqual(res.statusCode, 200);
    assert.strictEqual(capturedUrl, 'https://api.openai.com/v1/chat/completions');
    assert.strictEqual(capturedOptions.method, 'POST');
    assert.strictEqual(capturedOptions.headers['Authorization'], 'Bearer test-api-key');

    const payload = JSON.parse(capturedOptions.body);
    assert.strictEqual(payload.model, 'gpt-4.1-mini');
    assert.ok(payload.messages[1].content.includes('Coding Preference: High'));

    assert.deepStrictEqual(res.body.bestMatch, {
      careerTitle: 'Frontend Developer',
      whyItFits: 'Fits interest in UI design and JavaScript strengths.',
      skillsToLearn: ['React', 'TypeScript', 'CSS/Tailwind'],
      nextStep: 'Build 2 responsive web app projects.'
    });

    assert.strictEqual(res.body.paths.length, 3);
  });

  it('should overwrite paths[0] with bestMatch if bestMatch is not in paths list', async () => {
    globalThis.fetch = async () => ({
      ok: true,
      json: async () => ({
        choices: [
          {
            message: {
              content: JSON.stringify({
                bestMatch: {
                  careerTitle: 'DevOps Engineer',
                  whyItFits: 'Fits automation focus.',
                  skillsToLearn: ['Docker', 'Kubernetes'],
                  nextStep: 'Learn Linux'
                },
                paths: [
                  {
                    careerTitle: 'Frontend Developer',
                    whyItFits: 'Fits UI.',
                    skillsToLearn: ['HTML', 'CSS'],
                    nextStep: 'Practice'
                  },
                  {
                    careerTitle: 'Backend Developer',
                    whyItFits: 'Fits API.',
                    skillsToLearn: ['Java', 'SQL'],
                    nextStep: 'Practice'
                  },
                  {
                    careerTitle: 'Data Analyst',
                    whyItFits: 'Fits math.',
                    skillsToLearn: ['Python', 'SQL'],
                    nextStep: 'Practice'
                  }
                ]
              })
            }
          }
        ]
      })
    });

    const { req, res } = createMockReqRes();

    await handler(req, res);

    assert.strictEqual(res.statusCode, 200);
    assert.strictEqual(res.body.bestMatch.careerTitle, 'DevOps Engineer');
    assert.strictEqual(res.body.paths[0].careerTitle, 'DevOps Engineer');
  });

  it('should use default codingPreference when omitted in request body', async () => {
    let capturedOptions;

    globalThis.fetch = async (url, options) => {
      capturedOptions = options;
      return {
        ok: true,
        json: async () => sampleValidOpenAiResponse
      };
    };

    const { req, res } = createMockReqRes({
      req: {
        body: {
          stage: 'Fresher',
          interests: 'Data Science',
          workStyle: 'Hybrid',
          strengths: 'Python'
        }
      }
    });

    await handler(req, res);

    assert.strictEqual(res.statusCode, 200);
    const payload = JSON.parse(capturedOptions.body);
    assert.ok(payload.messages[1].content.includes('Coding Preference: not specified'));
  });
});
