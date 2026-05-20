import type { Request, Response, NextFunction } from "express";
import {
  getAllMedicineUsagesService,
  getMedicineUsageByIdService,
  createMedicineUsageService,
  updateMedicineUsageService,
  deleteMedicineUsageService,
} from "./medicine-usage.service.js";

/** GET /medicine/usages */
export async function getAllMedicineUsagesHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const data = await getAllMedicineUsagesService();
    return res.status(200).json({ message: "OK", data });
  } catch (error) {
    next(error);
  }
}

/** GET /medicine/usages/:id */
export async function getMedicineUsageByIdHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const id = Number(req.params.id);
    if (isNaN(id)) return res.status(400).json({ message: "ID phải là số nguyên" });

    const data = await getMedicineUsageByIdService(id);
    if (!data) return res.status(404).json({ message: `Không tìm thấy gợi ý cách dùng ID: ${id}` });

    return res.status(200).json({ message: "OK", data });
  } catch (error) {
    next(error);
  }
}

/** POST /medicine/usages */
export async function createMedicineUsageHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const { usage } = req.body;
    if (!usage || typeof usage !== "string" || !usage.trim()) {
      return res.status(400).json({ message: "Vui lòng cung cấp 'usage'" });
    }
    const data = await createMedicineUsageService(usage);
    return res.status(201).json({ message: "Tạo gợi ý cách dùng thành công", data });
  } catch (error: unknown) {
    const prismaError = error as { code?: string };
    if (prismaError?.code === "P2002") {
      return res.status(409).json({ message: "Cách dùng này đã tồn tại" });
    }
    next(error);
  }
}

/** PUT /medicine/usages/:id */
export async function updateMedicineUsageHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const id = Number(req.params.id);
    if (isNaN(id)) return res.status(400).json({ message: "ID phải là số nguyên" });

    const { usage } = req.body;
    if (!usage || typeof usage !== "string" || !usage.trim()) {
      return res.status(400).json({ message: "Vui lòng cung cấp 'usage'" });
    }

    const exists = await getMedicineUsageByIdService(id);
    if (!exists) return res.status(404).json({ message: `Không tìm thấy gợi ý cách dùng ID: ${id}` });

    const data = await updateMedicineUsageService(id, usage);
    return res.status(200).json({ message: "Cập nhật gợi ý cách dùng thành công", data });
  } catch (error: unknown) {
    const prismaError = error as { code?: string };
    if (prismaError?.code === "P2002") {
      return res.status(409).json({ message: "Cách dùng này đã tồn tại" });
    }
    next(error);
  }
}

/** DELETE /medicine/usages/:id */
export async function deleteMedicineUsageHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const id = Number(req.params.id);
    if (isNaN(id)) return res.status(400).json({ message: "ID phải là số nguyên" });

    const exists = await getMedicineUsageByIdService(id);
    if (!exists) return res.status(404).json({ message: `Không tìm thấy gợi ý cách dùng ID: ${id}` });

    await deleteMedicineUsageService(id);
    return res.status(200).json({ message: `Đã xóa gợi ý cách dùng ID: ${id}` });
  } catch (error) {
    next(error);
  }
}
