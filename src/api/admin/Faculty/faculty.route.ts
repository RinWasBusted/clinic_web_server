import { Router } from "express";
import {
  CreateFaculty,
  GetAllFaculties,
  GetFacultyById,
  UpdateFacultyById,
  DeleteFacultyById,
  DeleteManyFaculty,
} from "./faculty.controller.js";
import { verifyAccessToken } from "../../../middlewares/verifyToken.js";

import { validateStatusFaculty } from "../../../middlewares/statusFaculty.middleware.js";

const router = Router();

/**
 * @swagger
 * /admin/faculty:
 *   post:
 *     summary: Create a new faculty
 *     tags: [Faculty]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - facultyName
 *             properties:
 *               facultyName:
 *                 type: string
 *                 example: "Computer Science"
 *     responses:
 *       201:
 *         description: Faculty created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 faculty:
 *                   type: object
 *                   properties:
 *                     facultyID:
 *                       type: string
 *                     facultyName:
 *                       type: string
 *       400:
 *         description: Bad request - Faculty name is required
 *       409:
 *         description: Conflict - Faculty with this name already exists
 */
router.post("/", verifyAccessToken, CreateFaculty);

/**
 * @swagger
 * /admin/faculty:
 *   get:
 *     summary: Get all faculties
 *     tags: [Faculty]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all faculties
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 faculties:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       facultyID:
 *                         type: string
 *                       facultyName:
 *                         type: string
 */
router.get("/", verifyAccessToken, GetAllFaculties);

/**
 * @swagger
 * /admin/faculty/{id}:
 *   get:
 *     summary: Get faculty by ID
 *     tags: [Faculty]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Faculty ID
 *     responses:
 *       200:
 *         description: Faculty found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 faculty:
 *                   type: object
 *                   properties:
 *                     facultyID:
 *                       type: string
 *                     facultyName:
 *                       type: string
 *       400:
 *         description: Bad request - Faculty ID is required
 *       404:
 *         description: Not Found - Faculty not found
 */
router.get("/:id", verifyAccessToken, GetFacultyById);

/**
 * @swagger
 * /admin/faculty/{id}:
 *   patch:
 *     summary: Update faculty by ID
 *     tags: [Faculty]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Faculty ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               facultyName:
 *                 type: string
 *                 example: "Computer Science"
 *     responses:
 *       200:
 *         description: Faculty updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 data:
 *                   type: object
 *       400:
 *         description: Bad request
 *       404:
 *         description: Not Found - Faculty not found
 */
router.patch("/:id", verifyAccessToken, UpdateFacultyById);

/**
 * @swagger
 * /admin/faculty/delete-many:
 *   post:
 *     summary: Delete multiple faculties
 *     tags: [Faculty]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - FacultyIds
 *             properties:
 *               FacultyIds:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["id1", "id2", "id3"]
 *     responses:
 *       200:
 *         description: Faculties deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Delete successful"
 *       400:
 *         description: Bad request
 */
router.post("/delete-many", verifyAccessToken, DeleteManyFaculty);

/**
 * @swagger
 * /admin/faculty/{id}:
 *   post:
 *     summary: Delete faculty by ID
 *     tags: [Faculty]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Faculty ID
 *     responses:
 *       200:
 *         description: Faculty deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Delete Successful"
 *       400:
 *         description: Bad request
 *       404:
 *         description: Not Found - Faculty not found
 */
router.post("/:id", verifyAccessToken, DeleteFacultyById);

export default router;
