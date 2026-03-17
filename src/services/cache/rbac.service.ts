import RedisClient, { RedisClientType } from "../redis/redis.config.js";
import { CacheService } from "./cache.service.js";

// Based on the CacheService, RBACService implements role-based access control (RBAC) specific caching logic, using lists

class RBACService extends CacheService {
  constructor(redisClient: RedisClientType, ttl = 1) {
    super(redisClient, ttl);
  }

  // Generate a unique key for each role to store its permissions in Redis.
  generateRoleKey(roleName: string) {
    const prefix = "rbac:role";
    return `${prefix}:${roleName}`;
  }

  /**
   * Caches the permissions for a given role.
   * @param roleName Name of the role (not the ID). This will be used to generate the Redis key for storing permissions.
   * @param permissionList (array of permission names, not IDs) Permissions to be associated with the role.
   */
  async cacheRole(roleName: string, permissionList: string[]) {
    const key = this.generateRoleKey(roleName);
    await this.redis.del(key); // Clear existing permissions for the role
    if (permissionList.length > 0) {
      await this.redis.rPush(key, permissionList);
      this.redis.expire(key, this.ttl); // Set TTL for the role permissions
    } else {
      console.warn(`No permissions provided for role "${roleName}". Aborted caching.`);
    }
  }

  /**
   * Retrieves the permissions for a given role from the cache.
   * @param roleName Name of the role to retrieve permissions for. The service handle the key name generation internally, so only the role name is needed.
   * @returns string array of permission names associated with the role. If the role does not exist or has no permissions, an empty array is returned.
   */
  async getCachedRole(roleName: string): Promise<string[]> {
    const key = this.generateRoleKey(roleName);
    const permissions = await this.redis.lRange(key, 0, -1);
    return permissions;
  }

  /**
   * Delete the cached permissions for a given role. This should be called when a role is deleted or its permissions are updated to ensure the cache remains consistent with the database.
   * @param roleName Name of the role for which to delete cached permissions.
   */
  async deleteCachedRole(roleName: string) {
    const key = this.generateRoleKey(roleName);
    await this.redis.del(key);
  }

  /**
   * Check if the cache for a specific role exists. Used for avoiding unnecessary database queries when the cache is still valid.
   * @param roleName Name of the role to check for cache existence. The service will handle the key name generation internally.
   * @returns Boolean indicating whether the cache for the specified role exists. Returns true if the cache exists, false otherwise.
   */
  async checkCachedRoleExists(roleName: string): Promise<boolean> {
    const key = this.generateRoleKey(roleName);
    const exists = await this.redis.exists(key);
    return exists === 1; // Redis returns 1 if the key exists, 0 otherwise
  }
}

export default new RBACService(RedisClient);
