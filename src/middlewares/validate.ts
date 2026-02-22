import type { Request, Response, NextFunction } from "express";
import type { ZodSchema } from "zod";
import type { ParamsDictionary } from "express-serve-static-core";
import type { ZodType } from "zod";
export const validateBody =
  (schema: ZodSchema) => (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.body);

    if (!result.success) {
      return res.status(400).json({
        message: "Invalid input",
        errors: result.error.flatten(),
      });
    }
    req.body = result.data;
    next();
  };
export const validateParams =
  <T extends ParamsDictionary>(schema: ZodType<T>) =>
  (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.params);

    if (!result.success) {
      return res.status(400).json({
        message: "Invalid URL parameters",
        errors: result.error.format(),
      });
    }

    req.params = result.data; // ✅ type-safe
    next();
  };