import { Router } from "express";
import { verifyAccessToken } from "../../../middlewares/verifyToken.js";
import {
  getAllMedicineUnitsHandler,
  getMedicineUnitByIdHandler,
  createMedicineUnitHandler,
  updateMedicineUnitHandler,
  deleteMedicineUnitHandler,
} from "./medicine-unit.controller.js";
import { authorization } from "../../../middlewares/authorization.js";

const medicineUnitRouter = Router();

medicineUnitRouter.use(verifyAccessToken);

/**
 * @swagger
 * tags:
 *   - name: MedicineUnit
 *     description: Quản lý đơn vị thuốc (chai, viên, gói, ...)
 *
 * components:
 *   schemas:
 *     MedicineUnit:
 *       type: object
 *       properties:
 *         unitID:
 *           type: integer
 *           example: 1
 *         unitName:
 *           type: string
 *           maxLength: 50
 *           example: viên
 *       required:
 *         - unitID
 *         - unitName
 */

/**
 * @swagger
 * /medicine/units:
 *   get:
 *     summary: Lấy danh sách tất cả đơn vị thuốc
 *     tags:
 *       - MedicineUnit
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Danh sách đơn vị thuốc
 *         content:
 *           application/json:
 *             example:
 *               message: OK
 *               data:
 *                 - unitID: 1
 *                   unitName: viên
 *                 - unitID: 2
 *                   unitName: chai
 *                 - unitID: 3
 *                   unitName: gói
 */
medicineUnitRouter.get("/", authorization(["medicine.view", "medicine.add", "medicine.update", "imex.create", "imex.update", "ticket.update"]), getAllMedicineUnitsHandler);

/**
 * @swagger
 * /medicine/units/{id}:
 *   get:
 *     summary: Lấy đơn vị thuốc theo ID
 *     tags:
 *       - MedicineUnit
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
 *         description: Đơn vị thuốc tìm thấy
 *       404:
 *         description: Không tìm thấy
 */
medicineUnitRouter.get("/:id", authorization(["medicine.view", "medicine.add", "medicine.update", "imex.create", "imex.update", "ticket.update"]), getMedicineUnitByIdHandler);

/**
 * @swagger
 * /medicine/units:
 *   post:
 *     summary: Tạo đơn vị thuốc mới
 *     tags:
 *       - MedicineUnit
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - unitName
 *             properties:
 *               unitName:
 *                 type: string
 *                 example: miếng dán
 *     responses:
 *       201:
 *         description: Tạo thành công
 *       400:
 *         description: Thiếu unitName
 *       409:
 *         description: Đơn vị đã tồn tại
 */
medicineUnitRouter.post("/", authorization(["medicine.add", "medicine.update"]), createMedicineUnitHandler);

/**
 * @swagger
 * /medicine/units/{id}:
 *   put:
 *     summary: Cập nhật tên đơn vị thuốc
 *     tags:
 *       - MedicineUnit
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
 *               - unitName
 *             properties:
 *               unitName:
 *                 type: string
 *                 example: viên nén
 *     responses:
 *       200:
 *         description: Cập nhật thành công
 *       404:
 *         description: Không tìm thấy
 *       409:
 *         description: Tên đã tồn tại
 */
medicineUnitRouter.put("/:id", authorization(["medicine.update"]), updateMedicineUnitHandler);

/**
 * @swagger
 * /medicine/units/{id}:
 *   delete:
 *     summary: Xóa đơn vị thuốc
 *     description: Không thể xóa nếu đơn vị đang được dùng bởi thuốc nào đó.
 *     tags:
 *       - MedicineUnit
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
 *       409:
 *         description: Đơn vị đang được sử dụng, không thể xóa
 */
medicineUnitRouter.delete("/:id", authorization(["medicine.delete"]), deleteMedicineUnitHandler);

export default medicineUnitRouter;
