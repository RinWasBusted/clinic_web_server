import { Router } from "express";
import {
  getMedicineTickets,
  updateMedicineTicketStatus,
} from "./medicine-tickets.controller.js";
import { verifyAccessToken } from "../../../middlewares/verifyToken.js";
import { authorizeRoles } from "../../../middlewares/role.js";

const medicineTicketsRouter = Router();

/**
 * @swagger
 * /medicine/tickets:
 *   get:
 *     summary: Get medicine tickets by date and room
 *     description: |
 *       Retrieve a list of medicine tickets (waiting queue) filtered by date and room.
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
 *       - in: query
 *         name: roomId
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Room ID to filter by specific pharmacy counter
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
 *                       orderNum:
 *                         type: integer
 *                       status:
 *                         type: string
 *                         enum: [pending, done]
 *                       prescriptionID:
 *                         type: string
 *                         format: uuid
 *       400:
 *         description: Invalid date format
 *       500:
 *         description: Server error
 */
medicineTicketsRouter.get("/", verifyAccessToken, authorizeRoles("pharmacist", "staff"), getMedicineTickets);

/**
 * @swagger
 * /medicine/tickets/{id}/status:
 *   patch:
 *     summary: Update medicine ticket status
 *     description: |
 *       Update the status of a medicine ticket.
 *       Used by pharmacists to mark tickets as done when medicine is dispensed.
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
medicineTicketsRouter.patch("/:id/status", verifyAccessToken, authorizeRoles("pharmacist", "staff"), updateMedicineTicketStatus);

export default medicineTicketsRouter;
