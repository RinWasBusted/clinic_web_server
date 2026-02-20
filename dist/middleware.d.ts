import { Request, Response, NextFunction } from 'express';
interface AuthenticatedRequest extends Request {
    payload?: unknown;
}
declare function notFound(req: Request, res: Response, next: NextFunction): void;
declare function errorHandler(err: Error, req: Request, res: Response, next: NextFunction): void;
declare function isAuthenticated(req: AuthenticatedRequest, res: Response, next: NextFunction): void;
export { notFound, errorHandler, isAuthenticated };
//# sourceMappingURL=middleware.d.ts.map