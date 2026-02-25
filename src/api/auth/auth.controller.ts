import { Request, Response, NextFunction } from "express";
import prisma from "../../utils/prisma.js";
import { generateTokens } from "../../utils/jwt.js";
import { addRefreshTokenToCookieToWhitelist } from "./auth.service.js";
import bcrypt from "bcryptjs";
export const loginUser = async (req: Request, res: Response, next: NextFunction) => {
  const { email, password } = req.body;

  try {
    const account = await prisma.account.findUnique({
      where: { email },
      select: { accountID: true, role: true, password: true },
    });
    if (!account?.password)
    {
      return res.status(400).json(
        {
          message: "Password is required"
        }
      )
    }
    if (!account || !bcrypt.compareSync(password, account.password)) {
      return res.status(401).json({ message: "Invalid credentials" });
    }
    const { accessToken, refreshToken } = generateTokens({ id: account.accountID, email, role: account.role });
    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 60 * 60 * 1000, // 1 hour
    });
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });
    await addRefreshTokenToCookieToWhitelist({ refreshToken, userId: account.accountID })
    return res.status(200).json({
      message: "Login successful",
      user: { id: account.accountID, role: account.role },
    });
  } catch (error) {
    next(error)
  }
};
export const GetProfile = async (req: Request, res: Response) => {
  const userId = req.user?.id;
  if (!userId) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  const account = await prisma.account.findUnique({
    where: { accountID: userId },
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
  if (!account) {
    return res.status(404).json({ message: "User not found" });
  }
  return res.status(200).json({ user: account });
}
export const UpdateProfile = async (req:Request, res: Response) =>{
  const userId = req.user?.id;
  if (!userId) {
    return res.status(401).json({
      message: "Unauthorized"
    })
  }
  await prisma.account.update({
    where: { accountID: userId },
    data: req.body
    
  })
  return res.status(200).json({ message: "Profile updated successfully" })
}
export const updatePassword = async (req: Request, res: Response) => {
  const { currentPassword, newPassword } = req.body;
  const userId = req.user?.id;
  if (!userId) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  const account = await prisma.account.findUnique({
    where: { accountID: userId },
    select: { password: true },
  });
  if (!account?.password)
    {
      return res.status(400).json(
        {
          message: "Password is required"
        }
      )
    }
  if (!account || !bcrypt.compareSync(currentPassword, account.password)) {
    return res.status(401).json({ message: "Current password is incorrect" });
  }
  const hashedNewPassword = await bcrypt.hash(newPassword, 10);
  await prisma.account.update({
    where: { accountID: userId },

    data: { password: hashedNewPassword },
  });
  return res.status(200).json({ message: "Password updated successfully" });
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