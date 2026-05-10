import prisma from "../../utils/prisma.js";

export const permissionService = {
  async getAllPermissions() {
    return prisma.permission.findMany();
  }
};
