import { Router, type Request, type Response } from "express";
import authRoutes from "./auth/auth.route.js";
import adminAccountRoutes from "./admin/account/account.route.js";
const router = Router();

router.get("/", (req: Request, res: Response) => {
  res.json({ message: "Welcome to the API" });
});
router.use("/auth",authRoutes);
router.use("/account/admin",adminAccountRoutes);
export default router;
