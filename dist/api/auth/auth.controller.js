import prisma from "../../utils/prisma.js";
import { generateTokens } from "../../utils/jwt.js";
import { addRefreshTokenToCookieToWhitelist, deleteRefreshTokenFromWhitelist } from "./auth.service.js";
import bcrypt from "bcryptjs";
export const loginUser = async (req, res, next) => {
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
                role: { select: { roleName: true } }
            },
        });
        if (!account?.password) {
            return res.status(400).json({
                message: "Not have account with this email or password is required",
            });
        }
        if (!account || !bcrypt.compareSync(password, account.password)) {
            return res.status(401).json({ message: "Invalid credentials" });
        }
        // Prefer dynamic role from Role relation; fallback to legacy roleName field
        const resolvedRoleName = account.role?.roleName ?? account.roleName ?? "";
        const { accessToken, refreshToken } = generateTokens({
            id: account.accountID,
            email,
            role: resolvedRoleName,
            roleName: resolvedRoleName,
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
        return res.status(200).json({
            message: "Login successful",
            user: { id: account.accountID, role: resolvedRoleName, firstName: account.firstName, lastName: account.lastName },
        });
    }
    catch (error) {
        next(error);
    }
};
export const refreshTokens = async (req, res, next) => {
    try {
        const refreshToken = req.cookies?.refreshToken;
        if (!refreshToken)
            return res.status(401).json({ message: "Missing refresh token" });
        const userId = req.id;
        if (!userId)
            return res.status(401).json({ message: "Unauthorized" });
        // rotate: xóa refresh cũ
        await deleteRefreshTokenFromWhitelist(refreshToken);
        // lấy thông tin user để tạo access token
        const account = await prisma.account.findUnique({
            where: { accountID: userId },
            select: { email: true, roleName: true, roleID: true, role: { select: { roleName: true } } },
        });
        if (!account)
            return res.status(401).json({ message: "Unauthorized" });
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
    }
    catch (err) {
        next(err);
    }
};
export const GetProfile = async (req, res) => {
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
    return res.status(200).json({ user: account });
};
export const UpdateProfile = async (req, res) => {
    const userId = req.user?.id;
    if (!userId) {
        return res.status(401).json({
            message: "Unauthorized",
        });
    }
    await prisma.account.update({
        where: { accountID: userId },
        data: req.body,
    });
    return res.status(200).json({ message: "Profile updated successfully" });
};
export const updatePassword = async (req, res) => {
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
export const logout = async (req, res) => {
    const refreshToken = req.cookies?.refreshToken;
    if (refreshToken) {
        await deleteRefreshTokenFromWhitelist(refreshToken);
    }
    res.clearCookie("accessToken", { path: "/" });
    res.clearCookie("refreshToken", { path: "/" });
    return res.status(200).json({ message: "Logged out successfully" });
};
//# sourceMappingURL=auth.controller.js.map