import { Router } from "express";
import { verifyAccessToken } from "../../../middlewares/verifyToken.js";
import { validateBody, validateParams } from "../../../middlewares/validate.js";
import { deleteAccountParamsSchema, registerSchema } from "../../../schema/auth.schema.js";
import { deleteAccount, register } from "./account.controller.js";
const router = Router();
/**
 * @swagger
 * /admin/account/{id}:
 *   delete:
 *     summary: Delete user account
 *     description: Delete a user account by ID. Only manager or staff can delete accounts. Manager can delete any account except root. Staff can only delete patient accounts.
 *     tags:
 *       - Admin/Account
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: The ID of the account to delete
 *     responses:
 *       200:
 *         description: Account deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Account deleted successfully"
 *       400:
 *         description: Bad request (e.g., trying to delete own account)
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden (insufficient permissions or trying to delete protected account)
 *       404:
 *         description: Account not found
 *       500:
 *         description: Internal server error
 */
router.delete("/:id",verifyAccessToken, validateParams(deleteAccountParamsSchema), deleteAccount)
/**
 * @swagger
 * /admin/account/register:
 *   post:
 *     summary: Register a new user (Admin only)
 *     description: Allows admin to register a new user account
 *     tags:
 *       - Admin/Account
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               firstName:
 *                 type: string
 *                 example: "John"
 *               lastName:
 *                 type: string
 *                 example: "Doe"
 *               role:
 *                 type: string
 *                 example: "user"
 *               email:
 *                 type: string
 *                 example: "john.doe@example.com"
 *               birthDate:
 *                 type: string
 *                 format: date
 *                 example: "1990-01-01"
 *               phoneNumber:
 *                 type: string
 *                 example: "+1234567890"
 *             required:
 *               - firstName
 *               - lastName
 *               - role
 *               - email
 *               - birthDate
 *               - phoneNumber
 *     responses:
 *       201:
 *         description: User registered successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Only admin can register
 *       500:
 *         description: Internal server error
 */
router.post("/register",verifyAccessToken,validateBody(registerSchema),register);
export default router;