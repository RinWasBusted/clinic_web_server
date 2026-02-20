import { Router } from "express";
import {
  createMedicine,
  getMedicines,
  getMedicineById,
  updateMedicine,
  deleteMedicine,
} from "./medicine.controller.js";
import upload from "../../utils/multer.js";

const router = Router();

/**
 * @swagger
 * /medicine:
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
 *               quantity:
 *                 type: integer
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
router.post("/", upload.single("image"), createMedicine);

/**
 * @swagger
 * /medicine:
 *   get:
 *     summary: Get all medicines
 *     description: Retrieve all medicines from the database
 *     tags:
 *       - Medicine
 *     responses:
 *       200:
 *         description: Medicines retrieved successfully
 *       500:
 *         description: Server error
 */
router.get("/", getMedicines);

/**
 * @swagger
 * /medicine/{id}:
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
router.get("/:id", getMedicineById);

/**
 * @swagger
 * /medicine/{id}:
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
 *               quantity:
 *                 type: integer
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
router.patch("/:id", upload.single("image"), updateMedicine);

/**
 * @swagger
 * /medicine/{id}:
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
router.delete("/:id", deleteMedicine);

export default router;
