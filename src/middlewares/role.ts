import { NextFunction, Request, Response } from "express";
import prisma from "../utils/prisma.js";

// Change name to roleName for compatibility with old code.
// Now checks role rank dynamically by comparing roleID from DB instead of hardcoded strings.
export const checkRole = async (req: Request, res: Response, next: NextFunction) => {
  const currentAccountId = req.user?.id;
  const targetAccountId = req.params.id ?? "";

  if (Array.isArray(targetAccountId)) {
    return res.status(400).json({ message: "id must be a string, not an array" });
  }

  if (!currentAccountId) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  // Fetch both accounts with their role relations in parallel
  const [currentAccount, targetAccount] = await Promise.all([
    prisma.account.findUnique({
      where: { accountID: currentAccountId },
      select: { roleID: true, roleName: true },
    }),
    prisma.account.findUnique({
      where: { accountID: targetAccountId },
      select: { roleID: true, roleName: true },
    }),
  ]);

  if (!currentAccount || !targetAccount) {
    return res.status(400).json({ message: "Account not found" });
  }

  // Block operating on own account
  if (currentAccountId === targetAccountId) {
    return res.status(400).json({ message: "Cannot operate on your own account" });
  }

  // If both accounts are under the same role, block the operation
  if (currentAccount.roleID && currentAccount.roleID === targetAccount.roleID) {
    return res.status(403).json({ message: "Cannot operate on account with the same role" });
  }

  next();
};

/**
 * Authorize by permission codes (RBAC).
 * Replaces old authorizeRoles(...roleNames) which compared hardcoded role name strings.
 * Works with req.user.permissions populated by verifyToken middleware.
 *
 * Usage: authorizeRoles("account.read", "account.write")
 * By default checks if user has ANY of the listed permissions (partial=true).
 */
export const authorizeRoles = (...allowedPermissions: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const userPermissions = req.user?.permissions as string[] | undefined;

    if (!userPermissions) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    if (allowedPermissions.length > 0) {
      const hasPermission = allowedPermissions.some(p => userPermissions.includes(p));
      if (!hasPermission) {
        return res.status(403).json({ message: "Forbidden", required: allowedPermissions });
      }
    }

    next();
  };
};
