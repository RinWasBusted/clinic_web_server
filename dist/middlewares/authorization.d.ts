import type { Request, Response, NextFunction } from "express";
/**
 * Middleware function that checks if the user has the required permissions. Expects the user's permissions to be stored in `req.user.permissions` as a string array.
 * Example usage:
 * ```typescript
 * app.get("/admin", authorization(["account.read"]), (req, res) => {
 *   res.send("Welcome, admin!");
 * }
 * ```
 * @param roleList `string[]` List of required permission. If empty, in default, is treated as no permission required.
 * @param partial `boolean` Check if they have any, or all permission listed in `roleList`
 */
export declare function authorization(roleList?: string[], partial?: boolean): (req: Request, res: Response, next: NextFunction) => void | Response<any, Record<string, any>>;
//# sourceMappingURL=authorization.d.ts.map