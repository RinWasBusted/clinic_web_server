import { Router } from "express";
import { validateBody } from "../../../middlewares/validate.js";
import { registerManySchema, registerSchema, UpdateAccountSchema } from "../../../schema/auth.schema.js";
import { deleteAccount, DeleteManyAccounts, GetAllAccounts, GetProfile, register, registerMany, updateAvatar, updatePassword, UpdateProfile } from "./account.controller.js";
import { verifyAccessToken } from "../../../middlewares/verifyToken.js";
import { authorizeRoles, checkRole} from "../../../middlewares/role.js";
import { validateActiveAccount } from "../../../middlewares/acctive.middleware.js";
import upload from "../../../utils/multer.js";
const router = Router();
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
/**
 * @swagger
 * /admin/account/register-many:
 *   post:
 *     summary: Register multiple users at once (Admin only)
 *     description: Allows admin to register multiple user accounts in a single request. Returns details of successful and failed registrations.
 *     tags:
 *       - Admin/Account
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: array
 *             items:
 *               type: object
 *               required:
 *                 - firstName
 *                 - lastName
 *                 - role
 *                 - email
 *                 - birthDate
 *                 - phoneNumber
 *               properties:
 *                 firstName:
 *                   type: string
 *                 lastName:
 *                   type: string
 *                 role:
 *                   type: string
 *                 email:
 *                   type: string
 *                 birthDate:
 *                   type: string
 *                   format: date
 *                 phoneNumber:
 *                   type: string
 *           example:
 *             - firstName: "John"
 *               lastName: "Doe"
 *               role: "doctor"
 *               email: "john.hdoe@example.com"
 *               birthDate: "1990-01-01"
 *               phoneNumber: "+1234567890"
 *             - firstName: "John"
 *               lastName: "Doe"
 *               role: "doctor"
 *               email: "john.hoe@example.com"
 *               birthDate: "1990-01-01"
 *               phoneNumber: "+1234567890"
 *     responses:
 *       200:
 *         description: Bulk registration completed with success and failure details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Register many completed"
 *                 requestedCount:
 *                   type: integer
 *                   example: 5
 *                 successCount:
 *                   type: integer
 *                   example: 4
 *                 failedCount:
 *                   type: integer
 *                   example: 1
 *                 success:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       index:
 *                         type: integer
 *                       email:
 *                         type: string
 *                 failed:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       index:
 *                         type: integer
 *                       email:
 *                         type: string
 *                       reason:
 *                         type: string
 *                         enum: ["DUPLICATE_UNIQUE", "PRISMA_P2003", "INVALID_DATA"]
 *       400:
 *         description: Bad request - Invalid data format
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Only admin can register
 *       500:
 *         description: Internal server error
 */
router.post("/register-many", verifyAccessToken, validateBody(registerManySchema),registerMany)
/**
 * @swagger
 * /admin/account:
 *   get:
 *     summary: Get all accounts
 *     description: Retrieve a list of all user accounts. Only authorized admin users can access this endpoint.
 *     tags:
 *       - Admin/Account
 *     security:
 *       - bearerAuth: []
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
 *                     example: "doctor"
 *                   birthDate:
 *                     type: string
 *                     format: date
 *                     example: "1990-01-01"
 *                   phoneNumber:
 *                     type: string
 *                     example: "+1234567890"
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
router.get("",verifyAccessToken,authorizeRoles("manager", "staff"),GetAllAccounts)

/**
 * @swagger
 * /admin/account/profile/{id}:
 *   get:
 *     summary: Get user profile
 *     description: Retrieve the profile information of a specific user account
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
 *         description: The ID of the account to retrieve
 *     responses:
 *       200:
 *         description: Profile retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 user:
 *                   type: object
 *                   properties:
 *                     accountID:
 *                       type: string
 *                       format: uuid
 *                       example: "550e8400-e29b-41d4-a716-446655440000"
 *                     email:
 *                       type: string
 *                       example: "user@example.com"
 *                     firstName:
 *                       type: string
 *                       example: "John"
 *                     lastName:
 *                       type: string
 *                       example: "Doe"
 *                     role:
 *                       type: string
 *                       example: "doctor"
 *                     birthDate:
 *                       type: string
 *                       format: date
 *                       example: "1990-01-01"
 *                     phoneNumber:
 *                       type: string
 *                       example: "+1234567890"
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Account not found
 *       500:
 *         description: Internal server error
 */
router.get("/profile/:id", verifyAccessToken,checkRole, GetProfile)

/**
 * @swagger
 * /admin/account/update-profile/{id}:
 *   patch:
 *     summary: Update user profile
 *     description: Update profile information for a specific user account. Only manager or staff can update other users' profiles.
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
 *         description: The ID of the account to update
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
 *               birthDate:
 *                 type: string
 *                 format: date
 *                 example: "1990-01-01"
 *               phoneNumber:
 *                 type: string
 *                 example: "+1234567890"
 *     responses:
 *       200:
 *         description: Profile updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Profile updated successfully"
 *       400:
 *         description: Bad request - Invalid input
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - insufficient permissions
 *       404:
 *         description: Account not found
 *       500:
 *         description: Internal server error
 */
router.patch("/update-profile/:id", verifyAccessToken,checkRole, validateBody(UpdateAccountSchema),validateActiveAccount, UpdateProfile)
/**
 * @swagger
 * /admin/account/update-password/{id}:
 *   patch:
 *     summary: Update user password
 *     description: Update password for a specific user account. Only manager or staff can update other users' passwords.
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
 *         description: The ID of the account to update password for
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               newPassword:
 *                 type: string
 *                 example: "newpassword123"
 *             required:
 *               - newPassword
 *     responses:
 *       200:
 *         description: Password updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Password updated successfully"
 *       400:
 *         description: Bad request - Missing required fields
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - insufficient permissions
 *       404:
 *         description: Account not found
 *       500:
 *         description: Internal server error
 */
router.patch("/update-password/:id", verifyAccessToken, checkRole, updatePassword)

/**
 * @swagger
 * /admin/account/avatar/{id}:
 *   patch:
 *     summary: Update user avatar
 *     description: Upload and update user's profile avatar. Users can only update their own avatar. Requires multipart/form-data with an image file.
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
 *         description: The ID of the account to update avatar for
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               avatar:
 *                 type: string
 *                 format: binary
 *                 description: Image file for avatar (jpg, jpeg, png, webp)
 *             required:
 *               - avatar
 *     responses:
 *       200:
 *         description: Avatar updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Avatar updated successfully"
 *       400:
 *         description: Bad request - Missing or invalid file upload
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   enum: ["Bad Request: No file uploaded", "File size exceeds limit", "Invalid file type"]
 *       401:
 *         description: Unauthorized - User not authenticated
 *       403:
 *         description: Forbidden - Users can only update their own avatar
 *       404:
 *         description: Account not found
 *       500:
 *         description: Internal server error
 */
router.patch("/avatar/:id", verifyAccessToken, upload.single("avatar"), updateAvatar)

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

router.delete("/:id", verifyAccessToken,checkRole, deleteAccount)

/**
 * @swagger
 * /admin/account/delete-many:
 *   post:
 *     summary: Delete multiple accounts
 *     description: Delete multiple user accounts at once. Only manager or staff can delete accounts.
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
 *               ids:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: uuid
 *                 example: [
 *                   "550e8400-e29b-41d4-a716-446655440000",
 *                   "550e8400-e29b-41d4-a716-446655440001"
 *                 ]
 *             required:
 *               - ids
 *     responses:
 *       200:
 *         description: Accounts deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "3 accounts deleted successfully"
 *                 deletedCount:
 *                   type: integer
 *                   example: 3
 *       400:
 *         description: Bad request - Missing or invalid IDs
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - insufficient permissions
 *       500:
 *         description: Internal server error
 */
router.post("/delete-many", verifyAccessToken,checkRole, DeleteManyAccounts)
export default router;