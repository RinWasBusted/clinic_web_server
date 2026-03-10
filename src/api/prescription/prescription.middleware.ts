import prescriptionService from "./prescription.service.js";
import type { Request, Response, NextFunction } from "express";
import { PrescriptionStatus } from "../../generated/prisma/index.js";
import { getLocalDateTimeInUTC } from "../../utils/datetime.js";

// Todo: validate the update process to check: updatedAt same day as created, status
export async function validateUpdateHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const data = req.body;
    const { id } = req.params ?? {};
    const target = await prescriptionService.getPrescriptionByID(id as string, null, {
      mode: "RISK",
      onlyAllowDraft: true,
    });

    // Do not allow updating and deleting concurrently
    if (!prescriptionService.isValidUpdate(data)) {
      return res.status(422).json({ message: "Không được vừa cập nhật vừa xóa thuốc kê đơn" });
    }

    const doctorID = req.user?.id;
    if (doctorID !== target?.doctorID) {
      return res.status(403).json({ message: "Bạn không có quyền cập nhật đơn thuốc này" });
    }

    if (target?.status === PrescriptionStatus.done) {
      return res.status(403).json({ message: "Không thể cập nhật đơn thuốc đã hoàn thành" });
    }

    // Chỉ được cập nhật trong ngày tạo đơn thuốc. Lưu ý múi giờ, nếu tạo đơn thuốc lúc 23h thì chỉ được cập nhật đến 23h ngày đó, qua 0h là không được cập nhật nữa.
    const updatedAt = getLocalDateTimeInUTC(new Date());
    if (target?.createdAt.toDateString() !== updatedAt.toDateString()) {
      return res.status(403).json({ message: "Chỉ có thể cập nhật đơn thuốc trong ngày được tạo" });
    }

    req.targetItem = target;

    return next();
  } catch (error) {
    next(error);
  }
}
