import { NextFunction, Request, Response } from "express";
import prisma, { Prisma } from "../../../utils/prisma.js";
import { isAppointment, NotFoundError, verifyRefsForUpdate } from "./appointment.service.js";
import { AppointmentStatus } from "../../../generated/prisma/index.js";

export const CreateAppointment = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { appointmentType, scheduleDate, roomID, patientID, facultyID } = req.body;
        const approvedBy = req.user?.id
        if (!approvedBy) {
            return res.status(404).json({
                message: "Staff not found"
            })
        }
        const patient = await prisma.patient.findUnique({ where: { patientID } });
        if (!patient) {

            return res.status(404).json({ message: "Patient not found" });
        }
        const faculty = await prisma.faculty.findUnique({ where: { facultyID } });
        if (!faculty) {
            return res.status(404).json({ message: "Faculty not found" });
        }
        if (roomID) {
            const room = await prisma.room.findUnique({ where: { roomID } });
            if (!room) {
                return res.status(404).json({ message: "Room not found" });
            }
        }
        const lastAppointment = await prisma.appointment.findMany({
            orderBy: { createdAt: "desc" },
            take: 1,
            select: { appointmentDisplayID: true }
        });

        const lastNum = lastAppointment[0]?.appointmentDisplayID ? parseInt(lastAppointment[0].appointmentDisplayID) : 0;
        const appointmentDisplayID = String(lastNum + 1).padStart(6, "0");

        const newAppointment = await prisma.appointment.create({
            data: {
                appointmentType: appointmentType || "examine",
                scheduleDate: new Date(scheduleDate),
                roomID,
                patientID,
                facultyID,
                appointmentDisplayID,
                status: "pending",
                depositStatus: "unpaid",
                approvedBy

            },
            include: {
                patient: {
                    include: {
                        account: true
                    }
                },
                faculty: true,
                room: true,
                approvedByStaff: true
            }
        });

        return res.status(201).json({ appointment: newAppointment });
    } catch (error) {
        next(error);
    }
};

export const GetAllAppointments = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { status, facultyID, patientID, scheduleDate } = req.query;

        const where: Prisma.AppointmentWhereInput = {};
        if (!isAppointment(status)) {
            return res.status(400).json({
                message: "Invalid role value",
                allowed: Object.values(AppointmentStatus),
            });
        }
        if (status) {
            where.status = status;
        }
        if (facultyID && typeof facultyID === "string") where.facultyID = facultyID;
        if (patientID && typeof patientID === "string") where.patientID = patientID;

        if (scheduleDate && typeof scheduleDate === "string") {
            const d = new Date(scheduleDate);
            const start = new Date(d); start.setHours(0, 0, 0, 0);
            const end = new Date(d); end.setHours(23, 59, 59, 999);

            where.scheduleDate = { gte: start, lte: end };
        }

        const appointments = await prisma.appointment.findMany({
            where,
            include: {
                patient: {
                    include: {
                        account: true
                    }
                },
                faculty: true,
                room: true,
                approvedByStaff: {
                    include: {
                        account: true
                    }
                }
            },
            orderBy: { scheduleDate: "desc" }
        });

        return res.status(200).json({ appointments });
    } catch (error) {
        next(error);
    }
};

export const GetAppointmentById = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        const appointmentID = Array.isArray(id) ? id[0] : id;

        if (!appointmentID) {
            return res.status(400).json({ message: "Appointment ID is required" });
        }

        const appointment = await prisma.appointment.findUnique({
            where: { appointmentID },
            include: {
                patient: {
                    include: {
                        account: true
                    }
                },
                faculty: true,
                room: true,
                approvedByStaff: {
                    include: {
                        account: true
                    }
                },
                enterTickets: true,
                examineLogs: true
            }
        });

        if (!appointment) {
            return res.status(404).json({ message: "Appointment not found" });
        }

        return res.status(200).json({ appointment });
    } catch (error) {
        next(error);
    }
};

export const UpdateAppointmentById = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const appointmentID = req.params.id;
        const { status, depositStatus, roomID, scheduleDate, patientID, facultyID } = req.body;
        const approvedBy = req.user?.id;
        if (!appointmentID) {
            return res.status(404).json({ message: "Appointment not found" });
        }

        if (Array.isArray(appointmentID)) {
            return res.status(400).json({ message: "id must be a string, not an array" });
        }
        await verifyRefsForUpdate({
            patientID,
            facultyID,
            roomID,
        })
        const updateData: Prisma.AppointmentUncheckedUpdateInput = {};
        if (status) updateData.status = status;
        if (depositStatus) updateData.depositStatus = depositStatus;
        if (roomID) updateData.roomID = roomID;
        if (patientID) updateData.patientID = patientID;
        if (facultyID) updateData.facultyID = facultyID;
        if (approvedBy) updateData.approvedBy = approvedBy;
        if (scheduleDate) updateData.scheduleDate = new Date(scheduleDate);

        const result = await prisma.appointment.update({
            where: { appointmentID },
            data: updateData,
            include: {
                patient: {
                    include: {
                        account: true
                    }
                },
                faculty: true,
                room: true,
                approvedByStaff: {
                    include: {
                        account: true
                    }
                }
            }
        });

        if (result) {
            return res.status(200).json({
                message: "Update successful",
                appointment: result
            });
        }
    } catch (err) {
        if (err instanceof NotFoundError) {
      return res.status(err.statusCode).json({ message: err.message });
    }
    next(err);
    }
};

export const ApproveAppointment = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const appointmentID = req.params.id;
        const { roomID } = req.body;
        const approvedBy = req.user?.id;
        if (!appointmentID || Array.isArray(appointmentID)) {
            return res.status(404).json({ message: "Appointment not found" });
        }
        if (!approvedBy) {
            return res.status(400).json({ message: "approvedBy staff ID is required" });
        }
        if (roomID) {
            const room = await prisma.room.findUnique({ where: { roomID } });
            if (!room) {
                return res.status(404).json({ message: "Room not found" });
            }
        }

        const appointment = await prisma.appointment.update({
            where: { appointmentID },
            data: {
                status: "approved",
                approvedBy,
                roomID
            },
            include: {
                patient: true,
                faculty: true,
                room: true,
                approvedByStaff: true
            }
        });

        return res.status(200).json({
            message: "Appointment approved",
            appointment
        });
    } catch (error) {
        next(error);
    }
};

export const CancelAppointment = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const appointmentID = req.params.id;

        if (!appointmentID || Array.isArray(appointmentID)) {
            return res.status(404).json({ message: "Appointment not found" });
        }

        const appointment = await prisma.appointment.update({
            where: { appointmentID },
            data: { status: "cancelled" },
            include: {
                patient: true,
                faculty: true,
                room: true
            }
        });

        return res.status(200).json({
            message: "Appointment cancelled",
            appointment
        });
    } catch (error) {
        next(error);
    }
};

export const DeleteAppointmentById = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const appointmentID = req.params.id;

        if (!appointmentID) {
            return res.status(404).json({ message: "Appointment not found" });
        }

        if (Array.isArray(appointmentID)) {
            return res.status(400).json({ message: "id must be a string, not an array" });
        }

        const result = await prisma.appointment.delete({
            where: { appointmentID }
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

export const DeleteManyAppointments = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { appointmentIds } = req.body;

        const result = await prisma.appointment.deleteMany({
            where: { appointmentID: { in: appointmentIds } }
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