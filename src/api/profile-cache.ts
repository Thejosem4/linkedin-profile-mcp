/**
 * Simple in-memory cache for profile data.
 * Enforces a 5-minute TTL.
 */
export class ProfileCache {
  private cache: Map<string, { data: any; expiresAt: number }>;
  private readonly ttl: number;

  constructor(ttlMinutes: number = 5) {
    this.cache = new Map();
    this.ttl = ttlMinutes * 60 * 1000;
  }

  /**
   * Gets data from the cache.
   * Returns null if the data is not found or has expired.
   */
  get<T>(key: string): T | null {
    const entry = this.cache.get(key);
    if (!entry) {
      return null;
    }

    if (Date.now() > entry.expiresAt) {
      this.cache.delete(key);
      return null;
    }

    return entry.data as T;
  }

  /**
   * Sets data in the cache with the configured TTL.
   */
  set<T>(key: string, data: T): void {
    this.cache.set(key, {
      data,
      expiresAt: Date.now() + this.ttl,
    });
  }

  /**
   * Clears the cache.
   */
  clear(): void {
    this.cache.clear();
  }

  /**
   * Removes a specific key from the cache.
   */
  delete(key: string): void {
    this.cache.delete(key);
  }
}

export const profileCache = new ProfileCache();
