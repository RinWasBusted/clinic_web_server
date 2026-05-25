import RedisClient from "../redis/redis.config.js";
import CacheServiceInterface from "./interface.js";
declare class CacheService implements CacheServiceInterface {
    readonly redis: typeof RedisClient;
    readonly ttl: number;
    constructor(redisClient: typeof RedisClient, ttl?: number);
    get isConnected(): boolean;
    set(key: string, value: string): Promise<string | null | undefined>;
    get(key: string): Promise<string | null>;
    delete(key: string): Promise<void>;
    clear(): Promise<void>;
}
declare const _default: CacheService;
export default _default;
export { CacheService };
//# sourceMappingURL=cache.service.d.ts.map