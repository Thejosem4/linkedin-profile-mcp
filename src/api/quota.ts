import fs from 'node:fs/promises';
import path from 'node:path';
import os from 'node:os';

/**
 * Interface for the quota data stored in the JSON file.
 */
interface QuotaData {
  /**
   * The date the quota was last reset (YYYY-MM-DD).
   */
  lastResetDate: string;

  /**
   * The number of requests made today.
   */
  requestCount: number;
}

/**
 * Tracks the number of API requests made to LinkedIn.
 * Enforces a daily limit of 100 requests.
 */
export class QuotaTracker {
  private readonly quotaFilePath: string;
  private readonly dailyLimit = 100;

  constructor() {
    this.quotaFilePath = path.join(os.homedir(), '.linkedin-profile-mcp', 'quota.json');
  }

  /**
   * Ensures the quota directory and file exist.
   */
  private async ensureQuotaFile(): Promise<void> {
    const dir = path.dirname(this.quotaFilePath);
    try {
      await fs.mkdir(dir, { recursive: true });
    } catch (error) {
      // Ignore if directory already exists
    }

    try {
      await fs.access(this.quotaFilePath);
    } catch (error) {
      // File doesn't exist, create it with initial data
      const initialData: QuotaData = {
        lastResetDate: this.getTodayDateString(),
        requestCount: 0,
      };
      await fs.writeFile(this.quotaFilePath, JSON.stringify(initialData, null, 2));
    }
  }

  /**
   * Gets the current date as a YYYY-MM-DD string.
   */
  private getTodayDateString(): string {
    return new Date().toISOString().split('T')[0];
  }

  /**
   * Reads the current quota data from the file.
   */
  private async readQuotaData(): Promise<QuotaData> {
    await this.ensureQuotaFile();
    const content = await fs.readFile(this.quotaFilePath, 'utf-8');
    return JSON.parse(content) as QuotaData;
  }

  /**
   * Writes the quota data to the file.
   */
  private async writeQuotaData(data: QuotaData): Promise<void> {
    await fs.writeFile(this.quotaFilePath, JSON.stringify(data, null, 2));
  }

  /**
   * Checks if the quota has been exceeded for today.
   * Resets the quota if it's a new day.
   */
  async checkQuota(): Promise<boolean> {
    const data = await this.readQuotaData();
    const today = this.getTodayDateString();

    if (data.lastResetDate !== today) {
      // New day, reset quota
      data.lastResetDate = today;
      data.requestCount = 0;
      await this.writeQuotaData(data);
      return true;
    }

    return data.requestCount < this.dailyLimit;
  }

  /**
   * Increments the request count for today.
   */
  async incrementRequestCount(): Promise<void> {
    const data = await this.readQuotaData();
    const today = this.getTodayDateString();

    if (data.lastResetDate !== today) {
      data.lastResetDate = today;
      data.requestCount = 1;
    } else {
      data.requestCount++;
    }

    await this.writeQuotaData(data);
  }

  /**
   * Gets the number of remaining requests for today.
   */
  async getRemainingRequests(): Promise<number> {
    const data = await this.readQuotaData();
    const today = this.getTodayDateString();

    if (data.lastResetDate !== today) {
      return this.dailyLimit;
    }

    return Math.max(0, this.dailyLimit - data.requestCount);
  }
}

export const quotaTracker = new QuotaTracker();
