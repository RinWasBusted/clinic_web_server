import { NextFunction, Request, Response } from "express";
import prisma from "../utils/prisma.js";
type Role = "manager" | "staff" | "doctor" | "pharmacist"
const roleRank: Record<Role, number> = {
    manager: 2,
    staff: 1,
    doctor: 0,
    pharmacist: 0,
};

export const  checkRole = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const currentRole = req.user?.role as Role;
    const targerRoleId = req.params.id ??"";
    if (Array.isArray(targerRoleId)) {
        return res.status(400).json({ message: "id must be a string, not an array" });
    }
    const targetUser = await prisma.account.findUnique({
        where: { accountID: targerRoleId },
        select: { role: true },
    });
    const targetRole = targetUser?.role as Role;
    if (!currentRole || !targetRole) {
        return res.status(400).json({ message: "Invalid role" });
    }
    if (roleRank[currentRole] <= roleRank[targetRole]) {
        return res.status(403).json({
            message: "Cannot operate on same or higher role",
        });
    }
    next();
}
// check role for create account, only manager can create staff and manager, staff can only create doctor and pharmacist
export const authorizeRoles = (...allowedRoles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const role = req.user?.role;

    if (!role || !allowedRoles.includes(role)) {
      return res.status(403).json({ message: "Forbidden", role });
    }

    next();
  };
};