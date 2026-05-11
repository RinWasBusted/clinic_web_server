import { Router } from "express";
import { verifyAccessToken } from "../../middlewares/verifyToken.js";
import { getAllPermissions } from "./permission.controller.js";

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Permission
 *   description: System permissions
 */

/**
 * @swagger
 * /admin/permission:
 *   get:
 *     summary: Get all system permissions
 *     tags: [Permission]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Success
 */
router.get("/", verifyAccessToken, getAllPermissions);

export default router;
