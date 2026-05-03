import { Router } from "express";
import { verifyAccessToken } from "../../middlewares/verifyToken.js";
import {
  getAllNotificationsHandler,
  getNotificationByIdHandler,
  createNotificationHandler,
  markNotificationReadHandler,
  markAllNotificationsReadHandler,
  deleteNotificationHandler,
} from "./notification.controller.js";

/**
 * @swagger
 * tags:
 *   name: Notification
 *   description: Quản lý thông báo hệ thống
 */

const router = Router();
router.use(verifyAccessToken);

/**
 * @swagger
 * /notification:
 *   get:
 *     summary: Lấy danh sách tất cả thông báo
 *     tags: [Notification]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Danh sách thông báo
 *         content:
 *           application/json:
 *             example:
 *               notifications:
 *                 - id: "uuid"
 *                   title: "Bảo trì hệ thống"
 *                   description: "Hệ thống sẽ bảo trì lúc 22:00"
 *                   link: null
 *                   isRead: false
 *                   createdAt: "2026-05-03T10:00:00.000Z"
 *       401:
 *         description: Unauthorized
 */
router.get("/", getAllNotificationsHandler);

/**
 * @swagger
 * /notification/read-all:
 *   patch:
 *     summary: Đánh dấu tất cả thông báo là đã đọc
 *     tags: [Notification]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Đã đánh dấu tất cả thông báo
 *         content:
 *           application/json:
 *             example:
 *               message: "Đã đánh dấu 3 thông báo là đã đọc."
 *       401:
 *         description: Unauthorized
 */
router.patch("/read-all", markAllNotificationsReadHandler);

/**
 * @swagger
 * /notification/{id}:
 *   get:
 *     summary: Lấy chi tiết một thông báo theo ID
 *     tags: [Notification]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: UUID của thông báo
 *     responses:
 *       200:
 *         description: Chi tiết thông báo
 *         content:
 *           application/json:
 *             example:
 *               notification:
 *                 id: "uuid"
 *                 title: "Bảo trì hệ thống"
 *                 description: "Hệ thống sẽ bảo trì lúc 22:00"
 *                 link: null
 *                 isRead: false
 *                 createdAt: "2026-05-03T10:00:00.000Z"
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Không tìm thấy thông báo
 */
router.get("/:id", getNotificationByIdHandler);

/**
 * @swagger
 * /notification:
 *   post:
 *     summary: Tạo thông báo mới
 *     tags: [Notification]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *             properties:
 *               title:
 *                 type: string
 *                 maxLength: 255
 *                 example: "Bảo trì hệ thống"
 *               description:
 *                 type: string
 *                 maxLength: 255
 *                 example: "Hệ thống sẽ bảo trì từ 22:00 đến 23:30"
 *               link:
 *                 type: string
 *                 maxLength: 255
 *                 example: "/admin/maintenance"
 *     responses:
 *       201:
 *         description: Tạo thông báo thành công
 *         content:
 *           application/json:
 *             example:
 *               message: "Tạo thông báo thành công."
 *               notification:
 *                 id: "uuid"
 *                 title: "Bảo trì hệ thống"
 *                 description: "Hệ thống sẽ bảo trì từ 22:00 đến 23:30"
 *                 link: "/admin/maintenance"
 *                 isRead: false
 *                 createdAt: "2026-05-03T10:00:00.000Z"
 *       400:
 *         description: Dữ liệu không hợp lệ
 *       401:
 *         description: Unauthorized
 */
router.post("/", createNotificationHandler);

/**
 * @swagger
 * /notification/{id}/read:
 *   patch:
 *     summary: Đánh dấu một thông báo là đã đọc
 *     tags: [Notification]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: UUID của thông báo cần đánh dấu
 *     responses:
 *       200:
 *         description: Đã đánh dấu thành công
 *         content:
 *           application/json:
 *             example:
 *               message: "Đã đánh dấu thông báo là đã đọc."
 *               notification:
 *                 id: "uuid"
 *                 isRead: true
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Không tìm thấy thông báo
 */
router.patch("/:id/read", markNotificationReadHandler);

/**
 * @swagger
 * /notification/{id}:
 *   delete:
 *     summary: Xóa một thông báo theo ID
 *     tags: [Notification]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: UUID của thông báo cần xóa
 *     responses:
 *       200:
 *         description: Xóa thành công
 *         content:
 *           application/json:
 *             example:
 *               message: "Đã xóa thông báo thành công."
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Không tìm thấy thông báo
 */
router.delete("/:id", deleteNotificationHandler);

export default router;