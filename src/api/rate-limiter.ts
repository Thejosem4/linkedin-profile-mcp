import Bottleneck from 'bottleneck';

/**
 * Rate limiter configuration for the LinkedIn API.
 * LinkedIn's basic tier allows approximately 100 requests per day.
 * 
 * We use a reservoir of 100 requests that refreshes every 24 hours.
 * We also limit concurrency to 1 and add a small delay between requests.
 */
export const rateLimiter = new Bottleneck({
  maxConcurrent: 1,
  minTime: 1000, // 1 second between requests to prevent rapid-fire issues
  reservoir: 100, // Daily quota
  reservoirRefreshAmount: 100,
  reservoirRefreshInterval: 24 * 60 * 60 * 1000, // 24 hours
});

/**
 * High-priority rate limiter for authentication and critical read operations.
 */
export const highPriorityLimiter = new Bottleneck({
  maxConcurrent: 1,
  minTime: 500,
});

// Setup event listeners for debugging
rateLimiter.on('failed', async (error, jobInfo) => {
  const id = jobInfo.options.id;
  console.warn(`⚠️ Rate limiter job ${id} failed: ${error.message}`);
  
  if (jobInfo.retryCount < 2) {
    console.log(`🔄 Retrying job ${id}...`);
    return 1000 * (jobInfo.retryCount + 1);
  }
});

rateLimiter.on('depleted', () => {
  console.warn('🚨 Rate limit reservoir depleted for the day.');
});
