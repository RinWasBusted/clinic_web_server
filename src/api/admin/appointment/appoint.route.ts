import { Router } from "express";
import {
  CreateAppointment,
  GetAllAppointments,
  GetAppointmentById,
  UpdateAppointmentById,
  ApproveAppointment,
  CancelAppointment,
  DeleteAppointmentById,
  DeleteManyAppointments
} from "./appointment.controller.js";
import { verifyAccessToken } from "../../../middlewares/verifyToken.js";
import { authorizeRoles } from "../../../middlewares/role.js";
import { validateBody, validateQuery } from "../../../middlewares/validate.js";
import { createAppointmentBodySchema, getAllAppointmentsQuerySchema, updateAppointmentBodySchema } from "../../../schema/apointment.schama.js";

const router = Router();

/**
 * @swagger
 * /admin/appointments:
 *   post:
 *     summary: Create a new appointment
 *     tags: [Appointment]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - patientID
 *               - facultyID
 *               - scheduleDate
 *             properties:
 *               appointmentType:
 *                 type: string
 *                 enum: [examine, re_examine]
 *                 example: "examine"
 *               scheduleDate:
 *                 type: string
 *                 format: date
 *                 example: "2026-03-15"
 *               roomID:
 *                 type: string
 *                 format: uuid
 *                 example: "550e8400-e29b-41d4-a716-446655440000"
 *               patientID:
 *                 type: string
 *                 format: uuid
 *                 example: "550e8400-e29b-41d4-a716-446655440001"
 *               facultyID:
 *                 type: string
 *                 format: uuid
 *                 example: "550e8400-e29b-41d4-a716-446655440002"
 *               note:
 *                 type: string
 *                 example: "Patient notes"
 *     responses:
 *       201:
 *         description: Appointment created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 appointment:
 *                   type: object
 *                   properties:
 *                     appointmentID:
 *                       type: string
 *                       format: uuid
 *                     appointmentDisplayID:
 *                       type: string
 *                     status:
 *                       type: string
 *                     depositStatus:
 *                       type: string
 *       400:
 *         description: Bad request - Missing required fields
 *       404:
 *         description: Patient, Faculty or Room not found
 */
router.post("/", verifyAccessToken, authorizeRoles("manager", "staff"),validateBody(createAppointmentBodySchema), CreateAppointment);

/**
 * @swagger
 * /admin/appointments:
 *   get:
 *     summary: Get all appointments with filters
 *     tags: [Appointment]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [pending, approved, cancelled]
 *         description: Filter by appointment status
 *       - in: query
 *         name: facultyID
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Filter by faculty
 *       - in: query
 *         name: patientID
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Filter by patient
 *       - in: query
 *         name: scheduleDate
 *         schema:
 *           type: string
 *           format: date
 *         description: Filter by schedule date
 *     responses:
 *       200:
 *         description: List of appointments
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 appointments:
 *                   type: array
 *                   items:
 *                     type: object
 */
router.get("/", verifyAccessToken,validateQuery(getAllAppointmentsQuerySchema), GetAllAppointments);

/**
 * @swagger
 * /admin/appointments/{id}:
 *   get:
 *     summary: Get appointment by ID
 *     tags: [Appointment]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Appointment ID
 *     responses:
 *       200:
 *         description: Appointment found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 appointment:
 *                   type: object
 *       400:
 *         description: Bad request - Appointment ID is required
 *       404:
 *         description: Not Found - Appointment not found
 */
router.get("/:id", verifyAccessToken, GetAppointmentById);

/**
 * @swagger
 * /admin/appointments/{id}:
 *   put:
 *     summary: Update appointment by ID
 *     tags: [Appointment]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Appointment ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [pending, approved, cancelled]
 *               depositStatus:
 *                 type: string
 *                 enum: [paid, unpaid, refunded]
 *               patientID:
 *                 type: string
 *                 format: uuid
 *               facultyID:
 *                 type: string
 *                 format: uuid
 *               roomID:
 *                 type: string
 *                 format: uuid
 *               scheduleDate:
 *                 type: string
 *                 format: date
 *               approvedBy:
 *                 type: string
 *                 format: uuid
 *     responses:
 *       200:
 *         description: Appointment updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 appointment:
 *                   type: object
 *       400:
 *         description: Bad request
 *       404:
 *         description: Not Found - Appointment, Patient, Faculty, Room or Staff not found
 */
router.patch("/:id", verifyAccessToken, authorizeRoles("manager", "staff"),validateBody(updateAppointmentBodySchema), UpdateAppointmentById);

/**
 * @swagger
 * /admin/appointments/{id}/approve:
 *   patch:
 *     summary: Approve appointment
 *     tags: [Appointment]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Appointment ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - approvedBy
 *             properties:
 *               approvedBy:
 *                 type: string
 *                 format: uuid
 *                 example: "550e8400-e29b-41d4-a716-446655440000"
 *               roomID:
 *                 type: string
 *                 format: uuid
 *                 example: "550e8400-e29b-41d4-a716-446655440001"
 *     responses:
 *       200:
 *         description: Appointment approved
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 appointment:
 *                   type: object
 *       400:
 *         description: Bad request - approvedBy is required
 *       404:
 *         description: Not Found - Appointment, Staff or Room not found
 */
router.patch("/:id/approve", verifyAccessToken, authorizeRoles("manager", "staff"), ApproveAppointment);

/**
 * @swagger
 * /admin/appointments/{id}/cancel:
 *   patch:
 *     summary: Cancel appointment
 *     tags: [Appointment]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Appointment ID
 *     responses:
 *       200:
 *         description: Appointment cancelled
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 appointment:
 *                   type: object
 *       404:
 *         description: Not Found - Appointment not found
 */
router.patch("/:id/cancel", verifyAccessToken, authorizeRoles("manager", "staff"), CancelAppointment);

/**
 * @swagger
 * /admin/appointments/{id}:
 *   delete:
 *     summary: Delete appointment by ID
 *     tags: [Appointment]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Appointment ID
 *     responses:
 *       200:
 *         description: Appointment deleted successfully
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
 *         description: Not Found - Appointment not found
 */
router.delete("/:id", verifyAccessToken, authorizeRoles("manager", "staff"), DeleteAppointmentById);

/**
 * @swagger
 * /admin/appointments/delete-many:
 *   delete:
 *     summary: Delete multiple appointments
 *     tags: [Appointment]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - appointmentIds
 *             properties:
 *               appointmentIds:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: uuid
 *                 example: ["550e8400-e29b-41d4-a716-446655440000", "550e8400-e29b-41d4-a716-446655440001"]
 *     responses:
 *       200:
 *         description: Appointments deleted successfully
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
router.delete("/delete-many", verifyAccessToken, authorizeRoles("manager", "staff"), DeleteManyAppointments);

export default router;