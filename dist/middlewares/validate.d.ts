import type { Request, Response, NextFunction } from "express";
import type { ZodSchema } from "zod";
import type { ParamsDictionary } from "express-serve-static-core";
import type { ZodType } from "zod";
import { z } from "zod";
export declare const validateBody: (schema: ZodSchema) => (req: Request, res: Response, next: NextFunction) => Response<any, Record<string, any>> | undefined;
export declare const validateParams: <T extends ParamsDictionary>(schema: ZodType<T>) => (req: Request, res: Response, next: NextFunction) => Response<any, Record<string, any>> | undefined;
export declare const validateQuery: <T extends z.ZodTypeAny>(schema: T) => (req: Request, res: Response, next: NextFunction) => Response<any, Record<string, any>> | undefined;
//# sourceMappingURL=validate.d.ts.map