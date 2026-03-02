import { Request, Response, NextFunction } from 'express';
import { prisma } from '../utils/prisma.js';

export const validateStatusFaculty = async (req: Request, res: Response, next: NextFunction) => {
  const rawID = req.params.facultyID || req.params.id;
  const facultyID = Array.isArray(rawID) ? rawID[0] : rawID;
  if (!facultyID) return next();
  const faculty = await prisma.faculty.findFirst({
    where: { facultyID }
  });

  if (!faculty) {
    return res.status(404).json({
      success: false,
      message: "Khoa không tồn tại hoặc đã bị vô hiệu hóa."
    });
  }
  req.faculty = faculty; 
  next();
};