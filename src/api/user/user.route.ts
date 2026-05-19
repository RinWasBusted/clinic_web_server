import { Router } from "express";
import { GetAccountsByRole } from "./user.controller.js";
const router = Router();

/**
 * @swagger
 * tags:
 *   - name: User
 *     description: User lookup helpers
 *
 * components:
 *   schemas:
 *     UserAccountLite:
 *       type: object
 *       properties:
 *         accountID:
 *           type: string
 *           format: uuid
 *           description: Account unique identifier
 *           example: "550e8400-e29b-41d4-a716-446655440000"
 *         fullName:
 *           type: string
 *           description: Display name (Vietnamese format: LastName FirstName)
 *           example: "Nguyen Van A"
 *       required:
 *         - accountID
 *         - fullName
 */

/**
 * @swagger
 * /user/role:
 *   get:
 *     summary: Get accounts by role ID
 *     description: |
 *       Retrieve all user accounts assigned to a specific role.
 *       The `role` query parameter must be a role ID (UUID).
 *     tags:
 *       - User
 *     parameters:
 *       - in: query
 *         name: role
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Role ID to filter accounts by (e.g., ?role=550e8400-e29b-41d4-a716-446655440000)
 *         example: "550e8400-e29b-41d4-a716-446655440000"
 *     responses:
 *       200:
 *         description: Accounts retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 accounts:
 *                   type: array
 *                   items:
 *                     $ref: "#/components/schemas/UserAccountLite"
 *             examples:
 *               success:
 *                 summary: Accounts returned
 *                 value:
 *                   accounts:
 *                     - accountID: "550e8400-e29b-41d4-a716-446655440000"
 *                       fullName: "Nguyen Van A"
 *                     - accountID: "123e4567-e89b-12d3-a456-426614174000"
 *                       fullName: "Tran Thi B"
 *       400:
 *         description: Invalid role parameter
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Invalid role parameter"
 *       404:
 *         description: Role not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Role not found"
 *       500:
 *         description: Internal server error
 */
router.get("/role", GetAccountsByRole);
export default router;
