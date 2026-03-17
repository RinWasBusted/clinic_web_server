import { Router } from "express";
import { verifyAccessToken } from "../../../middlewares/verifyToken.js";

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

/**
 * @swagger
 * tags:
 *   - name: EnterTicket
 *     description: Ticket management for examination queue
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     TicketStatus:
 *       type: string
 *       enum: [pending, in_check, skip, done]
 *       example: pending
 *
 *     TicketPatientAccount:
 *       type: object
 *       properties:
 *         address:
 *           type: string
 *           nullable: true
 *           example: "123 Le Loi, District 1"
 *         DisplayID:
 *           type: string
 *           nullable: true
 *           example: "BN000123"
 *         fullName:
 *           type: string
 *           example: "Nguyen Van A"
 *         birthDate:
 *           type: string
 *           format: date-time
 *           example: "1990-01-01T00:00:00.000Z"
 *         genderDisplay:
 *           type: string
 *           nullable: true
 *           example: "Nam"
 *
 *     TicketPatient:
 *       type: object
 *       properties:
 *         patientID:
 *           type: string
 *           format: uuid
 *           example: "d4e5f6a7-b8c9-0123-defa-234567890123"
 *         previousRecord:
 *           type: string
 *           nullable: true
 *           example: "Hypertension"
 *         account:
 *           $ref: '#/components/schemas/TicketPatientAccount'
 *
 *     TicketRoom:
 *       type: object
 *       properties:
 *         roomID:
 *           type: string
 *           format: uuid
 *           example: "a1b2c3d4-e5f6-7890-abcd-ef1234567890"
 *         roomName:
 *           type: string
 *           nullable: true
 *           example: "Room 101"
 *
 *     TicketWithRelations:
 *       type: object
 *       properties:
 *         ticketID:
 *           type: string
 *           format: uuid
 *           example: "b2c3d4e5-f6a7-8901-bcde-f12345678901"
 *         orderNum:
 *           type: integer
 *           example: 4
 *         appointmentID:
 *           type: string
 *           format: uuid
 *           example: "c3d4e5f6-a7b8-9012-cdef-123456789012"
 *         patientID:
 *           type: string
 *           format: uuid
 *           example: "d4e5f6a7-b8c9-0123-defa-234567890123"
 *         roomID:
 *           type: string
 *           format: uuid
 *           example: "a1b2c3d4-e5f6-7890-abcd-ef1234567890"
 *         checkIn:
 *           type: string
 *           format: date-time
 *           example: "2026-03-05T07:00:00.000+07:00"
 *         status:
 *           $ref: '#/components/schemas/TicketStatus'
 *         note:
 *           type: string
 *           nullable: true
 *           example: null
 *         patient:
 *           $ref: '#/components/schemas/TicketPatient'
 *         room:
 *           $ref: '#/components/schemas/TicketRoom'
 *
 *     WaitingListTicket:
 *       type: object
 *       properties:
 *         ticketID:
 *           type: string
 *           format: uuid
 *           example: "b2c3d4e5-f6a7-8901-bcde-f12345678901"
 *         orderNum:
 *           type: integer
 *           example: 1
 *         appointmentID:
 *           type: string
 *           format: uuid
 *           example: "c3d4e5f6-a7b8-9012-cdef-123456789012"
 *         patientID:
 *           type: string
 *           format: uuid
 *           example: "d4e5f6a7-b8c9-0123-defa-234567890123"
 *         roomID:
 *           type: string
 *           format: uuid
 *           example: "a1b2c3d4-e5f6-7890-abcd-ef1234567890"
 *         checkIn:
 *           type: string
 *           format: date-time
 *           example: "2026-03-05T07:00:00.000+07:00"
 *         status:
 *           $ref: '#/components/schemas/TicketStatus'
 *         note:
 *           type: string
 *           nullable: true
 *           example: null
 *         patient:
 *           $ref: '#/components/schemas/TicketPatient'
 *
 *     CurrentServingTicket:
 *       type: object
 *       properties:
 *         orderNum:
 *           type: integer
 *           example: 3
 *         patientName:
 *           type: string
 *           example: "Nguyen Van A"
 *         birthDate:
 *           type: string
 *           example: "01/01/1990"
 *         roomName:
 *           type: string
 *           nullable: true
 *           example: "Room 101"
 *
 *     PaginationMeta:
 *       type: object
 *       properties:
 *         totalItems:
 *           type: integer
 *           example: 2
 *         totalPages:
 *           type: integer
 *           example: 1
 *         currentPage:
 *           type: integer
 *           example: 1
 *         itemCount:
 *           type: integer
 *           example: 2
 *
 *     ValidationError:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *           example: "Invalid query parameters"
 *         errors:
 *           type: object
 *
 *     UnauthorizedError:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *           enum:
 *             - Missing access token
 *             - Invalid token payload
 *             - Invalid or expired access token
 *           example: "Missing access token"
 *
 *     ForbiddenError:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *           example: "Forbidden"
 *         role:
 *           type: string
 *           nullable: true
 *           example: "staff"
 *
 *     NotFoundError:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *           example: "Không tìm thấy"
 *
 *     PrismaNotFoundError:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *           example: "Resource not found"
 *         err:
 *           type: object
 *
 *     InternalServerError:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *           example: "Internal Server Error"
 *         err:
 *           type: object
 */

// Public API
/**
 * @swagger
 * /examine/ticket/current:
 *   get:
 *     summary: Get currently served ticket
 *     description: Returns the ticket currently being served (status = in_check) for the specified room in the current day.
 *     tags:
 *       - EnterTicket
 *     parameters:
 *       - in: query
 *         name: roomID
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Room UUID.
 *         example: "a1b2c3d4-e5f6-7890-abcd-ef1234567890"
 *     responses:
 *       200:
 *         description: Current serving status for the room.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 currentlyServing:
 *                   type: boolean
 *                   example: true
 *                 ticket:
 *                   oneOf:
 *                     - $ref: '#/components/schemas/CurrentServingTicket'
 *                     - type: 'null'
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
 *                 summary: No patient is being served
 *                 value:
 *                   currentlyServing: false
 *                   ticket: null
 *       400:
 *         description: Invalid query parameters.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ValidationError'
 *             example:
 *               message: "Invalid query parameters"
 *               errors:
 *                 formErrors: []
 *                 fieldErrors:
 *                   roomID:
 *                     - "Invalid room ID format"
 *       500:
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/InternalServerError'
 */
enterTicketRouter.get("/current", validateQuery(enterTicketSchema.query), getCurrentTicket);

// Protected API
enterTicketRouter.use(verifyAccessToken);

/**
 * @swagger
 * /examine/ticket/next:
 *   get:
 *     summary: Call the next pending ticket (doctor only)
 *     description: |
 *       For the given room and current day:
 *       1) Marks the earliest in_check ticket as done (if exists).
 *       2) Promotes the earliest pending ticket to in_check (if exists).
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
 *         description: Room UUID.
 *         example: "a1b2c3d4-e5f6-7890-abcd-ef1234567890"
 *     responses:
 *       200:
 *         description: Next ticket was called or queue is empty.
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
 *                     - type: 'null'
 *             examples:
 *               nextCalled:
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
 *                       previousRecord: null
 *                       account:
 *                         address: null
 *                         DisplayID: "BN000123"
 *                         fullName: "Nguyen Van A"
 *                         birthDate: "1990-01-01T00:00:00.000Z"
 *                         genderDisplay: "Nam"
 *                     room:
 *                       roomID: "a1b2c3d4-e5f6-7890-abcd-ef1234567890"
 *                       roomName: "Room 101"
 *               queueEmpty:
 *                 value:
 *                   message: "Không còn STT nào trong danh sách chờ"
 *                   ticket: null
 *       400:
 *         description: Invalid query parameters.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ValidationError'
 *       401:
 *         description: Missing or invalid access token.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UnauthorizedError'
 *       403:
 *         description: Forbidden (only doctor).
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ForbiddenError'
 *       500:
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/InternalServerError'
 */
enterTicketRouter.get("/next", getNextTicket);

/**
 * @swagger
 * /examine/ticket/{id}:
 *   patch:
 *     summary: Update ticket status (doctor only)
 *     description: Updates `status` of the specified ticket.
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
 *         description: Ticket UUID.
 *         example: "b2c3d4e5-f6a7-8901-bcde-f12345678901"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [status]
 *             properties:
 *               status:
 *                 $ref: '#/components/schemas/TicketStatus'
 *           example:
 *             status: done
 *     responses:
 *       200:
 *         description: Ticket status updated successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Trạng thái ticket đã được cập nhật thành công"
 *                 ticket:
 *                   $ref: '#/components/schemas/TicketWithRelations'
 *       400:
 *         description: Invalid request body.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ValidationError'
 *             example:
 *               message: "Invalid input"
 *               errors:
 *                 formErrors: []
 *                 fieldErrors:
 *                   status:
 *                     - "Invalid enum value. Expected 'pending' | 'in_check' | 'skip' | 'done'"
 *       401:
 *         description: Missing or invalid access token.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UnauthorizedError'
 *       403:
 *         description: Forbidden (only doctor).
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ForbiddenError'
 *       404:
 *         description: Ticket does not exist (Prisma P2025).
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PrismaNotFoundError'
 *             example:
 *               message: "Resource not found"
 *               err:
 *                 code: "P2025"
 *       500:
 *         description: Internal server error (e.g. malformed path ID not parseable by database).
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/InternalServerError'
 */
enterTicketRouter.patch("/:id", updateEnterTicket);

/**
 * @swagger
 * /examine/ticket/{id}:
 *   get:
 *     summary: Get a single ticket by ID (doctor only)
 *     description: Returns ticket detail with patient and room relations.
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
 *         description: Ticket UUID.
 *         example: "b2c3d4e5-f6a7-8901-bcde-f12345678901"
 *     responses:
 *       200:
 *         description: Ticket retrieved successfully.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/TicketWithRelations'
 *       401:
 *         description: Missing or invalid access token.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UnauthorizedError'
 *       403:
 *         description: Forbidden (only doctor).
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ForbiddenError'
 *       404:
 *         description: Ticket not found.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/NotFoundError'
 *             example:
 *               message: "Không tìm thấy"
 *       500:
 *         description: Internal server error (e.g. malformed path ID not parseable by database).
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/InternalServerError'
 */
enterTicketRouter.get("/:id", viewEnterTicket);

/**
 * @swagger
 * /examine/ticket:
 *   post:
 *     summary: Generate a new enter ticket (staff only)
 *     description: |
 *       Creates a new examination queue ticket from an approved appointment.
 *       The server determines `patientID`, `roomID`, and `orderNum` automatically.
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
 *             required: [appointmentID]
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
 *         description: Ticket created successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 newTicket:
 *                   type: object
 *                   properties:
 *                     ticketID:
 *                       type: string
 *                       format: uuid
 *                     orderNum:
 *                       type: integer
 *                     appointmentID:
 *                       type: string
 *                       format: uuid
 *                     patientID:
 *                       type: string
 *                       format: uuid
 *                     roomID:
 *                       type: string
 *                       format: uuid
 *                     checkIn:
 *                       type: string
 *                       format: date-time
 *                     status:
 *                       $ref: '#/components/schemas/TicketStatus'
 *                     note:
 *                       type: string
 *                       nullable: true
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
 *         description: Invalid request body.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ValidationError'
 *             example:
 *               message: "Invalid input"
 *               errors:
 *                 formErrors: []
 *                 fieldErrors:
 *                   appointmentID:
 *                     - "Invalid appointment ID format"
 *       401:
 *         description: Missing or invalid access token.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UnauthorizedError'
 *       403:
 *         description: Forbidden (only staff).
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ForbiddenError'
 *       500:
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/InternalServerError'
 */
enterTicketRouter.post("/", generateNewTicket);

/**
 * @swagger
 * /examine/ticket:
 *   get:
 *     summary: View waiting list (staff and doctor)
 *     description: Returns paginated tickets with optional filters by date, status, and roomID.
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
 *         description: ISO date string used to filter `checkIn` within local day boundaries.
 *       - in: query
 *         name: status
 *         required: false
 *         schema:
 *           $ref: '#/components/schemas/TicketStatus'
 *       - in: query
 *         name: roomID
 *         required: false
 *         schema:
 *           type: string
 *           format: uuid
 *         example: "a1b2c3d4-e5f6-7890-abcd-ef1234567890"
 *       - in: query
 *         name: page
 *         required: false
 *         schema:
 *           type: integer
 *           minimum: 1
 *           example: 1
 *       - in: query
 *         name: limit
 *         required: false
 *         schema:
 *           type: integer
 *           minimum: 1
 *           example: 10
 *     responses:
 *       200:
 *         description: Paginated waiting list.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/WaitingListTicket'
 *                 pagination:
 *                   $ref: '#/components/schemas/PaginationMeta'
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
 *                     previousRecord: null
 *                     account:
 *                       address: null
 *                       DisplayID: "BN000123"
 *                       fullName: "Nguyen Van A"
 *                       birthDate: "1990-01-01T00:00:00.000Z"
 *                       genderDisplay: "Nam"
 *               pagination:
 *                 totalItems: 1
 *                 totalPages: 1
 *                 currentPage: 1
 *                 itemCount: 1
 *       400:
 *         description: Invalid query parameters.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ValidationError'
 *       401:
 *         description: Missing or invalid access token.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UnauthorizedError'
 *       403:
 *         description: Forbidden (only staff or doctor).
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ForbiddenError'
 *       500:
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/InternalServerError'
 */
enterTicketRouter.get(
  "/",

  validateQuery(enterTicketSchema.viewList),
  viewWaitingList
);

export default enterTicketRouter;
