import { createClient, SocketTimeoutError } from "redis";

const redisClientConfig = {
  host: "localhost", // Redis server host
  port: 6379, // Redis server port
  password: "", // Redis server password (if required)
};

const RedisClient = await createClient({
  ...redisClientConfig,
  socket: {
    reconnectStrategy: (retries, cause) => {
      // By default, do not reconnect on socket timeout.
      if (cause instanceof SocketTimeoutError) {
        return false;
      }
      // Generate a random jitter between 0 – 200 ms:
      const jitter = Math.floor(Math.random() * 200);
      // Delay is an exponential back off, (times^2) * 50 ms, with a maximum value of 2000 ms:
      const delay = Math.min(Math.pow(2, retries) * 50, 2000);

      return delay + jitter;
    },
  },
})
  .on("error", (err) => console.log("Cannot connect to redis server. Please recheck your configuration.", err))
  .on("connect", () => console.log("Connected to Redis server successfully."))
  .connect();

export default RedisClient;
export type RedisClientType = typeof RedisClient;
export { redisClientConfig };
