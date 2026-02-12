import { Router } from "express";
import { loginUser } from "./auth.controller.js";

const router = Router();

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: User login
 *     description: Authenticate user with username and password
 *     tags:
 *       - Authentication
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *                 example: "user@example.com"
 *               password:
 *                 type: string
 *                 example: "password123"
 *             required:
 *               - username
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

export default router;
