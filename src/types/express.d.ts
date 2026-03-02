import "express";
import { Account, Room } from "../generated/prisma/index.js";

declare global {
  namespace Express {
    interface User {
      id: string;
      role?: string;
      email?: string;
    }
    interface Pagination {
      totalItems: number;
      totalPages: number;
      itemCount: number;
      currentPage: number;
    }
    interface Request {
      user?: User;
      currentRole?: string;
      id?: string;
      userAccount?: Account; 
      room?: Room;
    }

    interface Response {
      paginate: (data: unknown[], pagination: Pagination) => void;
    }
  }
}

export {};
