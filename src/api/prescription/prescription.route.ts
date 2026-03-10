import { Router } from "express";
import { verifyAccessToken } from "../../middlewares/verifyToken.js";
import { authorizeRoles } from "../../middlewares/role.js";
import {
  createPrescriptionHandler,
  deletePrescriptionHandler,
  getPrescriptionHandler,
  updateDoseHandler,
  updateLogHandler,
} from "./prescription.controller.js";
import { validateBody } from "../../middlewares/validate.js";
import prescriptionSchema from "../../schema/prescription.schema.js";
import { validateUpdateHandler } from "./prescription.middleware.js";

const PrescriptionRouter = Router();
PrescriptionRouter.use(verifyAccessToken, authorizeRoles("doctor"));

PrescriptionRouter.post("/new", validateBody(prescriptionSchema.new), createPrescriptionHandler);
PrescriptionRouter.put("/:id", validateBody(prescriptionSchema.update), validateUpdateHandler, updateLogHandler);
PrescriptionRouter.put(
  "/:id/details",
  validateBody(prescriptionSchema.updateDetails),
  validateUpdateHandler,
  updateDoseHandler
);
PrescriptionRouter.delete("/:id", deletePrescriptionHandler);
PrescriptionRouter.get("/:id", getPrescriptionHandler);

export default PrescriptionRouter;
