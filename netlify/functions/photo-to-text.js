const MAX_IMAGE_BYTES = 8 * 1024 * 1024;
const ALLOWED_MIME_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp', 'image/heic', 'image/heif']);
const EXTENSION_MIME_TYPES = {
  jpg: 'image/jpeg',
  jpeg: 'image/jpeg',
  png: 'image/png',
  webp: 'image/webp',
  heic: 'image/heic',
  heif: 'image/heif'
};

const OCR_SYSTEM_PROMPT = 'You are an OCR engine. Transcribe the visible text from the uploaded image exactly as it appears. Do not describe the image, do not summarize, do not explain, do not infer missing words, and do not add any extra text. Preserve line breaks, punctuation, numbering, bullet points, and paragraph structure as much as possible. Return only the extracted text.';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Content-Type': 'application/json'
};

const jsonResponse = (statusCode, body) => ({
  statusCode,
  headers: corsHeaders,
  body: JSON.stringify(body)
});

const parseImagePayload = (imageData = '') => {
  const value = String(imageData || '').trim();
  const match = value.match(/^data:([^;]+);base64,(.+)$/i);
  if (match) {
    return { mimeType: match[1].toLowerCase(), base64: match[2] };
  }
  return { mimeType: '', base64: value };
};

const normalizeExtractedText = (text = '') =>
  String(text || '')
    .replace(/\r\n/g, '\n')
    .replace(/[ \t]+\n/g, '\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim();

const buildPrompt = () =>
  [
    OCR_SYSTEM_PROMPT,
    'Keep the same language as the text in the image.',
    'If no readable text is visible, return an empty response with no explanation.'
  ].join(' ');

const cleanModelOcrOutput = (text = '') => {
  let value = normalizeExtractedText(text)
    .replace(/^```(?:text|ocr|plaintext)?\s*/i, '')
    .replace(/\s*```$/i, '')
    .trim();

  value = value.replace(/^(?:here(?:\s+is|\'s)?\s+)?(?:the\s+)?(?:extracted\s+text|ocr\s+text|transcription|visible\s+text|text\s+in\s+the\s+image)\s*:\s*/i, '');
  value = value.replace(/^(?:the|this)\s+(?:image|picture|photo)\s+(?:contains|shows|has)\s+(?:the\s+following\s+)?(?:visible\s+)?text\s*:\s*/i, '');
  value = value.replace(/^i\s+can\s+(?:read|see)\s+(?:the\s+following\s+)?text\s*:\s*/i, '');

  value = normalizeExtractedText(value);
  const compact = value.replace(/\s+/g, ' ').trim().toLowerCase();
  const descriptivePatterns = [
    /^(?:the|this) (?:image|picture|photo) (?:shows|depicts|appears|looks like|is)\b/,
    /^i (?:can see|see|notice)\b/,
    /^it (?:shows|appears|looks like|contains|depicts)\b/,
    /^there (?:is|are)\b.*\b(?:in|on) (?:the|this) (?:image|picture|photo)\b/,
    /^(?:sorry|i['’]?m sorry|i cannot|i can['’]?t)\b/,
    /^(?:no readable text|there is no readable text|no text is visible)\b/
  ];

  return descriptivePatterns.some((pattern) => pattern.test(compact)) ? '' : value;
};

const extractWithOpenAI = async ({ base64, mimeType }) => {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return null;
  }

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      model: process.env.OPENAI_VISION_MODEL || 'gpt-4o-mini',
      messages: [
        { role: 'system', content: OCR_SYSTEM_PROMPT },
        {
          role: 'user',
          content: [
            { type: 'text', text: buildPrompt() },
            { type: 'image_url', image_url: { url: `data:${mimeType};base64,${base64}` } }
          ]
        }
      ],
      temperature: 0,
      max_tokens: 4096
    })
  });

  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(data?.error?.message || 'OpenAI vision OCR request failed.');
  }

  return cleanModelOcrOutput(data?.choices?.[0]?.message?.content || '');
};

const extractWithNvidia = async ({ base64, mimeType }) => {
  const apiKey = process.env.NVIDIA_API_KEY;
  if (!apiKey) {
    return null;
  }

  const response = await fetch('https://integrate.api.nvidia.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      model: process.env.NVIDIA_VISION_MODEL || process.env.NVIDIA_OCR_MODEL || 'meta/llama-3.2-11b-vision-instruct',
      messages: [
        { role: 'system', content: OCR_SYSTEM_PROMPT },
        {
          role: 'user',
          content: [
            { type: 'text', text: buildPrompt() },
            { type: 'image_url', image_url: { url: `data:${mimeType};base64,${base64}` } }
          ]
        }
      ],
      temperature: 0,
      top_p: 1,
      max_tokens: 4096,
      stream: false
    })
  });

  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(data?.error?.message || 'NVIDIA vision OCR request failed.');
  }

  return cleanModelOcrOutput(data?.choices?.[0]?.message?.content || data?.choices?.[0]?.delta?.content || '');
};

exports.handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 204, headers: corsHeaders, body: '' };
  }

  if (event.httpMethod !== 'POST') {
    return jsonResponse(405, { error: 'Method not allowed' });
  }

  let body = {};
  try {
    body = JSON.parse(event.body || '{}');
  } catch (_error) {
    return jsonResponse(400, { error: 'Invalid JSON body.' });
  }

  const { mimeType: dataUrlMimeType, base64 } = parseImagePayload(body.imageBase64 || body.imageData);
  const filename = String(body.fileName || body.filename || 'uploaded image').slice(0, 180);
  const extension = filename.split('.').pop()?.toLowerCase() || '';
  const mimeType = String(body.mimeType || dataUrlMimeType || EXTENSION_MIME_TYPES[extension] || '').toLowerCase();

  if (!base64) {
    return jsonResponse(400, { error: 'Image data is required.' });
  }

  if (!ALLOWED_MIME_TYPES.has(mimeType)) {
    return jsonResponse(400, { error: 'Unsupported image type. Please upload a JPEG, PNG, WEBP, HEIC, or HEIF image.' });
  }

  const normalizedBase64 = base64.replace(/\s/g, '');
  if (!/^[A-Za-z0-9+/]+={0,2}$/.test(normalizedBase64)) {
    return jsonResponse(400, { error: 'Invalid image data. Please upload the image again.' });
  }

  const estimatedBytes = Math.floor((normalizedBase64.length * 3) / 4);
  if (estimatedBytes > MAX_IMAGE_BYTES) {
    return jsonResponse(413, { error: 'Image is too large. Please upload an image up to 8 MB.' });
  }

  try {
    let text = await extractWithOpenAI({ base64: normalizedBase64, mimeType, filename });
    if (text === null) {
      text = await extractWithNvidia({ base64: normalizedBase64, mimeType, filename });
    }

    if (text === null) {
      return jsonResponse(500, {
        error: 'Text extraction is temporarily unavailable. Please try again later.'
      });
    }

    if (!text) {
      return jsonResponse(422, { error: 'No readable text was found in this image. Try a clearer or higher-resolution photo.' });
    }

    return jsonResponse(200, { text });
  } catch (error) {
    return jsonResponse(502, { error: error?.message || 'Text extraction failed. Please try another clear image.' });
  }
};
