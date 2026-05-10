import { Request, Response } from "express";
import prisma from "../../../utils/prisma.js";
import { updateAvatar as updateAvatarService, buildProfileCreate } from "./account.services.js";
import bcrypt from "bcryptjs";
import { NextFunction } from "express-serve-static-core";
import { Prisma } from "../../../utils/prisma.js";
import { Empty, RegisterManyBody } from "../../../dtos/account.js";
import random6Digits from "../../../utils/generateCode.js";
export const register = async (req: Request, res: Response) => {
  const { firstName, lastName, role, email, birthDate, phoneNumber } = req.body;
  console.log(req.body)
  const existing = await prisma.account.findUnique({ where: { email } });
  if (existing) {
    return res.status(400).json({ message: "Email already in use" });
  }
  if (!role) {
    return res.status(400).json({ message: `Role is required` });
  }
  const roleRecord = await prisma.role.findUnique({ where: { roleID: role } });
  if (!roleRecord) {
    return res.status(400).json({ message: `Role not found` });
  }
  console.log(roleRecord)
  const password = firstName + "@" + lastName;
  const code = random6Digits("NV");
  const hashed = await bcrypt.hash(password, 10);
  const createdUser = await prisma.account.create({
    data: {
      email,
      firstName,
      lastName,
      roleName: roleRecord.roleName,
      roleID: role,
      birthDate,
      phoneNumber,
      password: hashed,
      DisplayID: code,
    }
  })
  return res.status(201).json({
    message: "User registered successfully",
    user: { id: createdUser.accountID, email: createdUser.email }
  })
}
export const registerMany = async (req: Request<Empty, unknown, RegisterManyBody>, res: Response, next: NextFunction) => {
  try {
    const accounts = req.body;
    console.log(req.body)
    console.log(accounts)
    if (!accounts) {
      return res.status(200).json({
        message: "Register successful 0 account"
      })
    }
    if (!Array.isArray(accounts)) {
      return res.status(400).json({ message: "id must be a array" });
    }
    const roles = await prisma.role.findMany();
    const roleMap = new Map(roles.map(r => [r.roleID, r]));

    const tasks = accounts.map((a, index) =>
      (async () => {
        const roleRecord = roleMap.get(a.role);
        if (!roleRecord) {
          throw new Error(`Role not found`);
        }

        const email = a.email.trim().toLowerCase();
        const password = a.firstName + "@" + a.lastName;
        const hashed = await bcrypt.hash(password, 10);;
        const code = random6Digits("NV");
        await prisma.account.create({
          data: {
            firstName: a.firstName.trim(),
            lastName: a.lastName.trim(),
            email,
            roleName: roleRecord.roleName,
            roleID: a.role,
            birthDate: a.birthDate,
            phoneNumber: a.phoneNumber,
            password: hashed,
            DisplayID: code,
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
  const accounts = await prisma.account.findMany({
    omit: {
      password: true,
    },
    include: {
      role: true,
      workspaces: true
    }
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
    omit: {
      password: true,
    },
    include: {
      role: true,
      workspaces: true,
      patient: true
    }
  });
  if (!currentUser) {
    return res.status(404).json({ message: "Account not found" });
  }
  return res.status(200).json({ user: currentUser });
}
export const UpdateProfile = async (req: Request, res: Response) => {
  const currentAccount = req.userAccount;
  const result = await prisma.account.update({
    where: { accountID: currentAccount?.accountID },
    data: req.body

  })
  if (result) {
    return res.status(200).json({ message: "Profile updated successfully" })
  }
  return res.status(400).json({ message: "Profile updated failed" })
}
export const updatePassword = async (req: Request, res: Response) => {
  const accountIdToUpdate = req.params.id ?? "";
  const { newPassword } = req.body;
  if (Array.isArray(accountIdToUpdate)) {
    return res.status(400).json({ message: "id must be a string, not an array" });
  }
  const user = await prisma.account.findUnique({
    where: { accountID: accountIdToUpdate },
    select: { password: true, roleName: true, role: true },
  });
  if (!user) {
    return res.status(404).json({ message: "Account not found" });
  }
  const hashedNewPassword = await bcrypt.hash(newPassword, 10);
  await prisma.account.update({
    where: { accountID: accountIdToUpdate },
    data: { password: hashedNewPassword },
  });
  return res.status(200).json({ message: "Password updated successfully" });
}
export const updateAvatar = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const accountIdToUpdate = req.params.id ?? "";

    if (!req.user?.id) {
      return res.status(401).json({ message: "Unauthorized: User not authenticated" });
    }

    if (accountIdToUpdate !== req.user.id) {
      return res.status(403).json({ message: "Forbidden: You can only update your own avatar" });
    }

    if (!req.file) {
      return res.status(400).json({ message: "Bad Request: No file uploaded" });
    }

    const accountExists = await prisma.account.findUnique({
      where: { accountID: accountIdToUpdate },
      select: { accountID: true }
    });

    if (!accountExists) {
      return res.status(404).json({ message: "Account not found" });
    }

    await updateAvatarService(accountIdToUpdate, req.file.path);
    return res.status(200).json({ message: "Avatar updated successfully" });
  } catch (error) {
    return next(error);
  }
}
export const deleteAccount = async (req: Request, res: Response) => {
  const accountIdToDelete = req.params.id ?? "";
  if (Array.isArray(accountIdToDelete)) {
    return res.status(400).json({ message: "id must be a string, not an array" });
  }
  const targetAccount = await prisma.account.findUnique({
    where: { accountID: accountIdToDelete },
    include: { role: true }
  });
  if (!targetAccount) {
    return res.status(404).json({ message: "Account not found" });
  }
  const result = await prisma.account.delete({ where: { accountID: accountIdToDelete } });
  if (result) {
    return res.status(200).json({ message: "Account deleted successfully" })
  }
  return res.status(400).json({ message: "Account deleted Failed" });
}
export const DeleteManyAccounts = async (req: Request, res: Response) => {
  const { accountIDs } = req.body;
  await prisma.account.deleteMany({
    where: { accountID: { in: accountIDs } },
  });
  return res.status(200).json({ message: "Accounts deleted successfully" });
}