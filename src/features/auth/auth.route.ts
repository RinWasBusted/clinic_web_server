import { Router } from "express";
import { loginUser, registerUser } from "./auth.controller.js";

const router = Router();

router.post("/login", loginUser);
router.post("/register", registerUser);

export default router;
