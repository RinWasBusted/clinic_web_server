import { NextFunction, Request, Response } from "express";
import prisma from "../../../utils/prisma.js";

export const CreateTimetable = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { doctorID, roomID, dayOfWeek, note } = req.body;
        const newTimetable = await prisma.timetable.create({
            data: {
                doctorID,
                roomID,
                dayOfWeek,
                note
            },
            include: {
                doctor: true,
                room: true
            }
        });

        return res.status(201).json({ timetable: newTimetable });
    } catch (error) {
        next(error);
    }
};

export const GetAllTimetables = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const timetables = await prisma.timetable.findMany({
            include: {
                doctor: {
                    include: {
                        account: true
                    }
                },
                room: {
                    include: {
                        faculty: true
                    }
                }
            }
        });
        return res.status(200).json({ timetables });
    } catch (error) {
        next(error);
    }
};

export const GetTimetableById = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        const timeID = Array.isArray(id) ? id[0] : id;

        if (!timeID) {
            return res.status(400).json({ message: "Timetable ID is required" });
        }

        const timetable = await prisma.timetable.findUnique({
            where: { timeID },
            include: {
                doctor: {
                    include: {
                        account: true
                    }
                },
                room: {
                    include: {
                        faculty: true
                    }
                }
            }
        });

        if (!timetable) {
            return res.status(404).json({ message: "Timetable not found" });
        }

        return res.status(200).json({ timetable });
    } catch (error) {
        next(error);
    }
};

export const GetTimetableByDoctor = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { doctorID } = req.params;
        if (Array.isArray(doctorID)) {
            return res.status(400).json({ message: "id must be a string not array" });
        }
        if (!doctorID) {
            return res.status(400).json({ message: "Doctor ID is required" });
        }

        const timetables = await prisma.timetable.findMany({
            where: { doctorID },
            include: {
                doctor: {
                    include: {
                        account: true
                    }
                },
                room: {
                    include: {
                        faculty: true
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

        if (!timeID) {
            return res.status(404).json({ message: "Timetable not found" });
        }

        if (Array.isArray(timeID)) {
            return res.status(400).json({ message: "id must be a string, not an array" });
        }

        // If updating doctorID or roomID, verify they exist
        if (data.doctorID) {
            const doctor = await prisma.doctor.findUnique({ where: { doctorID: data.doctorID } });
            if (!doctor) {
                return res.status(404).json({ message: "Doctor not found" });
            }
        }

        if (data.roomID) {
            const room = await prisma.room.findUnique({ where: { roomID: data.roomID } });
            if (!room) {
                return res.status(404).json({ message: "Room not found" });
            }
        }

        const result = await prisma.timetable.update({
            where: { timeID },
            data,
            include: {
                doctor: {
                    include: {
                        account: true
                    }
                },
                room: {
                    include: {
                        faculty: true
                    }
                }
            }
        });

        if (result) {
            return res.status(200).json({
                message: "Update successful",
                timetable: result
            });
        }
    } catch (error) {
        next(error);
    }
};

export const DeleteTimetableById = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const timeID = req.params.id;

        if (!timeID) {
            return res.status(404).json({ message: "Timetable not found" });
        }

        if (Array.isArray(timeID)) {
            return res.status(400).json({ message: "id must be a string, not an array" });
        }

        const result = await prisma.timetable.delete({
            where: { timeID }
        });

        if (result) {
            return res.status(200).json({
                message: "Delete Successful"
            });
        }
    } catch (error) {
        next(error);
    }
};

export const DeleteManyTimetables = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { timeIds } = req.body;

        const result = await prisma.timetable.deleteMany({
            where: { timeID: { in: timeIds } }
        });

        if (result) {
            return res.status(200).json({
                message: "Delete successful",
                deletedCount: result.count
            });
        }
    } catch (error) {
        next(error);
    }
};
