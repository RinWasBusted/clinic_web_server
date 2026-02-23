import { Request, Response } from "express";
import prisma from "../../../utils/prisma.js";
import { checkRole } from "./account.services.js";
import bcrypt from "bcryptjs";
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
export const GetAllAccounts = async (req: Request, res: Response) => {
  const currentRole = req.user?.role;
  if (!["manager", "staff"].includes(currentRole || "")) {
    return res.status(403).json({ message: "Forbidden: Only manager or staff can access this resource" });
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
  const currentRole = req.user?.role;
  const currentUser = await prisma.account.findUnique({
    // @ts-expect-error - accountIdToUpdate đã được validate là string uuid nên không cần check thêm
    where: { accountID: req.params.id },
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
  checkRole(currentRole || "", currentUser?.role || "")
  return res.status(200).json({ user: currentUser });
}
export const UpdateProfile = async (req:Request, res: Response) =>{
  const accountIdToUpdate = req.params.id;
  const currentRole = req.user?.role;
  const user = await prisma.account.findUnique({
    // @ts-expect-error - accountIdToUpdate đã được validate là string uuid nên không cần check thêm
    where: { accountID: accountIdToUpdate },
    select: { password: true, role: true },
  });
  const checkRoleResult = checkRole(currentRole || "", user?.role || "")
  if (checkRoleResult) {
    return res.status(checkRoleResult.status).json({ message: checkRoleResult.message });
  }
  await prisma.account.update({
    // @ts-expect-error - accountIdToUpdate đã được validate là string uuid nên không cần check thêm
    where: { accountID: accountIdToUpdate },
    data: req.body
    
  })
  return res.status(200).json({ message: "Profile updated successfully" })
}
export const updatePassword = async (req: Request, res: Response) => {
  const accountIdToUpdate = req.params.id;
  const currentRole = req.user?.role;
  const { newPassword } = req.body;
  const user = await prisma.account.findUnique({
    // @ts-expect-error - accountIdToUpdate đã được validate là string uuid nên không cần check thêm
    where: { accountID: accountIdToUpdate },
    select: { password: true, role: true },
  });
  const checkRoleResult = checkRole(currentRole || "", user?.role || "")
  if (checkRoleResult) {
    return res.status(checkRoleResult.status).json({ message: checkRoleResult.message });
  }
  const hashedNewPassword = await bcrypt.hash(newPassword, 10);
  await prisma.account.update({
    // @ts-expect-error - accountIdToUpdate đã được validate là string uuid nên không cần check thêm
    where: { accountID: accountIdToUpdate },

    data: { password: hashedNewPassword },
  });
  return res.status(200).json({ message: "Password updated successfully" });
}
export const deleteAccount = async (req: Request, res: Response) => {
  const accountIdToDelete = req.params.id;
  const currentRole = req.user?.role;
  // @ts-expect-error - accountIdToDelete đã được validate là string uuid nên không cần check thêm
  const accountToDelete = await prisma.account.findUnique({ where: { accountID: accountIdToDelete }, select: { role: true } })
  if (!accountToDelete) {
    return res.status(404).json({ message: "Account not found" });
  }
  const checkRoleResult = checkRole(currentRole || "", accountToDelete.role)
  if (checkRoleResult) {
    return res.status(checkRoleResult.status).json({ message: checkRoleResult.message });
  }
  // @ts-expect-error - accountIdToDelete đã được validate là string uuid nên không cần check thêm
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