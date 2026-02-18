import { Router, type Request, type Response } from "express";
import authRoutes from "./auth/auth.route.js";
const router = Router();

router.get("/", (req: Request, res: Response) => {
  res.json({ message: "Welcome to the API" });
});
router.use("/auth",authRoutes);
export default router;
