import RedisClient from "../redis/redis.config.js";
import CacheServiceInterface from "./interface.js";

// This service caches data with TTL supports. Developers now only focus on the service functions. All the connection and configuration details have been implemented earlier.
class CacheService implements CacheServiceInterface {
  readonly redis: typeof RedisClient;
  readonly ttl: number;
  constructor(redisClient: typeof RedisClient, ttl = 1) {
    this.redis = redisClient;
    // Time to live (in days)
    this.ttl = ttl * 86400; // Convert days to seconds
  }

  get isConnected() {
    return this.redis.isReady;
  }

  async set(key: string, value: string) {
    if (this.isConnected) {
      return this.redis.set(key, value, {
        expiration: {
          type: "EX",
          value: this.ttl,
        },
      });
    } else {
      console.warn("Redis server is not connected. Cache set operation failed.");
    }
  }

  async get(key: string) {
    if (this.isConnected) {
      const value = await this.redis.get(key);
      return value;
    } else {
      console.warn("Redis server is not connected. Cache get operation failed.");
      return null;
    }
  }

  async delete(key: string) {
    if (this.isConnected) {
      await this.redis.del(key);
    } else {
      console.warn("Redis server is not connected. Cache delete operation failed.");
    }
  }

  async clear() {
    if (this.isConnected) {
      await this.redis.flushDb();
    } else {
      console.warn("Redis server is not connected. Cache clear operation failed.");
    }
  }
}

export default new CacheService(RedisClient);
export { CacheService };
