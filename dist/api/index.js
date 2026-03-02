import { Router } from "express";
import authRoutes from "./auth/auth.route.js";
import medicineRoutes from "./medicine/items/medicine-items.route.js";
const router = Router();
router.get("/", (req, res) => {
    res.json({ message: "Welcome to the API" });
});
router.use("/auth", authRoutes);
router.use("/medicine", medicineRoutes);
export default router;
//# sourceMappingURL=index.js.map