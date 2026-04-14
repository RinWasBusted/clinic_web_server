import { Router } from "express";
import {
  getImexLogs,
  createImexLog,
  createManyImexLog,
  updateImexLog,
  deleteImexLog,
  getImexById,
} from "./medicine-imex.controller.js";
import { verifyAccessToken } from "../../../middlewares/verifyToken.js";
import { authorizeRoles } from "../../../middlewares/role.js";
import { validateBody, validateParams, validateQuery } from "../../../middlewares/validate.js";
import {
  createImexLogBodySchema,
  createManyImexLogBodySchema,
  getImexLogsQuerySchema,
  imexLogParamsSchema,
  updateImexLogBodySchema,
} from "../../../schema/medicine-imex.schema.js";

const router = Router();

/**
 * @swagger
 * /medicine/imex:
 *   get:
 *     summary: Lấy danh sách nhật ký nhập xuất thuốc
 *     description: |
 *       Lấy danh sách các phiếu nhập/xuất thuốc với các bộ lọc tùy chọn theo loại (nhập/xuất) và khoảng thời gian.
 *       Dữ liệu trả về được sắp xếp theo thời gian tạo (mới nhất trước). Không cung cấp query params sẽ trả về tất cả phiếu.
 *     tags:
 *       - Medicine Imex
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: type
 *         required: false
 *         schema:
 *           type: string
 *           enum: [import, export]
 *         description: Lọc theo loại phiếu (import = nhập, export = xuất)
 *         example: "import"
 *       - in: query
 *         name: from
 *         required: false
 *         schema:
 *           type: string
 *           format: date-time
 *         description: Ngày bắt đầu (ISO 8601 format)
 *         example: "2026-04-01T00:00:00Z"
 *       - in: query
 *         name: to
 *         required: false
 *         schema:
 *           type: string
 *           format: date-time
 *         description: Ngày kết thúc (ISO 8601 format)
 *         example: "2026-04-13T23:59:59Z"
 *       - in: query
 *         name: page
 *         required: false
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *         description: Số thứ tự trang hiện tại
 *         example: 1
 *       - in: query
 *         name: pageSize
 *         required: false
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 10
 *         description: Số lượng phiếu imex trên mỗi trang
 *         example: 10
 *     responses:
 *       200:
 *         description: Lấy danh sách thành công. Hỗ trợ phân trang và trả về mảng rỗng nếu không có dữ liệu phù hợp.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Imex logs retrieved successfully"
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       imexID:
 *                         type: string
 *                         format: uuid
 *                         example: "550e8400-e29b-41d4-a716-446655440000"
 *                       imexType:
 *                         type: string
 *                         enum: [import, export]
 *                         example: "import"
 *                       pharmacist:
 *                         type: object
 *                         description: Thông tin dược sĩ tạo phiếu
 *                         properties:
 *                           account:
 *                             type: object
 *                             properties:
 *                               firstName:
 *                                 type: string
 *                                 example: "Nguyễn"
 *                               lastName:
 *                                 type: string
 *                                 example: "Hòa"
 *                               email:
 *                                 type: string
 *                                 example: "hoa.nguyen@clinic.com"
 *                       value:
 *                         type: number
 *                         format: float
 *                         description: Tổng giá trị của phiếu (VND)
 *                         example: 500000
 *                       note:
 *                         type: string
 *                         nullable: true
 *                         description: Ghi chú thêm của phiếu
 *                         example: "Nhập từ nhà cung cấp A"
 *                       createdAt:
 *                         type: string
 *                         format: date-time
 *                         description: Thời gian tạo phiếu
 *                         example: "2026-04-13T10:30:00Z"
 *                 pagination:
 *                   type: object
 *                   properties:
 *                     currentPage:
 *                       type: integer
 *                       example: 1
 *                     pageSize:
 *                       type: integer
 *                       example: 10
 *                     totalItems:
 *                       type: integer
 *                       example: 45
 *                     totalPages:
 *                       type: integer
 *                       example: 5
 *       400:
 *         description: Lỗi định dạng ngày tháng hoặc tham số phân trang không hợp lệ
 *       401:
 *         description: Unauthorized - Không được phép truy cập
 *       500:
 *         description: Server error - Lỗi máy chủ
 */
router.get(
  "/",
  verifyAccessToken,
  authorizeRoles("pharmacist"),
  validateQuery(getImexLogsQuerySchema),
  getImexLogs
);

/**
 * @swagger
 * /medicine/imex/{id}:
 *   get:
 *     summary: Lấy chi tiết phiếu nhập xuất thuốc
 *     description: |
 *       Lấy thông tin chi tiết đầy đủ của một phiếu nhập/xuất thuốc bao gồm:
 *       - Thông tin phiếu: ID, loại (nhập/xuất), giá trị, ghi chú
 *       - Danh sách các mục thuốc được nhập/xuất với thông tin thuốc chi tiết
 *       - Số lượng thay đổi (+ cho import, - cho export)
 *     tags:
 *       - Medicine Imex
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID duy nhất của phiếu nhập xuất
 *         example: "550e8400-e29b-41d4-a716-446655440000"
 *     responses:
 *       200:
 *         description: Lấy chi tiết phiếu thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Imex log retrieved successfully"
 *                 data:
 *                   type: object
 *                   properties:
 *                     imexID:
 *                       type: string
 *                       format: uuid
 *                       example: "550e8400-e29b-41d4-a716-446655440000"
 *                     imexType:
 *                       type: string
 *                       enum: [import, export]
 *                       example: "import"
 *                     pharmacist:
 *                       type: object
 *                       properties:
 *                         id:
 *                           type: string
 *                           format: uuid
 *                           example: "660e8400-e29b-41d4-a716-446655440111"
 *                         name:
 *                           type: string
 *                           example: "Nguyen Hoa"
 *                     value:
 *                       type: number
 *                       format: float
 *                       description: Tổng giá trị phiếu (VND)
 *                       example: 500000
 *                     note:
 *                       type: string
 *                       nullable: true
 *                       example: "Nhập từ nhà cung cấp A"
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                       example: "2026-04-13T10:30:00Z"
 *                     details:
 *                       type: array
 *                       description: Danh sách các mục thuốc. Import = qty (+), Export = qty (-)
 *                       items:
 *                         type: object
 *                         properties:
 *                           medicineID:
 *                             type: integer
 *                             example: 1
 *                           quantity:
 *                             type: integer
 *                             description: Số lượng thay đổi (dương=import, âm=export)
 *                             example: 100
 *                           note:
 *                             type: string
 *                             nullable: true
 *                             example: "Hộp đầy đủ"
 *                           medicine:
 *                             type: object
 *                             properties:
 *                               medicineName:
 *                                 type: string
 *                                 example: "Aspirin 500mg"
 *                               unit:
 *                                 type: string
 *                                 enum: [bottle, capsule, patches]
 *                                 example: "bottle"
 *                               price:
 *                                 type: number
 *                                 format: float
 *                                 example: 5000
 *       400:
 *         description: ID không được cung cấp
 *       404:
 *         description: Phiếu nhập xuất không tìm thấy
 *       401:
 *         description: Unauthorized - Không được phép truy cập
 *       500:
 *         description: Server error - Lỗi máy chủ
 */
router.get(
  "/:id",
  verifyAccessToken,
  authorizeRoles("pharmacist"),
  validateParams(imexLogParamsSchema),
  getImexById
);

/**
 * @swagger
 * /medicine/imex:
 *   post:
 *     summary: Tạo phiếu nhập xuất thuốc mới
 *     description: |
 *       Tạo phiếu nhập/xuất mới và cập nhật tồn kho trong một transaction:
 *       - **Import**: Tăng số lượng thuốc trong kho
 *       - **Export**: Giảm số lượng thuốc trong kho
 *       - `pharmacistID` được tự động lấy từ tài khoản pharmacist đang đăng nhập
 *       Phải cung cấp ít nhất 1 mục thuốc với số lượng > 0. Tất cả thay đổi được thực hiện atomically.
 *     tags:
 *       - Medicine Imex
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - imexType
 *               - items
 *             properties:
 *               imexType:
 *                 type: string
 *                 enum: [import, export]
 *                 description: Loại phiếu (import=nhập, export=xuất)
 *                 example: "import"
 *               value:
 *                 type: number
 *                 format: float
 *                 description: Tổng giá trị phiếu (VND) - tùy chọn, mặc định = 0
 *                 example: 500000
 *               note:
 *                 type: string
 *                 description: Ghi chú - tùy chọn
 *                 example: "Nhập từ nhà cung cấp A"
 *               items:
 *                 type: array
 *                 description: Danh sách mục thuốc (tối thiểu 1)
 *                 minItems: 1
 *                 items:
 *                   type: object
 *                   required:
 *                     - medicineID
 *                     - quantity
 *                   properties:
 *                     medicineID:
 *                       type: integer
 *                       example: 1
 *                     quantity:
 *                       type: integer
 *                       description: Số lượng (phải > 0)
 *                       example: 100
 *                     note:
 *                       type: string
 *                       description: Ghi chú mục - tùy chọn
 *                       example: "Hộp chưa mở"
 *           example:
 *             imexType: "import"
 *             value: 500000
 *             note: "Nhập từ nhà cung cấp A"
 *             items:
 *               - medicineID: 1
 *                 quantity: 100
 *                 note: "Hộp chưa mở"
 *               - medicineID: 2
 *                 quantity: 50
 *     responses:
 *       201:
 *         description: Phiếu được tạo thành công. Tồn kho đã cập nhật.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Imex log created successfully"
 *                 data:
 *                   type: object
 *                   properties:
 *                     imexID:
 *                       type: string
 *                       format: uuid
 *                       example: "550e8400-e29b-41d4-a716-446655440000"
 *                     imexType:
 *                       type: string
 *                       enum: [import, export]
 *                     pharmacistID:
 *                       type: string
 *                       format: uuid
 *                     value:
 *                       type: number
 *                       format: float
 *                     note:
 *                       type: string
 *                       nullable: true
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                     details:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           medicineID:
 *                             type: integer
 *                           quantity:
 *                             type: integer
 *                           note:
 *                             type: string
 *                           medicine:
 *                             type: object
 *                             properties:
 *                               medicineName:
 *                                 type: string
 *                               unit:
 *                                 type: string
 *                               price:
 *                                 type: number
 *       400:
 *         description: Dữ liệu không hợp lệ
 *       401:
 *         description: Unauthorized - Không được phép truy cập
 *       403:
 *         description: Forbidden - Chỉ pharmacist mới được phép truy cập
 *       500:
 *         description: Server error - Lỗi máy chủ
 */
router.post(
  "/",
  verifyAccessToken,
  authorizeRoles("pharmacist"),
  validateBody(createImexLogBodySchema),
  createImexLog
);

/**
 * @swagger
 * /medicine/imex/many:
 *   post:
 *     summary: Tạo phiếu nhập xuất thuốc nhiều mặt hàng
 *     description: |
 *       Tạo phiếu nhập/xuất với nhiều thuốc trong cùng một lần gọi API.
 *       `pharmacistID` được lấy tự động từ tài khoản đăng nhập hiện tại.
 *     tags:
 *       - Medicine Imex
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - imexType
 *               - items
 *             properties:
 *               imexType:
 *                 type: string
 *                 enum: [import, export]
 *               value:
 *                 type: number
 *                 format: float
 *               note:
 *                 type: string
 *               items:
 *                 type: array
 *                 minItems: 1
 *                 items:
 *                   type: object
 *                   required:
 *                     - medicineID
 *                     - quantity
 *                   properties:
 *                     medicineID:
 *                       type: integer
 *                     quantity:
 *                       type: integer
 *                     note:
 *                       type: string
 *     responses:
 *       201:
 *         description: Phiếu được tạo thành công
 *       400:
 *         description: Dữ liệu không hợp lệ
 *       401:
 *         description: Unauthorized - Không được phép truy cập
 *       403:
 *         description: Forbidden - Chỉ pharmacist mới được phép truy cập
 */
router.post(
  "/many",
  verifyAccessToken,
  authorizeRoles("pharmacist"),
  validateBody(createManyImexLogBodySchema),
  createManyImexLog
);

/**
 * @swagger
 * /medicine/imex/{id}:
 *   patch:
 *     summary: Cập nhật phiếu nhập xuất thuốc
 *     description: |
 *       Cập nhật phiếu bao gồm giá trị, ghi chú, và danh sách mục thuốc.
 *       Có thể thêm mục mới, cập nhật mục cũ hoặc xóa mục. Tồn kho tự động điều chỉnh.
 *       **Lưu ý**: Các mục không có trong danh sách items mới sẽ bị xóa.
 *     tags:
 *       - Medicine Imex
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID của phiếu nhập xuất
 *         example: "550e8400-e29b-41d4-a716-446655440000"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             description: Ít nhất 1 trường phải được cung cấp
 *             properties:
 *               value:
 *                 type: number
 *                 format: float
 *                 description: Giá trị phiếu mới (VND) - tùy chọn
 *                 example: 550000
 *               note:
 *                 type: string
 *                 description: Cập nhật ghi chú - tùy chọn
 *                 example: "Nhập từ nhà cung cấp B"
 *               items:
 *                 type: array
 *                 description: |
 *                   Danh sách mục để thêm/cập nhật - tùy chọn.
 *                   Mục không có trong danh sách sẽ bị xóa.
 *                 items:
 *                   type: object
 *                   required:
 *                     - medicineID
 *                     - quantity
 *                   properties:
 *                     medicineID:
 *                       type: integer
 *                       example: 1
 *                     quantity:
 *                       type: integer
 *                       description: Số lượng mới (phải > 0)
 *                       example: 120
 *                     note:
 *                       type: string
 *                       example: "Kiểm tra QC"
 *           example:
 *             value: 550000
 *             note: "Nhập từ nhà cung cấp B"
 *             items:
 *               - medicineID: 1
 *                 quantity: 120
 *                 note: "Kiểm tra QC"
 *               - medicineID: 3
 *                 quantity: 75
 *     responses:
 *       200:
 *         description: Cập nhật thành công. Tồn kho đã điều chỉnh.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Imex log updated successfully"
 *                   example: "Imex log updated successfully"
 *                 data:
 *                   type: object
 *                   properties:
 *                     imexID:
 *                       type: string
 *                       format: uuid
 *                       example: "550e8400-e29b-41d4-a716-446655440000"
 *                     imexType:
 *                       type: string
 *                       enum: [import, export]
 *                       example: "import"
 *                     pharmacistID:
 *                       type: string
 *                       format: uuid
 *                       example: "660e8400-e29b-41d4-a716-446655440111"
 *                     value:
 *                       type: number
 *                       format: float
 *                       example: 550000
 *                     note:
 *                       type: string
 *                       nullable: true
 *                       example: "Nhập từ nhà cung cấp B"
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                       example: "2026-04-13T10:30:00Z"
 *                     details:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           medicineID:
 *                             type: integer
 *                             example: 1
 *                           quantity:
 *                             type: integer
 *                             example: 120
 *                           note:
 *                             type: string
 *                             nullable: true
 *                           medicine:
 *                             type: object
 *                             properties:
 *                               medicineName:
 *                                 type: string
 *                               unit:
 *                                 type: string
 *                               price:
 *                                 type: number
 *       400:
 *         description: Dữ liệu không hợp lệ
 *       401:
 *         description: Unauthorized - Không được phép truy cập
 *       404:
 *         description: Phiếu nhập xuất không tìm thấy
 *       500:
 *         description: Server error - Lỗi máy chủ
 */
router.patch(
  "/:id",
  verifyAccessToken,
  authorizeRoles("pharmacist"),
  validateParams(imexLogParamsSchema),
  validateBody(updateImexLogBodySchema),
  updateImexLog
);

/**
 * @swagger
 * /medicine/imex/{id}:
 *   delete:
 *     summary: Xóa phiếu nhập xuất thuốc
 *     description: |
 *       Xóa toàn bộ phiếu nhập/xuất và các mục liên quan.
 *       Tồn kho sẽ tự động khôi phục về trạng thái trước khi phiếu được tạo (reverse transaction).
 *     tags:
 *       - Medicine Imex
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID của phiếu nhập xuất
 *         example: "550e8400-e29b-41d4-a716-446655440000"
 *     responses:
 *       200:
 *         description: Xóa thành công. Tồn kho đã khôi phục.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Imex log deleted successfully"
 *       400:
 *         description: ID không được cung cấp
 *       401:
 *         description: Unauthorized - Không được phép truy cập
 *       404:
 *         description: Phiếu nhập xuất không tìm thấy
 *       500:
 *         description: Server error - Lỗi máy chủ
 */
router.delete(
  "/:id",
  verifyAccessToken,
  authorizeRoles("pharmacist"),
  validateParams(imexLogParamsSchema),
  deleteImexLog
);

export default router;
