/**
 * API Response Caching
 *
 * Implements stale-while-revalidate pattern for API responses.
 * Caches static data and user profile data to improve performance.
 */

interface CacheEntry<T> {
  data: T;
  timestamp: number;
  expiresAt: number;
}

interface CacheOptions {
  ttl?: number; // Time to live in milliseconds
  staleWhileRevalidate?: boolean;
  maxAge?: number; // Maximum age before considering stale
}

class APICache {
  private cache: Map<string, CacheEntry<any>> = new Map();
  private defaultTTL = 5 * 60 * 1000; // 5 minutes
  private defaultMaxAge = 30 * 60 * 1000; // 30 minutes

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

  set<T>(key: string, data: T, options: CacheOptions = {}): void {
    const ttl = options.ttl || this.defaultTTL;
    const expiresAt = Date.now() + ttl;

    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      expiresAt,
    });
  }

  isStale(key: string, maxAge?: number): boolean {
    const entry = this.cache.get(key);

    if (!entry) {
      return true;
    }

    const age = Date.now() - entry.timestamp;
    const max = maxAge || this.defaultMaxAge;

    return age > max;
  }

  invalidate(key: string): void {
    this.cache.delete(key);
  }

  invalidatePattern(pattern: string | RegExp): void {
    const regex = typeof pattern === 'string' ? new RegExp(pattern) : pattern;

    for (const key of this.cache.keys()) {
      if (regex.test(key)) {
        this.cache.delete(key);
      }
    }
  }

  clear(): void {
    this.cache.clear();
  }

  size(): number {
    return this.cache.size;
  }
}

const apiCache = new APICache();

export const cacheKeys = {
  userProfile: (userId?: string) => `user:profile:${userId || 'current'}`,
  numerologyProfile: (userId?: string) => `numerology:profile:${userId || 'current'}`,
  dailyReading: (date: string, userId?: string) => `numerology:daily:${date}:${userId || 'current'}`,
  birthChart: (userId?: string) => `numerology:birth-chart:${userId || 'current'}`,
  people: (userId?: string) => `people:list:${userId || 'current'}`,
  reports: (userId?: string) => `reports:list:${userId || 'current'}`,
  consultations: (userId?: string) => `consultations:list:${userId || 'current'}`,
  lifePathDescriptions: () => 'static:life-path-descriptions',
  numberMeanings: () => 'static:number-meanings',
  featureFlags: (userId?: string) => `feature-flags:${userId || 'current'}`,
};

export async function cachedFetch<T>(
  key: string,
  fetcher: () => Promise<T>,
  options: CacheOptions = {}
): Promise<T> {
  const cached = apiCache.get<T>(key);
  const isStale = apiCache.isStale(key, options.maxAge);

  if (cached && !isStale) {
    return cached;
  }

  if (cached && isStale && options.staleWhileRevalidate !== false) {
    fetcher()
      .then((data) => {
        apiCache.set(key, data, options);
      })
      .catch((error) => {
        console.error('Background revalidation failed:', error);
      });

    return cached;
  }

  try {
    const data = await fetcher();
    apiCache.set(key, data, options);
    return data;
  } catch (error) {
    if (cached) {
      return cached;
    }
    throw error;
  }
}

export async function prefetch<T>(
  key: string,
  fetcher: () => Promise<T>,
  options: CacheOptions = {}
): Promise<void> {
  try {
    const data = await fetcher();
    apiCache.set(key, data, options);
  } catch (error) {
    console.error('Prefetch failed:', error);
  }
}

export const cache = {
  get: <T>(key: string) => apiCache.get<T>(key),
  set: <T>(key: string, data: T, options?: CacheOptions) => apiCache.set(key, data, options),
  invalidate: (key: string) => apiCache.invalidate(key),
  invalidatePattern: (pattern: string | RegExp) => apiCache.invalidatePattern(pattern),
  clear: () => apiCache.clear(),
  isStale: (key: string, maxAge?: number) => apiCache.isStale(key, maxAge),
};

export default apiCache;

