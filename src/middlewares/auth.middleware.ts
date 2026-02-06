import { Request, Response, NextFunction } from "express";
import { JwtService } from "../jwtService.js";

export const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.header("authorization");
    const token = authHeader && authHeader.split(" ")[1];

    if (!token) {
        return res.status(401).json({ message: "Access token missing" });
    }
    
    try {
        const payload = JwtService.verifyToken(token);
        req.user = payload; 
        next();
    } catch {
        return res.status(403).json({ message: "Invalid or expired access token" });
    }
};