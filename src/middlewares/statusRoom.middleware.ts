import { Request, Response, NextFunction } from 'express';
import { prisma } from '../utils/prisma.js';

export const validateStatusRoom = async (req: Request, res: Response, next: NextFunction) => {
  const rawID = req.params.roomID || req.params.id;
  const roomID = Array.isArray(rawID) ? rawID[0] : rawID;
  if (!roomID) return next();
  const room = await prisma.room.findFirst({
    where: { roomID }
  });

  if (!room) {
    return res.status(404).json({
      success: false,
      message: "Phòng không tồn tại hoặc đã bị vô hiệu hóa."
    });
  }
  req.room = room; 
  next();
};