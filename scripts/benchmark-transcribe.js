import { performance } from 'perf_hooks';

const API_ROUTES = ['/api/transcribe', '/.netlify/functions/transcribe'];

function createMockFetch(routeConfigs) {
  return async function mockFetch(route, options) {
    const config = routeConfigs[route];
    if (!config) throw new Error(`Unknown route: ${route}`);

    return new Promise((resolve, reject) => {
      const signal = options?.signal;
      const timer = setTimeout(() => {
        if (config.error) return reject(new Error(config.error));
        resolve({
          status: config.status,
          ok: config.status >= 200 && config.status < 300,
          json: async () => config.data || {}
        });
      }, config.latency);

      if (signal) {
        signal.addEventListener('abort', () => {
          clearTimeout(timer);
          reject(new DOMException('Aborted', 'AbortError'));
        });
      }
    });
  };
}

// Optimized implementation as in transcription-tool.js
async function callTranscribeOptimized(payload, fetchFn = fetch) {
  const controller = typeof AbortController !== 'undefined' ? new AbortController() : null;
  const signal = controller?.signal;

  const promises = API_ROUTES.map(async (route) => {
    const res = await fetchFn(route, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload), signal });
    if (res.status === 404) throw new Error('Route 404');
    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(data.error || 'Transcription failed.');
    return data;
  });

  try {
    const data = await Promise.any(promises);
    controller?.abort();
    return data;
  } catch (err) {
    controller?.abort();
    if (err instanceof AggregateError) {
      const nonNotFoundError = err.errors.find((e) => e.message !== 'Route 404' && e.name !== 'AbortError');
      if (nonNotFoundError) throw nonNotFoundError;
      throw new Error('Server transcription route not available. Configure /api/transcribe or /.netlify/functions/transcribe on the server.');
    }
    throw err;
  }
}

// Original sequential implementation
async function callTranscribeSequential(payload, fetchFn = fetch) {
  for (const route of API_ROUTES) {
    const res = await fetchFn(route, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
    if (res.status === 404) continue;
    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(data.error || 'Transcription failed.');
    return data;
  }
  throw new Error('Server transcription route not available. Configure /api/transcribe or /.netlify/functions/transcribe on the server.');
}

async function runBenchmarkAndVerification() {
  console.log('=== Performance Benchmarks ===\n');

  const perfTestCases = [
    {
      name: 'Scenario 1: Route 1 returns 404 (100ms), Route 2 returns 200 OK (100ms)',
      routes: {
        '/api/transcribe': { status: 404, latency: 100 },
        '/.netlify/functions/transcribe': { status: 200, latency: 100, data: { text: 'Hello' } }
      }
    },
    {
      name: 'Scenario 2: Route 1 is slow 404 (300ms), Route 2 is fast 200 OK (50ms)',
      routes: {
        '/api/transcribe': { status: 404, latency: 300 },
        '/.netlify/functions/transcribe': { status: 200, latency: 50, data: { text: 'Hello' } }
      }
    },
    {
      name: 'Scenario 3: Route 1 succeeds immediately 200 OK (50ms), Route 2 slow 200 OK (200ms)',
      routes: {
        '/api/transcribe': { status: 200, latency: 50, data: { text: 'Fast route' } },
        '/.netlify/functions/transcribe': { status: 200, latency: 200, data: { text: 'Slow route' } }
      }
    }
  ];

  for (const tc of perfTestCases) {
    console.log(`Test: ${tc.name}`);
    const fetchFn = createMockFetch(tc.routes);
    const payload = { fileName: 'test.webm' };

    const t0 = performance.now();
    const resSeq = await callTranscribeSequential(payload, fetchFn).catch(e => e.message);
    const durSeq = performance.now() - t0;

    const t1 = performance.now();
    const resPar = await callTranscribeOptimized(payload, fetchFn).catch(e => e.message);
    const durPar = performance.now() - t1;

    console.log(`  Sequential: ${durSeq.toFixed(2)} ms | Result: ${JSON.stringify(resSeq)}`);
    console.log(`  Parallel:   ${durPar.toFixed(2)} ms | Result: ${JSON.stringify(resPar)}`);
    const diff = durSeq - durPar;
    const pct = ((durSeq - durPar) / durSeq * 100).toFixed(1);
    console.log(`  Speedup:    ${diff.toFixed(2)} ms faster (${pct}% improvement)\n`);
  }

  console.log('=== Correctness & Edge Case Tests ===\n');

  // Test Case 1: All routes return 404
  {
    const fetchFn = createMockFetch({
      '/api/transcribe': { status: 404, latency: 20 },
      '/.netlify/functions/transcribe': { status: 404, latency: 30 }
    });
    try {
      await callTranscribeOptimized({ fileName: 'test.webm' }, fetchFn);
      console.error('FAIL: Expected error when all routes 404');
    } catch (err) {
      if (err.message.includes('Server transcription route not available')) {
        console.log('PASS: All routes 404 throws correct error');
      } else {
        console.error('FAIL: Unexpected error message:', err.message);
      }
    }
  }

  // Test Case 2: One route returns 500 error, another 404
  {
    const fetchFn = createMockFetch({
      '/api/transcribe': { status: 404, latency: 10 },
      '/.netlify/functions/transcribe': { status: 500, latency: 20, data: { error: 'Quota exceeded' } }
    });
    try {
      await callTranscribeOptimized({ fileName: 'test.webm' }, fetchFn);
      console.error('FAIL: Expected error on 500 response');
    } catch (err) {
      if (err.message === 'Quota exceeded') {
        console.log('PASS: 500 API error is preserved and thrown correctly');
      } else {
        console.error('FAIL: Unexpected error message:', err.message);
      }
    }
  }

  // Test Case 3: In-flight request cancellation on victory
  {
    let cancelled = false;
    const fetchFn = async (route, options) => {
      if (route === '/api/transcribe') {
        return { status: 200, ok: true, json: async () => ({ text: 'Winner' }) };
      }
      return new Promise((_, reject) => {
        options.signal.addEventListener('abort', () => {
          cancelled = true;
          reject(new DOMException('Aborted', 'AbortError'));
        });
      });
    };
    const res = await callTranscribeOptimized({ fileName: 'test.webm' }, fetchFn);
    if (res.text === 'Winner' && cancelled) {
      console.log('PASS: Slow in-flight request was aborted on victory');
    } else {
      console.error('FAIL: Cancellation test failed', { res, cancelled });
    }
  }
}

runBenchmarkAndVerification().catch(console.error);
