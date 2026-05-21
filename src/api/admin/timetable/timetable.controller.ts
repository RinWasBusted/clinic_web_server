import { NextFunction, Request, Response } from "express";
import prisma from "../../../utils/prisma.js";
import { DayOfWeek } from "../../../generated/prisma/index.js";

const accountInclude = {
    account: {
        select: {
            accountID: true,
            firstName: true,
            lastName: true,
            email: true,
            role: true
        }
    },
    room: {
        include: { faculty: true }
    }
} as const;

export const CreateTimetable = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { accountID, roomID, dayOfWeek, note } = req.body;
        const newTimetable = await prisma.timetable.create({
            data: { accountID, roomID, dayOfWeek, note },
            include: accountInclude
        });
        return res.status(201).json({ timetable: newTimetable });
    } catch (error) {
        next(error);
    }
};

export const GetAllTimetables = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const timetables = await prisma.timetable.findMany({ include: accountInclude });
        return res.status(200).json({ timetables });
    } catch (error) {
        next(error);
    }
};

export const GetTimetableById = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        const timeID = Array.isArray(id) ? id[0] : id;
        if (!timeID) return res.status(400).json({ message: "Timetable ID is required" });

        const timetable = await prisma.timetable.findUnique({
            where: { timeID },
            include: accountInclude
        });
        if (!timetable) return res.status(404).json({ message: "Timetable not found" });
        return res.status(200).json({ timetable });
    } catch (error) {
        next(error);
    }
};

export const GetTimetableByDoctor = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { accountID } = req.params;
        if (Array.isArray(accountID)) return res.status(400).json({ message: "id must be a string not array" });
        if (!accountID) return res.status(400).json({ message: "Account ID is required" });

        const timetables = await prisma.timetable.findMany({
            where: { accountID },
            include: {
                account: {
                    select: { firstName: true, lastName: true, email: true }
                },
                room: {
                    select: {
                        roomName: true,
                        faculty: { select: { facultyName: true } }
                    }
                }
            }
        });
        return res.status(200).json({ timetables });
    } catch (error) {
        next(error);
    }
};

export const GetTimetableByDoctorAndDay = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { accountID, dayOfWeek } = req.params;
        if (Array.isArray(accountID) || Array.isArray(dayOfWeek)) {
            return res.status(400).json({ message: "Parameters must be strings, not arrays" });
        }
        if (!accountID) return res.status(400).json({ message: "Account ID is required" });
        if (!dayOfWeek) return res.status(400).json({ message: "Day of week is required" });

        const timetables = await prisma.timetable.findMany({
            where: { accountID, dayOfWeek: dayOfWeek as DayOfWeek },
            include: {
                account: {
                    select: { firstName: true, lastName: true, email: true }
                },
                room: {
                    select: {
                        roomName: true,
                        faculty: { select: { facultyName: true } }
                    }
                }
            }
        });
        return res.status(200).json({ timetables });
    } catch (error) {
        next(error);
    }
};

export const UpdateTimetableById = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const timeID = req.params.id;
        const data = req.body;

        if (!timeID) return res.status(404).json({ message: "Timetable not found" });
        if (Array.isArray(timeID)) return res.status(400).json({ message: "id must be a string, not an array" });

        // If updating accountID, verify account exists
        if (data.accountID) {
            const account = await prisma.account.findUnique({ where: { accountID: data.accountID } });
            if (!account) return res.status(404).json({ message: "Account not found" });
        }

        if (data.roomID) {
            const room = await prisma.room.findUnique({ where: { roomID: data.roomID } });
            if (!room) return res.status(404).json({ message: "Room not found" });
        }

        const result = await prisma.timetable.update({
            where: { timeID },
            data,
            include: accountInclude
        });

        if (result) {
            return res.status(200).json({ message: "Update successful", timetable: result });
        }
    } catch (error) {
        next(error);
    }
};

export const DeleteTimetableById = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const timeID = req.params.id;
        if (!timeID) return res.status(404).json({ message: "Timetable not found" });
        if (Array.isArray(timeID)) return res.status(400).json({ message: "id must be a string, not an array" });

        const result = await prisma.timetable.delete({ where: { timeID } });
        if (result) return res.status(200).json({ message: "Delete Successful" });
    } catch (error) {
        next(error);
    }
};

export const DeleteManyTimetables = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { timeIds } = req.body;
        const result = await prisma.timetable.deleteMany({ where: { timeID: { in: timeIds } } });
        if (result) return res.status(200).json({ message: "Delete successful", deletedCount: result.count });
    } catch (error) {
        next(error);
    }
};
