import { Router } from "express";
import { verifyAccessToken } from "../../../middlewares/verifyToken.js";
import {
  getAllMedicineUsagesHandler,
  getMedicineUsageByIdHandler,
  createMedicineUsageHandler,
  updateMedicineUsageHandler,
  deleteMedicineUsageHandler,
} from "./medicine-usage.controller.js";

const medicineUsageRouter = Router();

medicineUsageRouter.use(verifyAccessToken);

/**
 * @swagger
 * tags:
 *   - name: MedicineUsage
 *     description: Quản lý các gợi ý cách dùng thuốc (Uống sau ăn, bôi ngoài da, ...)
 *
 * components:
 *   schemas:
 *     MedicineUsage:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           example: 1
 *         usage:
 *           type: string
 *           maxLength: 255
 *           example: "Uống sau ăn"
 *       required:
 *         - id
 *         - usage
 */

/**
 * @swagger
 * /medicine/usages:
 *   get:
 *     summary: Lấy danh sách tất cả gợi ý cách dùng
 *     tags:
 *       - MedicineUsage
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Danh sách gợi ý cách dùng
 *         content:
 *           application/json:
 *             example:
 *               message: OK
 *               data:
 *                 - id: 1
 *                   usage: "Uống sau ăn"
 *                 - id: 2
 *                   usage: "Uống trước ăn"
 */
medicineUsageRouter.get("/", getAllMedicineUsagesHandler);

/**
 * @swagger
 * /medicine/usages/{id}:
 *   get:
 *     summary: Lấy gợi ý cách dùng theo ID
 *     tags:
 *       - MedicineUsage
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         example: 1
 *     responses:
 *       200:
 *         description: Gợi ý cách dùng tìm thấy
 *       404:
 *         description: Không tìm thấy
 */
medicineUsageRouter.get("/:id", getMedicineUsageByIdHandler);

/**
 * @swagger
 * /medicine/usages:
 *   post:
 *     summary: Tạo gợi ý cách dùng mới
 *     tags:
 *       - MedicineUsage
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - usage
 *             properties:
 *               usage:
 *                 type: string
 *                 example: "Uống khi cần thiết"
 *     responses:
 *       201:
 *         description: Tạo thành công
 *       400:
 *         description: Thiếu thông tin
 *       409:
 *         description: Cách dùng đã tồn tại
 */
medicineUsageRouter.post("/", createMedicineUsageHandler);

/**
 * @swagger
 * /medicine/usages/{id}:
 *   put:
 *     summary: Cập nhật gợi ý cách dùng
 *     tags:
 *       - MedicineUsage
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         example: 1
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - usage
 *             properties:
 *               usage:
 *                 type: string
 *                 example: "Sáng 1 viên, chiều 1 viên"
 *     responses:
 *       200:
 *         description: Cập nhật thành công
 *       404:
 *         description: Không tìm thấy
 *       409:
 *         description: Cách dùng đã tồn tại
 */
medicineUsageRouter.put("/:id", updateMedicineUsageHandler);

/**
 * @swagger
 * /medicine/usages/{id}:
 *   delete:
 *     summary: Xóa gợi ý cách dùng
 *     tags:
 *       - MedicineUsage
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         example: 1
 *     responses:
 *       200:
 *         description: Xóa thành công
 *       404:
 *         description: Không tìm thấy
 */
medicineUsageRouter.delete("/:id", deleteMedicineUsageHandler);

export default medicineUsageRouter;
