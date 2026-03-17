import { Router } from "express";
import { addCache, deleteCache, getCache } from "./test.controller.js";

const TestRouter = Router();

TestRouter.post("/add", addCache);
TestRouter.get("/get", getCache);
TestRouter.delete("/delete", deleteCache);

export default TestRouter;
