import { Router } from "express";
import enterTicketRouter from "./ticket/ticket.route.js";
import examineLogRouter from "./log/log.route.js";

const ExamineRouter = Router();

ExamineRouter.use("/ticket", enterTicketRouter);

ExamineRouter.use("/", examineLogRouter);

export default ExamineRouter;
