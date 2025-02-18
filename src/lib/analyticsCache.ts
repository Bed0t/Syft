interface CacheEntry<T> {
  data: T;
  timestamp: number;
  expiresAt: number;
}

interface CacheConfig {
  ttl: number; // Time to live in milliseconds
  maxSize: number;
}

class AnalyticsCache {
  private cache: Map<string, CacheEntry<any>>;
  private config: CacheConfig;

  constructor(config: CacheConfig = { ttl: 5 * 60 * 1000, maxSize: 100 }) {
    this.cache = new Map();
    this.config = config;
  }

  async get<T>(key: string): Promise<T | null> {
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

  set<T>(key: string, data: T, ttl?: number): void {
    if (this.cache.size >= this.config.maxSize) {
      this.evictOldest();
    }

    const timestamp = Date.now();
    const expiresAt = timestamp + (ttl || this.config.ttl);

    this.cache.set(key, {
      data,
      timestamp,
      expiresAt
    });
  }

  invalidate(key: string): void {
    this.cache.delete(key);
  }

  invalidateAll(): void {
    this.cache.clear();
  }

  private evictOldest(): void {
    let oldestKey: string | null = null;
    let oldestTimestamp = Infinity;

    for (const [key, entry] of this.cache.entries()) {
      if (entry.timestamp < oldestTimestamp) {
        oldestTimestamp = entry.timestamp;
        oldestKey = key;
      }
    }

    if (oldestKey) {
      this.cache.delete(oldestKey);
    }
  }
}

// Create singleton instance
export const analyticsCache = new AnalyticsCache();

// Analytics-specific cache keys and helpers
export const CACHE_KEYS = {
  PLATFORM_METRICS: 'platform_metrics',
  USER_METRICS: 'user_metrics',
  AI_METRICS: 'ai_metrics',
  JOB_METRICS: (jobId: string) => `job_metrics_${jobId}`,
  USER_ANALYTICS: (userId: string) => `user_analytics_${userId}`,
};

// Cache decorators
export function cacheable(key: string, ttl?: number) {
  return function (
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor
  ) {
    const originalMethod = descriptor.value;

    descriptor.value = async function (...args: any[]) {
      const cacheKey = typeof key === 'function' ? key(...args) : key;
      const cachedData = await analyticsCache.get(cacheKey);

      if (cachedData) {
        return cachedData;
      }

      const result = await originalMethod.apply(this, args);
      analyticsCache.set(cacheKey, result, ttl);
      return result;
    };

    return descriptor;
  };
}

// Real-time update helpers
export function invalidateCache(keys: string[]): void {
  keys.forEach(key => analyticsCache.invalidate(key));
}

export function updateCachedValue<T>(key: string, updateFn: (current: T) => T): void {
  const current = analyticsCache.get<T>(key);
  if (current) {
    analyticsCache.set(key, updateFn(current));
  }
}

// Batch cache operations
export async function prefetchAnalytics(userId: string): Promise<void> {
  const promises = [
    supabase.rpc('get_platform_metrics'),
    supabase.rpc('get_user_metrics'),
    supabase.rpc('get_ai_metrics')
  ];

  const [platformMetrics, userMetrics, aiMetrics] = await Promise.all(promises);

  analyticsCache.set(CACHE_KEYS.PLATFORM_METRICS, platformMetrics.data);
  analyticsCache.set(CACHE_KEYS.USER_METRICS, userMetrics.data);
  analyticsCache.set(CACHE_KEYS.AI_METRICS, aiMetrics.data);
  analyticsCache.set(CACHE_KEYS.USER_ANALYTICS(userId), {
    platformMetrics: platformMetrics.data,
    userMetrics: userMetrics.data,
    aiMetrics: aiMetrics.data
  });
}

// Cache warming
export async function warmCache(): Promise<void> {
  try {
    const { data: activeUsers } = await supabase
      .from('auth.users')
      .select('id')
      .filter('last_sign_in_at', 'gte', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString());

    await Promise.all(
      activeUsers?.map(user => prefetchAnalytics(user.id)) || []
    );
  } catch (error) {
    console.error('Error warming cache:', error);
  }
} 