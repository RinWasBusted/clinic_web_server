import { Router, type Request, type Response } from "express";
import authRoutes from "./auth/auth.route.js";
import adminAccountRoutes from "./admin/account/account.route.js";
import roleRoutes from "./user/user.route.js";
import facyltyRoutes from "./admin/Faculty/faculty.route.js"
import RoomRoutes  from "./admin/room/room.route.js"
import TimetableRoutes from "./admin/timetable/timetable.route.js"
import AppointmentRoutes from "./admin/appointment/appoint.route.js"
const router = Router();

router.get("/", (req: Request, res: Response) => {
  res.json({ message: "Welcome to the API" });
});
router.use("/auth",authRoutes);
router.use("/user",roleRoutes);
router.use("/admin/account",adminAccountRoutes);
router.use("/admin/faculty",facyltyRoutes)
router.use("/admin/room",RoomRoutes)
router.use("/admin/timetables",TimetableRoutes)
router.use("/admin/appointments", AppointmentRoutes)
export default router;
