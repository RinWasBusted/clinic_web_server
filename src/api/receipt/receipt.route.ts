import { Router } from "express";
import { verifyAccessToken } from "../../middlewares/verifyToken.js";
import { getReceiptHandler } from "./receipt.controller.js";

const receiptRouter = Router();

receiptRouter.use(verifyAccessToken);

receiptRouter.get("/", getReceiptHandler);
receiptRouter.get("/prescription/:prescriptionID", getReceiptHandler);
receiptRouter.get("/:appointmentID", getReceiptHandler);

export default receiptRouter;
