const normalizeBaseUrl = (baseUrl = '') => String(baseUrl || '').trim().replace(/\/+$/, '');
const getEnvString = (key, fallback = '') => String(process.env[key] || fallback).trim();

const hasEnv = (key) => Boolean(getEnvString(key));

const resolveVisionProvider = (providerEnv, fallbackProvider = 'openai') => {
  const explicitProvider = getEnvString(providerEnv) || getEnvString('VISION_PROVIDER');
  if (explicitProvider) return explicitProvider.toLowerCase();
  if (hasEnv('NVIDIA_API_KEY')) return 'nvidia';
  if (hasEnv('OPENAI_API_KEY')) return 'openai';
  return fallbackProvider;
};

const buildVisionConfig = ({
  providerEnv,
  apiKeyEnv,
  modelEnv,
  baseUrlEnv,
  fallbackProvider = 'openai',
  defaultOpenAiModel = 'gpt-4o-mini',
  defaultNvidiaModel = 'meta/llama-3.2-11b-vision-instruct'
}) => {
  const provider = resolveVisionProvider(providerEnv, fallbackProvider);

  if (provider === 'nvidia') {
    return {
      provider,
      apiKey: getEnvString(apiKeyEnv, getEnvString('VISION_API_KEY', getEnvString('NVIDIA_API_KEY'))),
      model: getEnvString(modelEnv, getEnvString('VISION_MODEL', defaultNvidiaModel)),
      baseUrl: normalizeBaseUrl(getEnvString(baseUrlEnv, getEnvString('VISION_BASE_URL', 'https://integrate.api.nvidia.com/v1')))
    };
  }

  if (provider === 'openai' || provider === 'openai-compatible') {
    return {
      provider,
      apiKey: getEnvString(apiKeyEnv, getEnvString('VISION_API_KEY', provider === 'openai' ? getEnvString('OPENAI_API_KEY') : '')),
      model: getEnvString(modelEnv, getEnvString('VISION_MODEL', defaultOpenAiModel)),
      baseUrl: normalizeBaseUrl(getEnvString(baseUrlEnv, getEnvString('VISION_BASE_URL', provider === 'openai' ? 'https://api.openai.com/v1' : '')))
    };
  }

  return { provider, apiKey: '', model: '', baseUrl: '' };
};

const getVisionConfigError = (toolName, config) => {
  if (!['nvidia', 'openai', 'openai-compatible'].includes(config.provider)) {
    return `Unsupported ${toolName} provider "${config.provider}". Set a supported provider: nvidia, openai, or openai-compatible.`;
  }
  if (!config.apiKey) {
    if (config.provider === 'nvidia') return `${toolName} is not configured. Add NVIDIA_API_KEY${toolName.includes('Photo') ? ' or PHOTO_TO_TEXT_API_KEY' : ''} on the server.`;
    if (config.provider === 'openai') return `${toolName} is not configured. Add OPENAI_API_KEY on the server, or set VISION_PROVIDER=nvidia with NVIDIA_API_KEY.`;
    return `${toolName} is not configured. Add VISION_API_KEY (or the tool-specific API key), VISION_BASE_URL, and a vision-capable model on the server.`;
  }
  if (!config.model) return `${toolName} model is not configured. Add a vision-capable model env var.`;
  if (!config.baseUrl && !config.endpoint) return `${toolName} endpoint is not configured. Add the provider endpoint/base URL env var.`;
  return '';
};

module.exports = { buildVisionConfig, getEnvString, getVisionConfigError, normalizeBaseUrl };
