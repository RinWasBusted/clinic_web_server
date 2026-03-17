import type { Request, Response, NextFunction } from "express";
import cacheService from "../../services/cache/cache.service.js";
import rbacService from "../../services/cache/rbac.service.js";

export async function addCache(req: Request, res: Response, next: NextFunction) {
  try {
    // await cacheService.set("test-key", "test-value");
    await rbacService.cacheRole("admin", ["permission1", "permission2"]);
    return res.json({ message: "Cache added successfully" });
  } catch (error) {
    next(error);
  }
}

export async function getCache(req: Request, res: Response, next: NextFunction) {
  try {
    if (!(await rbacService.checkCachedRoleExists("admin"))) {
      return res.json({ message: "Cache does not exist for the specified role" });
    }
    const value = await rbacService.getCachedRole("admin");
    return res.json({ message: "Cache retrieved successfully", value });
  } catch (error) {
    next(error);
  }
}
export async function deleteCache(req: Request, res: Response, next: NextFunction) {
  try {
    await rbacService.deleteCachedRole("admin");
    return res.json({ message: "Cache deleted successfully" });
  } catch (error) {
    next(error);
  }
}
