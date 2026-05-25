import rbacService from "../../services/cache/rbac.service.js";
export async function addCache(req, res, next) {
    try {
        // await cacheService.set("test-key", "test-value");
        await rbacService.cacheRole("admin", ["permission1", "permission2"]);
        return res.json({ message: "Cache added successfully" });
    }
    catch (error) {
        next(error);
    }
}
export async function getCache(req, res, next) {
    try {
        if (!(await rbacService.checkCachedRoleExists("admin"))) {
            return res.json({ message: "Cache does not exist for the specified role" });
        }
        const value = await rbacService.getCachedRole("admin");
        return res.json({ message: "Cache retrieved successfully", value });
    }
    catch (error) {
        next(error);
    }
}
export async function deleteCache(req, res, next) {
    try {
        await rbacService.deleteCachedRole("admin");
        return res.json({ message: "Cache deleted successfully" });
    }
    catch (error) {
        next(error);
    }
}
//# sourceMappingURL=test.controller.js.map