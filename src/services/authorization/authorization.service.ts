import prisma from "../../utils/prisma.js";
import rbacService from "../cache/rbac.service.js";

class AuthorizationService {
  constructor() {}

  private renderList(obj: Record<string, Record<string, string>>[] | null): string[] {
    if (!obj) return [];
    return obj.map(({ permission }) => {
      return permission?.code as string;
    });
  }

  async getPermissionsListByRole(
    roleID: string | null | undefined,
    roleName: string | null | undefined
  ): Promise<string[]> {
    if (!roleID || !roleName) return [];
    if (await rbacService.checkCachedRoleExists(roleName)) {
      console.log(`Permissions for role ${roleName} found in cache`);
      const cachedPermissions = await rbacService.getCachedRole(roleName);
      if (cachedPermissions) return cachedPermissions;
    } else {
      // If permissions for the role are not cached, fetch from database and cache it

      const permissions = await prisma.rolePermission.findMany({
        where: { roleID },
        select: {
          permission: {
            select: {
              code: true,
            },
          },
        },
      });
      const permissionList = this.renderList(permissions);
      await rbacService.cacheRole(roleName, permissionList);
      return permissionList;
    }
    return [];
  }
}

export default new AuthorizationService();
