import type { Request, Response, NextFunction } from "express";
import receiptService, { ReceiptServiceError } from "./receipt.service.js";

export async function getReceiptHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const appointmentID = (req.params.appointmentID || req.query.appointmentID) as string | undefined;

    if (!appointmentID) {
      return res.status(400).json({ message: "appointmentID is required" });
    }

    const receipt = await receiptService.getReceiptByAppointmentID(appointmentID);

    return res.json({
      message: "Get receipt successfully",
      data: receipt,
    });
  } catch (error) {
    if (error instanceof ReceiptServiceError) {
      return res.status(error.statusCode).json({ message: error.message });
    }
    next(error);
  }
}
