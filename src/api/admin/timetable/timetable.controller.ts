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

        const existingTimetable = await prisma.timetable.findFirst({
            where: {
                accountID,
                roomID,
                dayOfWeek: dayOfWeek as DayOfWeek
            }
        });

        if (existingTimetable) {
            return res.status(400).json({ message: "Timetable already exists for this doctor, room and day" });
        }

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
        const { facultyID } = req.query;

        if (!facultyID || typeof facultyID !== "string") {
            return res.status(400).json({ message: "Faculty ID is required" });
        }

        const timetables = await prisma.timetable.findMany({
            where: {
                room: {
                    FacultyID: facultyID
                }
            },
            include: {
                account: {
                    select: {
                        accountID: true,
                        firstName: true,
                        lastName: true,
                        email: true,
                        role: true,
                        avatarUrl: true,
                        DisplayID: true
                    }
                },
                room: {
                    select: {
                        roomID: true,
                        roomName: true,
                        roomType: true
                    }
                }
            }
        });

        const groupedTimetables = timetables.reduce((acc: Record<DayOfWeek, typeof timetables>, curr) => {
            if (!acc[curr.dayOfWeek]) {
                acc[curr.dayOfWeek] = [];
            }
            acc[curr.dayOfWeek].push(curr);
            return acc;
        }, {} as Record<DayOfWeek, typeof timetables>);

        return res.status(200).json({ timetables: groupedTimetables });
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

export const GetAvailableUserForTimetable = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { facultyID, dayOfWeek } = req.query;

        if (!facultyID || typeof facultyID !== "string") {
            return res.status(400).json({ message: "Faculty ID is required" });
        }

        // 1. Get all accounts that belong to this faculty (via AccountWorkspace)
        const facultyAccounts = await prisma.accountWorkspace.findMany({
            where: { facultyID },
            select: {
                account: {
                    select: {
                        accountID: true,
                        firstName: true,
                        lastName: true,
                        email: true,
                        role: true
                    }
                }
            }
        });

        const allUsersInFaculty = facultyAccounts.map(fa => fa.account);

        if (!dayOfWeek) {
            return res.status(200).json({ users: allUsersInFaculty });
        }

        // 2. Get accounts that already have an assignment on the chosen day
        const assignedTimetables = await prisma.timetable.findMany({
            where: {
                dayOfWeek: dayOfWeek as DayOfWeek,
                room: {
                    FacultyID: facultyID
                }
            },
            select: {
                accountID: true
            }
        });

        const assignedAccountIDs = new Set(assignedTimetables.map(t => t.accountID));

        // 3. Filter out assigned users
        const availableUsers = allUsersInFaculty.filter(user => !assignedAccountIDs.has(user.accountID));

        return res.status(200).json({ users: availableUsers });
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
