import type { Request, Response,  ErrorRequestHandler } from "express";
import { ZodError } from "zod";

type PrismaLikeError = {
  code?: string;
  meta?: unknown;
};

function isPrismaLikeError(err: unknown): err is PrismaLikeError {
  return typeof err === "object" && err !== null && "code" in err;
}

export const errorHandler: ErrorRequestHandler = (err: unknown, req: Request, res: Response) => {
  // Zod
  if (err instanceof ZodError) {
    return res.status(400).json({
      message: "Invalid input",
      errors: err.flatten(),
    });
  }
  if (isPrismaLikeError(err)) {
    if (err.code === "P2002") {
      return res.status(409).json({ message: "Duplicate resource" });
    }
    if (err.code === "P2025") {
      return res.status(404).json({ message: "Resource not found" });
    }
  }
  console.error(err);
  return res.status(500).json({ message: "Internal Server Error" });
};