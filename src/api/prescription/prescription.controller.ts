import type { Request, Response, NextFunction } from "express";
import prescriptionService from "./prescription.service.js";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/client";

export async function createPrescriptionHandler(req: Request, res: Response, next: NextFunction) {
  try {
    // refine the data in the service layer, not here
    const prescriptionData = await prescriptionService.refinePrescriptionData(req.body);
    const newPrescription = await prescriptionService.submit(prescriptionData);
    return res.json({ message: "Create prescription successfully", prescription: newPrescription });
  } catch (error) {
    next(error);
  }
}
export async function getPrescriptionHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const prescriptionID: string = req.params?.id as string;
    const prescription = await prescriptionService.getPrescriptionByID(prescriptionID, null, {
      mode: "INTERNAL",
      onlyAllowDraft: false,
    });
    if (!prescription) {
      return res.status(404).json({ message: "Không tìm thấy đơn thuốc." });
    }

    return res.json({ prescription });
  } catch (error) {
    next(error);
  }
}
export async function updateLogHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const { id } = req.params;
    // validateUpdateHandler đã kiểm tra tính hợp lệ của việc cập nhật.
    const updatedPrescription = await prescriptionService.update(id as string, req.targetItem, req.body);
    return res.json({ message: "Đã cập nhật toa thuốc", prescription: updatedPrescription });
  } catch (error) {
    next(error);
  }
}

export async function updateDoseHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const { id } = req.params;
    // validateUpdateHandler đã kiểm tra tính hợp lệ của việc cập nhật.
    const updatedPrescription = await prescriptionService.updateDetails(id as string, req.targetItem, req.body);
    if (!updatedPrescription)
      return res.json({
        message: "Đã xóa toa thuốc",
        reason: "Không có thuốc nào được kê ở toa này sau khi đã cập nhật",
      });
    return res.json({ message: "Đã cập nhật toa thuốc", prescription: updatedPrescription });
  } catch (error) {
    next(error);
  }
}

export async function deletePrescriptionHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const prescriptionID: string = req.params?.id as string;
    const doctorID = req.user?.id;
    try {
      await prescriptionService.deletePrescriptionByID(prescriptionID, null, doctorID);
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        return res.status(404).json({ message: "Không tìm thấy đơn thuốc" });
      }
      throw error;
    }
    return res.json({ message: "Đã xóa đơn thuốc" });
  } catch (error) {
    next(error);
  }
}
