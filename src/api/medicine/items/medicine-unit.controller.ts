import type { Request, Response, NextFunction } from "express";
import {
  getAllMedicineUnitsService,
  getMedicineUnitByIdService,
  createMedicineUnitService,
  updateMedicineUnitService,
  deleteMedicineUnitService,
} from "./medicine-unit.service.js";

/** GET /medicine/units */
export async function getAllMedicineUnitsHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const data = await getAllMedicineUnitsService();
    return res.status(200).json({ message: "OK", data });
  } catch (error) {
    next(error);
  }
}

/** GET /medicine/units/:id */
export async function getMedicineUnitByIdHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const unitID = Number(req.params.id);
    if (isNaN(unitID)) return res.status(400).json({ message: "unitID phải là số nguyên" });

    const data = await getMedicineUnitByIdService(unitID);
    if (!data) return res.status(404).json({ message: `Không tìm thấy đơn vị ID: ${unitID}` });

    return res.status(200).json({ message: "OK", data });
  } catch (error) {
    next(error);
  }
}

/** POST /medicine/units */
export async function createMedicineUnitHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const { unitName } = req.body;
    if (!unitName || typeof unitName !== "string" || !unitName.trim()) {
      return res.status(400).json({ message: "Vui lòng cung cấp 'unitName'" });
    }
    const data = await createMedicineUnitService(unitName);
    return res.status(201).json({ message: "Tạo đơn vị thuốc thành công", data });
  } catch (error: unknown) {
    const prismaError = error as { code?: string };
    if (prismaError?.code === "P2002") {
      return res.status(409).json({ message: "Đơn vị này đã tồn tại" });
    }
    next(error);
  }
}

/** PUT /medicine/units/:id */
export async function updateMedicineUnitHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const unitID = Number(req.params.id);
    if (isNaN(unitID)) return res.status(400).json({ message: "unitID phải là số nguyên" });

    const { unitName } = req.body;
    if (!unitName || typeof unitName !== "string" || !unitName.trim()) {
      return res.status(400).json({ message: "Vui lòng cung cấp 'unitName'" });
    }

    const exists = await getMedicineUnitByIdService(unitID);
    if (!exists) return res.status(404).json({ message: `Không tìm thấy đơn vị ID: ${unitID}` });

    const data = await updateMedicineUnitService(unitID, unitName);
    return res.status(200).json({ message: "Cập nhật đơn vị thuốc thành công", data });
  } catch (error: unknown) {
    const prismaError = error as { code?: string };
    if (prismaError?.code === "P2002") {
      return res.status(409).json({ message: "Tên đơn vị này đã tồn tại" });
    }
    next(error);
  }
}

/** DELETE /medicine/units/:id */
export async function deleteMedicineUnitHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const unitID = Number(req.params.id);
    if (isNaN(unitID)) return res.status(400).json({ message: "unitID phải là số nguyên" });

    const exists = await getMedicineUnitByIdService(unitID);
    if (!exists) return res.status(404).json({ message: `Không tìm thấy đơn vị ID: ${unitID}` });

    await deleteMedicineUnitService(unitID);
    return res.status(200).json({ message: `Đã xóa đơn vị thuốc ID: ${unitID}` });
  } catch (error: unknown) {
    // P2003: FK constraint — đơn vị đang được dùng bởi thuốc
    const prismaError = error as { code?: string };
    if (prismaError?.code === "P2003") {
      return res.status(409).json({
        message: "Không thể xóa — đơn vị này đang được sử dụng bởi một hoặc nhiều thuốc",
      });
    }
    next(error);
  }
}
