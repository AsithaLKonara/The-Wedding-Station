/**
 * Caching abstraction for Facebook posts
 * Supports in-memory cache (default) and Redis (optional)
 */

import Redis from "ioredis";
import type { SanitizedPost } from "@/types";

interface CacheEntry {
  posts: SanitizedPost[];
  timestamp: number;
}

const CACHE_KEY = "fb_posts";
const DEFAULT_TTL = 900; // 15 minutes

class CacheManager {
  private redis: Redis | null = null;
  private memoryCache: Map<string, CacheEntry> = new Map();
  private ttl: number;

  constructor() {
    this.ttl = parseInt(process.env.FB_CACHE_TTL_SECONDS || String(DEFAULT_TTL), 10);
    
    // Initialize Redis if URL is provided
    if (process.env.REDIS_URL) {
      try {
        this.redis = new Redis(process.env.REDIS_URL);
        this.redis.on("error", (err) => {
          console.error("Redis connection error:", err);
          // Fallback to memory cache
          this.redis = null;
        });
      } catch (error) {
        console.error("Failed to initialize Redis:", error);
        this.redis = null;
      }
    }
  }

  /**
   * Get cached posts
   */
  async get(): Promise<SanitizedPost[] | null> {
    if (this.redis) {
      try {
        const cached = await this.redis.get(CACHE_KEY);
        if (cached) {
          const entry: CacheEntry = JSON.parse(cached);
          const age = (Date.now() - entry.timestamp) / 1000;
          
          if (age < this.ttl) {
            return entry.posts;
          }
          // Cache expired, delete it
          await this.redis.del(CACHE_KEY);
        }
      } catch (error) {
        console.error("Redis get error:", error);
        // Fallback to memory cache
      }
    }

    // Fallback to memory cache
    const entry = this.memoryCache.get(CACHE_KEY);
    if (entry) {
      const age = (Date.now() - entry.timestamp) / 1000;
      if (age < this.ttl) {
        return entry.posts;
      }
      // Cache expired
      this.memoryCache.delete(CACHE_KEY);
    }

    return null;
  }

  /**
   * Set cached posts
   */
  async set(posts: SanitizedPost[]): Promise<void> {
    const entry: CacheEntry = {
      posts,
      timestamp: Date.now(),
    };

    if (this.redis) {
      try {
        await this.redis.setex(CACHE_KEY, this.ttl, JSON.stringify(entry));
      } catch (error) {
        console.error("Redis set error:", error);
        // Fallback to memory cache
        this.memoryCache.set(CACHE_KEY, entry);
      }
    } else {
      this.memoryCache.set(CACHE_KEY, entry);
    }
  }

  /**
   * Get cache age in seconds
   */
  async getCacheAge(): Promise<number | null> {
    if (this.redis) {
      try {
        const cached = await this.redis.get(CACHE_KEY);
        if (cached) {
          const entry: CacheEntry = JSON.parse(cached);
          return (Date.now() - entry.timestamp) / 1000;
        }
      } catch (error) {
        console.error("Redis getCacheAge error:", error);
      }
    }

    const entry = this.memoryCache.get(CACHE_KEY);
    if (entry) {
      return (Date.now() - entry.timestamp) / 1000;
    }

    return null;
  }

  /**
   * Clear cache
   */
  async clear(): Promise<void> {
    if (this.redis) {
      try {
        await this.redis.del(CACHE_KEY);
      } catch (error) {
        console.error("Redis clear error:", error);
      }
    }
    this.memoryCache.delete(CACHE_KEY);
  }

  /**
   * Check if cache is available
   */
  isAvailable(): boolean {
    return this.redis !== null || this.memoryCache.size > 0;
  }
}

// Singleton instance
export const cacheManager = new CacheManager();

