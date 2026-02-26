import { NextFunction, Request, Response } from "express";
import prisma from "../../../utils/prisma.js";
export const CreateFaculty = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { facultyName, doctors, rooms } = req.body;
        if (!facultyName) {
            return res.status(400).json({ message: "Faculty name is required" });
        }
        const existingFaculty = await prisma.faculty.findUnique({ where: { facultyName } });
        if (existingFaculty) {
            return res.status(409).json({ message: "Faculty with this name already exists" });
        }
        const newFaculty = await prisma.faculty.create({
            data:
            {
                facultyName,
                doctors,
                rooms
            }
        });
        return res.status(201).json({ faculty: newFaculty });
    } catch (error) {
        next(error);
    }
};
export const GetAllFaculties = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const faculties = await prisma.faculty.findMany();
        return res.status(200).json({ faculties });
    } catch (error) {
        next(error);
    }
};
export const GetFacultyById = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params ?? "";
        const facultyID = Array.isArray(id) ? id[0] : id;
        if (!facultyID) {
            return res.status(400).json({ message: "facultyID is required" });
        }

        const faculty = await prisma.faculty.findUnique({ where: { facultyID } });
        if (!faculty) {
            return res.status(404).json({ message: "Faculty not found" });
        }
        return res.status(200).json({ faculty });
    } catch (error) {
        next(error);
    }
}
export const UpdateFacultyById = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const facultyID = req.params.id;
        const data = req.body;
        if (!facultyID) {
            return res.status(404).json({ message: "Faculty not found" });
        }
        if (Array.isArray(facultyID)) {
            return res.status(400).json({ message: "id must be a string, not an array" });
        }
        const result = await prisma.faculty.update({
            where: { facultyID },
            data: data
        })
        if (data.facultyName) {
            const existingFaculty = await prisma.faculty.findUnique({ 
                where: { facultyName: data.facultyName } 
            });
            if (existingFaculty && existingFaculty.facultyID !== facultyID) {
                return res.status(409).json({ message: "Faculty with this name already exists" });
            }
        }
        if (result) {
            res.status(200).json({
                message: "Update successful",
                data
            })
        }
        else {
            res.status(400).json({
                message: "Not find faculty"
            })
        }
    } catch (error) {
        next(error)
    }
}
export const DeleteFacultyById = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const facultyID = req.params.id;
        if (!facultyID) {
            return res.status(404).json({ message: "Faculty not found" });
        }
        if (Array.isArray(facultyID)) {
            return res.status(400).json({ message: "id must be a string, not an array" });
        }
        const result = await prisma.faculty.delete({
            where: { facultyID }
        })
        if (result) {
            return res.status(200).json({
                message: "Delete Successful"
            })
        }
        else {
            return res.status(400).json({
                message: "Not find Faculty"
            })
        }
    } catch (error) {
        next(error)
    }
}
export const DeleteManyFaculty = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { FacultyIds, } = req.body;
        if (!Array.isArray(FacultyIds) || FacultyIds.length === 0) {
            return res.status(400).json({ message: "FacultyIds must be a non-empty array" });
        }
        const result = await prisma.faculty.deleteMany({
            where: { facultyID: { in: FacultyIds } },
        });
        if (result) {
            return res.status(200).json({
                message: "Delete Successful"
            })
        }
        else {
            return res.status(400).json({
                message: "Delete fail"
            })
        }
    } catch (error) {
        return next(error)
    }
}