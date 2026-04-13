import { Router } from "express";
import { verifyAccessToken } from "../../middlewares/verifyToken.js";

import {
  createPrescriptionHandler,
  deletePrescriptionHandler,
  getPrescriptionHandler,
  updateDoseHandler,
  updateLogHandler,
} from "./prescription.controller.js";
import { validateBody } from "../../middlewares/validate.js";
import prescriptionSchema from "../../schema/prescription.schema.js";
import { validateUpdateHandler } from "./prescription.middleware.js";

/**
 * @swagger
 * tags:
 *   name: Prescription
 *   description: Prescription management (doctor only)
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     PrescriptionMedicineItem:
 *       type: object
 *       required:
 *         - medicineID
 *         - usage
 *       properties:
 *         medicineID:
 *           type: integer
 *           description: ID of the medicine
 *           example: 1
 *         usage:
 *           type: string
 *           maxLength: 255
 *           description: |
 *             Dosage instructions. Can be either:
 *             - Solely dose format: "uống, sáng 2 viên, chiều 1 viên" — quantity is auto-calculated from totalTreatmentDays
 *             - Free-form text — requires explicit `quantity` field
 *           example: "uống, sáng 2 viên, chiều 1 viên"
 *         note:
 *           type: string
 *           maxLength: 255
 *           description: Optional note for this medicine
 *           example: "Uống sau ăn"
 *         quantity:
 *           type: integer
 *           description: Total quantity (required when usage is free-form text)
 *           example: 30
 */

const PrescriptionRouter = Router();
PrescriptionRouter.use(verifyAccessToken);

/**
 * @swagger
 * /prescription/new:
 *   post:
 *     summary: Create a new draft prescription
 *     description: |
 *       Creates a new prescription linked to an examine log. Only accessible by doctors.
 *       The `examinedBy` (doctorID) is resolved from the `examineID` — not from the request body.
 *       For medicine items with solely dose format usage (e.g. "uống, sáng 2 viên, chiều 1 viên"),
 *       quantity is automatically calculated from `totalTreatmentDays`. Otherwise, `quantity` must be provided explicitly.
 *     tags:
 *       - Prescription
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - examineID
 *               - totalTreatmentDays
 *               - details
 *             properties:
 *               examineID:
 *                 type: string
 *                 format: uuid
 *                 description: UUID of the examine log this prescription belongs to
 *                 example: "d5e6f7a8-b9c0-1234-defa-345678901234"
 *               note:
 *                 type: string
 *                 maxLength: 255
 *                 description: Optional general notes for the prescription
 *                 example: "Tái khám sau 7 ngày nếu không thuyên giảm"
 *               needReExamine:
 *                 type: boolean
 *                 description: Whether the patient needs a follow-up examination
 *                 example: true
 *               totalTreatmentDays:
 *                 type: integer
 *                 minimum: 1
 *                 description: Total number of treatment days
 *                 example: 7
 *               details:
 *                 type: array
 *                 minItems: 1
 *                 description: List of prescribed medicines (at least one item required)
 *                 items:
 *                   $ref: '#/components/schemas/PrescriptionMedicineItem'
 *           example:
 *             examineID: "d5e6f7a8-b9c0-1234-defa-345678901234"
 *             totalTreatmentDays: 7
 *             needReExamine: true
 *             note: "Tái khám sau 7 ngày"
 *             details:
 *               - medicineID: 1
 *                 usage: "uống, sáng 2 viên, chiều 1 viên"
 *               - medicineID: 2
 *                 usage: "Bôi ngoài da"
 *                 quantity: 1
 *     responses:
 *       200:
 *         description: Prescription created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Create prescription successfully"
 *                 prescription:
 *                   type: object
 *                   properties:
 *                     prescriptionID:
 *                       type: string
 *                       format: uuid
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                     note:
 *                       type: string
 *                       nullable: true
 *                     needReExamine:
 *                       type: boolean
 *                     totalTreatmentDays:
 *                       type: integer
 *                     details:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           medicine:
 *                             type: object
 *                             properties:
 *                               medicineID:
 *                                 type: integer
 *                                 description: ID of the medicine
 *                               medicineName:
 *                                 type: string
 *                                 description: Name of the medicine
 *                               medicineImage:
 *                                 type: string
 *                                 nullable: true
 *                                 description: Image URL of the medicine
 *                               unit:
 *                                 type: string
 *                                 description: Unit of measurement (bottle, capsule, patches, etc.)
 *                               price:
 *                                 type: number
 *                                 description: Price per unit (VND)
 *                               quantity:
 *                                 type: integer
 *                                 description: Current stock quantity available
 *                           quantity:
 *                             type: integer
 *                             description: Total quantity prescribed
 *                           usage:
 *                             type: string
 *                             description: Dosage instructions
 *       400:
 *         description: Validation error (invalid body fields)
 *       401:
 *         description: Unauthorized — missing or invalid access token
 *       403:
 *         description: Forbidden — only doctors can access this endpoint
 *       404:
 *         description: Examine log not found for the given `examineID`
 *         content:
 *           application/json:
 *             example:
 *               message: "Không tìm thấy thông tin khám bệnh để kê đơn thuốc"
 *       500:
 *         description: Internal server error
 */
PrescriptionRouter.post("/new", validateBody(prescriptionSchema.new), createPrescriptionHandler);

/**
 * @swagger
 * /prescription/{id}:
 *   put:
 *     summary: Update prescription header info
 *     description: |
 *       Updates top-level fields of a draft prescription (`note`, `needReExamine`, `totalTreatmentDays`).
 *       When `totalTreatmentDays` changes, all medicine quantities are proportionally recalculated.
 *       Only the doctor who created the prescription can update it, and only on the same calendar day it was created.
 *       The prescription must still be in `draft` status.
 *       Cannot update and delete medicine items simultaneously (use `/details` endpoint for that).
 *     tags:
 *       - Prescription
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: UUID of the prescription to update
 *         example: "e6f7a8b9-c0d1-2345-efab-456789012345"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               note:
 *                 type: string
 *                 maxLength: 255
 *                 example: "Tái khám sau 5 ngày"
 *               needReExamine:
 *                 type: boolean
 *                 example: false
 *               totalTreatmentDays:
 *                 type: integer
 *                 minimum: 1
 *                 example: 5
 *           example:
 *             note: "Tái khám sau 5 ngày"
 *             needReExamine: false
 *             totalTreatmentDays: 5
 *     responses:
 *       200:
 *         description: Prescription updated successfully
 *         content:
 *           application/json:
 *             example:
 *               message: "Đã cập nhật toa thuốc"
 *               prescription:
 *                 prescriptionID: "e6f7a8b9-c0d1-2345-efab-456789012345"
 *                 note: "Tái khám sau 5 ngày"
 *                 needReExamine: false
 *                 totalTreatmentDays: 5
 *                 createdAt: "2026-03-10T08:00:00.000Z"
 *                 details:
 *                   - medicineID: 1
 *                     quantity: 15
 *                     usage: "uống, sáng 2 viên, chiều 1 viên"
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized — missing or invalid access token
 *       403:
 *         description: |
 *           Forbidden. Possible reasons:
 *           - Not the prescribing doctor
 *           - Prescription status is already `done`
 *           - Attempting to update after the creation date
 *         content:
 *           application/json:
 *             examples:
 *               notOwner:
 *                 summary: Not the prescribing doctor
 *                 value:
 *                   message: "Bạn không có quyền cập nhật đơn thuốc này"
 *               alreadyDone:
 *                 summary: Prescription is already finalized
 *                 value:
 *                   message: "Không thể cập nhật đơn thuốc đã hoàn thành"
 *               outdated:
 *                 summary: Past creation date
 *                 value:
 *                   message: "Chỉ có thể cập nhật đơn thuốc trong ngày được tạo"
 *       404:
 *         description: Prescription not found or not in draft status
 *       422:
 *         description: Cannot simultaneously update and delete medicines in the same request
 *         content:
 *           application/json:
 *             example:
 *               message: "Không được vừa cập nhật vừa xóa thuốc kê đơn"
 *       500:
 *         description: Internal server error
 */
PrescriptionRouter.put("/:id", validateBody(prescriptionSchema.update), validateUpdateHandler, updateLogHandler);

/**
 * @swagger
 * /prescription/{id}/details:
 *   put:
 *     summary: Update prescription medicine details (upsert / delete)
 *     description: |
 *       Upserts (create or update) medicine items in a draft prescription and/or removes specific medicines.
 *       If all medicines are removed, the prescription itself is automatically deleted.
 *       The same update constraints from `PUT /prescription/{id}` apply:
 *       only the creating doctor, on the same day, while still in `draft` status.
 *       You cannot include the same `medicineID` in both `details` (upsert) and `deleteList` in one request.
 *     tags:
 *       - Prescription
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: UUID of the prescription to update
 *         example: "e6f7a8b9-c0d1-2345-efab-456789012345"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - details
 *             properties:
 *               details:
 *                 type: array
 *                 description: Medicines to upsert. Pass an empty array if only deleting.
 *                 items:
 *                   $ref: '#/components/schemas/PrescriptionMedicineItem'
 *               deleteList:
 *                 type: array
 *                 description: List of `medicineID` values to remove from the prescription
 *                 items:
 *                   type: integer
 *                   example: 2
 *           example:
 *             details:
 *               - medicineID: 3
 *                 usage: "uống, sáng 1 viên"
 *             deleteList:
 *               - 2
 *     responses:
 *       200:
 *         description: Prescription details updated (or prescription deleted if no medicines remain)
 *         content:
 *           application/json:
 *             examples:
 *               updated:
 *                 summary: Medicines updated successfully
 *                 value:
 *                   message: "Đã cập nhật toa thuốc"
 *                   prescription:
 *                     prescriptionID: "e6f7a8b9-c0d1-2345-efab-456789012345"
 *                     totalTreatmentDays: 7
 *                     details:
 *                       - medicineID: 1
 *                         quantity: 7
 *                         usage: "uống, sáng 1 viên"
 *               deleted:
 *                 summary: All medicines removed — prescription auto-deleted
 *                 value:
 *                   message: "Đã xóa toa thuốc"
 *                   reason: "Không có thuốc nào được kê ở toa này sau khi đã cập nhật"
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized — missing or invalid access token
 *       403:
 *         description: |
 *           Forbidden. Possible reasons:
 *           - Not the prescribing doctor
 *           - Prescription status is already `done`
 *           - Attempting to update after the creation date
 *       404:
 *         description: Prescription not found or not in draft status
 *       422:
 *         description: Same `medicineID` appears in both `details` and `deleteList`
 *         content:
 *           application/json:
 *             example:
 *               message: "Không được vừa cập nhật vừa xóa thuốc kê đơn"
 *       500:
 *         description: Internal server error
 */
PrescriptionRouter.put(
  "/:id/details",
  validateBody(prescriptionSchema.updateDetails),
  validateUpdateHandler,
  updateDoseHandler
);

/**
 * @swagger
 * /prescription/{id}:
 *   delete:
 *     summary: Delete a draft prescription
 *     description: |
 *       Permanently deletes a prescription. Only the doctor who created it can delete it, and only while it is still in `draft` status.
 *       Prescriptions with `done` status cannot be deleted.
 *     tags:
 *       - Prescription
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: UUID of the prescription to delete
 *         example: "e6f7a8b9-c0d1-2345-efab-456789012345"
 *     responses:
 *       200:
 *         description: Prescription deleted successfully
 *         content:
 *           application/json:
 *             example:
 *               message: "Đã xóa đơn thuốc"
 *       401:
 *         description: Unauthorized — missing or invalid access token
 *       403:
 *         description: Forbidden — only doctors can access this endpoint
 *       404:
 *         description: Prescription not found, not in draft status, or does not belong to the requesting doctor
 *         content:
 *           application/json:
 *             example:
 *               message: "Không tìm thấy đơn thuốc"
 *       500:
 *         description: Internal server error
 */
PrescriptionRouter.delete("/:id", deletePrescriptionHandler);

/**
 * @swagger
 * /prescription/{id}:
 *   get:
 *     summary: Get a prescription by ID
 *     description: |
 *       Returns full prescription data including all medicine details.
 *       Accessible only by doctors. Returns both draft and finalized prescriptions.
 *     tags:
 *       - Prescription
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: UUID of the prescription to retrieve
 *         example: "e6f7a8b9-c0d1-2345-efab-456789012345"
 *     responses:
 *       200:
 *         description: Prescription retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 prescription:
 *                   type: object
 *                   properties:
 *                     prescriptionID:
 *                       type: string
 *                       format: uuid
 *                     prescriptionDisplayID:
 *                       type: string
 *                       description: Display code for the prescription
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                     createdAtLocal:
 *                       type: string
 *                       description: Local date-time string
 *                     note:
 *                       type: string
 *                       nullable: true
 *                     needReExamine:
 *                       type: boolean
 *                     totalTreatmentDays:
 *                       type: integer
 *                     details:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           medicine:
 *                             type: object
 *                             properties:
 *                               medicineID:
 *                                 type: integer
 *                                 description: ID of the medicine
 *                               medicineName:
 *                                 type: string
 *                                 description: Name of the medicine
 *                               medicineImage:
 *                                 type: string
 *                                 nullable: true
 *                                 description: Image URL of the medicine
 *                               unit:
 *                                 type: string
 *                                 description: Unit of measurement (bottle, capsule, patches, etc.)
 *                               price:
 *                                 type: number
 *                                 description: Price per unit (VND)
 *                               quantity:
 *                                 type: integer
 *                                 description: Current stock quantity available
 *                           quantity:
 *                             type: integer
 *                             description: Total quantity prescribed
 *                           usage:
 *                             type: string
 *                             description: Dosage instructions
 *             example:
 *               prescription:
 *                 prescriptionID: "e6f7a8b9-c0d1-2345-efab-456789012345"
 *                 prescriptionDisplayID: "RX-2026-001234"
 *                 createdAt: "2026-03-10T08:00:00.000Z"
 *                 createdAtLocal: "10/03/2026 15:00"
 *                 note: "Tái khám sau 7 ngày"
 *                 needReExamine: true
 *                 totalTreatmentDays: 7
 *                 details:
 *                   - medicine:
 *                       medicineID: 1
 *                       medicineName: "Paracetamol"
 *                       medicineImage: "https://example.com/paracetamol.jpg"
 *                       unit: "viên"
 *                       price: 5000
 *                       quantity: 150
 *                     quantity: 21
 *                     usage: "uống, sáng 2 viên, chiều 1 viên"
 *       401:
 *         description: Unauthorized — missing or invalid access token
 *       403:
 *         description: Forbidden — only doctors can access this endpoint
 *       404:
 *         description: Prescription not found
 *         content:
 *           application/json:
 *             example:
 *               message: "Không tìm thấy đơn thuốc."
 *       500:
 *         description: Internal server error
 */
PrescriptionRouter.get("/:id", getPrescriptionHandler);

export default PrescriptionRouter;
