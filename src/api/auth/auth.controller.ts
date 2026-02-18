import { Request, Response } from "express";
import prisma from "../../utils/prisma.js";

export const loginUser = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  try {
    // Here we treat `username` as the account's `email` field in Prisma's Account model.
    const account = await prisma.account.findUnique({
      where: { email },
      select: { accountID: true, role: true, password: true },
    });

    if (!account || account.password !== password) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    return res.status(200).json({
      message: "Login successful",
      user: { id: account.accountID, role: account.role },
    });
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json(
      { message: "Internal server error",error });
  }
};
// export const register = (req:Request, res:Response) =>{
//   const {}
// }