import { Router } from "express";
import {
  createMedicine,
  getMedicineById,
  getMedicineItems,
  updateMedicine,
  deleteMedicine,
  createManyMedicine,
} from "./medicine-items.controller.js";
import upload from "../../../utils/multer.js";
import { verifyAccessToken } from "../../../middlewares/verifyToken.js";
import { authorizeRoles } from "../../../middlewares/role.js";

const medicineItemsRouter = Router();

/**
 * @swagger
 * /medicine/items:
 *   post:
 *     summary: Create a new medicine
 *     description: Create a new medicine with image upload to Cloudinary
 *     tags:
 *       - Medicine
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               medicineName:
 *                 type: string
 *               unit:
 *                 type: string
 *                 enum: [bottle, capsule, patches]
 *               price:
 *                 type: number
 *               description:
 *                 type: string
 *               image:
 *                 type: string
 *                 format: binary
 *             required:
 *               - medicineName
 *               - unit
 *               - price
 *     responses:
 *       201:
 *         description: Medicine created successfully
 *       400:
 *         description: Missing required fields
 *       500:
 *         description: Server error
 */
medicineItemsRouter.post("/", verifyAccessToken, authorizeRoles("manager", "staff"), upload.single("image"), createMedicine);

/**
 * @swagger
 * /medicine/items/many:
 *   post:
 *     summary: Create multiple medicines at once
 *     description: Bulk create medicines from a JSON array. Returns details of successful and failed creations.
 *     tags:
 *       - Medicine
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: array
 *             items:
 *               type: object
 *               required:
 *                 - medicineName
 *                 - unit
 *                 - price
 *               properties:
 *                 medicineName:
 *                   type: string
 *                   example: "Aspirin"
 *                 unit:
 *                   type: string
 *                   enum: [bottle, capsule, patches]
 *                   example: "bottle"
 *                 price:
 *                   type: number
 *                   example: 50000
 *                 description:
 *                   type: string
 *                   example: "Pain relief medicine"
 *           example:
 *             - medicineName: "Aspirin"
 *               unit: "bottle"
 *               price: 50000
 *               description: "Pain relief"
 *             - medicineName: "Ibuprofen"
 *               unit: "capsule"
 *               price: 35000
 *               description: "Anti-inflammatory"
 *     responses:
 *       201:
 *         description: Bulk creation completed with success and failure details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Medicines created successfully"
 *                 data:
 *                   type: object
 *                   properties:
 *                     requestCount:
 *                       type: integer
 *                       example: 5
 *                     successCount:
 *                       type: integer
 *                       example: 4
 *                     failedCount:
 *                       type: integer
 *                       example: 1
 *                     success:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           index:
 *                             type: integer
 *                           medicineName:
 *                             type: string
 *                     failed:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           index:
 *                             type: integer
 *                           medicineName:
 *                             type: string
 *                           reason:
 *                             type: string
 *                             enum: ["DUPLICATE_UNIQUE", "PRISMA_P2003", "Missing required fields for medicine"]
 *       400:
 *         description: Bad request - Medicines must be an array or missing required fields
 *       401:
 *         description: Unauthorized - Missing or invalid token
 *       403:
 *         description: Forbidden - Only manager or staff can access
 *       500:
 *         description: Server error
 */
medicineItemsRouter.post("/many", verifyAccessToken, authorizeRoles("manager", "staff"), createManyMedicine);

/**
 * @swagger
 * /medicine/items:
 *   get:
 *     summary: Get medicines with search and pagination
 *     description: Retrieve medicines with optional search by name and pagination support. Without query params, returns all medicines
 *     tags:
 *       - Medicine
 *     parameters:
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search medicines by name (case-insensitive)
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number (starts from 1)
 *     responses:
 *       200:
 *         description: Medicines retrieved successfully with pagination info
 *       400:
 *         description: Invalid page number
 *       500:
 *         description: Server error
 */
medicineItemsRouter.get("/", verifyAccessToken, getMedicineItems);

/**
 * @swagger
 * /medicine/items/{id}:
 *   get:
 *     summary: Get medicine by ID
 *     description: Retrieve a specific medicine by its ID
 *     tags:
 *       - Medicine
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Medicine retrieved successfully
 *       404:
 *         description: Medicine not found
 *       500:
 *         description: Server error
 */
medicineItemsRouter.get("/:id", verifyAccessToken, getMedicineById);

/**
 * @swagger
 * /medicine/items/{id}:
 *   patch:
 *     summary: Update medicine
 *     description: Update medicine details with optional image upload
 *     tags:
 *       - Medicine
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               medicineName:
 *                 type: string
 *               unit:
 *                 type: string
 *               price:
 *                 type: number
 *               description:
 *                 type: string
 *               image:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Medicine updated successfully
 *       404:
 *         description: Medicine not found
 *       500:
 *         description: Server error
 */
medicineItemsRouter.patch("/:id", verifyAccessToken, authorizeRoles("manager", "staff"), upload.single("image"), updateMedicine);

/**
 * @swagger
 * /medicine/items/{id}:
 *   delete:
 *     summary: Delete medicine
 *     description: Delete a medicine and its associated image from Cloudinary
 *     tags:
 *       - Medicine
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Medicine deleted successfully
 *       404:
 *         description: Medicine not found
 *       500:
 *         description: Server error
 */
medicineItemsRouter.delete("/:id", verifyAccessToken, authorizeRoles("manager", "staff"), deleteMedicine);

export default medicineItemsRouter;
