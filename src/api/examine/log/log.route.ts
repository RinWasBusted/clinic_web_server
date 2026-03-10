import { Router } from "express";
import { validateBody } from "../../../middlewares/validate.js";
import examineLogSchema from "../../../schema/examineLog.schema.js";
import { authorizeRoles } from "../../../middlewares/role.js";
import { verifyAccessToken } from "../../../middlewares/verifyToken.js";
import {
  createExamineLogHandler,
  getExamineLogHandler,
  getPrintableExamineLogHandler,
  updateExamineLogHandler,
} from "./log.controller.js";

/**
 * @swagger
 * tags:
 *   name: Examine
 *   description: Examine log management (doctor only)
 */

const examineLogRouter = Router();

examineLogRouter.use(verifyAccessToken);

/**
 * @swagger
 * /examine/{id}:
 *   get:
 *     summary: Get an examine log by ID
 *     description: |
 *       Returns the full examine log record including diagnose details.
 *       Only accessible by doctors.
 *     tags:
 *       - Examine
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: UUID of the examine log
 *         example: "a1b2c3d4-e5f6-7890-abcd-ef1234567890"
 *     responses:
 *       200:
 *         description: Examine log retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 examineLog:
 *                   type: object
 *                   properties:
 *                     examineID:
 *                       type: string
 *                       format: uuid
 *                     examineDisplayID:
 *                       type: string
 *                       example: "KH2600000001"
 *                     appointmentID:
 *                       type: string
 *                       format: uuid
 *                     patientID:
 *                       type: string
 *                       format: uuid
 *                     examinedBy:
 *                       type: string
 *                       format: uuid
 *                     symptoms:
 *                       type: string
 *                     status:
 *                       type: string
 *                       enum: [draft, done]
 *                     diagnose:
 *                       type: string
 *                       nullable: true
 *                     note:
 *                       type: string
 *                       nullable: true
 *                     details:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           diseaseID:
 *                             type: string
 *             example:
 *               examineLog:
 *                 examineID: "a1b2c3d4-e5f6-7890-abcd-ef1234567890"
 *                 examineDisplayID: "KH2600000001"
 *                 appointmentID: "b2c3d4e5-f6a7-8901-bcde-f12345678901"
 *                 patientID: "c3d4e5f6-a7b8-9012-cdef-123456789012"
 *                 examinedBy: "d4e5f6a7-b8c9-0123-defa-234567890123"
 *                 symptoms: "Đau đầu, sốt nhẹ"
 *                 status: "draft"
 *                 diagnose: null
 *                 note: null
 *                 details:
 *                   - diseaseID: "J00"
 *       401:
 *         description: Unauthorized — missing or invalid access token
 *       403:
 *         description: Forbidden — only doctors can access this endpoint
 *       404:
 *         description: Examine log not found
 *       500:
 *         description: Internal server error
 */
examineLogRouter.get("/:id", authorizeRoles("doctor"), getExamineLogHandler);

/**
 * @swagger
 * /examine/new:
 *   post:
 *     summary: Create a new examine log
 *     description: |
 *       Creates a new examine log (medical examination record) for a patient appointment.
 *       The `examinedBy` field is automatically set to the authenticated doctor's ID.
 *       A unique display ID (e.g. `KH2600000001`) is auto-generated from a sequence counter.
 *     tags:
 *       - Examine
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - appointmentID
 *               - patientID
 *               - symptoms
 *               - status
 *             properties:
 *               appointmentID:
 *                 type: string
 *                 format: uuid
 *                 description: UUID of the related appointment
 *                 example: "b2c3d4e5-f6a7-8901-bcde-f12345678901"
 *               patientID:
 *                 type: string
 *                 format: uuid
 *                 description: UUID of the patient
 *                 example: "c3d4e5f6-a7b8-9012-cdef-123456789012"
 *               symptoms:
 *                 type: string
 *                 maxLength: 255
 *                 description: Patient's symptoms as recorded by the doctor
 *                 example: "Đau đầu, sốt nhẹ"
 *               status:
 *                 type: string
 *                 enum: [draft, done]
 *                 description: Initial status of the examine log
 *                 example: "draft"
 *               diagnose:
 *                 type: array
 *                 description: List of ICD-10 disease codes
 *                 items:
 *                   type: string
 *                   maxLength: 255
 *                   example: "J00"
 *               note:
 *                 type: string
 *                 maxLength: 255
 *                 description: Optional additional notes
 *                 example: "Bệnh nhân dị ứng Penicillin"
 *           example:
 *             appointmentID: "b2c3d4e5-f6a7-8901-bcde-f12345678901"
 *             patientID: "c3d4e5f6-a7b8-9012-cdef-123456789012"
 *             symptoms: "Đau đầu, sốt nhẹ"
 *             status: "draft"
 *             diagnose: ["J00"]
 *             note: "Bệnh nhân dị ứng Penicillin"
 *     responses:
 *       200:
 *         description: Examine log created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Tạo mới hồ sơ khám bệnh thành công"
 *                 data:
 *                   type: object
 *                   properties:
 *                     examineID:
 *                       type: string
 *                       format: uuid
 *                     examineDisplayID:
 *                       type: string
 *                       example: "KH2600000001"
 *                     appointmentID:
 *                       type: string
 *                       format: uuid
 *                     patientID:
 *                       type: string
 *                       format: uuid
 *                     examinedBy:
 *                       type: string
 *                       format: uuid
 *                     symptoms:
 *                       type: string
 *                     status:
 *                       type: string
 *                     note:
 *                       type: string
 *                       nullable: true
 *                     details:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           diseaseID:
 *                             type: string
 *       400:
 *         description: Validation error (invalid body fields or invalid ICD-10 format)
 *       401:
 *         description: Unauthorized — missing or invalid access token
 *       403:
 *         description: Forbidden — only doctors can access this endpoint
 *       500:
 *         description: Internal server error
 */
examineLogRouter.post("/new", authorizeRoles("doctor"), validateBody(examineLogSchema.create), createExamineLogHandler);

/**
 * @swagger
 * /examine/{id}:
 *   put:
 *     summary: Update an examine log
 *     description: |
 *       Partially updates an existing examine log. All fields are optional.
 *       Only accessible by doctors. The `examinedBy` field is not updatable via this endpoint.
 *     tags:
 *       - Examine
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: UUID of the examine log to update
 *         example: "a1b2c3d4-e5f6-7890-abcd-ef1234567890"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               appointmentID:
 *                 type: string
 *                 format: uuid
 *               patientID:
 *                 type: string
 *                 format: uuid
 *               symptoms:
 *                 type: string
 *                 maxLength: 255
 *                 example: "Ho, khó thở"
 *               status:
 *                 type: string
 *                 enum: [draft, done]
 *                 example: "done"
 *               diagnose:
 *                 type: array
 *                 items:
 *                   type: string
 *                   maxLength: 255
 *                 example: ["J00", "J06.9"]
 *               note:
 *                 type: string
 *                 maxLength: 255
 *                 example: "Cần theo dõi thêm"
 *           example:
 *             symptoms: "Ho, khó thở"
 *             status: "done"
 *             diagnose: ["J00", "J06.9"]
 *             note: "Cần theo dõi thêm"
 *     responses:
 *       200:
 *         description: Examine log updated successfully
 *         content:
 *           application/json:
 *             example:
 *               message: "Đã cập nhật hồ sơ khám bệnh"
 *               data:
 *                 examineID: "a1b2c3d4-e5f6-7890-abcd-ef1234567890"
 *                 examineDisplayID: "KH2600000001"
 *                 symptoms: "Ho, khó thở"
 *                 status: "done"
 *                 note: "Cần theo dõi thêm"
 *                 details:
 *                   - diseaseID: "J00"
 *                   - diseaseID: "J06.9"
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized — missing or invalid access token
 *       403:
 *         description: Forbidden — only doctors can access this endpoint
 *       404:
 *         description: Examine log not found
 *       500:
 *         description: Internal server error
 */
examineLogRouter.put("/:id", authorizeRoles("doctor"), validateBody(examineLogSchema.update), updateExamineLogHandler);

/**
 * @swagger
 * /examine/{id}/print:
 *   get:
 *     summary: Get printable examine log by ID
 *     description: |
 *       Returns a formatted version of the examine log suitable for printing.
 *       Includes patient information, diagnoses, and prescription details.
 *       Only accessible by doctors.
 *     tags:
 *       - Examine
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: UUID of the examine log to print
 *         example: "a1b2c3d4-e5f6-7890-abcd-ef1234567890"
 *     responses:
 *       200:
 *         description: Printable examine log retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 examineLog:
 *                   type: object
 *                   description: Examine log data enriched with patient, appointment, and prescription info for printing
 *       401:
 *         description: Unauthorized — missing or invalid access token
 *       403:
 *         description: Forbidden — only doctors can access this endpoint
 *       404:
 *         description: Examine log not found
 *       500:
 *         description: Internal server error
 */
examineLogRouter.get("/:id/print", authorizeRoles("doctor"), getPrintableExamineLogHandler);

export default examineLogRouter;
