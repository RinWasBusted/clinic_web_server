import { Router } from "express";
import { validateBody } from "../../../middlewares/validate.js";
import examineLogSchema from "../../../schema/examineLog.schema.js";
import { authorizeRoles } from "../../../middlewares/role.js";
import { verifyAccessToken } from "../../../middlewares/verifyToken.js";
import {
  createExamineLogHandler,
  getExamineLogHandler,
  getPrintableExamineLogHandler,
  updateExamineLogHandler,
} from "./log.controller.js";

const examineLogRouter = Router();

examineLogRouter.use(verifyAccessToken);
examineLogRouter.get("/:id", authorizeRoles("doctor"), getExamineLogHandler);
examineLogRouter.post("/new", authorizeRoles("doctor"), validateBody(examineLogSchema.create), createExamineLogHandler);
examineLogRouter.put("/:id", authorizeRoles("doctor"), validateBody(examineLogSchema.update), updateExamineLogHandler);
examineLogRouter.get("/:id/print", authorizeRoles("doctor"), getPrintableExamineLogHandler);

export default examineLogRouter;
