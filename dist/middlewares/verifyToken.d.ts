import type { Request, Response, NextFunction } from "express";
export declare function verifyAccessToken(req: Request, res: Response, next: NextFunction): Promise<void | Response<any, Record<string, any>>>;
export declare const verifyRefreshToken: (req: Request, res: Response, next: NextFunction) => Promise<void | Response<any, Record<string, any>>>;
//# sourceMappingURL=verifyToken.d.ts.map