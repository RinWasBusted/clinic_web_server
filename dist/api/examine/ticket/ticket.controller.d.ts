import type { Request, Response, NextFunction } from "express";
export declare function generateNewTicket(req: Request, res: Response, next: NextFunction): Promise<void>;
export declare function viewWaitingList(req: Request, res: Response, next: NextFunction): Promise<Response<any, Record<string, any>> | undefined>;
export declare function viewEnterTicket(req: Request, res: Response, next: NextFunction): Promise<Response<any, Record<string, any>> | undefined>;
export declare function updateEnterTicket(req: Request, res: Response, next: NextFunction): Promise<Response<any, Record<string, any>> | undefined>;
export declare function getNextTicket(req: Request, res: Response, next: NextFunction): Promise<Response<any, Record<string, any>> | undefined>;
export declare function getCurrentTicket(req: Request, res: Response, next: NextFunction): Promise<Response<any, Record<string, any>> | undefined>;
//# sourceMappingURL=ticket.controller.d.ts.map