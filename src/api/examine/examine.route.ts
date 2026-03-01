import { Router } from "express";
import enterTicketRouter from "./ticket/ticket.route.js";

const examineRouter = Router();

examineRouter.use("/ticket", enterTicketRouter);

export default examineRouter;
