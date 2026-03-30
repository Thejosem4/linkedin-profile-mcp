import Bottleneck from 'bottleneck';
import { quotaTracker } from './quota.js';

/**
 * Rate limiter for LinkedIn API calls.
 * Enforces daily limits and handles retries on 429.
 */
export class RateLimiter {
  private readonly limiter: Bottleneck;

  constructor() {
    this.limiter = new Bottleneck({
      // 100 requests per day is roughly 1 request every 14.4 minutes.
      // However, we want to allow some bursting, so we'll set a more reasonable
      // short-term limit and rely on the QuotaTracker for the daily limit.
      minTime: 1000, // 1 request per second
      maxConcurrent: 1,
    });

    // Handle 429 Too Many Requests
    this.limiter.on('failed', async (error, jobInfo) => {
      if (error.response?.status === 429) {
        const retryAfter = error.response.headers['retry-after'];
        const waitTime = retryAfter ? parseInt(retryAfter, 10) * 1000 : 5000;

        console.warn(`⚠️ Rate limited by LinkedIn. Retrying in ${waitTime}ms...`);
        return waitTime;
      }

      // Don't retry for other errors
      return null;
    });
  }

  /**
   * Executes a function through the rate limiter.
   * Checks the daily quota before executing.
   */
  async schedule<T>(fn: () => Promise<T>): Promise<T> {
    const hasQuota = await quotaTracker.checkQuota();
    if (!hasQuota) {
      throw new Error('❌ Daily API quota exceeded (100 requests/day).');
    }

    return this.limiter.schedule(async () => {
      try {
        const result = await fn();
        await quotaTracker.incrementRequestCount();
        return result;
      } catch (error: any) {
        // If it's a 429, the 'failed' event will handle it.
        // For other errors, we still increment the count if the request was actually made.
        if (error.response) {
          await quotaTracker.incrementRequestCount();
        }
        throw error;
      }
    });
  }
}

export const rateLimiter = new RateLimiter();
