import { NextFunction, Request, Response } from "express";
export declare const checkRole: (req: Request, res: Response, next: NextFunction) => Promise<Response<any, Record<string, any>> | undefined>;
/**
 * Authorize by permission codes (RBAC).
 * Replaces old authorizeRoles(...roleNames) which compared hardcoded role name strings.
 * Works with req.user.permissions populated by verifyToken middleware.
 *
 * Usage: authorizeRoles("account.read", "account.write")
 * By default checks if user has ANY of the listed permissions (partial=true).
 */
export declare const authorizeRoles: (...allowedPermissions: string[]) => (req: Request, res: Response, next: NextFunction) => Response<any, Record<string, any>> | undefined;
//# sourceMappingURL=role.d.ts.map