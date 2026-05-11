import prisma from "../../utils/prisma.js";

/**
 * Check if a given string is a valid roleName by querying the Role table dynamically.
 * This replaces the old AccountRole enum check.
 */
export async function isValidRoleName(roleName: string): Promise<boolean> {
  const count = await prisma.role.count({ where: { roleName } });
  return count > 0;
}

/**
 * Get all role names from the database.
 */
export async function getAllRoleNames(): Promise<string[]> {
  const roles = await prisma.role.findMany({ select: { roleName: true } });
  return roles.map(r => r.roleName);
}