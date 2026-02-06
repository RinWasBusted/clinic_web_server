import { Router } from "express";
import { loginUser, registerUser, verifyEmail, refreshToken } from "./auth.controller.js";

const router = Router();

router.post("/login", loginUser);
router.post("/register", registerUser);
router.post("/verify-email", verifyEmail);  
router.get("/refresh-token", refreshToken);

export default router;
