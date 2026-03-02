import type { Request, Response, NextFunction } from "express";
import EnterTicketService from "./ticket.service.js";

export async function generateNewTicket(req: Request, res: Response, next: NextFunction) {
  try {
    const appointmentData = await EnterTicketService.findAppointment(req.body);
    const newTicket = await EnterTicketService.generateTicket(appointmentData);
    res.status(201).json(newTicket);
  } catch (error) {
    next(error);
  }
}

export async function viewWaitingList(req: Request, res: Response, next: NextFunction) {
  try {
    const { data, pagination } = await EnterTicketService.getWaitingList(req.query as Record<string, string>);
    return res.json({ data, pagination });
  } catch (error) {
    next(error);
  }
}

export async function viewEnterTicket(req: Request, res: Response, next: NextFunction) {
  try {
    const { id: ticketID } = req.params ?? {};
    const ticket = await EnterTicketService.getEnterTicketByID(ticketID as string);
    if (!ticket) {
      return res.status(404).json({ message: "Ticket not found" });
    }
    return res.json(ticket);
  } catch (error) {
    next(error);
  }
}

export async function updateEnterTicket(req: Request, res: Response, next: NextFunction) {
  try {
    const { id: ticketID } = req.params ?? {};
    const { status } = req.body ?? {};
    const updatedTicket = await EnterTicketService.updateEnterTicket(ticketID as string, status);
    if (!updatedTicket) {
      return res.status(404).json({ message: "Ticket not found" });
    } else {
      return res.json({
        message: "Ticket status updated successfully",
        ticket: updatedTicket,
      });
    }
  } catch (error) {
    next(error);
  }
}

export async function getNextTicket(req: Request, res: Response, next: NextFunction) {
  try {
    const { roomID } = req.query;
    const nextTicket = await EnterTicketService.callNextTicket(roomID as string);
    return res.json({
      message: nextTicket ? "Next ticket called successfully" : "No pending tickets in the queue",
      ticket: nextTicket,
    });
  } catch (error) {
    next(error);
  }
}

export async function getCurrentTicket(req: Request, res: Response, next: NextFunction) {
  try {
    // View currently served patient
    const { roomID } = req.query;
    const currentTicket = await EnterTicketService.getCurrentTicket(roomID as string);
    return res.json({
      currentlyServing: !!currentTicket,
      ticket: currentTicket,
    });
  } catch (error) {
    next(error);
  }
}
