import { Request, Response, NextFunction } from "express";
export declare const loginUser: (req: Request, res: Response, next: NextFunction) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const refreshTokens: (req: Request, res: Response, next: NextFunction) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const GetProfile: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const UpdateProfile: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const updatePassword: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const logout: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
//# sourceMappingURL=auth.controller.d.ts.map