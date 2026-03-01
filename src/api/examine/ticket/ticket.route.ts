import { Router } from "express";
import { verifyAccessToken } from "../../../middlewares/verifyToken.js";
import { authorizeRoles } from "../../../middlewares/role.js";
import {
  generateNewTicket,
  getCurrentTicket,
  getNextTicket,
  updateEnterTicket,
  viewEnterTicket,
  viewWaitingList,
} from "./ticket.controller.js";
import { validateBody, validateQuery } from "../../../middlewares/validate.js";
import enterTicketSchema from "../../../schema/enterTicket.schema.js";

const enterTicketRouter = Router();

// Public API
enterTicketRouter.get("/current", validateQuery(enterTicketSchema.query), getCurrentTicket);

// Protected API
enterTicketRouter.use(verifyAccessToken);

// Only doctors can manage the ticket status and view the current ticket
enterTicketRouter.get("/next", authorizeRoles("doctor"), validateQuery(enterTicketSchema.query), getNextTicket);
enterTicketRouter.patch("/:id", authorizeRoles("doctor"), validateBody(enterTicketSchema.update), updateEnterTicket);
enterTicketRouter.get("/:id", authorizeRoles("doctor"), viewEnterTicket);

// Only staff can generate new tickets and view the waiting list
enterTicketRouter.post("/", authorizeRoles("staff"), validateBody(enterTicketSchema.new), generateNewTicket);

// Both staff and doctors can view the waiting list.
enterTicketRouter.get(
  "/",
  authorizeRoles("staff", "doctor"),
  validateQuery(enterTicketSchema.viewList),
  viewWaitingList
);

export default enterTicketRouter;
