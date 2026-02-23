import { Response, Request } from "express";
import { isAccountRole } from "./user.service.js";
import { AccountRole } from "../../generated/prisma/index.js";
import prisma from "../../utils/prisma.js";
export const GetAccountsByRole = async (req: Request, res: Response) => {
    const { role } = req.query;
    if (typeof role !== "string") {
        return res.status(400).json({
            message: "Invalid role parameter",
            allowed: Object.values(AccountRole),
        });
    }
    if (!isAccountRole(role)) {
        return res.status(400).json({ 
            message: "Invalid role value",
            allowed: Object.values(AccountRole),
        });
    }
    const accounts = await prisma.account.findMany({
        where: { role },
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