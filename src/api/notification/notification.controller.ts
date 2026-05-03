import type { Request, Response, NextFunction } from "express";
import prisma from "../../utils/prisma.js";

/**
 * GET /notification
 * Lấy danh sách tất cả thông báo, sắp xếp mới nhất trước.
 */
export async function getAllNotificationsHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const notifications = await prisma.notification.findMany({
      orderBy: { createdAt: "desc" },
    });
    return res.json({ notifications });
  } catch (error) {
    next(error);
  }
}

/**
 * GET /notification/:id
 * Lấy chi tiết một thông báo theo ID.
 */
export async function getNotificationByIdHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const id = req.params.id as string;
    const notification = await prisma.notification.findUnique({
      where: { id },
    });
    if (!notification) {
      return res.status(404).json({ message: "Không tìm thấy thông báo." });
    }
    return res.json({ notification });
  } catch (error) {
    next(error);
  }
}

/**
 * POST /notification
 * Tạo thông báo mới.
 * Body: { title, description?, link? }
 */
export async function createNotificationHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const { title, description, link } = req.body;
    const notification = await prisma.notification.create({
      data: {
        title,
        description: description ?? null,
        link: link ?? null,
      },
    });
    return res.status(201).json({ message: "Tạo thông báo thành công.", notification });
  } catch (error) {
    next(error);
  }
}

/**
 * PATCH /notification/:id/read
 * Đánh dấu một thông báo là đã đọc.
 */
export async function markNotificationReadHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const id = req.params.id as string;
    const exists = await prisma.notification.findUnique({ where: { id } });
    if (!exists) {
      return res.status(404).json({ message: "Không tìm thấy thông báo." });
    }
    const notification = await prisma.notification.update({
      where: { id },
      data: { isRead: true },
    });
    return res.json({ message: "Đã đánh dấu thông báo là đã đọc.", notification });
  } catch (error) {
    next(error);
  }
}

/**
 * PATCH /notification/read-all
 * Đánh dấu tất cả thông báo là đã đọc.
 */
export async function markAllNotificationsReadHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const result = await prisma.notification.updateMany({
      where: { isRead: false },
      data: { isRead: true },
    });
    return res.json({ message: `Đã đánh dấu ${result.count} thông báo là đã đọc.` });
  } catch (error) {
    next(error);
  }
}

/**
 * DELETE /notification/:id
 * Xóa một thông báo theo ID.
 */
export async function deleteNotificationHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const id = req.params.id as string;
    try {
      await prisma.notification.delete({ where: { id } });
    } catch {
      return res.status(404).json({ message: "Không tìm thấy thông báo." });
    }
    return res.json({ message: "Đã xóa thông báo thành công." });
  } catch (error) {
    next(error);
  }
}
