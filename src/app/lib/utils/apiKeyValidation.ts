import { AIProvider } from '../contexts/AIContext';

// Validate API key format
export function isValidApiKey(provider: AIProvider, apiKey: string | undefined): boolean {
  if (!apiKey) return false;
  
  // MODIFIED: Added more flexible validation to handle different API key formats
  switch (provider) {
    case 'gemini':
      return /^AIza[a-zA-Z0-9-_]{35}$/.test(apiKey);
    // Add other providers as needed
    default:
      return apiKey.length > 8; // Basic length check for unknown providers
  }
}

// Mask API key for logging/display
export function maskApiKey(apiKey: string): string {
  if (!apiKey) return '';
  const firstFour = apiKey.slice(0, 4);
  const lastFour = apiKey.slice(-4);
  return `${firstFour}...${lastFour}`;
}

// Get API key with validation
export function getValidatedApiKey(provider: AIProvider): string | null {
  // MODIFIED: Now supports multiple providers and handles missing keys more gracefully
  if (provider !== 'gemini') {
    console.warn(`Provider ${provider} is not fully supported`);
  }

  const apiKey = process.env.GOOGLE_API_KEY;
  
  if (!isValidApiKey(provider, apiKey)) {
    // MODIFIED: Log warning instead of throwing error
    console.warn(`Invalid or missing API key for provider: ${provider}`);
    return null;
  }

  return apiKey as string;
} 