import { AIProvider } from '../contexts/AIContext';

type RateLimitConfig = {
  maxRequests: number;
  windowMs: number;
};

const rateLimits: Record<AIProvider, RateLimitConfig> = {
  openai: {
    maxRequests: 50,  // 50 requests
    windowMs: 60000   // per minute
  },
  anthropic: {
    maxRequests: 50,  // 50 requests
    windowMs: 60000   // per minute
  },
  gemini: {
    maxRequests: 60,  // 60 requests
    windowMs: 60000   // per minute
  }
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
    const now = Date.now();
    const key = provider;
    const { maxRequests, windowMs } = rateLimits[provider];

    const validRequests = this.cleanup(key, windowMs);
    return validRequests.length < maxRequests;
  }

  addRequest(provider: AIProvider): void {
    const key = provider;
    const requests = this.requests.get(key) || [];
    requests.push(Date.now());
    this.requests.set(key, requests);
  }

  getTimeUntilNextRequest(provider: AIProvider): number {
    const { windowMs } = rateLimits[provider];
    const requests = this.requests.get(provider) || [];
    if (requests.length === 0) return 0;

    const oldestRequest = Math.min(...requests);
    const timeUntilExpiry = windowMs - (Date.now() - oldestRequest);
    return Math.max(0, timeUntilExpiry);
  }
}

// Create a singleton instance
export const rateLimiter = new RateLimiter(); 