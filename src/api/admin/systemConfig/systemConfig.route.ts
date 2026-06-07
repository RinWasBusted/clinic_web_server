import { Router } from "express";
import { verifyAccessToken } from "../../../middlewares/verifyToken.js";
import {
  getAllConfigHandler,
  getConfigByKeyHandler,
  getConfigHistoryHandler,
  getPendingChangeHandler,
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
 * /admin/config/{key}/history:
 *   get:
 *     summary: Lấy lịch sử thay đổi của 1 config key
 *     description: Trả về danh sách các lần thay đổi, mới nhất trước. Dùng để audit trail.
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
 *         example: COUNT_FEE
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 50
 *         description: Số bản ghi tối đa trả về
 *     responses:
 *       200:
 *         description: Danh sách lịch sử thay đổi
 *         content:
 *           application/json:
 *             example:
 *               message: OK
 *               data:
 *                 - id: 3
 *                   key: COUNT_FEE
 *                   value: "50000"
 *                   changedAt: "2026-06-07T12:00:00.000Z"
 *                 - id: 1
 *                   key: COUNT_FEE
 *                   value: "40000"
 *                   changedAt: "2026-01-01T00:00:00.000Z"
 *       404:
 *         description: Không tìm thấy config
 *       401:
 *         description: Unauthorized
 */
systemConfigRouter.get("/:key/history", getConfigHistoryHandler);

/**
 * @swagger
 * /admin/config/{key}/pending:
 *   get:
 *     summary: Xem giá trị đang chờ hiệu lực (ngày mai)
 *     description: |
 *       Trả về bản ghi history có effectiveDate = ngày mai (nếu có).
 *       hasPending = true nghĩa là có thay đổi giá sẽ có hiệu lực từ ngày mai.
 *       Dùng để hiển thị banner cảnh báo trên UI admin.
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
 *         example: COUNT_FEE
 *     responses:
 *       200:
 *         description: Pending change (nếu có)
 *         content:
 *           application/json:
 *             examples:
 *               hasPending:
 *                 value:
 *                   message: OK
 *                   hasPending: true
 *                   data:
 *                     id: 5
 *                     key: COUNT_FEE
 *                     value: "50000"
 *                     changedAt: "2026-06-07T14:00:00.000Z"
 *                     effectiveDate: "2026-06-08"
 *               noPending:
 *                 value:
 *                   message: OK
 *                   hasPending: false
 *                   data: null
 */
systemConfigRouter.get("/:key/pending", getPendingChangeHandler);

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
