import { AIProvider } from '../contexts/AIContext';

type RateLimitConfig = {
  maxRequests: number;
  windowMs: number;
};

const RATE_LIMIT: RateLimitConfig = {
  maxRequests: 60,  // 60 requests
  windowMs: 60000   // per minute
};

class RateLimiter {
  private requests: Map<string, number[]>;

  constructor() {
    this.requests = new Map();
  }

  private cleanup(key: string, windowMs: number) {
    const now = Date.now();
    const requests = this.requests.get(key) || [];
    const validRequests = requests.filter(timestamp => now - timestamp < windowMs);
    this.requests.set(key, validRequests);
    return validRequests;
  }

  canMakeRequest(provider: AIProvider): boolean {
    if (provider !== 'gemini') {
      throw new Error('Only Gemini AI provider is supported');
    }

    const now = Date.now();
    const key = provider;
    const { maxRequests, windowMs } = RATE_LIMIT;

    const validRequests = this.cleanup(key, windowMs);
    return validRequests.length < maxRequests;
  }

  addRequest(provider: AIProvider): void {
    if (provider !== 'gemini') {
      throw new Error('Only Gemini AI provider is supported');
    }

    const key = provider;
    const requests = this.requests.get(key) || [];
    requests.push(Date.now());
    this.requests.set(key, requests);
  }

  getTimeUntilNextRequest(provider: AIProvider): number {
    if (provider !== 'gemini') {
      throw new Error('Only Gemini AI provider is supported');
    }

    const { windowMs } = RATE_LIMIT;
    const requests = this.requests.get(provider) || [];
    if (requests.length === 0) return 0;

    const oldestRequest = Math.min(...requests);
    const timeUntilExpiry = windowMs - (Date.now() - oldestRequest);
    return Math.max(0, timeUntilExpiry);
  }
}

// Create a singleton instance
export const rateLimiter = new RateLimiter(); 