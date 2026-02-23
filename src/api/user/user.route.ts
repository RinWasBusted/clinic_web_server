import { Router } from "express";
import { GetAccountsByRole } from "./user.controller.js";
const router = Router();

/**
 * @swagger
 * /user/role:
 *   get:
 *     summary: Get accounts by role
 *     description: Retrieve all user accounts filtered by a specific role. Query parameter role is required.
 *     tags:
 *       - User
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: role
 *         required: true
 *         schema:
 *           type: string
 *           enum: [root, staff, doctor, manager, patient]
 *         description: The role to filter accounts by (e.g., ?role=doctor)
 *         example: doctor
 *     responses:
 *       200:
 *         description: Accounts retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   accountID:
 *                     type: string
 *                     format: uuid
 *                     example: "550e8400-e29b-41d4-a716-446655440000"
 *                   email:
 *                     type: string
 *                     example: "user@example.com"
 *                   firstName:
 *                     type: string
 *                     example: "John"
 *                   lastName:
 *                     type: string
 *                     example: "Doe"
 *                   role:
 *                     type: string
 *                     enum: [root, staff, doctor, manager, patient]
 *                     example: "doctor"
 *                   birthDate:
 *                     type: string
 *                     format: date
 *                     example: "1990-01-01"
 *                   phoneNumber:
 *                     type: string
 *                     example: "+1234567890"
 *       400:
 *         description: Bad request - role query parameter is required
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
router.get("/role", GetAccountsByRole);
export default router;