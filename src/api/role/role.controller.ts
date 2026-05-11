import { Request, Response, NextFunction } from "express";
import { roleService } from "./role.service.js";

export const getAllRoles = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const roles = await roleService.getAllRoles();
        res.status(200).json({ message: "Get all roles successfully", data: roles });
    } catch (error) {
        next(error);
    }
};

export const getRoleById = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const id = req.params.id as string;
        const role = await roleService.getRoleById(id);
        if (!role) {
            return res.status(404).json({ message: "Role not found" });
        }
        res.status(200).json({ message: "Get role successfully", data: role });
    } catch (error) {
        next(error);
    }
};

export const createRole = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const role = await roleService.createRole(req.body);
        res.status(201).json({ message: "Role created successfully", data: role });
    } catch (error) {
        next(error);
    }
};

export const updateRole = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const id = req.params.id as string;
        const role = await roleService.updateRole(id, req.body);
        res.status(200).json({ message: "Role updated successfully", data: role });
    } catch (error) {
        if (error instanceof Error && error.message === "Role not found") {
            return res.status(404).json({ message: "Role not found" });
        }
        next(error);
    }
};

export const deleteRole = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const id = req.params.id as string;
        await roleService.deleteRole(id);
        res.status(200).json({ message: "Role deleted successfully" });
    } catch (error) {
        next(error);
    }
};
