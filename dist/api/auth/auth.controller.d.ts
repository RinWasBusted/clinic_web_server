import { Request, Response, NextFunction } from "express";
export declare const loginUser: (req: Request, res: Response, next: NextFunction) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const register: (req: Request, res: Response) => Response<any, Record<string, any>> | undefined;
//# sourceMappingURL=auth.controller.d.ts.map