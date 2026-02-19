import { Request, Response, NextFunction } from "express";
import prisma from "../../utils/prisma.js";

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

    return res.status(200).json({
      message: "Login successful",
      user: { id: account.accountID, role: account.role },
    });
  } catch (error) {
    next(error)
  }
};
// export const register = (req:Request, res:Response) =>{
//   const {}
// }