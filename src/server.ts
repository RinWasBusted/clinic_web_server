import express from "express";
import type { Request, Response } from "express";
import apiRoutes from "./api/index.js";
import { setupSwagger } from "./swagger.js";;
const app = express();

app.get("/", (req: Request, res: Response) => {
  res.send("Server is running");
});
setupSwagger(app);
app.use(express.json()); //bật middleware parse JSON trước khi mount routes
app.use(express.urlencoded({ extended: true }));
app.use("/api/v1", apiRoutes);
export default app;
