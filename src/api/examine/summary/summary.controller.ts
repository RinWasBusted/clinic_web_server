import type { Request, Response, NextFunction } from "express";
import { createNewRecord, getPrintableVersion } from "./summary.service.js";

export async function getPrintableVersionForExamineSummary(req: Request, res: Response, next: NextFunction) {
  try {
    const { id } = req.params;
    const details = await getPrintableVersion(id as string);
    return res.status(200).json({ summary: details });
  } catch (error) {
    next(error);
  }
}
export async function createRecord(req: Request, res: Response, next: NextFunction) {
  try {
    // Lấy thông tin khám bệnh
    const { prescription, examine } = req.body ?? {};
    const newExamineLogPayload = { ...examine, examinedBy: req.user?.id as string };
    const newPrescriptionPayload = { ...prescription, doctorID: req.user?.id as string };
    const _ = await createNewRecord({
      examine: newExamineLogPayload,
      prescription: newPrescriptionPayload,
    });
    return res.status(201).json({ message: "OK", ..._ });
  } catch (error) {
    next(error);
  }
}
