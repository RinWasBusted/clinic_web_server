import { createClient } from "redis";

const redisClient = createClient({
    url: 'redis://default:' + process.env.REDIS_PASSWORD + '@localhost:6379'
})

redisClient.on('error', (err) => console.error('Redis Client Error', err));

export const connectRedis = async () => {
    try {
        await redisClient.connect();
        console.log('Connected to Redis');
    } catch (error) {
        console.error('Error connecting to Redis:', error);
    }
}

export default redisClient;