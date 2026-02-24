import type { Request, Response, NextFunction } from "express";
import type { ZodSchema } from "zod";
import type { ParamsDictionary } from "express-serve-static-core";
import type { ZodType } from "zod";
import { z, ZodError } from "zod";
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
  export const validateQuery =
  <T extends z.ZodTypeAny>(schema: T) =>
  (req: Request, res: Response, next: NextFunction) => {
    try {
      const parsed = schema.parse(req.query);
      res.locals.query = parsed;
      next();
    } catch (err) {
      if (err instanceof ZodError) {
        return res.status(400).json({
          message: "Invalid query parameters",
          errors: err.flatten(),
        });
      }
      next(err);
    }
  };