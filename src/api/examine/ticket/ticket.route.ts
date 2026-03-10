import { Router } from "express";
import { verifyAccessToken } from "../../../middlewares/verifyToken.js";
import { authorizeRoles } from "../../../middlewares/role.js";
import {
  generateNewTicket,
  getCurrentTicket,
  getNextTicket,
  updateEnterTicket,
  viewEnterTicket,
  viewWaitingList,
} from "./ticket.controller.js";
import { validateBody, validateQuery } from "../../../middlewares/validate.js";
import enterTicketSchema from "../../../schema/enterTicket.schema.js";

const enterTicketRouter = Router();

// Public API
/**
 * @swagger
 * tags:
 *   name: EnterTicket
 *   description: Ticket management for examination queue
 */
/**
 * @swagger
 * /examine/ticket/current:
 *   get:
 *     summary: Get currently served ticket
 *     description: Returns the ticket currently being served (status = in_check) for a given room today. No authentication required.
 *     tags:
 *       - EnterTicket
 *     parameters:
 *       - in: query
 *         name: roomID
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *           example: "a1b2c3d4-e5f6-7890-abcd-ef1234567890"
 *         description: The UUID of the room to check
 *     responses:
 *       200:
 *         description: Currently served ticket info (ticket is null when no one is being served)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 currentlyServing:
 *                   type: boolean
 *                 ticket:
 *                   oneOf:
 *                     - type: object
 *                       properties:
 *                         orderNum:
 *                           type: integer
 *                           example: 3
 *                         patientName:
 *                           type: string
 *                           example: "Nguyen Van A"
 *                         birthDate:
 *                           type: string
 *                           example: "01/01/1990"
 *                         roomName:
 *                           type: string
 *                           example: "Room 101"
 *                     - type: "null"
 *             examples:
 *               serving:
 *                 summary: A patient is currently being served
 *                 value:
 *                   currentlyServing: true
 *                   ticket:
 *                     orderNum: 3
 *                     patientName: "Nguyen Van A"
 *                     birthDate: "01/01/1990"
 *                     roomName: "Room 101"
 *               idle:
 *                 summary: No patient is currently being served
 *                 value:
 *                   currentlyServing: false
 *                   ticket: null
 *       400:
 *         description: Missing or invalid roomID query parameter
 *         content:
 *           application/json:
 *             example:
 *               message: "Invalid room ID format"
 *       500:
 *         description: Internal server error
 */
enterTicketRouter.get("/current", validateQuery(enterTicketSchema.query), getCurrentTicket);

// Protected API
enterTicketRouter.use(verifyAccessToken);

/**
 * @swagger
 * /examine/ticket/next:
 *   get:
 *     summary: Call the next pending ticket (doctor only)
 *     description: Marks the current in_check ticket as done and updates the next pending ticket to in_check for the given room today.
 *     tags:
 *       - EnterTicket
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: roomID
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *           example: "a1b2c3d4-e5f6-7890-abcd-ef1234567890"
 *         description: The UUID of the room to advance the queue for
 *     responses:
 *       200:
 *         description: Next ticket called or queue is empty
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 ticket:
 *                   oneOf:
 *                     - $ref: '#/components/schemas/TicketWithRelations'
 *                     - type: "null"
 *             examples:
 *               nextCalled:
 *                 summary: Successfully advanced to the next ticket
 *                 value:
 *                   message: "Đã gọi STT tiếp theo"
 *                   ticket:
 *                     ticketID: "b2c3d4e5-f6a7-8901-bcde-f12345678901"
 *                     orderNum: 4
 *                     appointmentID: "c3d4e5f6-a7b8-9012-cdef-123456789012"
 *                     patientID: "d4e5f6a7-b8c9-0123-defa-234567890123"
 *                     roomID: "a1b2c3d4-e5f6-7890-abcd-ef1234567890"
 *                     checkIn: "2026-03-05T07:00:00.000+07:00"
 *                     status: "in_check"
 *                     note: null
 *                     patient:
 *                       patientID: "d4e5f6a7-b8c9-0123-defa-234567890123"
 *                       account:
 *                         fullName: "Nguyen Van A"
 *                     room:
 *                       roomID: "a1b2c3d4-e5f6-7890-abcd-ef1234567890"
 *                       roomName: "Room 101"
 *               queueEmpty:
 *                 summary: No pending tickets remain
 *                 value:
 *                   message: "Không còn STT nào trong danh sách chờ"
 *                   ticket: null
 *       400:
 *         description: Missing or invalid roomID query parameter
 *         content:
 *           application/json:
 *             example:
 *               message: "Invalid room ID format"
 *       401:
 *         description: Unauthorized – missing or invalid access token
 *       403:
 *         description: Forbidden – only doctors can call this endpoint
 *       500:
 *         description: Internal server error
 */
// Only doctors can manage the ticket status and view the current ticket
enterTicketRouter.get("/next", authorizeRoles("doctor"), validateQuery(enterTicketSchema.query), getNextTicket);

/**
 * @swagger
 * /examine/ticket/{id}:
 *   patch:
 *     summary: Update ticket status (doctor only)
 *     description: Updates the status of a specific ticket. Allowed statuses are pending, in_check, skip, done.
 *     tags:
 *       - EnterTicket
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *           example: "b2c3d4e5-f6a7-8901-bcde-f12345678901"
 *         description: The UUID of the ticket to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - status
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [pending, in_check, skip, done]
 *                 example: "done"
 *     responses:
 *       200:
 *         description: Ticket status updated successfully
 *         content:
 *           application/json:
 *             example:
 *               message: "Trạng thái ticket đã được cập nhật thành công"
 *               ticket:
 *                 ticketID: "b2c3d4e5-f6a7-8901-bcde-f12345678901"
 *                 orderNum: 4
 *                 appointmentID: "c3d4e5f6-a7b8-9012-cdef-123456789012"
 *                 patientID: "d4e5f6a7-b8c9-0123-defa-234567890123"
 *                 roomID: "a1b2c3d4-e5f6-7890-abcd-ef1234567890"
 *                 checkIn: "2026-03-05T07:00:00.000+07:00"
 *                 status: "done"
 *                 note: null
 *                 patient:
 *                   patientID: "d4e5f6a7-b8c9-0123-defa-234567890123"
 *                   account:
 *                     fullName: "Nguyen Van A"
 *                 room:
 *                   roomID: "a1b2c3d4-e5f6-7890-abcd-ef1234567890"
 *                   roomName: "Room 101"
 *       400:
 *         description: Invalid status value
 *         content:
 *           application/json:
 *             example:
 *               message: "Invalid status value"
 *       401:
 *         description: Unauthorized – missing or invalid access token
 *       403:
 *         description: Forbidden – only doctors can call this endpoint
 *       404:
 *         description: Ticket not found
 *         content:
 *           application/json:
 *             example:
 *               message: "Không tìm thấy"
 *       500:
 *         description: Internal server error
 */
enterTicketRouter.patch("/:id", authorizeRoles("doctor"), validateBody(enterTicketSchema.update), updateEnterTicket);

/**
 * @swagger
 * /examine/ticket/{id}:
 *   get:
 *     summary: Get a single ticket by ID (doctor only)
 *     description: Returns the full details of a specific enter ticket including patient and room relations.
 *     tags:
 *       - EnterTicket
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *           example: "b2c3d4e5-f6a7-8901-bcde-f12345678901"
 *         description: The UUID of the ticket to retrieve
 *     responses:
 *       200:
 *         description: Ticket details retrieved successfully
 *         content:
 *           application/json:
 *             example:
 *               ticketID: "b2c3d4e5-f6a7-8901-bcde-f12345678901"
 *               orderNum: 4
 *               appointmentID: "c3d4e5f6-a7b8-9012-cdef-123456789012"
 *               patientID: "d4e5f6a7-b8c9-0123-defa-234567890123"
 *               roomID: "a1b2c3d4-e5f6-7890-abcd-ef1234567890"
 *               checkIn: "2026-03-05T07:00:00.000+07:00"
 *               status: "pending"
 *               note: "Patient needs wheelchair"
 *               patient:
 *                 patientID: "d4e5f6a7-b8c9-0123-defa-234567890123"
 *                 account:
 *                   fullName: "Nguyen Van A"
 *               room:
 *                 roomID: "a1b2c3d4-e5f6-7890-abcd-ef1234567890"
 *                 roomName: "Room 101"
 *       401:
 *         description: Unauthorized – missing or invalid access token
 *       403:
 *         description: Forbidden – only doctors can call this endpoint
 *       404:
 *         description: Ticket not found
 *         content:
 *           application/json:
 *             example:
 *               message: "Không tìm thấy"
 *       500:
 *         description: Internal server error
 */
enterTicketRouter.get("/:id", authorizeRoles("doctor"), viewEnterTicket);

/**
 * @swagger
 * /examine/ticket:
 *   post:
 *     summary: Generate a new enter ticket (staff only)
 *     description: Creates a new examination queue ticket for an approved appointment. The order number is automatically calculated based on existing tickets for the same room today.
 *     tags:
 *       - EnterTicket
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
 *             properties:
 *               appointmentID:
 *                 type: string
 *                 format: uuid
 *                 example: "c3d4e5f6-a7b8-9012-cdef-123456789012"
 *               note:
 *                 type: string
 *                 maxLength: 255
 *                 example: "Patient needs wheelchair"
 *     responses:
 *       201:
 *         description: Ticket created successfully
 *         content:
 *           application/json:
 *             example:
 *               newTicket:
 *                 ticketID: "b2c3d4e5-f6a7-8901-bcde-f12345678901"
 *                 orderNum: 5
 *                 appointmentID: "c3d4e5f6-a7b8-9012-cdef-123456789012"
 *                 patientID: "d4e5f6a7-b8c9-0123-defa-234567890123"
 *                 roomID: "a1b2c3d4-e5f6-7890-abcd-ef1234567890"
 *                 checkIn: "2026-03-05T07:15:00.000+07:00"
 *                 status: "pending"
 *                 note: "Patient needs wheelchair"
 *       400:
 *         description: Invalid request body (e.g. appointmentID is not a valid UUID)
 *         content:
 *           application/json:
 *             example:
 *               message: "Invalid appointment ID format"
 *       401:
 *         description: Unauthorized – missing or invalid access token
 *       403:
 *         description: Forbidden – only staff can call this endpoint
 *       404:
 *         description: Appointment not found or does not have status approved
 *         content:
 *           application/json:
 *             example:
 *               message: "Không tìm thấy"
 *       500:
 *         description: Internal server error
 */
// Only staff can generate new tickets and view the waiting list
enterTicketRouter.post("/", authorizeRoles("staff"), validateBody(enterTicketSchema.new), generateNewTicket);

/**
 * @swagger
 * /examine/ticket:
 *   get:
 *     summary: View the waiting list (staff and doctors)
 *     description: Returns a paginated list of enter tickets. Supports filtering by date, status, and roomID.
 *     tags:
 *       - EnterTicket
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: date
 *         required: false
 *         schema:
 *           type: string
 *           example: "2026-03-05"
 *         description: Filter tickets by check-in date (ISO 8601 date string). Defaults to all dates if omitted.
 *       - in: query
 *         name: status
 *         required: false
 *         schema:
 *           type: string
 *           enum: [pending, in_check, skip, done]
 *           example: "pending"
 *         description: Filter tickets by status
 *       - in: query
 *         name: roomID
 *         required: false
 *         schema:
 *           type: string
 *           format: uuid
 *           example: "a1b2c3d4-e5f6-7890-abcd-ef1234567890"
 *         description: Filter tickets by room UUID
 *       - in: query
 *         name: page
 *         required: false
 *         schema:
 *           type: integer
 *           minimum: 1
 *           example: 1
 *         description: Page number for pagination
 *       - in: query
 *         name: limit
 *         required: false
 *         schema:
 *           type: integer
 *           minimum: 1
 *           example: 10
 *         description: Number of items per page
 *     responses:
 *       200:
 *         description: Paginated waiting list returned successfully
 *         content:
 *           application/json:
 *             example:
 *               data:
 *                 - ticketID: "b2c3d4e5-f6a7-8901-bcde-f12345678901"
 *                   orderNum: 1
 *                   appointmentID: "c3d4e5f6-a7b8-9012-cdef-123456789012"
 *                   patientID: "d4e5f6a7-b8c9-0123-defa-234567890123"
 *                   roomID: "a1b2c3d4-e5f6-7890-abcd-ef1234567890"
 *                   checkIn: "2026-03-05T07:00:00.000+07:00"
 *                   status: "done"
 *                   note: null
 *                   patient:
 *                     patientID: "d4e5f6a7-b8c9-0123-defa-234567890123"
 *                     account:
 *                       fullName: "Nguyen Van A"
 *                   room:
 *                     roomID: "a1b2c3d4-e5f6-7890-abcd-ef1234567890"
 *                     roomName: "Room 101"
 *                 - ticketID: "e5f6a7b8-c9d0-1234-efab-567890123456"
 *                   orderNum: 2
 *                   appointmentID: "f6a7b8c9-d0e1-2345-fabc-678901234567"
 *                   patientID: "a7b8c9d0-e1f2-3456-abcd-789012345678"
 *                   roomID: "a1b2c3d4-e5f6-7890-abcd-ef1234567890"
 *                   checkIn: "2026-03-05T07:10:00.000+07:00"
 *                   status: "in_check"
 *                   note: null
 *                   patient:
 *                     patientID: "a7b8c9d0-e1f2-3456-abcd-789012345678"
 *                     account:
 *                       fullName: "Tran Thi B"
 *                   room:
 *                     roomID: "a1b2c3d4-e5f6-7890-abcd-ef1234567890"
 *                     roomName: "Room 101"
 *               pagination:
 *                 total: 2
 *                 page: 1
 *                 limit: 10
 *                 totalPages: 1
 *       400:
 *         description: Invalid query parameters
 *         content:
 *           application/json:
 *             example:
 *               message: "Invalid date format"
 *       401:
 *         description: Unauthorized – missing or invalid access token
 *       403:
 *         description: Forbidden – only staff or doctors can call this endpoint
 *       500:
 *         description: Internal server error
 */
// Both staff and doctors can view the waiting list.
enterTicketRouter.get(
  "/",
  authorizeRoles("staff", "doctor"),
  validateQuery(enterTicketSchema.viewList),
  viewWaitingList
);
/**
 * @swagger
 * /examine/ticket/current:
 *   get:
 *     summary: Get currently served ticket
 *     description: Returns the ticket currently being served (status = in_check) for a given room today. No authentication required.
 *     tags:
 *       - EnterTicket
 *     parameters:
 *       - in: query
 *         name: roomID
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *           example: "a1b2c3d4-e5f6-7890-abcd-ef1234567890"
 *         description: The UUID of the room to check
 *     responses:
 *       200:
 *         description: Currently served ticket info (ticket is null when no one is being served)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 currentlyServing:
 *                   type: boolean
 *                 ticket:
 *                   oneOf:
 *                     - type: object
 *                       properties:
 *                         orderNum:
 *                           type: integer
 *                           example: 3
 *                         patientName:
 *                           type: string
 *                           example: "Nguyen Van A"
 *                         birthDate:
 *                           type: string
 *                           example: "01/01/1990"
 *                         roomName:
 *                           type: string
 *                           example: "Room 101"
 *                     - type: "null"
 *             examples:
 *               serving:
 *                 summary: A patient is currently being served
 *                 value:
 *                   currentlyServing: true
 *                   ticket:
 *                     orderNum: 3
 *                     patientName: "Nguyen Van A"
 *                     birthDate: "01/01/1990"
 *                     roomName: "Room 101"
 *               idle:
 *                 summary: No patient is currently being served
 *                 value:
 *                   currentlyServing: false
 *                   ticket: null
 *       400:
 *         description: Missing or invalid roomID query parameter
 *         content:
 *           application/json:
 *             example:
 *               message: "Invalid room ID format"
 *       500:
 *         description: Internal server error
 */
enterTicketRouter.get("/current", validateQuery(enterTicketSchema.query), getCurrentTicket);

// Protected API
enterTicketRouter.use(verifyAccessToken);

/**
 * @swagger
 * /examine/ticket/next:
 *   get:
 *     summary: Call the next pending ticket (doctor only)
 *     description: Marks the current in_check ticket as done and updates the next pending ticket to in_check for the given room today.
 *     tags:
 *       - EnterTicket
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: roomID
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *           example: "a1b2c3d4-e5f6-7890-abcd-ef1234567890"
 *         description: The UUID of the room to advance the queue for
 *     responses:
 *       200:
 *         description: Next ticket called or queue is empty
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 ticket:
 *                   oneOf:
 *                     - $ref: '#/components/schemas/TicketWithRelations'
 *                     - type: "null"
 *             examples:
 *               nextCalled:
 *                 summary: Successfully advanced to the next ticket
 *                 value:
 *                   message: "Next ticket called successfully"
 *                   ticket:
 *                     ticketID: "b2c3d4e5-f6a7-8901-bcde-f12345678901"
 *                     orderNum: 4
 *                     appointmentID: "c3d4e5f6-a7b8-9012-cdef-123456789012"
 *                     patientID: "d4e5f6a7-b8c9-0123-defa-234567890123"
 *                     roomID: "a1b2c3d4-e5f6-7890-abcd-ef1234567890"
 *                     checkIn: "2026-03-05T07:00:00.000+07:00"
 *                     status: "in_check"
 *                     note: null
 *                     patient:
 *                       patientID: "d4e5f6a7-b8c9-0123-defa-234567890123"
 *                       account:
 *                         fullName: "Nguyen Van A"
 *                     room:
 *                       roomID: "a1b2c3d4-e5f6-7890-abcd-ef1234567890"
 *                       roomName: "Room 101"
 *               queueEmpty:
 *                 summary: No pending tickets remain
 *                 value:
 *                   message: "No pending tickets in the queue"
 *                   ticket: null
 *       400:
 *         description: Missing or invalid roomID query parameter
 *         content:
 *           application/json:
 *             example:
 *               message: "Invalid room ID format"
 *       401:
 *         description: Unauthorized – missing or invalid access token
 *       403:
 *         description: Forbidden – only doctors can call this endpoint
 *       500:
 *         description: Internal server error
 */
// Only doctors can manage the ticket status and view the current ticket
enterTicketRouter.get("/next", authorizeRoles("doctor"), validateQuery(enterTicketSchema.query), getNextTicket);

/**
 * @swagger
 * /examine/ticket/{id}:
 *   patch:
 *     summary: Update ticket status (doctor only)
 *     description: Updates the status of a specific ticket. Allowed statuses are pending, in_check, skip, done.
 *     tags:
 *       - EnterTicket
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *           example: "b2c3d4e5-f6a7-8901-bcde-f12345678901"
 *         description: The UUID of the ticket to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - status
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [pending, in_check, skip, done]
 *                 example: "done"
 *     responses:
 *       200:
 *         description: Ticket status updated successfully
 *         content:
 *           application/json:
 *             example:
 *               message: "Ticket status updated successfully"
 *               ticket:
 *                 ticketID: "b2c3d4e5-f6a7-8901-bcde-f12345678901"
 *                 orderNum: 4
 *                 appointmentID: "c3d4e5f6-a7b8-9012-cdef-123456789012"
 *                 patientID: "d4e5f6a7-b8c9-0123-defa-234567890123"
 *                 roomID: "a1b2c3d4-e5f6-7890-abcd-ef1234567890"
 *                 checkIn: "2026-03-05T07:00:00.000+07:00"
 *                 status: "done"
 *                 note: null
 *                 patient:
 *                   patientID: "d4e5f6a7-b8c9-0123-defa-234567890123"
 *                   account:
 *                     fullName: "Nguyen Van A"
 *                 room:
 *                   roomID: "a1b2c3d4-e5f6-7890-abcd-ef1234567890"
 *                   roomName: "Room 101"
 *       400:
 *         description: Invalid status value
 *         content:
 *           application/json:
 *             example:
 *               message: "Invalid status value"
 *       401:
 *         description: Unauthorized – missing or invalid access token
 *       403:
 *         description: Forbidden – only doctors can call this endpoint
 *       404:
 *         description: Ticket not found
 *         content:
 *           application/json:
 *             example:
 *               message: "Ticket not found"
 *       500:
 *         description: Internal server error
 */
enterTicketRouter.patch("/:id", authorizeRoles("doctor"), validateBody(enterTicketSchema.update), updateEnterTicket);

/**
 * @swagger
 * /examine/ticket/{id}:
 *   get:
 *     summary: Get a single ticket by ID (doctor only)
 *     description: Returns the full details of a specific enter ticket including patient and room relations.
 *     tags:
 *       - EnterTicket
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *           example: "b2c3d4e5-f6a7-8901-bcde-f12345678901"
 *         description: The UUID of the ticket to retrieve
 *     responses:
 *       200:
 *         description: Ticket details retrieved successfully
 *         content:
 *           application/json:
 *             example:
 *               ticketID: "b2c3d4e5-f6a7-8901-bcde-f12345678901"
 *               orderNum: 4
 *               appointmentID: "c3d4e5f6-a7b8-9012-cdef-123456789012"
 *               patientID: "d4e5f6a7-b8c9-0123-defa-234567890123"
 *               roomID: "a1b2c3d4-e5f6-7890-abcd-ef1234567890"
 *               checkIn: "2026-03-05T07:00:00.000+07:00"
 *               status: "pending"
 *               note: "Patient needs wheelchair"
 *               patient:
 *                 patientID: "d4e5f6a7-b8c9-0123-defa-234567890123"
 *                 account:
 *                   fullName: "Nguyen Van A"
 *               room:
 *                 roomID: "a1b2c3d4-e5f6-7890-abcd-ef1234567890"
 *                 roomName: "Room 101"
 *       401:
 *         description: Unauthorized – missing or invalid access token
 *       403:
 *         description: Forbidden – only doctors can call this endpoint
 *       404:
 *         description: Ticket not found
 *         content:
 *           application/json:
 *             example:
 *               message: "Ticket not found"
 *       500:
 *         description: Internal server error
 */
enterTicketRouter.get("/:id", authorizeRoles("doctor"), viewEnterTicket);

/**
 * @swagger
 * /examine/ticket:
 *   post:
 *     summary: Generate a new enter ticket (staff only)
 *     description: Creates a new examination queue ticket for an approved appointment. The order number is automatically calculated based on existing tickets for the same room today.
 *     tags:
 *       - EnterTicket
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
 *             properties:
 *               appointmentID:
 *                 type: string
 *                 format: uuid
 *                 example: "c3d4e5f6-a7b8-9012-cdef-123456789012"
 *               note:
 *                 type: string
 *                 maxLength: 255
 *                 example: "Patient needs wheelchair"
 *     responses:
 *       201:
 *         description: Ticket created successfully
 *         content:
 *           application/json:
 *             example:
 *               newTicket:
 *                 ticketID: "b2c3d4e5-f6a7-8901-bcde-f12345678901"
 *                 orderNum: 5
 *                 appointmentID: "c3d4e5f6-a7b8-9012-cdef-123456789012"
 *                 patientID: "d4e5f6a7-b8c9-0123-defa-234567890123"
 *                 roomID: "a1b2c3d4-e5f6-7890-abcd-ef1234567890"
 *                 checkIn: "2026-03-05T07:15:00.000+07:00"
 *                 status: "pending"
 *                 note: "Patient needs wheelchair"
 *       400:
 *         description: Invalid request body (e.g. appointmentID is not a valid UUID)
 *         content:
 *           application/json:
 *             example:
 *               message: "Invalid appointment ID format"
 *       401:
 *         description: Unauthorized – missing or invalid access token
 *       403:
 *         description: Forbidden – only staff can call this endpoint
 *       404:
 *         description: Appointment not found or does not have status approved
 *         content:
 *           application/json:
 *             example:
 *               message: "Appointment not found"
 *       500:
 *         description: Internal server error
 */
// Only staff can generate new tickets and view the waiting list
enterTicketRouter.post("/", authorizeRoles("staff"), validateBody(enterTicketSchema.new), generateNewTicket);

/**
 * @swagger
 * /examine/ticket:
 *   get:
 *     summary: View the waiting list (staff and doctors)
 *     description: Returns a paginated list of enter tickets. Supports filtering by date, status, and roomID.
 *     tags:
 *       - EnterTicket
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: date
 *         required: false
 *         schema:
 *           type: string
 *           example: "2026-03-05"
 *         description: Filter tickets by check-in date (ISO 8601 date string). Defaults to all dates if omitted.
 *       - in: query
 *         name: status
 *         required: false
 *         schema:
 *           type: string
 *           enum: [pending, in_check, skip, done]
 *           example: "pending"
 *         description: Filter tickets by status
 *       - in: query
 *         name: roomID
 *         required: false
 *         schema:
 *           type: string
 *           format: uuid
 *           example: "a1b2c3d4-e5f6-7890-abcd-ef1234567890"
 *         description: Filter tickets by room UUID
 *       - in: query
 *         name: page
 *         required: false
 *         schema:
 *           type: integer
 *           minimum: 1
 *           example: 1
 *         description: Page number for pagination
 *       - in: query
 *         name: limit
 *         required: false
 *         schema:
 *           type: integer
 *           minimum: 1
 *           example: 10
 *         description: Number of items per page
 *     responses:
 *       200:
 *         description: Paginated waiting list returned successfully
 *         content:
 *           application/json:
 *             example:
 *               data:
 *                 - ticketID: "b2c3d4e5-f6a7-8901-bcde-f12345678901"
 *                   orderNum: 1
 *                   appointmentID: "c3d4e5f6-a7b8-9012-cdef-123456789012"
 *                   patientID: "d4e5f6a7-b8c9-0123-defa-234567890123"
 *                   roomID: "a1b2c3d4-e5f6-7890-abcd-ef1234567890"
 *                   checkIn: "2026-03-05T07:00:00.000+07:00"
 *                   status: "done"
 *                   note: null
 *                   patient:
 *                     patientID: "d4e5f6a7-b8c9-0123-defa-234567890123"
 *                     account:
 *                       fullName: "Nguyen Van A"
 *                   room:
 *                     roomID: "a1b2c3d4-e5f6-7890-abcd-ef1234567890"
 *                     roomName: "Room 101"
 *                 - ticketID: "e5f6a7b8-c9d0-1234-efab-567890123456"
 *                   orderNum: 2
 *                   appointmentID: "f6a7b8c9-d0e1-2345-fabc-678901234567"
 *                   patientID: "a7b8c9d0-e1f2-3456-abcd-789012345678"
 *                   roomID: "a1b2c3d4-e5f6-7890-abcd-ef1234567890"
 *                   checkIn: "2026-03-05T07:10:00.000+07:00"
 *                   status: "in_check"
 *                   note: null
 *                   patient:
 *                     patientID: "a7b8c9d0-e1f2-3456-abcd-789012345678"
 *                     account:
 *                       fullName: "Tran Thi B"
 *                   room:
 *                     roomID: "a1b2c3d4-e5f6-7890-abcd-ef1234567890"
 *                     roomName: "Room 101"
 *               pagination:
 *                 total: 2
 *                 page: 1
 *                 limit: 10
 *                 totalPages: 1
 *       400:
 *         description: Invalid query parameters
 *         content:
 *           application/json:
 *             example:
 *               message: "Invalid date format"
 *       401:
 *         description: Unauthorized – missing or invalid access token
 *       403:
 *         description: Forbidden – only staff or doctors can call this endpoint
 *       500:
 *         description: Internal server error
 */
// Both staff and doctors can view the waiting list.
enterTicketRouter.get(
  "/",
  authorizeRoles("staff", "doctor"),
  validateQuery(enterTicketSchema.viewList),
  viewWaitingList
);

export default enterTicketRouter;
