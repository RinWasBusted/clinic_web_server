import express from "express";
import apiRoutes from "./api/index.js";
import cors from "cors";
import { setupSwagger } from "./swagger.js";
import cookieParser from "cookie-parser";
const app = express();
const corsOptions = {
    origin: [
        'http://localhost:5173',
        'http://localhost:3000'
    ],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: [
        'Content-Type',
        'Authorization',
        'Origin',
        'X-Requested-With',
        'Accept'
    ],
    credentials: true,
    optionsSuccessStatus: 200,
    maxAge: 86400 // 24 hours
};
app.use(cors(corsOptions));
app.use(cookieParser());
app.get("/", (req, res) => {
    res.send("Server is running");
});
setupSwagger(app);
app.use(express.json()); //bật middleware parse JSON trước khi mount routes
app.use(express.urlencoded({ extended: true }));
app.use("/api/v1", apiRoutes);
export default app;
//# sourceMappingURL=server.js.map