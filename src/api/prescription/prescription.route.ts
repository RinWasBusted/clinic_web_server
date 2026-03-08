import { Router } from "express";
import { verifyAccessToken } from "../../middlewares/verifyToken.js";
import { authorizeRoles } from "../../middlewares/role.js";

const PrescriptionRouter = Router();
PrescriptionRouter.use(verifyAccessToken, authorizeRoles("doctor"));

export default PrescriptionRouter;
