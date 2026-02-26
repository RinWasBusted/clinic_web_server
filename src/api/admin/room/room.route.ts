import { Router } from "express";
import {
  CreateRoom,
  GetAllRooms,
  GetRoomById,
  UpdateRoomById,
  DeleteRoomById,
  DeleteManyRooms
} from "./room.controller.js";
import { verifyAccessToken } from "../../../middlewares/verifyToken.js";
import { authorizeRoles } from "../../../middlewares/role.js";

const router = Router();

/**
 * @swagger
 * /admin/rooms:
 *   post:
 *     summary: Create a new room
 *     tags: [Room]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - roomType
 *             properties:
 *               roomType:
 *                 type: string
 *                 enum: [examination, pharmacy, cashier, lab]
 *                 example: "examination"
 *               roomName:
 *                 type: string
 *                 example: "Room A"
 *               FacultyID:
 *                 type: string
 *                 format: uuid
 *                 example: "550e8400-e29b-41d4-a716-446655440000"
 *     responses:
 *       201:
 *         description: Room created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 room:
 *                   type: object
 *                   properties:
 *                     roomID:
 *                       type: string
 *                       format: uuid
 *                     roomType:
 *                       type: string
 *                     roomName:
 *                       type: string
 *                     FacultyID:
 *                       type: string
 *       400:
 *         description: Bad request - Room type is required
 *       409:
 *         description: Conflict - Room with this type already exists
 */
router.post("/",verifyAccessToken,authorizeRoles("manager", "staff"), CreateRoom);

/**
 * @swagger
 * /admin/rooms:
 *   get:
 *     summary: Get all rooms
 *     tags: [Room]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all rooms
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 rooms:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       roomID:
 *                         type: string
 *                         format: uuid
 *                       roomType:
 *                         type: string
 *                       roomName:
 *                         type: string
 *                       FacultyID:
 *                         type: string
 *                         format: uuid
 *                       faculty:
 *                         type: object
 */
router.get("/",verifyAccessToken,authorizeRoles("manager", "staff"), GetAllRooms);

/**
 * @swagger
 * /admin/rooms/{id}:
 *   get:
 *     summary: Get room by ID
 *     tags: [Room]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Room ID
 *     responses:
 *       200:
 *         description: Room found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 room:
 *                   type: object
 *                   properties:
 *                     roomID:
 *                       type: string
 *                       format: uuid
 *                     roomType:
 *                       type: string
 *                     roomName:
 *                       type: string
 *                     FacultyID:
 *                       type: string
 *                     faculty:
 *                       type: object
 *       400:
 *         description: Bad request - Room ID is required
 *       404:
 *         description: Not Found - Room not found
 */
router.get("/:id",verifyAccessToken,authorizeRoles("manager", "staff"), GetRoomById);

/**
 * @swagger
 * /admin/rooms/{id}:
 *   patch:
 *     summary: Update room by ID
 *     tags: [Room]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Room ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               roomType:
 *                 type: string
 *                 enum: [examination, pharmacy, cashier, lab]
 *               roomName:
 *                 type: string
 *               FacultyID:
 *                 type: string
 *                 format: uuid
 *     responses:
 *       200:
 *         description: Room updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 room:
 *                   type: object
 *       400:
 *         description: Bad request
 *       404:
 *         description: Not Found - Room not found
 */
router.patch("/:id",verifyAccessToken,authorizeRoles("manager", "staff"), UpdateRoomById);

/**
 * @swagger
 * /admin/rooms/{id}:
 *   delete:
 *     summary: Delete room by ID
 *     tags: [Room]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Room ID
 *     responses:
 *       200:
 *         description: Room deleted successfully
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
 *         description: Not Found - Room not found
 */
router.delete("/:id",verifyAccessToken,authorizeRoles("manager", "staff"), DeleteRoomById);

/**
 * @swagger
 * /admin/rooms/delete-many:
 *   delete:
 *     summary: Delete multiple rooms
 *     tags: [Room]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - roomIds
 *             properties:
 *               roomIds:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: uuid
 *                 example: ["550e8400-e29b-41d4-a716-446655440000", "550e8400-e29b-41d4-a716-446655440001"]
 *     responses:
 *       200:
 *         description: Rooms deleted successfully
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
router.delete("/delete-many",verifyAccessToken,authorizeRoles("manager", "staff"), DeleteManyRooms);

export default router;