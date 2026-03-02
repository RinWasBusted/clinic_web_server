import { Request, Response, NextFunction } from 'express';
import { prisma } from '../utils/prisma.js';

export const validateActiveAccount = async (req: Request, res: Response, next: NextFunction) => {
  const rawID = req.params.accountID || req.params.id;
  const accountID = Array.isArray(rawID) ? rawID[0] : rawID;
  if (!accountID) return next();
  const account = await prisma.account.findFirst({
    where: { accountID }
  });

  if (!account) {
    return res.status(404).json({
      success: false,
      message: "Tài khoản không tồn tại hoặc đã bị vô hiệu hóa."
    });
  }
  req.userAccount = account; 
  next();
};