import { Router } from "express";
import {
  CreateTimetable,
  GetAllTimetables,
  GetTimetableById,
  GetTimetableByDoctor,
  UpdateTimetableById,
  DeleteTimetableById,
  DeleteManyTimetables
} from "./timetable.controller.js";

const router = Router();

/**
 * @swagger
 * /admin/timetables:
 *   post:
 *     summary: Create a new timetable
 *     tags: [Timetable]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - doctorID
 *               - roomID
 *               - dayOfWeek
 *             properties:
 *               doctorID:
 *                 type: string
 *                 format: uuid
 *                 example: "550e8400-e29b-41d4-a716-446655440000"
 *               roomID:
 *                 type: string
 *                 format: uuid
 *                 example: "550e8400-e29b-41d4-a716-446655440001"
 *               dayOfWeek:
 *                 type: string
 *                 enum: [mon, tue, wed, thu, fri, sat, sun]
 *                 example: "mon"
 *               note:
 *                 type: string
 *                 example: "Available for consultations"
 *     responses:
 *       201:
 *         description: Timetable created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 timetable:
 *                   type: object
 *                   properties:
 *                     timeID:
 *                       type: string
 *                       format: uuid
 *                     doctorID:
 *                       type: string
 *                       format: uuid
 *                     roomID:
 *                       type: string
 *                       format: uuid
 *                     dayOfWeek:
 *                       type: string
 *                     note:
 *                       type: string
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *       400:
 *         description: Bad request - Missing required fields
 *       404:
 *         description: Doctor or Room not found
 */
router.post("/", CreateTimetable);

/**
 * @swagger
 * /admin/timetables:
 *   get:
 *     summary: Get all timetables
 *     tags: [Timetable]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all timetables
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 timetables:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       timeID:
 *                         type: string
 *                         format: uuid
 *                       doctorID:
 *                         type: string
 *                         format: uuid
 *                       roomID:
 *                         type: string
 *                         format: uuid
 *                       dayOfWeek:
 *                         type: string
 *                       note:
 *                         type: string
 *                       createdAt:
 *                         type: string
 *                         format: date-time
 *                       doctor:
 *                         type: object
 *                       room:
 *                         type: object
 */
router.get("/", GetAllTimetables);

/**
 * @swagger
 * /admin/timetables/{id}:
 *   get:
 *     summary: Get timetable by ID
 *     tags: [Timetable]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Timetable ID
 *     responses:
 *       200:
 *         description: Timetable found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 timetable:
 *                   type: object
 *       400:
 *         description: Bad request - Timetable ID is required
 *       404:
 *         description: Not Found - Timetable not found
 */
router.get("/:id", GetTimetableById);

/**
 * @swagger
 * /admin/timetables/doctor/{doctorID}:
 *   get:
 *     summary: Get timetables by doctor ID
 *     tags: [Timetable]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: doctorID
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Doctor ID
 *     responses:
 *       200:
 *         description: List of timetables for the doctor
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 timetables:
 *                   type: array
 *                   items:
 *                     type: object
 *       400:
 *         description: Bad request - Doctor ID is required
 */
router.get("/doctor/:doctorID", GetTimetableByDoctor);

/**
 * @swagger
 * /admin/timetables/{id}:
 *   put:
 *     summary: Update timetable by ID
 *     tags: [Timetable]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Timetable ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               doctorID:
 *                 type: string
 *                 format: uuid
 *               roomID:
 *                 type: string
 *                 format: uuid
 *               dayOfWeek:
 *                 type: string
 *                 enum: [mon, tue, wed, thu, fri, sat, sun]
 *               note:
 *                 type: string
 *     responses:
 *       200:
 *         description: Timetable updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 timetable:
 *                   type: object
 *       400:
 *         description: Bad request
 *       404:
 *         description: Not Found - Timetable, Doctor or Room not found
 */
router.put("/:id", UpdateTimetableById);

/**
 * @swagger
 * /admin/timetables/{id}:
 *   delete:
 *     summary: Delete timetable by ID
 *     tags: [Timetable]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Timetable ID
 *     responses:
 *       200:
 *         description: Timetable deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       400:
 *         description: Bad request
 *       404:
 *         description: Not Found - Timetable not found
 */
router.delete("/:id", DeleteTimetableById);

/**
 * @swagger
 * /admin/timetables/delete-many:
 *   delete:
 *     summary: Delete multiple timetables
 *     tags: [Timetable]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - timeIds
 *             properties:
 *               timeIds:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: uuid
 *                 example: ["550e8400-e29b-41d4-a716-446655440000", "550e8400-e29b-41d4-a716-446655440001"]
 *     responses:
 *       200:
 *         description: Timetables deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 deletedCount:
 *                   type: integer
 *       400:
 *         description: Bad request
 */
router.delete("/delete-many", DeleteManyTimetables);

export default router;
