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

const medicineItemsRouter = Router();

/**
 * @swagger
 * /medicine/items:
 *   post:
 *     summary: Create a new medicine
 *     description: Create a new medicine item with optional image upload to Cloudinary. Image will be stored with default placeholder if not provided.
 *     tags:
 *       - Medicine
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               medicineName:
 *                 type: string
 *                 description: Unique name of the medicine
 *                 example: "Aspirin"
 *               unit:
 *                 type: string
 *                 enum: [bottle, capsule, patches]
 *                 description: Unit/form of the medicine
 *                 example: "bottle"
 *               price:
 *                 type: number
 *                 format: decimal
 *                 description: Price of the medicine in VND
 *                 example: 50000
 *               description:
 *                 type: string
 *                 description: Optional detailed description of the medicine
 *                 example: "Pain relief and fever reducer"
 *               image:
 *                 type: string
 *                 format: binary
 *                 description: Optional medicine image file (jpg, png, etc)
 *             required:
 *               - medicineName
 *               - unit
 *               - price
 *     responses:
 *       201:
 *         description: Medicine created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Medicine created successfully"
 *                 data:
 *                   type: object
 *                   properties:
 *                     medicineID:
 *                       type: integer
 *                       example: 1
 *                     medicineName:
 *                       type: string
 *                       example: "Aspirin"
 *                     unit:
 *                       type: string
 *                       enum: [bottle, capsule, patches]
 *                       example: "bottle"
 *                     price:
 *                       type: number
 *                       format: decimal
 *                       example: 50000
 *                     quantity:
 *                       type: integer
 *                       example: 0
 *                     description:
 *                       type: string
 *                       example: "Pain relief and fever reducer"
 *                     medicineImage:
 *                       type: string
 *                       format: url
 *                       example: "https://cloudinary.com/image.jpg"
 *       400:
 *         description: Bad request - Missing required fields
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Missing required fields: medicineName, unit, price"
 *       401:
 *         description: Unauthorized - Missing or invalid authentication token
 *       409:
 *         description: Conflict - Medicine name already exists (duplicate unique constraint)
 *       500:
 *         description: Server error
 */
medicineItemsRouter.post("/", verifyAccessToken, createMedicine);

/**
 * @swagger
 * /medicine/items/many:
 *   post:
 *     summary: Create multiple medicines at once
 *     description: Bulk create medicines from a JSON array. Returns success and failure details for each medicine. Each failure is tracked with the reason (duplicate unique, validation error, etc).
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
 *             minItems: 1
 *             items:
 *               type: object
 *               required:
 *                 - medicineName
 *                 - unit
 *                 - price
 *               properties:
 *                 medicineName:
 *                   type: string
 *                   description: Unique name of the medicine
 *                   example: "Aspirin"
 *                 unit:
 *                   type: string
 *                   enum: [bottle, capsule, patches]
 *                   description: Unit/form of the medicine
 *                   example: "bottle"
 *                 price:
 *                   type: number
 *                   format: decimal
 *                   description: Price of the medicine in VND
 *                   example: 50000
 *                 description:
 *                   type: string
 *                   description: Optional detailed description
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
 *         description: Bulk creation completed - returns both success and failure details
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
 *                       description: Total number of medicines requested
 *                       example: 5
 *                     successCount:
 *                       type: integer
 *                       description: Number of medicines created successfully
 *                       example: 4
 *                     failedCount:
 *                       type: integer
 *                       description: Number of medicines that failed
 *                       example: 1
 *                     success:
 *                       type: array
 *                       description: List of successfully created medicines
 *                       items:
 *                         type: object
 *                         properties:
 *                           index:
 *                             type: integer
 *                             example: 0
 *                           medicineName:
 *                             type: string
 *                             example: "Aspirin"
 *                     failed:
 *                       type: array
 *                       description: List of medicines that failed to create
 *                       items:
 *                         type: object
 *                         properties:
 *                           index:
 *                             type: integer
 *                             example: 1
 *                           medicineName:
 *                             type: string
 *                             example: "Ibuprofen"
 *                           reason:
 *                             type: string
 *                             enum: ["DUPLICATE_UNIQUE", "PRISMA_P2003", "Missing required fields for medicine at index X"]
 *                             description: Reason for failure
 *                             example: "DUPLICATE_UNIQUE"
 *       400:
 *         description: Bad request - Medicines must be an array or empty array provided
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Medicines must be an array"
 *       401:
 *         description: Unauthorized - Missing or invalid authentication token
 *       500:
 *         description: Server error
 */
medicineItemsRouter.post("/many", verifyAccessToken, createManyMedicine);

/**
 * @swagger
 * /medicine/items:
 *   get:
 *     summary: Get medicines with search and pagination
 *     description: Retrieve medicines with optional search by name and pagination support. Supports case-insensitive search. Without query params, returns first page of all medicines.
 *     tags:
 *       - Medicine
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search medicines by name (case-insensitive, partial match)
 *         example: "aspirin"
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *         description: Page number (starts from 1), 10 items per page
 *         example: 1
 *     responses:
 *       200:
 *         description: Medicines retrieved successfully with pagination info
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Medicines retrieved successfully"
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       medicineID:
 *                         type: integer
 *                         example: 1
 *                       medicineName:
 *                         type: string
 *                         example: "Aspirin"
 *                       unit:
 *                         type: string
 *                         enum: [bottle, capsule, patches]
 *                         example: "bottle"
 *                       price:
 *                         type: number
 *                         format: decimal
 *                         example: 50000
 *                       quantity:
 *                         type: integer
 *                         example: 100
 *                       description:
 *                         type: string
 *                         example: "Pain relief and fever reducer"
 *                       medicineImage:
 *                         type: string
 *                         format: url
 *                         example: "https://cloudinary.com/image.jpg"
 *                       createdAt:
 *                         type: string
 *                         format: date-time
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
 *         description: Bad request - Invalid page number
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Page must be at least 1"
 *       401:
 *         description: Unauthorized - Missing or invalid authentication token
 *       500:
 *         description: Server error
 */
medicineItemsRouter.get("/", verifyAccessToken, getMedicineItems);

/**
 * @swagger
 * /medicine/items/{id}:
 *   get:
 *     summary: Get medicine by ID
 *     description: Retrieve a specific medicine by its integer ID with all details including image and timestamps
 *     tags:
 *       - Medicine
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *           example: 1
 *         description: Medicine ID (integer, not UUID)
 *     responses:
 *       200:
 *         description: Medicine retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Medicine retrieved successfully"
 *                 data:
 *                   type: object
 *                   properties:
 *                     medicineID:
 *                       type: integer
 *                       example: 1
 *                     medicineName:
 *                       type: string
 *                       example: "Aspirin"
 *                     unit:
 *                       type: string
 *                       enum: [bottle, capsule, patches]
 *                       example: "bottle"
 *                     price:
 *                       type: number
 *                       format: decimal
 *                       example: 50000
 *                     quantity:
 *                       type: integer
 *                       example: 100
 *                     description:
 *                       type: string
 *                       example: "Pain relief and fever reducer"
 *                     medicineImage:
 *                       type: string
 *                       format: url
 *                       example: "https://cloudinary.com/image.jpg"
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                       example: "2026-04-13T10:30:00Z"
 *       400:
 *         description: Bad request - Missing medicine ID
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Missing medicine ID"
 *       401:
 *         description: Unauthorized - Missing or invalid authentication token
 *       404:
 *         description: Medicine not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Medicine not found"
 *       500:
 *         description: Server error
 */
medicineItemsRouter.get("/:id", verifyAccessToken, getMedicineById);

/**
 * @swagger
 * /medicine/items/{id}:
 *   patch:
 *     summary: Update medicine
 *     description: Update medicine details (name, unit, price, description) with optional image replacement. If new image provided, old image is automatically deleted from Cloudinary.
 *     tags:
 *       - Medicine
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *           example: 1
 *         description: Medicine ID (integer)
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               medicineName:
 *                 type: string
 *                 description: New medicine name (optional if not updating)
 *                 example: "Aspirin Premium"
 *               unit:
 *                 type: string
 *                 enum: [bottle, capsule, patches]
 *                 description: New unit/form (optional if not updating)
 *                 example: "bottle"
 *               price:
 *                 type: number
 *                 format: decimal
 *                 description: New price in VND (optional if not updating)
 *                 example: 55000
 *               description:
 *                 type: string
 *                 description: New description (optional)
 *                 example: "Enhanced pain relief formula"
 *               image:
 *                 type: string
 *                 format: binary
 *                 description: New medicine image (optional - old image will be deleted if provided)
 *     responses:
 *       200:
 *         description: Medicine updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Medicine updated successfully"
 *                 data:
 *                   type: object
 *                   properties:
 *                     medicineID:
 *                       type: integer
 *                       example: 1
 *                     medicineName:
 *                       type: string
 *                       example: "Aspirin Premium"
 *                     unit:
 *                       type: string
 *                       enum: [bottle, capsule, patches]
 *                       example: "bottle"
 *                     price:
 *                       type: number
 *                       format: decimal
 *                       example: 55000
 *                     quantity:
 *                       type: integer
 *                       example: 100
 *                     description:
 *                       type: string
 *                       example: "Enhanced pain relief formula"
 *                     medicineImage:
 *                       type: string
 *                       format: url
 *                       example: "https://cloudinary.com/image-new.jpg"
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                       example: "2026-04-13T10:30:00Z"
 *       400:
 *         description: Bad request - Missing medicine ID
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Missing medicine ID"
 *       401:
 *         description: Unauthorized - Missing or invalid authentication token
 *       404:
 *         description: Medicine not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Medicine not found"
 *       500:
 *         description: Server error
 */
medicineItemsRouter.patch("/:id", verifyAccessToken, updateMedicine);

/**
 * @swagger
 * /medicine/items/{id}:
 *   delete:
 *     summary: Delete medicine
 *     description: Delete a medicine and its associated image from Cloudinary. This is a hard delete operation.
 *     tags:
 *       - Medicine
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *           example: 1
 *         description: Medicine ID (integer)
 *     responses:
 *       200:
 *         description: Medicine deleted successfully along with its image
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Medicine deleted successfully"
 *       400:
 *         description: Bad request - Missing medicine ID
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Missing medicine ID"
 *       401:
 *         description: Unauthorized - Missing or invalid authentication token
 *       404:
 *         description: Medicine not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Medicine not found"
 *       500:
 *         description: Server error
 */
medicineItemsRouter.delete("/:id", verifyAccessToken, deleteMedicine);

export default medicineItemsRouter;
