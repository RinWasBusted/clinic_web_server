import { Request, Response, NextFunction } from "express";
import {
  getMedicineTicketsService,
  updateMedicineTicketStatusService,
  createMedicineTicketService,
} from "./medicine-tickets.service.js";


export const getMedicineTickets = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { date, roomId } = req.query;

    // Validate date format if provided
    if (date && typeof date === "string") {
      const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
      if (!dateRegex.test(date)) {
        return res.status(400).json({
          message: "Invalid date format. Please use YYYY-MM-DD",
        });
      }
    }

    const tickets = await getMedicineTicketsService(
      date as string | undefined,
      roomId as string | undefined
    );

    return res.status(200).json({
      message: "Medicine tickets retrieved successfully",
      data: tickets,
    });
  } catch (error) {
    next(error);
  }
};

export const updateMedicineTicketStatus = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    // Validate required fields
    if (!id) {
      return res.status(400).json({
        message: "Ticket ID is required",
      });
    }

    if (!status) {
      return res.status(400).json({
        message: "Status is required",
      });
    }

    if (!["pending", "done"].includes(status)) {
      return res.status(400).json({
        message: "Invalid status. Must be 'pending' or 'done'",
      });
    }

    const updatedTicket = await updateMedicineTicketStatusService(id as string, status);

    return res.status(200).json({
      message: "Medicine ticket status updated successfully",
      data: updatedTicket,
    });
  } catch (error) {
    next(error);
  }
};


export const createMedicineTicket = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { prescriptionID, roomID } = req.body;

    // Validate required fields
    if (!prescriptionID) {
      return res.status(400).json({
        message: "prescriptionID is required",
      });
    }

    if (!roomID) {
      return res.status(400).json({
        message: "roomID is required",
      });
    }

    const newTicket = await createMedicineTicketService(prescriptionID, roomID);

    return res.status(201).json({
      message: "Medicine ticket created successfully",
      data: newTicket,
    });
  } catch (error) {
    next(error);
  }
};
