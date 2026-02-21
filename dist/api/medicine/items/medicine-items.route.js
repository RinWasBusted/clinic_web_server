import { Router } from "express";
import { createMedicine, getMedicineById, getMedicineItems, updateMedicine, deleteMedicine, } from "./medicine-items.controller.js";
import upload from "../../../utils/multer.js";
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
medicineItemsRouter.post("/items", upload.single("image"), createMedicine);
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
medicineItemsRouter.get("/items", getMedicineItems);
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
medicineItemsRouter.get("/items/:id", getMedicineById);
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
medicineItemsRouter.patch("/items/:id", upload.single("image"), updateMedicine);
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
medicineItemsRouter.delete("/items/:id", deleteMedicine);
export default medicineItemsRouter;
//# sourceMappingURL=medicine-items.route.js.map