// Authorization Middleware: Replacement for role.ts, more flexible and can be used for other purposes.
// Suitable for RBAC.

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
export function authorization(roleList: string[] = [], partial: boolean = true) {
  return function (req: Request, res: Response, next: NextFunction) {
    // Expected the permissions to be stored in req.user.permissions, arrayed.
    const userPermissions = req.user?.permissions as string[] | undefined;
    if (!userPermissions) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    if (roleList.length > 0) {
      if (partial) {
        if (!roleList.some((role) => userPermissions.includes(role))) {
          return res.status(403).json({ message: "Forbidden" });
        }
      } else {
        if (!roleList.every((role) => userPermissions.includes(role))) {
          return res.status(403).json({ message: "Forbidden" });
        }
      }
    }

    return next();
  };
}
