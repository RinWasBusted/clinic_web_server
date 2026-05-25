import { Router } from "express";
import enterTicketRouter from "./ticket/ticket.route.js";
import examineLogRouter from "./log/log.route.js";
import diseaseRouter from "./disease/disease.route.js";
import PrescriptionRouter from "./prescription/prescription.route.js";
import SummaryRouter from "./summary/summary.route.js";

const ExamineRouter = Router();

ExamineRouter.use("/ticket", enterTicketRouter);

ExamineRouter.use("/disease", diseaseRouter);
ExamineRouter.use("/prescription", PrescriptionRouter);
ExamineRouter.use("/summary", SummaryRouter);
ExamineRouter.use("/", examineLogRouter);

export default ExamineRouter;
