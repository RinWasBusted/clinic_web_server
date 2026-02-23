import type { Request, Response, NextFunction } from "express";
import jwt, { type JwtPayload } from "jsonwebtoken";

function mustGetEnv(name: string): string {
  const v = process.env[name];
  if (!v) throw new Error(`Missing ${name} in environment`);
  return v;
}

const JWT_SECRET = mustGetEnv("JWT_SECRET");

type AuthPayload = { id: string; email: string, role: string };

//tự tạo type Request có user
export interface AuthedRequest extends Request {
  user?: AuthPayload;
}

function isAuthPayload(p: unknown): p is AuthPayload {
  if (!p || typeof p !== "object") return false;
  const obj = p as Record<string, unknown>;
  return typeof obj.id === "string" && typeof obj.email === "string";
}

export function verifyAccessToken(req: Request, res: Response, next: NextFunction) {
  const token = req.cookies?.accessToken;
  if (!token) return res.status(401).json({ message: "Missing access token" });

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload | string;

    if (typeof decoded === "string" || !isAuthPayload(decoded)) {
      return res.status(401).json({ message: "Invalid token payload" });
    }

    req.user = { id: decoded.id, email: decoded.email, role: decoded.role };
    return next();
  } catch {
    return res.status(401).json({ message: "Invalid or expired access token" });
  }
}
