import { Router } from "express";
import { createRecord, getPrintableVersionForExamineSummary } from "./summary.controller.js";
import { verifyAccessToken } from "../../../middlewares/verifyToken.js";
import { validateBody } from "../../../middlewares/validate.js";
import { recordSchema } from "./schema.js";

/**
 * @swagger
 * tags:
 *   - name: ExamineSummary
 *     description: Printable exam summary combining examine log + prescription
 *
 * components:
 *   schemas:
 *     ExamineSummaryDisease:
 *       type: object
 *       properties:
 *         diseaseID:
 *           type: string
 *           description: ICD-10 disease code
 *           example: J00
 *         diseaseName:
 *           type: string
 *           nullable: true
 *           example: Common cold
 *
 *     ExamineSummaryDiseaseDetail:
 *       type: object
 *       properties:
 *         disease:
 *           $ref: '#/components/schemas/ExamineSummaryDisease'
 *
 *     ExamineSummaryPatientAccount:
 *       type: object
 *       properties:
 *         fullName:
 *           type: string
 *           example: Nguyen Van A
 *         genderDisplay:
 *           type: string
 *           nullable: true
 *           example: Male
 *         age:
 *           type: integer
 *           nullable: true
 *           example: 35
 *         DisplayID:
 *           type: string
 *           nullable: true
 *           example: BN000123
 *         address:
 *           type: string
 *           nullable: true
 *           example: 123 Le Loi, District 1
 *
 *     ExamineSummaryPatient:
 *       type: object
 *       properties:
 *         account:
 *           $ref: '#/components/schemas/ExamineSummaryPatientAccount'
 *
 *     ExamineSummaryDoctor:
 *       type: object
 *       properties:
 *         fullName:
 *           type: string
 *           example: Dr. Tran B
 *
 *     ExamineSummaryPrescriptionDetail:
 *       type: object
 *       properties:
 *         quantity:
 *           type: integer
 *           nullable: true
 *           description: Quantity of this medicine in the prescription
 *           example: 10
 *         usage:
 *           type: string
 *           nullable: true
 *           description: Usage instructions
 *           example: Take after meals, twice daily
 *         note:
 *           type: string
 *           nullable: true
 *           example: Avoid alcohol
 *         medicine:
 *           type: object
 *           properties:
 *             medicineName:
 *               type: string
 *               example: Paracetamol 500mg
 *
 *     ExamineSummaryPrescription:
 *       type: object
 *       properties:
 *         payAmount:
 *           type: number
 *           nullable: true
 *           description: |
 *             Calculated payable amount for printable view. Only medicines with inventory quantity > 50
 *             are included in the calculation (current hardcoded business rule).
 *           example: 150000
 *         prescriptionDisplayID:
 *           type: string
 *           nullable: true
 *           example: KH2600000001
 *         details:
 *           type: array
 *           description: |
 *             Printable prescription items. Only medicines with inventory quantity > 50
 *             are included in this list.
 *           items:
 *             $ref: '#/components/schemas/ExamineSummaryPrescriptionDetail'
 *         needReExamine:
 *           type: boolean
 *           nullable: true
 *           example: false
 *         totalTreatmentDays:
 *           type: integer
 *           nullable: true
 *           example: 7
 *
 *     ExamineSummaryPrintable:
 *       type: object
 *       properties:
 *         createdAtLocal:
 *           type: string
 *           nullable: true
 *           description: Local date-time string
 *           example: "2026-05-25 09:30"
 *         patient:
 *           $ref: '#/components/schemas/ExamineSummaryPatient'
 *         doctor:
 *           $ref: '#/components/schemas/ExamineSummaryDoctor'
 *         details:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/ExamineSummaryDiseaseDetail'
 *         prescription:
 *           nullable: true
 *           $ref: '#/components/schemas/ExamineSummaryPrescription'
 *
 *     ExamineSummaryCreateRequest:
 *       type: object
 *       required:
 *         - examine
 *         - prescription
 *       properties:
 *         examine:
 *           type: object
 *           required:
 *             - enterTicketID
 *             - patientID
 *             - symptoms
 *             - status
 *             - treatmentPlan
 *           properties:
 *             enterTicketID:
 *               type: string
 *               format: uuid
 *               example: "b2c3d4e5-f6a7-8901-bcde-f12345678901"
 *             patientID:
 *               type: string
 *               format: uuid
 *               example: "c3d4e5f6-a7b8-9012-cdef-123456789012"
 *             symptoms:
 *               type: string
 *               maxLength: 255
 *               example: Mild fever and headache
 *             status:
 *               type: string
 *               enum: [draft, done]
 *               example: done
 *             diagnose:
 *               type: array
 *               description: List of ICD-10 disease codes
 *               items:
 *                 type: string
 *                 maxLength: 255
 *                 example: J00
 *             height:
 *               type: integer
 *               minimum: 1
 *               nullable: true
 *               example: 170
 *             weight:
 *               type: integer
 *               minimum: 1
 *               nullable: true
 *               example: 65
 *             bloodPressure:
 *               type: string
 *               maxLength: 20
 *               nullable: true
 *               example: 120/80
 *             note:
 *               type: string
 *               maxLength: 255
 *               nullable: true
 *               example: Patient has mild allergies
 *             treatmentPlan:
 *               type: string
 *               maxLength: 255
 *               example: Rest and follow prescription
 *         prescription:
 *           type: object
 *           required:
 *             - totalTreatmentDays
 *             - details
 *           properties:
 *             note:
 *               type: string
 *               maxLength: 255
 *               nullable: true
 *               example: Recheck after 7 days
 *             needReExamine:
 *               type: boolean
 *               nullable: true
 *               example: false
 *             totalTreatmentDays:
 *               type: integer
 *               minimum: 1
 *               example: 7
 *             details:
 *               type: array
 *               minItems: 1
 *               items:
 *                 type: object
 *                 required:
 *                   - medicineID
 *                   - usage
 *                 properties:
 *                   medicineID:
 *                     type: integer
 *                     example: 1
 *                   usage:
 *                     type: string
 *                     maxLength: 255
 *                     description: |
 *                       If usage is solely dose format (e.g. "take, morning 2 pills, evening 1 pill"),
 *                       quantity is auto-calculated from totalTreatmentDays. Otherwise quantity is required.
 *                     example: take, morning 2 pills, evening 1 pill
 *                   note:
 *                     type: string
 *                     maxLength: 255
 *                     nullable: true
 *                     example: After meals
 *                   quantity:
 *                     type: integer
 *                     nullable: true
 *                     description: Required if usage is free-form text
 *                     example: 21
 *             examineID:
 *               type: string
 *               format: uuid
 *               nullable: true
 *               description: Optional and ignored in this endpoint (auto-set from created examine log)
 *
 *     ExamineSummaryCreateResponse:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *           example: OK
 *         examine:
 *           $ref: '#/components/schemas/ExamineSummaryCreatedExamine'
 *         prescription:
 *           $ref: '#/components/schemas/ExamineSummaryCreatedPrescription'
 *
 *     ExamineSummaryCreatedDiseaseDetail:
 *       type: object
 *       properties:
 *         diseaseID:
 *           type: string
 *           example: J00
 *         disease:
 *           type: object
 *           properties:
 *             diseaseName:
 *               type: string
 *               example: Common cold
 *
 *     ExamineSummaryCreatedExamine:
 *       type: object
 *       properties:
 *         examineID:
 *           type: string
 *           format: uuid
 *           example: "a1b2c3d4-e5f6-7890-abcd-ef1234567890"
 *         examineDisplayID:
 *           type: string
 *           nullable: true
 *           example: KH2600000001
 *         enterTicketID:
 *           type: string
 *           format: uuid
 *         patientID:
 *           type: string
 *           format: uuid
 *         examinedBy:
 *           type: string
 *           format: uuid
 *         symptoms:
 *           type: string
 *           maxLength: 255
 *         status:
 *           type: string
 *           enum: [draft, done]
 *         createdAt:
 *           type: string
 *           format: date-time
 *         height:
 *           type: integer
 *           nullable: true
 *         weight:
 *           type: integer
 *           nullable: true
 *         bloodPressure:
 *           type: string
 *           nullable: true
 *         treatmentPlan:
 *           type: string
 *           nullable: true
 *         note:
 *           type: string
 *           nullable: true
 *         details:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/ExamineSummaryCreatedDiseaseDetail'
 *
 *     ExamineSummaryCreatedPrescriptionDetail:
 *       type: object
 *       properties:
 *         quantity:
 *           type: integer
 *           example: 14
 *         usage:
 *           type: string
 *           example: take, morning 2 pills, evening 1 pill
 *         medicine:
 *           type: object
 *           properties:
 *             medicineID:
 *               type: integer
 *               example: 1
 *             medicineName:
 *               type: string
 *               example: Paracetamol 500mg
 *             unit:
 *               type: string
 *               example: tablet
 *             price:
 *               type: number
 *               example: 5000
 *
 *     ExamineSummaryCreatedPrescription:
 *       type: object
 *       properties:
 *         prescriptionID:
 *           type: string
 *           format: uuid
 *         prescriptionDisplayID:
 *           type: string
 *           example: KH2600000001
 *         createdAt:
 *           type: string
 *           format: date-time
 *         createdAtLocal:
 *           type: string
 *           nullable: true
 *           example: "2026-05-25 09:30"
 *         note:
 *           type: string
 *           nullable: true
 *         needReExamine:
 *           type: boolean
 *           nullable: true
 *         totalTreatmentDays:
 *           type: integer
 *           example: 7
 *         details:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/ExamineSummaryCreatedPrescriptionDetail'
 */

/**
 * @swagger
 * /examine/summary/{id}:
 *   get:
 *     summary: Get printable examine summary by examine ID
 *     description: |
 *       Returns a printable summary of an examine log, including patient, doctor, diagnoses,
 *       and a filtered prescription view. On each request, `payAmount` is recalculated and
 *       prescription details are filtered to medicines with inventory quantity > 50
 *       (current hardcoded business rule).
 *       Response can contain `summary: null` when the record is not found.
 *     tags:
 *       - ExamineSummary
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Human-readable examine ID (display ID)
 *         example: "2600000001"
 *     responses:
 *       200:
 *         description: Printable summary retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 summary:
 *                   oneOf:
 *                     - $ref: '#/components/schemas/ExamineSummaryPrintable'
 *                     - type: 'null'
 *             example:
 *               summary:
 *                 createdAtLocal: "2026-05-25 09:30"
 *                 patient:
 *                   account:
 *                     fullName: "Nguyen Van A"
 *                     genderDisplay: "Male"
 *                     age: 35
 *                     DisplayID: "BN000123"
 *                     address: "123 Le Loi, District 1"
 *                 doctor:
 *                   fullName: "Dr. Tran B"
 *                 details:
 *                   - disease:
 *                       diseaseID: "J00"
 *                       diseaseName: "Common cold"
 *                 prescription:
 *                   payAmount: 150000
 *                   prescriptionDisplayID: "KH2600000001"
 *                   needReExamine: false
 *                   totalTreatmentDays: 7
 *                   details:
 *                     - quantity: 10
 *                       usage: "Take after meals, twice daily"
 *                       note: "Avoid alcohol"
 *                       medicine:
 *                         medicineName: "Paracetamol 500mg"
 *       400:
 *         description: Invalid path parameter
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ValidationError'
 *       401:
 *         description: Unauthorized - missing or invalid access token
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UnauthorizedError'
 *       404:
 *         description: Examine log not found
 *       500:
 *         description: Internal server error
 */

const SummaryRouter = Router();
SummaryRouter.use(verifyAccessToken);
SummaryRouter.get("/:id", getPrintableVersionForExamineSummary);

/**
 * @swagger
 * /examine/summary:
 *   post:
 *     summary: Create examine log and prescription in one request
 *     description: |
 *       Creates a new examine log and a linked prescription in a single transaction.
 *       `examinedBy` and `doctorID` are resolved from the access token and are not accepted
 *       from the request body. Any provided `prescription.examineID` is ignored and replaced
 *       with the newly created examine log ID.
 *       For medicine items with solely dose format usage, quantity is auto-calculated from
 *       `totalTreatmentDays`. Otherwise `quantity` must be provided.
 *     tags:
 *       - ExamineSummary
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ExamineSummaryCreateRequest'
 *           example:
 *             examine:
 *               enterTicketID: "b2c3d4e5-f6a7-8901-bcde-f12345678901"
 *               patientID: "c3d4e5f6-a7b8-9012-cdef-123456789012"
 *               symptoms: "Mild fever and headache"
 *               status: done
 *               diagnose: ["J00"]
 *               height: 170
 *               weight: 65
 *               bloodPressure: "120/80"
 *               note: "Patient has mild allergies"
 *               treatmentPlan: "Rest and follow prescription"
 *             prescription:
 *               totalTreatmentDays: 7
 *               needReExamine: false
 *               note: "Recheck after 7 days"
 *               details:
 *                 - medicineID: 1
 *                   usage: "take, morning 2 pills, evening 1 pill"
 *                 - medicineID: 2
 *                   usage: "Apply topically"
 *                   quantity: 7
 *     responses:
 *       201:
 *         description: Examine summary created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ExamineSummaryCreateResponse'
 *       400:
 *         description: Validation error for request body
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ValidationError'
 *       401:
 *         description: Unauthorized - missing or invalid access token
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UnauthorizedError'
 *       404:
 *         description: Related resources not found (enter ticket, patient, or disease)
 *       409:
 *         description: Duplicate resource
 *         content:
 *           application/json:
 *             example:
 *               message: Duplicate resource
 *       500:
 *         description: Internal server error
 */

SummaryRouter.post("/", validateBody(recordSchema), createRecord);
export default SummaryRouter;
