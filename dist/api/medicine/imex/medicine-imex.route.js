import { Router } from "express";
import { getImexLogs, createImexLog, updateImexLog, deleteImexLog, getImexById, } from "./medicine-imex.controller.js";
const router = Router();
/**
 * @swagger
 * /medicine/imex:
 *   get:
 *     summary: Get imex logs with filters
 *     description: Retrieve imex logs with optional filters by type and date range
 *     tags:
 *       - Medicine Imex
 *     parameters:
 *       - in: query
 *         name: type
 *         schema:
 *           type: string
 *           enum: [import, export]
 *         description: Filter by imex type
 *       - in: query
 *         name: from
 *         schema:
 *           type: string
 *           format: date
 *         description: Start date (ISO format)
 *       - in: query
 *         name: to
 *         schema:
 *           type: string
 *           format: date
 *         description: End date (ISO format)
 *     responses:
 *       200:
 *         description: Imex logs retrieved successfully
 *       400:
 *         description: Invalid date format
 *       500:
 *         description: Server error
 */
router.get("/", getImexLogs);
/**
 * @swagger
 * /medicine/imex/{id}:
 *   get:
 *     summary: Get imex log by ID
 *     description: Retrieve a specific imex log with all its details
 *     tags:
 *       - Medicine Imex
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Imex ID
 *     responses:
 *       200:
 *         description: Imex log retrieved successfully
 *       404:
 *         description: Imex log not found
 *       500:
 *         description: Server error
 */
router.get("/:id", getImexById);
/**
 * @swagger
 * /medicine/imex:
 *   post:
 *     summary: Create new imex log
 *     description: Create a new imex log (import or export) with medicine items
 *     tags:
 *       - Medicine Imex
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               imexType:
 *                 type: string
 *                 enum: [import, export]
 *               pharmacistID:
 *                 type: string
 *                 format: uuid
 *               value:
 *                 type: number
 *               note:
 *                 type: string
 *               items:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     medicineID:
 *                       type: integer
 *                     quantity:
 *                       type: integer
 *                     note:
 *                       type: string
 *             required:
 *               - imexType
 *               - pharmacistID
 *               - items
 *     responses:
 *       201:
 *         description: Imex log created successfully
 *       400:
 *         description: Invalid input
 *       500:
 *         description: Server error
 */
router.post("/", createImexLog);
/**
 * @swagger
 * /medicine/imex/{id}:
 *   patch:
 *     summary: Update imex log
 *     description: Update imex log metadata (value, note) and/or add/update medicine items
 *     tags:
 *       - Medicine Imex
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Imex ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               value:
 *                 type: number
 *                 description: Optional total value
 *               note:
 *                 type: string
 *                 description: Optional note
 *               items:
 *                 type: array
 *                 description: Optional array of items to add/update
 *                 items:
 *                   type: object
 *                   properties:
 *                     medicineID:
 *                       type: integer
 *                     quantity:
 *                       type: integer
 *                     note:
 *                       type: string
 *     responses:
 *       200:
 *         description: Imex log updated successfully
 *       400:
 *         description: Invalid input
 *       404:
 *         description: Imex log not found
 *       500:
 *         description: Server error
 */
router.patch("/:id", updateImexLog);
/**
 * @swagger
 * /medicine/imex/{id}:
 *   delete:
 *     summary: Delete imex log
 *     description: Delete an entire imex log and its associated items
 *     tags:
 *       - Medicine Imex
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Imex ID
 *     responses:
 *       200:
 *         description: Imex log deleted successfully
 *       400:
 *         description: Invalid input
 *       404:
 *         description: Imex log not found
 *       500:
 *         description: Server error
 */
router.delete("/:id", deleteImexLog);
export default router;
//# sourceMappingURL=medicine-imex.route.js.map