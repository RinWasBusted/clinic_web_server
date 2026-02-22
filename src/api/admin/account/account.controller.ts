import { Request, Response } from "express";
import prisma from "../../../utils/prisma.js";
import { checkRoleToDelete } from "./account.services.js";
import bcrypt from "bcryptjs";
import { checkRoleToRegister } from "./account.services.js";
export const deleteAccount = async (req: Request, res: Response) => {
  const accountIdToDelete = req.params.id;
  const currentUserId = req.user?.id;
  if (!currentUserId) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  const currentUser = await prisma.account.findUnique({
    where: { accountID: currentUserId },
    select: { role: true }
  })
  // @ts-expect-error - accountIdToDelete đã được validate là string uuid nên không cần check thêm
  const accountToDelete = await prisma.account.findUnique({ where: { accountID: accountIdToDelete }, select: { role: true } })
  if (!accountToDelete) {
    return res.status(404).json({ message: "Account not found" });
  }
  if (currentUserId === accountIdToDelete) {
    return res.status(400).json({ message: "Cannot delete your own account" });
  }
  const checkRoleResult = checkRoleToDelete(currentUser?.role || "", accountToDelete.role)
  if (checkRoleResult) {
    return res.status(checkRoleResult.status).json({ message: checkRoleResult.message });
  }
  // @ts-expect-error - accountIdToDelete đã được validate là string uuid nên không cần check thêm
  await prisma.account.delete({ where: { accountID: accountIdToDelete } });
  return res.status(200).json({ message: "Account deleted successfully" });
}
export const logout = async (req: Request, res: Response) => {
  const refreshToken = req.cookies.refreshToken;
  if (refreshToken) {
    await prisma.refreshToken.deleteMany({ where: { hashedToken: refreshToken } });
  }
  res.clearCookie("accessToken");
  res.clearCookie("refreshToken");
  return res.status(200).json({ message: "Logged out successfully" });
}
export const register = async (req: Request, res: Response) => {
  const { firstName, lastName, role, email, birthDate, phoneNumber } = req.body;
  const currentUserId = req.user?.id;

  if (!currentUserId) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  const currrentUser = await prisma.account.findUnique({
    where: { accountID: currentUserId },
    select: { role: true }
  })
  const existing = await prisma.account.findUnique({ where: { email } });
  if (existing) {
    return res.status(400).json({ message: "Email already in use" });
  }
  const checkRoleResult = checkRoleToRegister(currrentUser?.role || "", role)
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