import fs from 'node:fs/promises';
import path from 'node:path';
import os from 'node:os';

interface QuotaData {
  used: number;
  lastReset: string;
}

/**
 * Tracks daily API usage to prevent exceeding LinkedIn's limits.
 * Persists data to ~/.linkedin-profile-mcp/quota.json
 */
export class QuotaTracker {
  private readonly quotaDir: string;
  private readonly quotaFile: string;
  private readonly DAILY_LIMIT = 100;

  constructor() {
    this.quotaDir = path.join(os.homedir(), '.linkedin-profile-mcp');
    this.quotaFile = path.join(this.quotaDir, 'quota.json');
  }

  private async ensureDir(): Promise<void> {
    try {
      await fs.mkdir(this.quotaDir, { recursive: true });
    } catch (error) {
      // Ignore if directory exists
    }
  }

  private async readQuota(): Promise<QuotaData> {
    await this.ensureDir();
    try {
      const data = await fs.readFile(this.quotaFile, 'utf-8');
      const parsed = JSON.parse(data);
      
      // Check if we need to reset (new day)
      const lastReset = new Date(parsed.lastReset);
      const now = new Date();
      
      if (lastReset.getUTCDate() !== now.getUTCDate() || 
          lastReset.getUTCMonth() !== now.getUTCMonth() || 
          lastReset.getUTCFullYear() !== now.getUTCFullYear()) {
        return this.resetQuota();
      }
      
      return parsed;
    } catch (error) {
      return this.resetQuota();
    }
  }

  private async resetQuota(): Promise<QuotaData> {
    const data: QuotaData = {
      used: 0,
      lastReset: new Date().toISOString(),
    };
    await this.saveQuota(data);
    return data;
  }

  private async saveQuota(data: QuotaData): Promise<void> {
    await this.ensureDir();
    await fs.writeFile(this.quotaFile, JSON.stringify(data, null, 2));
  }

  /**
   * Increments the usage counter.
   */
  async increment(): Promise<number> {
    const data = await this.readQuota();
    data.used += 1;
    await this.saveQuota(data);
    return data.used;
  }

  /**
   * Gets current usage statistics.
   */
  async getUsage(): Promise<{ used: number; remaining: number; resetAt: string }> {
    const data = await this.readQuota();
    return {
      used: data.used,
      remaining: Math.max(0, this.DAILY_LIMIT - data.used),
      resetAt: new Date(new Date(data.lastReset).getTime() + 24 * 60 * 60 * 1000).toISOString(),
    };
  }

  /**
   * Checks if the daily limit has been reached.
   */
  async isLimitReached(): Promise<boolean> {
    const data = await this.readQuota();
    return data.used >= this.DAILY_LIMIT;
  }
}

export const quota = new QuotaTracker();
