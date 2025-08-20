/**
 * Cache management utilities for Domain Nest
 * Handles intelligent caching with TTL and invalidation
 */

export interface CacheConfig {
  ttl: number; // Time to live in milliseconds
  key: string;
  fallbackFn?: () => Promise<any>;
}

export class DomainCache {
  private static instance: DomainCache;
  private cache = new Map<string, { data: any; expires: number }>();

  static getInstance(): DomainCache {
    if (!DomainCache.instance) {
      DomainCache.instance = new DomainCache();
    }
    return DomainCache.instance;
  }

  /**
   * Get cached data or fetch if expired
   */
  async get<T>(key: string, ttl: number, fallbackFn: () => Promise<T>): Promise<T> {
    const cached = this.cache.get(key);
    const now = Date.now();

    // Return cached data if valid
    if (cached && cached.expires > now) {
      return cached.data;
    }

    // Fetch fresh data
    try {
      const freshData = await fallbackFn();
      this.set(key, freshData, ttl);
      return freshData;
    } catch (error) {
      // Return stale data if available and fetch failed
      if (cached) {
        console.warn(`Using stale cache for ${key}:`, error);
        return cached.data;
      }
      throw error;
    }
  }

  /**
   * Set cache data with TTL
   */
  set(key: string, data: any, ttl: number): void {
    this.cache.set(key, {
      data,
      expires: Date.now() + ttl,
    });
  }

  /**
   * Invalidate specific cache key
   */
  invalidate(key: string): void {
    this.cache.delete(key);
  }

  /**
   * Clear all cache
   */
  clear(): void {
    this.cache.clear();
  }

  /**
   * Check if data is stale but exists
   */
  isStale(key: string): boolean {
    const cached = this.cache.get(key);
    return cached ? cached.expires < Date.now() : false;
  }
}

// Cache TTL constants (in milliseconds)
export const CACHE_TTL = {
  WHOIS_DATA: 24 * 60 * 60 * 1000, // 24 hours
  SSL_STATUS: 6 * 60 * 60 * 1000,  // 6 hours
  DNS_RECORDS: 60 * 60 * 1000,     // 1 hour
  UPTIME_CHECK: 5 * 60 * 1000,     // 5 minutes
} as const;

// Cache key generators
export const getCacheKey = {
  whois: (domain: string) => `whois:${domain}`,
  ssl: (domain: string) => `ssl:${domain}`,
  dns: (domain: string) => `dns:${domain}`,
  uptime: (domain: string) => `uptime:${domain}`,
  userDomains: (userId: string) => `user:${userId}:domains`,
};
