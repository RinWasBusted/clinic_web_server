/**
 * @swagger
 * tags:
 *   name: Prescription
 *   description: Prescription management (doctor only)
 */
/**
 * @swagger
 * components:
 *   schemas:
 *     PrescriptionMedicineItem:
 *       type: object
 *       required:
 *         - medicineID
 *         - usage
 *       properties:
 *         medicineID:
 *           type: integer
 *           description: ID of the medicine
 *           example: 1
 *         usage:
 *           type: string
 *           maxLength: 255
 *           description: |
 *             Dosage instructions. Can be either:
 *             - Solely dose format: "uống, sáng 2 viên, chiều 1 viên" — quantity is auto-calculated from totalTreatmentDays
 *             - Free-form text — requires explicit `quantity` field
 *           example: "uống, sáng 2 viên, chiều 1 viên"
 *         note:
 *           type: string
 *           maxLength: 255
 *           description: Optional note for this medicine
 *           example: "Uống sau ăn"
 *         quantity:
 *           type: integer
 *           description: Total quantity (required when usage is free-form text)
 *           example: 30
 */
declare const PrescriptionRouter: import("express-serve-static-core").Router;
export default PrescriptionRouter;
//# sourceMappingURL=prescription.route.d.ts.map