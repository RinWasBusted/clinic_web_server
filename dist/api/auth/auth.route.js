import { Router } from "express";
import { loginUser, register } from "./auth.controller.js";
import { verifyAccessToken } from "./verifyToken.js";
const router = Router();
/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: User login
 *     description: Authenticate user with email and password
 *     tags:
 *       - Authentication
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: "user@example.com"
 *               password:
 *                 type: string
 *                 example: "password123"
 *             required:
 *               - email
 *               - password
 *     responses:
 *       200:
 *         description: Login successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 user:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                     role:
 *                       type: string
 *       401:
 *         description: Invalid credentials
 *       500:
 *         description: Internal server error
 */
router.post("/login", loginUser);
/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Register a new user (Admin only)
 *     description: Allows admin to register a new user account
 *     tags:
 *       - Authentication
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
router.post("/register", verifyAccessToken, register);
export default router;
//# sourceMappingURL=auth.route.js.map