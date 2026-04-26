(function () {
  const RESUME_TOOL_ID = 'resume-headline-generator';
  const RESUME_API_ENDPOINT = '/api/generate-resume-headline';

  const normalizeResult = (payload) => {
    if (!payload || typeof payload !== 'object') {
      return null;
    }

    if (payload.type === 'cards' && Array.isArray(payload.items)) {
      return payload;
    }

    if (Array.isArray(payload.headlines)) {
      const items = payload.headlines
        .map((entry, index) => {
          const text = String(entry?.text || '').trim();
          if (!text) {
            return null;
          }

          const tone = String(entry?.tone || 'Professional').trim();
          return {
            label: `Headline ${index + 1}`,
            text,
            note: `Tone: ${tone}`,
            copyText: text
          };
        })
        .filter(Boolean)
        .slice(0, 5);

      if (!items.length) {
        return null;
      }

      return {
        type: 'cards',
        items
      };
    }

    return null;
  };

  window.ToolShalaAIProvider = {
    async generate({ toolId, values }) {
      if (toolId !== RESUME_TOOL_ID) {
        throw new Error('Unsupported remote tool.');
      }

      const response = await fetch(RESUME_API_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(values)
      });

      const payload = await response.json().catch(() => ({}));
      if (!response.ok) {
        const message = String(payload?.error || 'Headline service is unavailable right now.').trim();
        throw new Error(message);
      }

      const normalized = normalizeResult(payload);
      if (!normalized) {
        throw new Error('The service returned an invalid response format.');
      }

      return normalized;
    }
  };
})();
