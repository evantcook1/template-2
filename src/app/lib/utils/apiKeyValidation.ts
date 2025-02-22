import { AIProvider } from '../contexts/AIContext';

// Validate API key format
export function isValidApiKey(provider: AIProvider, apiKey: string | undefined): boolean {
  if (!apiKey) return false;

  const patterns = {
    openai: /^sk-[a-zA-Z0-9-_]{32,}$/,
    anthropic: /^sk-ant-[a-zA-Z0-9-_]{32,}$/,
    gemini: /^AIza[a-zA-Z0-9-_]{35}$/
  };

  return patterns[provider].test(apiKey);
}

// Mask API key for logging/display
export function maskApiKey(apiKey: string): string {
  if (!apiKey) return '';
  const firstFour = apiKey.slice(0, 4);
  const lastFour = apiKey.slice(-4);
  return `${firstFour}...${lastFour}`;
}

// Get API key with validation
export function getValidatedApiKey(provider: AIProvider): string {
  const apiKeys = {
    openai: process.env.OPENAI_API_KEY,
    anthropic: process.env.ANTHROPIC_API_KEY,
    gemini: process.env.GOOGLE_API_KEY
  };

  const apiKey = apiKeys[provider];
  
  if (!isValidApiKey(provider, apiKey)) {
    throw new Error(`Invalid or missing API key for ${provider}`);
  }

  return apiKey as string;
} 