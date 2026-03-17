import { createClient } from "redis";

const redisClientConfig = {
  host: "localhost", // Redis server host
  port: 6379, // Redis server port
  password: "", // Redis server password (if required)
};
const MAX_RETRIES = 5; // Maximum number of reconnection attempts before giving up
const RETRY_DURATION = 5000; // Base duration (in ms) for reconnection attempts, will be multiplied by the retry count for exponential backoff

const RedisClient = createClient({
  socket: {
    ...redisClientConfig,
    reconnectStrategy: (retries) => {
      if (retries >= MAX_RETRIES) {
        console.error(`Exceeded maximum reconnection attempts (${MAX_RETRIES}). Giving up.`);
        return new Error("Max retries reached"); // Returning an Error stops retrying
      }
      const jitter = Math.floor(Math.random() * 200);
      const delay = Math.min(Math.pow(2, retries) * 50, RETRY_DURATION);
      console.log(`Attempt ${retries + 1}/${MAX_RETRIES} in ${delay + jitter}ms`);
      return delay + jitter;
    },
  },
});

RedisClient.on("error", () => {});
RedisClient.on("reconnecting", () => console.log("Reconnecting to Redis server..."));
RedisClient.on("ready", () => console.log("The redis server is connected!"));

export default RedisClient;
export type RedisClientType = typeof RedisClient;
export { redisClientConfig };
