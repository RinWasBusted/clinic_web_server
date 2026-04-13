import { Router } from "express";
import {
  getMedicineTickets,
  updateMedicineTicketStatus,
  createMedicineTicket,
  dispenseMedicineTicket,
} from "./medicine-tickets.controller.js";
import { verifyAccessToken } from "../../../middlewares/verifyToken.js";
import { authorizeRoles } from "../../../middlewares/role.js";
import { validateQuery } from "../../../middlewares/validate.js";
import { dispenseMedicineTicketQuerySchema } from "../../../schema/medicine-ticket.schema.js";

const medicineTicketsRouter = Router();

/**
 * @swagger
 * /medicine/tickets:
 *   post:
 *     summary: Create a new medicine ticket
 *     description: |
 *       Create a new medicine ticket with prescriptionDisplayID.
 *       The system resolves prescriptionID from prescriptionDisplayID.
 *       The orderNum is automatically calculated based on existing tickets for today.
 *       roomID is resolved from the current pharmacist account.
 *       Status defaults to "pending".
 *     tags:
 *       - Medicine Tickets
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               prescriptionDisplayID:
 *                 type: string
 *                 description: The prescription display code
 *             required:
 *               - prescriptionDisplayID
 *     responses:
 *       201:
 *         description: Medicine ticket created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 data:
 *                   type: object
 *                   properties:
 *                     ticketID:
 *                       type: string
 *                       format: uuid
 *                     orderNum:
 *                       type: integer
 *                     status:
 *                       type: string
 *                       enum: [pending, done]
 *                     prescription:
 *                       type: object
 *                       properties:
 *                         prescriptionDisplayID:
 *                           type: string
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *       400:
 *         description: Invalid request body
 *       500:
 *         description: Server error
 */
medicineTicketsRouter.post("/", verifyAccessToken, authorizeRoles("pharmacist"), createMedicineTicket);

/**
 * @swagger
 * /medicine/tickets:
 *   get:
 *     summary: Get medicine tickets by date
 *     description: |
 *       Retrieve a list of medicine tickets (waiting queue).
 *       Filter date must be sent via query params (not request body payload).
 *       Used for displaying on waiting room TV screens and pharmacist computer screens.
 *     tags:
 *       - Medicine Tickets
 *     parameters:
 *       - in: query
 *         name: date
 *         schema:
 *           type: string
 *           format: date
 *         description: Date in YYYY-MM-DD format (defaults to today if not provided)
 *         example: "2026-02-24"
 *     responses:
 *       200:
 *         description: Medicine tickets retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       ticketID:
 *                         type: string
 *                         format: uuid
 *                         description: Medicine ticket ID
 *                       prescriptionID:
 *                         type: string
 *                         format: uuid
 *                         description: Prescription ID
 *                       prescriptionDisplayID:
 *                         type: string
 *                         description: Prescription display code
 *                       patientName:
 *                         type: string
 *                         description: Patient's full name
 *                       orderNum:
 *                         type: integer
 *                         description: Order number in the queue
 *                       status:
 *                         type: string
 *                         enum: [pending, done]
 *                         description: Ticket status
 *                       roomName:
 *                         type: string
 *                         description: Pharmacy room name
 *                       createdAt:
 *                         type: string
 *                         format: date-time
 *                         description: Ticket creation time
 *       400:
 *         description: Invalid date format
 *       500:
 *         description: Server error
 */
medicineTicketsRouter.get("/", verifyAccessToken, authorizeRoles("pharmacist"), getMedicineTickets);

/**
 * @swagger
 * /medicine/tickets/{id}/status:
 *   patch:
 *     summary: Update medicine ticket status
 *     description: |
 *       Update the status of a medicine ticket manually.
 *       For the full medicine dispensing flow with stock check and export log creation, use `/medicine/tickets/dispense`.
 *     tags:
 *       - Medicine Tickets
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Ticket ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [pending, done]
 *                 description: New status for the ticket
 *             required:
 *               - status
 *     responses:
 *       200:
 *         description: Ticket status updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 data:
 *                   type: object
 *                   properties:
 *                     ticketID:
 *                       type: string
 *                       format: uuid
 *                     orderNum:
 *                       type: integer
 *                     status:
 *                       type: string
 *                       enum: [pending, done]
 *                     prescriptionID:
 *                       type: string
 *                       format: uuid
 *       400:
 *         description: Invalid request body or ticket ID
 *       404:
 *         description: Ticket not found
 *       500:
 *         description: Server error
 */
medicineTicketsRouter.patch("/:id/status", verifyAccessToken, authorizeRoles("pharmacist"), updateMedicineTicketStatus);

/**
 * @swagger
 * /medicine/tickets/dispense:
 *   post:
 *     summary: Dispense medicine by medicine ticket
 *     description: |
 *       Xuất thuốc cho một medicine ticket.
 *       Hệ thống sẽ kiểm tra tồn kho của toàn bộ thuốc trong prescription tương ứng.
 *       Nếu đủ tồn kho, hệ thống sẽ tạo phiếu xuất thuốc, trừ tồn kho, cập nhật medicine ticket và prescription sang `done`.
 *       Nếu thiếu thuốc, request sẽ bị từ chối và không có thay đổi nào được ghi vào database.
 *     tags:
 *       - Medicine Tickets
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Medicine ticket ID
 *         example: "550e8400-e29b-41d4-a716-446655440000"
 *     responses:
 *       200:
 *         description: Medicine dispensed successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Medicine dispensed successfully"
 *                 data:
 *                   type: object
 *                   properties:
 *                     ticketID:
 *                       type: string
 *                       format: uuid
 *                     status:
 *                       type: string
 *                       enum: [done]
 *                     prescriptionID:
 *                       type: string
 *                       format: uuid
 *                     prescriptionDisplayID:
 *                       type: string
 *                     imexID:
 *                       type: string
 *                       format: uuid
 *       400:
 *         description: Invalid ticket id or insufficient stock
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - only pharmacists can access this endpoint
 *       404:
 *         description: Medicine ticket or prescription not found
 *       409:
 *         description: Medicine ticket or prescription has already been completed
 *       500:
 *         description: Server error
 */
medicineTicketsRouter.post(
  "/dispense",
  verifyAccessToken,
  authorizeRoles("pharmacist"),
  validateQuery(dispenseMedicineTicketQuerySchema),
  dispenseMedicineTicket
);

export default medicineTicketsRouter;
