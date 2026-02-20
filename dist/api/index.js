import { Router } from "express";
import authRoutes from "./auth/auth.route.js";
const router = Router();
router.get("/", (req, res) => {
    res.json({ message: "Welcome to the API" });
});
router.use("/auth", authRoutes);
export default router;
//# sourceMappingURL=index.js.map