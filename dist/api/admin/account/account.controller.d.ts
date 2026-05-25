import { Request, Response } from "express";
import { NextFunction } from "express-serve-static-core";
import { Empty, RegisterManyBody } from "../../../dtos/account.js";
export declare const register: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const registerMany: (req: Request<Empty, unknown, RegisterManyBody>, res: Response, next: NextFunction) => Promise<void | Response<any, Record<string, any>>>;
export declare const GetAllAccounts: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const GetProfile: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const UpdateProfile: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const updatePassword: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const updateAvatar: (req: Request, res: Response, next: NextFunction) => Promise<void | Response<any, Record<string, any>>>;
export declare const deleteAccount: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const DeleteManyAccounts: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
//# sourceMappingURL=account.controller.d.ts.map