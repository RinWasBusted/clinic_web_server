import type { Request, Response, NextFunction } from "express";
type AuthPayload = {
    id: string;
    email: string;
};
export interface AuthedRequest extends Request {
    user?: AuthPayload;
}
export declare function verifyAccessToken(req: AuthedRequest, res: Response, next: NextFunction): void | Response<any, Record<string, any>>;
export {};
//# sourceMappingURL=verifyToken.d.ts.map