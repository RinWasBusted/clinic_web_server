import { Request, Response, NextFunction } from "express";
import { permissionService } from "./permission.service.js";

export const getAllPermissions = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const permissions = await permissionService.getAllPermissions();
    res.status(200).json({ message: "Get all permissions successfully", data: permissions });
  } catch (error) {
    next(error);
  }
};
