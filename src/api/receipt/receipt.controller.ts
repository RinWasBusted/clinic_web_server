import type { Request, Response, NextFunction } from "express";
import receiptService, { ReceiptServiceError } from "./receipt.service.js";

export async function getReceiptHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const appointmentID = (req.params.appointmentID || req.query.appointmentID) as string | undefined;
    const prescriptionID = (req.params.prescriptionID || req.query.prescriptionID) as string | undefined;

    if (!appointmentID && !prescriptionID) {
      return res.status(400).json({ message: "appointmentID or prescriptionID is required" });
    }

    const receipt = appointmentID
      ? await receiptService.getReceiptByAppointmentID(appointmentID)
      : await receiptService.getReceiptByPrescriptionID(prescriptionID as string);

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
