import type { Request, Response, NextFunction } from "express";
import systemConfigService from "./systemConfig.service.js";

/** GET /admin/config — Lấy tất cả config */
export async function getAllConfigHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const data = await systemConfigService.getAll();
    return res.status(200).json({ message: "OK", data });
  } catch (error) {
    next(error);
  }
}

/** GET /admin/config/:key — Lấy 1 config theo key */
export async function getConfigByKeyHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const { key } = req.params;
    const data = await systemConfigService.getByKey(key as string);
    if (!data) {
      return res.status(404).json({ message: `Không tìm thấy config với key: ${key}` });
    }
    return res.status(200).json({ message: "OK", data });
  } catch (error) {
    next(error);
  }
}

/** POST /admin/config — Tạo mới 1 config */
export async function createConfigHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const { key, value, description } = req.body;
    if (!key || value === undefined || value === null) {
      return res.status(400).json({ message: "Vui lòng cung cấp 'key' và 'value'" });
    }
    const exists = await systemConfigService.getByKey(key);
    if (exists) {
      return res.status(409).json({ message: `Config với key '${key}' đã tồn tại` });
    }
    const data = await systemConfigService.create(key, String(value), description);
    return res.status(201).json({ message: "Tạo config thành công", data });
  } catch (error) {
    next(error);
  }
}

/** PUT /admin/config/:key — Cập nhật config theo key */
export async function updateConfigHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const { key } = req.params;
    const { value, description } = req.body;
    if (value === undefined || value === null) {
      return res.status(400).json({ message: "Vui lòng cung cấp 'value'" });
    }
    const exists = await systemConfigService.getByKey(key as string);
    if (!exists) {
      return res.status(404).json({ message: `Không tìm thấy config với key: ${key}` });
    }
    const data = await systemConfigService.update(key as string, String(value), description);
    return res.status(200).json({ message: "Cập nhật config thành công", data });
  } catch (error) {
    next(error);
  }
}

/** PUT /admin/config/:key/upsert — Tạo hoặc cập nhật config */
export async function upsertConfigHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const { key } = req.params;
    const { value, description } = req.body;
    if (value === undefined || value === null) {
      return res.status(400).json({ message: "Vui lòng cung cấp 'value'" });
    }
    const data = await systemConfigService.upsert(key as string, String(value), description);
    return res.status(200).json({ message: "Upsert config thành công", data });
  } catch (error) {
    next(error);
  }
}

/** DELETE /admin/config/:key — Xóa config theo key */
export async function deleteConfigHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const { key } = req.params;
    const exists = await systemConfigService.getByKey(key as string);
    if (!exists) {
      return res.status(404).json({ message: `Không tìm thấy config với key: ${key}` });
    }
    await systemConfigService.delete(key as string);
    return res.status(200).json({ message: `Đã xóa config '${key}'` });
  } catch (error) {
    next(error);
  }
}

/** GET /admin/config/:key/history — Lấy lịch sử thay đổi của 1 config key */
export async function getConfigHistoryHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const { key } = req.params;
    const limit = Number(req.query.limit ?? 50);
    const exists = await systemConfigService.getByKey(key as string);
    if (!exists) {
      return res.status(404).json({ message: `Không tìm thấy config với key: ${key}` });
    }
    const data = await systemConfigService.getHistory(key as string, limit);
    return res.status(200).json({ message: "OK", data });
  } catch (error) {
    next(error);
  }
}

/**
 * GET /admin/config/:key/pending
 * Lấy thay đổi đang chờ hiệu lực (effectiveDate = ngày mai) của 1 config key.
 * Trả về null nếu không có thay đổi nào đang chờ.
 * Dùng để hiển thị banner "Giá sẽ thay đổi từ ngày mai" trên UI admin.
 */
export async function getPendingChangeHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const { key } = req.params;
    const exists = await systemConfigService.getByKey(key as string);
    if (!exists) {
      return res.status(404).json({ message: `Không tìm thấy config với key: ${key}` });
    }
    const data = await systemConfigService.getPendingChange(key as string);
    return res.status(200).json({
      message: "OK",
      data,                        // null nếu không có pending change
      hasPending: data !== null,
    });
  } catch (error) {
    next(error);
  }
}
