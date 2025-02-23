import { AIProvider } from '../contexts/AIContext';

// Validate API key format
export function isValidApiKey(provider: AIProvider, apiKey: string | undefined): boolean {
  if (!apiKey) return false;
  return /^AIza[a-zA-Z0-9-_]{35}$/.test(apiKey);
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
  if (provider !== 'gemini') {
    throw new Error('Only Gemini AI provider is supported');
  }

  const apiKey = process.env.GOOGLE_API_KEY;
  
  if (!isValidApiKey(provider, apiKey)) {
    throw new Error('Invalid or missing Google API key');
  }

  return apiKey as string;
} 