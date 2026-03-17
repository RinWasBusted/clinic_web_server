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

  test() {
    console.log("CacheService is working");
  }

  async set(key: string, value: string) {
    return this.redis.set(key, value, {
      expiration: {
        type: "EX",
        value: this.ttl,
      },
    });
  }

  async get(key: string) {
    const value = await this.redis.get(key);
    return value;
  }

  async delete(key: string) {
    await this.redis.del(key);
  }

  async clear() {
    await this.redis.flushDb();
  }
}

export default new CacheService(RedisClient);
export { CacheService };
