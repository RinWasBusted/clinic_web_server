import { Response, Request } from "express";
import { getAllRoleNames, isValidRoleName } from "./user.service.js";
import prisma from "../../utils/prisma.js";

export const GetAccountsByRole = async (req: Request, res: Response) => {
    const { role } = req.query;
    if (typeof role !== "string") {
        const allRoles = await getAllRoleNames();
        return res.status(400).json({
            message: "Invalid role parameter",
            allowed: allRoles,
        });
    }

    const valid = await isValidRoleName(role);
    if (!valid) {
        const allRoles = await getAllRoleNames();
        return res.status(400).json({
            message: "Invalid role value",
            allowed: allRoles,
        });
    }

    // Find the role record to get roleID for filtering
    const roleRecord = await prisma.role.findFirst({ where: { roleName: role } });
    if (!roleRecord) {
        return res.status(404).json({ message: "Role not found" });
    }

    const accounts = await prisma.account.findMany({
        where: { roleID: roleRecord.roleID },
        select: {
            accountID: true,
            email: true,
            firstName: true,
            lastName: true,
            role: true,
            birthDate: true,
        },
    });
    return res.status(200).json({ accounts });
}