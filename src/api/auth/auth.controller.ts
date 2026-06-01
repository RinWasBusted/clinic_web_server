import { Request, Response, NextFunction } from "express";
import prisma from "../../utils/prisma.js";
import { generateTokens } from "../../utils/jwt.js";
import { addRefreshTokenToCookieToWhitelist, deleteRefreshTokenFromWhitelist } from "./auth.service.js";
import bcrypt from "bcryptjs";
export const loginUser = async (req: Request, res: Response, next: NextFunction) => {
  const { email, password } = req.body;

  try {
    const account = await prisma.account.findFirst({
      where: { email },
      select: {
        accountID: true,
        roleName: true,
        roleID: true,
        password: true,
        firstName: true,
        lastName: true,
        role: true,
      },
    });
    if (!account?.password) {
      return res.status(400).json({
        message: "Tên đăng nhập hoặc mật khẩu không chính xác",
      });
    }
    if (!account || !bcrypt.compareSync(password, account.password)) {
      return res.status(401).json({ message: "Tên đăng nhập hoặc mật khẩu không chính xác" });
    }
    const { accessToken, refreshToken } = generateTokens({
      id: account.accountID,
      email,
      role: account?.role?.roleName as string,
      roleName: account?.role?.roleName as string,
      roleID: account.roleID,
    });

    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 60 * 60 * 1000, // 1 hour
      path: "/",
    });
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      path: "/",
    });
    await addRefreshTokenToCookieToWhitelist({ refreshToken, userId: account.accountID });

    // Fetch permissions for the logged in role
    const authorizationService = (await import("../../services/authorization/authorization.service.js")).default;
    const permissions = await authorizationService.getPermissionsListByRole(account.roleID, account?.role?.roleName);

    return res.status(200).json({
      message: "Đăng nhập thành công",
      user: {
        id: account.accountID,
        role: account?.role?.roleName as string,
        roleDescription: account?.role?.roleDescription as string,
        firstName: account.firstName,
        lastName: account.lastName,
        permissions: permissions
      },
    });
  } catch (error) {
    next(error);
  }
};
export const refreshTokens = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const refreshToken = req.cookies?.refreshToken;
    if (!refreshToken) return res.status(401).json({ message: "Missing refresh token" });

    const userId = req.id;
    if (!userId) return res.status(401).json({ message: "Unauthorized" });

    // rotate: xóa refresh cũ
    await deleteRefreshTokenFromWhitelist(refreshToken);

    // lấy thông tin user để tạo access token
    const account = await prisma.account.findUnique({
      where: { accountID: userId },
      select: { email: true, roleName: true, roleID: true, role: { select: { roleName: true } } },
    });
    if (!account) return res.status(401).json({ message: "Unauthorized" });

    const resolvedRoleName = account.role?.roleName ?? account.roleName ?? "";

    const { accessToken, refreshToken: newRefreshToken } = generateTokens({
      id: userId,
      email: account.email,
      role: resolvedRoleName,
      roleName: resolvedRoleName,
      roleID: account.roleID,
    });

    await addRefreshTokenToCookieToWhitelist({ refreshToken: newRefreshToken, userId });

    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 60 * 60 * 1000,
      path: "/",
    });

    res.cookie("refreshToken", newRefreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
      path: "/",
    });

    return res.status(200).json({ message: "Token refreshed" });
  } catch (err) {
    next(err);
  }
};
export const GetProfile = async (req: Request, res: Response) => {
  const userId = req.user?.id;
  if (!userId) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  const account = await prisma.account.findUnique({
    where: { accountID: userId },
    omit: { password: true },
    include: { role: true, workspaces: true, patient: true },
  });
  if (!account) {
    return res.status(404).json({ message: "User not found" });
  }
  return res.status(200).json({
    user: {
      id: account.accountID,
      email: account.email,
      firstName: account.firstName,
      lastName: account.lastName,
      role: account.role?.roleName as string,
      roleDescription: account.role?.roleDescription as string,
      avatar: account.avatarUrl as string,
      permissions: req.user?.permissions || []
    }
  });
};
export const UpdateProfile = async (req: Request, res: Response) => {
  const userId = req.user?.id;
  if (!userId) {
    return res.status(401).json({
      message: "Unauthorized",
    });
  }
  const updated = await prisma.account.update({
    where: { accountID: userId },
    data: req.body,
    omit: { password: true },
    include: { role: true, workspaces: true, patient: true },
  });
  return res.status(200).json({ message: "Profile updated successfully", profile: updated });
};
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
  if (!account?.password) {
    return res.status(400).json({
      message: "Password is required",
    });
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
};
export const logout = async (req: Request, res: Response) => {
  const refreshToken = req.cookies?.refreshToken;

  if (refreshToken) {
    await deleteRefreshTokenFromWhitelist(refreshToken);
  }

  res.clearCookie("accessToken", { path: "/" });
  res.clearCookie("refreshToken", { path: "/" });
  return res.status(200).json({ message: "Logged out successfully" });
};
