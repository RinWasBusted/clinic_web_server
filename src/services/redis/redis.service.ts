import RedisClient from "./redis.config.js";

export async function startRedisService() {
  try {
    await RedisClient.connect();
  } catch (error) {
    console.warn("Failed to connect to Redis server:", error instanceof Error ? error.message : error);
  }
}
