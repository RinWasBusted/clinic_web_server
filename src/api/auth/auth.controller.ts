import { Request, Response, NextFunction } from "express";
import prisma from "../../utils/prisma.js";
import { generateTokens } from "../../utils/jwt.js";
import { addRefreshTokenToCookieToWhitelist } from "./auth.service.js";

export const loginUser = async (req: Request, res: Response, next: NextFunction) => {
  const { email, password } = req.body;

  try {
    const account = await prisma.account.findUnique({
      where: { email },
      select: { accountID: true, role: true, password: true },
    });

    if (!account || account.password !== password) {
      return res.status(401).json({ message: "Invalid credentials" });
    }
    const {accessToken, refreshToken} = generateTokens({id: account.accountID, email})
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
    await addRefreshTokenToCookieToWhitelist({refreshToken, userId: account.accountID})
    return res.status(200).json({
      message: "Login successful",
      user: { id: account.accountID, role: account.role },
    });
  } catch (error) {
    next(error)
  }
};
export const register = (req:Request, res:Response) =>{
  const {firstName,lastName, role, email,birthDate, phoneNumber} = req.body;
  const currentUserId = req.user?.id;

  if (!currentUserId) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  if (role !== "admin")
  {
    return res.status(403).json({
      message: "Forbidden: Only admin can register new users"
    })
  }
  prisma.account.create({
    data:{
      email,
      firstName,
      lastName,
      role,
      birthDate,
      phoneNumber,
      password: firstName + "@" + lastName
    }
  })
  
 }