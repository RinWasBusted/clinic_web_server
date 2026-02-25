import { Request, Response } from "express";
import prisma from "../../../utils/prisma.js";
import { checkRole } from "./account.services.js";
import bcrypt from "bcryptjs";
import { NextFunction } from "express-serve-static-core";
import { Prisma } from "../../../utils/prisma.js";
import { Empty, RegisterManyBody } from "../../../dtos/account.js";
export const register = async (req: Request, res: Response) => {
  const { firstName, lastName, role, email, birthDate, phoneNumber } = req.body;
  const currentRole = req.user?.role;
  const existing = await prisma.account.findUnique({ where: { email } });
  if (existing) {
    return res.status(400).json({ message: "Email already in use" });
  }
  const checkRoleResult = checkRole(currentRole || "", role)
  if (checkRoleResult) {
    return res.status(checkRoleResult.status).json({ message: checkRoleResult.message });
  }
  const password = firstName + "@" + lastName;
  const hashed = await bcrypt.hash(password, 10);
  console.log("FIELDS:", {
  firstName,
  lastName,
  email,
  role,
  birthDate,
  phoneNumber,
});
  const createdUser = await prisma.account.create({
    data: {
      email,
      firstName,
      lastName,
      role,
      birthDate,
      phoneNumber,
      password: hashed
    }
  })
  return res.status(201).json({
    message: "User registered successfully",
    user: { id: createdUser.accountID, email: createdUser.email, role: createdUser.role }
  })
}
export const registerMany = async (req: Request<Empty, unknown, RegisterManyBody>, res: Response, next: NextFunction) => {
  try {
    const accounts  = req.body;
    console.log(req.body)
    console.log(accounts)
    if (!accounts)
    {
      return res.status(200).json({
        message: "Register successful 0 account"
      })
    }
    if (!Array.isArray(accounts)) {
    return res.status(400).json({ message: "id must be a array" });
  }
    const tasks = accounts.map((a, index) =>
      (async () => {
        const email = a.email.trim().toLowerCase();
        const password = a.firstName + "@" + a.lastName;
        await prisma.account.create({
          data: {
            firstName: a.firstName.trim(),
            lastName: a.lastName.trim(),
            email,
            role: a.role,
            birthDate: a.birthDate,
            phoneNumber: a.phoneNumber,
            password
          },
        });

        return { index, email };
      })()
    );

    const settled = await Promise.allSettled(tasks);

    const success: Array<{ index: number; email: string }> = [];
    const failed: Array<{ index: number; email: string; reason: string }> = [];

    settled.forEach((r, i) => {
      const acc = accounts[i];
      const email = acc.email.trim().toLowerCase();

      if (r.status === "fulfilled") {
        success.push(r.value);
        return;
      }

      const err = r.reason;

      if (err instanceof Prisma.PrismaClientKnownRequestError) {
        if (err.code === "P2002") {
          failed.push({ index: i, email, reason: "DUPLICATE_UNIQUE" });
          return;
        }
        failed.push({ index: i, email, reason: `PRISMA_${err.code}` });
        return;
      }

      failed.push({ index: i, email, reason: err instanceof Error ? err.message : "UNKNOWN_ERROR" });
    });

    return res.status(200).json({
      message: "Register many completed",
      requestedCount: accounts.length,
      successCount: success.length,
      failedCount: failed.length,
      success,
      failed,
    });
  } catch (error) {
    return next(error);
  }
}
export const GetAllAccounts = async (req: Request, res: Response) => {
  const currentRole = req.user?.role;
  if (currentRole === "staff") {
    const accounts = await prisma.account.findMany({
      where: { role: { in: ["doctor", "pharmacist"] } },
      select: {
        accountID: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        birthDate: true,
        phoneNumber: true,
      },
    });
    return res.status(200).json({ accounts });
  }
  const accounts = await prisma.account.findMany({
    select: {
      accountID: true,
      email: true,
      firstName: true,
      lastName: true,
      role: true,
      birthDate: true,
      phoneNumber: true,
    },
  });
  return res.status(200).json({ accounts });
}
export const GetProfile = async (req: Request, res: Response) => {
  const accountIdToGet = req.params.id ?? "";
  if (Array.isArray(accountIdToGet)) {
    return res.status(400).json({ message: "id must be a string, not an array" });
  }
  const currentUser = await prisma.account.findUnique({
    where: { accountID: accountIdToGet },
    select: {
      accountID: true,
      email: true,
      firstName: true,
      lastName: true,
      role: true,
      birthDate: true,
      phoneNumber: true,
    },
  });
  return res.status(200).json({ user: currentUser });
}
export const UpdateProfile = async (req: Request, res: Response) => {
  const accountIdToUpdate = req.params.id ?? "";
  const currentRole = req.user?.role;
  if (Array.isArray(accountIdToUpdate)) {
    return res.status(400).json({ message: "id must be a string, not an array" });
  }
  const user = await prisma.account.findUnique({
    where: { accountID: accountIdToUpdate },
    select: { password: true, role: true },
  });
  const checkRoleResult = checkRole(currentRole || "", user?.role || "")
  if (checkRoleResult) {
    return res.status(checkRoleResult.status).json({ message: checkRoleResult.message });
  }
  await prisma.account.update({
    where: { accountID: accountIdToUpdate },
    data: req.body

  })
  return res.status(200).json({ message: "Profile updated successfully" })
}
export const updatePassword = async (req: Request, res: Response) => {
  const accountIdToUpdate = req.params.id ?? "";
  const currentRole = req.user?.role;
  const { newPassword } = req.body;
  if (Array.isArray(accountIdToUpdate)) {
    return res.status(400).json({ message: "id must be a string, not an array" });
  }
  const user = await prisma.account.findUnique({
    where: { accountID: accountIdToUpdate },
    select: { password: true, role: true },
  });
  const checkRoleResult = checkRole(currentRole || "", user?.role || "")
  if (checkRoleResult) {
    return res.status(checkRoleResult.status).json({ message: checkRoleResult.message });
  }
  const hashedNewPassword = await bcrypt.hash(newPassword, 10);
  await prisma.account.update({

    where: { accountID: accountIdToUpdate },

    data: { password: hashedNewPassword },
  });
  return res.status(200).json({ message: "Password updated successfully" });
}
export const deleteAccount = async (req: Request, res: Response) => {
  const accountIdToDelete = req.params.id ?? "";
  const currentRole = req.user?.role;
  if (Array.isArray(accountIdToDelete)) {
    return res.status(400).json({ message: "id must be a string, not an array" });
  }
  const accountToDelete = await prisma.account.findUnique({ where: { accountID: accountIdToDelete }, select: { role: true } })
  if (!accountToDelete) {
    return res.status(404).json({ message: "Account not found" });
  }
  const checkRoleResult = checkRole(currentRole || "", accountToDelete.role)
  if (checkRoleResult) {
    return res.status(checkRoleResult.status).json({ message: checkRoleResult.message });
  }

  await prisma.account.delete({ where: { accountID: accountIdToDelete } });
  return res.status(200).json({ message: "Account deleted successfully" });
}
export const DeleteManyAccounts = async (req: Request, res: Response) => {
  const { accountIDs } = req.body;
  const currentRole = req.user?.role;
  if (!["manager", "staff"].includes(currentRole || "")) {
    return res.status(403).json({ message: "Forbidden: Only manager or staff can access this resource" });
  }
  const accountsToDelete = await prisma.account.findMany({
    where: { accountID: { in: accountIDs } },
    select: { role: true, accountID: true }
  });
  for (const account of accountsToDelete) {
    const checkRoleResult = checkRole(currentRole || "", account.role)
    if (checkRoleResult) {
      return res.status(checkRoleResult.status).json({ message: checkRoleResult.message });
    }
  }
  await prisma.account.deleteMany({
    where: { accountID: { in: accountIDs } },
  });
  return res.status(200).json({ message: "Accounts deleted successfully" });
}