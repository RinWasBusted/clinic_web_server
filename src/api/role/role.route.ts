import { Router } from "express";
import { verifyAccessToken } from "../../middlewares/verifyToken.js";
import { validateBody, validateParams } from "../../middlewares/validate.js";
import { createRoleSchema, updateRoleSchema, roleParamsSchema } from "../../schema/role.schema.js";
import {
  getAllRoles,
  getRoleById,
  createRole,
  updateRole,
  deleteRole,
} from "./role.controller.js";

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Role
 *   description: Role management operations
 */

/**
 * @swagger
 * /admin/role:
 *   get:
 *     summary: Get all roles
 *     tags: [Role]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Success
 */
router.get("/", verifyAccessToken, getAllRoles);

/**
 * @swagger
 * /admin/role/{id}:
 *   get:
 *     summary: Get role by ID
 *     tags: [Role]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Success
 *       404:
 *         description: Role not found
 */
router.get("/:id", verifyAccessToken, validateParams(roleParamsSchema), getRoleById);

/**
 * @swagger
 * /admin/role:
 *   post:
 *     summary: Create a new role
 *     tags: [Role]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - roleName
 *             properties:
 *               roleName:
 *                 type: string
 *               roleDescription:
 *                 type: string
 *               permissionIDs:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: uuid
 *     responses:
 *       201:
 *         description: Role created successfully
 */
router.post("/", verifyAccessToken, validateBody(createRoleSchema), createRole);

/**
 * @swagger
 * /admin/role/{id}:
 *   patch:
 *     summary: Update a role
 *     tags: [Role]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               roleName:
 *                 type: string
 *               roleDescription:
 *                 type: string
 *               permissionIDs:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: uuid
 *     responses:
 *       200:
 *         description: Role updated successfully
 *       404:
 *         description: Role not found
 */
router.patch("/:id", verifyAccessToken, validateParams(roleParamsSchema), validateBody(updateRoleSchema), updateRole);

/**
 * @swagger
 * /admin/role/{id}:
 *   delete:
 *     summary: Delete a role
 *     tags: [Role]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Role deleted successfully
 */
router.delete("/:id", verifyAccessToken, validateParams(roleParamsSchema), deleteRole);

export default router;
