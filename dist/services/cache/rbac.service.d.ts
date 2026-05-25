import { RedisClientType } from "../redis/redis.config.js";
import { CacheService } from "./cache.service.js";
declare class RBACService extends CacheService {
    constructor(redisClient: RedisClientType, ttl?: number);
    generateRoleKey(roleName: string): string;
    /**
     * Caches the permissions for a given role.
     * @param roleName Name of the role (not the ID). This will be used to generate the Redis key for storing permissions.
     * @param permissionList (array of permission names, not IDs) Permissions to be associated with the role.
     */
    cacheRole(roleName: string, permissionList: string[]): Promise<null | undefined>;
    /**
     * Retrieves the permissions for a given role from the cache.
     * @param roleName Name of the role to retrieve permissions for. The service handle the key name generation internally, so only the role name is needed.
     * @returns string array of permission names associated with the role. If the role does not exist or has no permissions, an empty array is returned.
     */
    getCachedRole(roleName: string): Promise<string[] | null>;
    /**
     * Delete the cached permissions for a given role. This should be called when a role is deleted or its permissions are updated to ensure the cache remains consistent with the database.
     * @param roleName Name of the role for which to delete cached permissions.
     */
    deleteCachedRole(roleName: string): Promise<void>;
    /**
     * Check if the cache for a specific role exists. Used for avoiding unnecessary database queries when the cache is still valid.
     * @param roleName Name of the role to check for cache existence. The service will handle the key name generation internally.
     * @returns Boolean indicating whether the cache for the specified role exists. Returns true if the cache exists, false otherwise.
     */
    checkCachedRoleExists(roleName: string): Promise<boolean>;
}
declare const _default: RBACService;
export default _default;
//# sourceMappingURL=rbac.service.d.ts.map