import { Router } from "express";
import { addCache, deleteCache, getCache } from "./test.controller.js";
import { verifyAccessToken } from "../../middlewares/verifyToken.js";
import { authorization } from "../../middlewares/authorization.js";

const TestRouter = Router();

TestRouter.post("/add", addCache);
TestRouter.get("/get", getCache);
TestRouter.delete("/delete", deleteCache);

TestRouter.get("/only-prescription", verifyAccessToken, authorization(["medicine.view_all"]), (req, res) => {
  res.json({ message: "You have access to create prescriptions!", permissions: req.user?.permissions });
});

export default TestRouter;
