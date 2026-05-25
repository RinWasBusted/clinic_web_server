/**
 * @swagger
 * tags:
 *   - name: Examine
 *     description: Examine log management for patient examinations
 *
 * components:
 *   schemas:
 *     BloodType:
 *       type: string
 *       enum: [a, o, b, ab]
 *       nullable: true
 *       example: a
 *
 *     ExamineStatus:
 *       type: string
 *       enum: [draft, done]
 *       example: draft
 *
 *     ExamineDiseaseDetail:
 *       type: object
 *       properties:
 *         diseaseID:
 *           type: string
 *           maxLength: 5
 *           example: J00
 *         diseaseName:
 *           type: string
 *           nullable: true
 *           example: Cảm lạnh thông thường
 *
 *     ExamineLogBase:
 *       type: object
 *       properties:
 *         examineID:
 *           type: string
 *           format: uuid
 *           example: a1b2c3d4-e5f6-7890-abcd-ef1234567890
 *         examineDisplayID:
 *           type: string
 *           nullable: true
 *           example: KH2600000001
 *         appointmentID:
 *           type: string
 *           format: uuid
 *           example: b2c3d4e5-f6a7-8901-bcde-f12345678901
 *         patientID:
 *           type: string
 *           format: uuid
 *           example: c3d4e5f6-a7b8-9012-cdef-123456789012
 *         examinedBy:
 *           type: string
 *           format: uuid
 *           example: d4e5f6a7-b8c9-0123-defa-234567890123
 *         symptoms:
 *           type: string
 *           maxLength: 255
 *           example: Đau đầu, sốt nhẹ
 *         status:
 *           $ref: '#/components/schemas/ExamineStatus'
 *         height:
 *           type: integer
 *           nullable: true
 *           example: 170
 *         weight:
 *           type: integer
 *           nullable: true
 *           example: 65
 *         blood:
 *           $ref: '#/components/schemas/BloodType'
 *         treatmentPlan:
 *           type: string
 *           nullable: true
 *           maxLength: 255
 *           example: Nghỉ ngơi, uống thuốc theo toa
 *         note:
 *           type: string
 *           nullable: true
 *           maxLength: 255
 *           example: Bệnh nhân dị ứng Penicillin
 *         createdAt:
 *           type: string
 *           format: date-time
 *           example: 2026-03-24T02:15:30.000Z
 *         details:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/ExamineDiseaseDetail'
 *
 *     PrescriptionDetail:
 *       type: object
 *       properties:
 *         medicineID:
 *           type: integer
 *           example: 12
 *         medicine:
 *           type: object
 *           properties:
 *             medicineName:
 *               type: string
 *               example: Paracetamol 500mg
 *         quantity:
 *           type: integer
 *           example: 10
 *         usage:
 *           type: string
 *           example: Uống sau ăn, ngày 2 lần
 *
 *     ExaminePrescriptionBundle:
 *       type: object
 *       nullable: true
 *       properties:
 *         details:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/PrescriptionDetail'
 *         totalTreatmentDays:
 *           type: integer
 *           nullable: true
 *           example: 5
 *         needReExamine:
 *           type: boolean
 *           nullable: true
 *           example: false
 *
 *     ExamineLogWithPrescription:
 *       allOf:
 *         - $ref: '#/components/schemas/ExamineLogBase'
 *         - type: object
 *           properties:
 *             prescription:
 *               $ref: '#/components/schemas/ExaminePrescriptionBundle'
 */
declare const examineLogRouter: import("express-serve-static-core").Router;
export default examineLogRouter;
//# sourceMappingURL=log.route.d.ts.map