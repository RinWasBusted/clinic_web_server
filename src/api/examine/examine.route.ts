import { Router } from "express";
import enterTicketRouter from "./ticket/ticket.route.js";
import examineLogRouter from "./log/log.route.js";

const examineRouter = Router();

examineRouter.use("/ticket", enterTicketRouter);

examineRouter.use("/", examineLogRouter);

export default examineRouter;
