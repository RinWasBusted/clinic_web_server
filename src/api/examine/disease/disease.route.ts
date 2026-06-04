import { Router } from "express";
import {
  findDiseaseByWords,
  searchDiseaseByName,
  createDisease,
  updateDisease,
  deleteDisease,
  getAllDiseases,
  getDiseaseById,
} from "./disease.controller.js";
import { verifyAccessToken } from "../../../middlewares/verifyToken.js";
import { authorization } from "../../../middlewares/authorization.js";

const diseaseRouter = Router();

/**
 * @swagger
 * tags:
 *   - name: Disease
 *     description: Disease catalog lookup for examine flows
 *
 * components:
 *   schemas:
 *     Disease:
 *       type: object
 *       properties:
 *         diseaseID:
 *           type: string
 *           maxLength: 5
 *           description: ICD-style disease code stored in the system
 *           example: J00
 *         diseaseName:
 *           type: string
 *           maxLength: 255
 *           description: Human-readable disease name
 *           example: Acute nasopharyngitis (common cold)
 *       required:
 *         - diseaseID
 *         - diseaseName
 *
 * /examine/disease/find:
 *   get:
 *     summary: Find diseases by code prefix
 *     description: |
 *       Returns up to 10 diseases whose `diseaseID` starts with the provided keyword.
 *       This is designed for quick typeahead lookup by disease code.
 *     tags:
 *       - Disease
 *     parameters:
 *       - in: query
 *         name: keyword
 *         required: true
 *         description: Disease code prefix to search (case-sensitive)
 *         schema:
 *           type: string
 *           minLength: 1
 *           example: J0
 *     responses:
 *       200:
 *         description: Matching diseases (or empty list when no matches)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: OK
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Disease'
 *             examples:
 *               found:
 *                 summary: Matches found
 *                 value:
 *                   message: OK
 *                   data:
 *                     - diseaseID: J00
 *                       diseaseName: Acute nasopharyngitis (common cold)
 *                     - diseaseID: J01
 *                       diseaseName: Acute sinusitis
 *               missingKeyword:
 *                 summary: Keyword is missing
 *                 value:
 *                   message: Must type a word
 *                   data: []
 *               noMatches:
 *                 summary: No matches for the keyword
 *                 value:
 *                   message: No disease matches!
 *                   data: []
 */
diseaseRouter.get("/find", verifyAccessToken, authorization(["ticket.update", "system.manage"]), findDiseaseByWords);

/**
 * @swagger
 * /examine/disease/search:
 *   get:
 *     summary: Search diseases by name keyword
 *     description: |
 *       Returns up to 10 diseases whose `diseaseName` contains the provided keyword.
 *       The search is case-insensitive and supports partial matching anywhere in the name.
 *     tags:
 *       - Disease
 *     parameters:
 *       - in: query
 *         name: keyword
 *         required: true
 *         description: Partial or full disease name to search (case-insensitive)
 *         schema:
 *           type: string
 *           minLength: 1
 *           example: nasopharyngitis
 *     responses:
 *       200:
 *         description: Matching diseases (or empty list when no matches)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: OK
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Disease'
 *             examples:
 *               found:
 *                 summary: Matches found
 *                 value:
 *                   message: OK
 *                   data:
 *                     - diseaseID: J00
 *                       diseaseName: Acute nasopharyngitis (common cold)
 *               missingKeyword:
 *                 summary: Keyword is missing
 *                 value:
 *                   message: Must type a keyword
 *                   data: []
 *               noMatches:
 *                 summary: No matches for the keyword
 *                 value:
 *                   message: No disease matches!
 *                   data: []
 */
diseaseRouter.get("/search", verifyAccessToken, authorization(["ticket.update", "system.manage"]), searchDiseaseByName);

/**
 * @swagger
 * /examine/disease:
 *   post:
 *     summary: Create a new disease
 *     description: Creates a new disease entry.
 *     tags:
 *       - Disease
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - diseaseID
 *               - diseaseName
 *             properties:
 *               diseaseID:
 *                 type: string
 *                 description: ICD-style disease code
 *               diseaseName:
 *                 type: string
 *                 description: Disease name
 *               note:
 *                 type: string
 *                 description: Optional notes
 *     responses:
 *       201:
 *         description: Disease created successfully
 *       400:
 *         description: Bad request
 */
diseaseRouter.post("/", verifyAccessToken, authorization(["system.manage"]), createDisease);

/**
 * @swagger
 * /examine/disease/{id}:
 *   put:
 *     summary: Update an existing disease
 *     description: Updates the name or notes of an existing disease.
 *     tags:
 *       - Disease
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The disease ID to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               diseaseName:
 *                 type: string
 *                 description: Updated disease name
 *               note:
 *                 type: string
 *                 description: Updated notes
 *     responses:
 *       200:
 *         description: Disease updated successfully
 *       400:
 *         description: Bad request
 *       404:
 *         description: Disease not found
 */
diseaseRouter.put("/:id", verifyAccessToken, authorization(["system.manage"]), updateDisease);

/**
 * @swagger
 * /examine/disease/{id}:
 *   delete:
 *     summary: Delete a disease
 *     description: Removes a disease from the system.
 *     tags:
 *       - Disease
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The disease ID to delete
 *     responses:
 *       200:
 *         description: Disease deleted successfully
 *       400:
 *         description: Bad request
 *       404:
 *         description: Disease not found
 */
diseaseRouter.delete("/:id", verifyAccessToken, authorization(["system.manage"]), deleteDisease);

/**
 * @swagger
 * /examine/disease:
 *   get:
 *     summary: Get all diseases
 *     description: Returns a paginated list of all active diseases.
 *     tags:
 *       - Disease
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Items per page
 *     responses:
 *       200:
 *         description: A paginated list of diseases
 */
diseaseRouter.get("/", verifyAccessToken, authorization(["ticket.update", "system.manage"]), getAllDiseases);

/**
 * @swagger
 * /examine/disease/{id}:
 *   get:
 *     summary: Get disease by ID
 *     description: Returns a single active disease by its ID.
 *     tags:
 *       - Disease
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The disease ID to fetch
 *     responses:
 *       200:
 *         description: Disease details
 *       404:
 *         description: Disease not found
 */
diseaseRouter.get("/:id", verifyAccessToken, authorization(["ticket.update", "system.manage"]), getDiseaseById);

export default diseaseRouter;
