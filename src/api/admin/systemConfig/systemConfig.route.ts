import { Router } from "express";
import { verifyAccessToken } from "../../../middlewares/verifyToken.js";
import {
  getAllConfigHandler,
  getConfigByKeyHandler,
  createConfigHandler,
  updateConfigHandler,
  upsertConfigHandler,
  deleteConfigHandler,
} from "./systemConfig.controller.js";

import { authorization } from "../../../middlewares/authorization.js";

const systemConfigRouter = Router();

systemConfigRouter.use(verifyAccessToken);
systemConfigRouter.use(authorization(["system.manage"]));

/**
 * @swagger
 * tags:
 *   - name: SystemConfig
 *     description: Quản lý cấu hình hệ thống (chỉ dành cho Admin)
 *
 * components:
 *   schemas:
 *     SystemConfig:
 *       type: object
 *       properties:
 *         key:
 *           type: string
 *           maxLength: 50
 *           description: Khóa định danh cấu hình (duy nhất)
 *           example: EXAMINE_FEE
 *         value:
 *           type: string
 *           maxLength: 255
 *           description: Giá trị cấu hình (luôn là string)
 *           example: "150000"
 *         description:
 *           type: string
 *           nullable: true
 *           description: Mô tả ý nghĩa của config này
 *           example: Tiền khám cơ bản (VND)
 *       required:
 *         - key
 *         - value
 */

/**
 * @swagger
 * /admin/config:
 *   get:
 *     summary: Lấy danh sách tất cả config
 *     tags:
 *       - SystemConfig
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Danh sách config
 *         content:
 *           application/json:
 *             example:
 *               message: OK
 *               data:
 *                 - key: EXAMINE_FEE
 *                   value: "150000"
 *                   description: Tiền khám cơ bản (VND)
 *                 - key: MAX_PATIENTS_PER_DAY
 *                   value: "40"
 *                   description: Số bệnh nhân tối đa mỗi ngày
 *       401:
 *         description: Unauthorized
 */
systemConfigRouter.get("/", getAllConfigHandler);

/**
 * @swagger
 * /admin/config/{key}:
 *   get:
 *     summary: Lấy 1 config theo key
 *     tags:
 *       - SystemConfig
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: key
 *         required: true
 *         schema:
 *           type: string
 *         description: Key của config cần lấy
 *         example: EXAMINE_FEE
 *     responses:
 *       200:
 *         description: Config tìm thấy
 *         content:
 *           application/json:
 *             example:
 *               message: OK
 *               data:
 *                 key: EXAMINE_FEE
 *                 value: "150000"
 *                 description: Tiền khám cơ bản (VND)
 *       404:
 *         description: Không tìm thấy config
 *       401:
 *         description: Unauthorized
 */
systemConfigRouter.get("/:key", getConfigByKeyHandler);

/**
 * @swagger
 * /admin/config:
 *   post:
 *     summary: Tạo mới một config
 *     tags:
 *       - SystemConfig
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - key
 *               - value
 *             properties:
 *               key:
 *                 type: string
 *                 example: EXAMINE_FEE
 *               value:
 *                 type: string
 *                 example: "150000"
 *               description:
 *                 type: string
 *                 example: Tiền khám cơ bản (VND)
 *     responses:
 *       201:
 *         description: Tạo config thành công
 *       400:
 *         description: Thiếu key hoặc value
 *       409:
 *         description: Key đã tồn tại
 *       401:
 *         description: Unauthorized
 */
systemConfigRouter.post("/", createConfigHandler);

/**
 * @swagger
 * /admin/config/{key}:
 *   put:
 *     summary: Cập nhật config theo key
 *     tags:
 *       - SystemConfig
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: key
 *         required: true
 *         schema:
 *           type: string
 *         example: EXAMINE_FEE
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - value
 *             properties:
 *               value:
 *                 type: string
 *                 example: "200000"
 *               description:
 *                 type: string
 *                 example: Tiền khám cơ bản (VND) - đã cập nhật
 *     responses:
 *       200:
 *         description: Cập nhật thành công
 *       400:
 *         description: Thiếu value
 *       404:
 *         description: Không tìm thấy config
 *       401:
 *         description: Unauthorized
 */
systemConfigRouter.put("/:key", updateConfigHandler);

/**
 * @swagger
 * /admin/config/{key}/upsert:
 *   put:
 *     summary: Tạo hoặc cập nhật config (upsert)
 *     description: Nếu key chưa tồn tại thì tạo mới, nếu đã có thì cập nhật.
 *     tags:
 *       - SystemConfig
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: key
 *         required: true
 *         schema:
 *           type: string
 *         example: EXAMINE_FEE
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - value
 *             properties:
 *               value:
 *                 type: string
 *                 example: "150000"
 *               description:
 *                 type: string
 *                 example: Tiền khám cơ bản (VND)
 *     responses:
 *       200:
 *         description: Upsert thành công
 *       400:
 *         description: Thiếu value
 *       401:
 *         description: Unauthorized
 */
systemConfigRouter.put("/:key/upsert", upsertConfigHandler);

/**
 * @swagger
 * /admin/config/{key}:
 *   delete:
 *     summary: Xóa config theo key
 *     tags:
 *       - SystemConfig
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: key
 *         required: true
 *         schema:
 *           type: string
 *         example: EXAMINE_FEE
 *     responses:
 *       200:
 *         description: Xóa thành công
 *       404:
 *         description: Không tìm thấy config
 *       401:
 *         description: Unauthorized
 */
systemConfigRouter.delete("/:key", deleteConfigHandler);

export default systemConfigRouter;
