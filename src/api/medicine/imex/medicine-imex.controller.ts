import { Request, Response, NextFunction } from "express";
import {
  getImexLogsService,
  createImexLogService,
  updateImexLogService,
  deleteImexLogService,
  getImexByIdService,
} from "./medicine-imex.service.js";
import type { ImexType } from "../../../generated/prisma/index.js";
import type { GetImexLogsQuery } from "../../../schema/medicine-imex.schema.js";

export const getImexLogs = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { type, from, to, page, pageSize } = res.locals.query as GetImexLogsQuery;
    const fromDate = from ? new Date(from) : undefined;
    const toDate = to ? new Date(to) : undefined;

    const result = await getImexLogsService(
      type as ImexType | undefined,
      fromDate,
      toDate,
      page,
      pageSize
    );

    return res.status(200).json({
      message: "Imex logs retrieved successfully",
      data: result.data,
      pagination: {
        currentPage: result.currentPage,
        pageSize: result.pageSize,
        totalItems: result.totalItems,
        totalPages: result.totalPages,
      },
    });
  } catch (error) {
    next(error);
  }
};

const createImexLogForCurrentPharmacist = async (
  req: Request,
  res: Response,
  next: NextFunction,
  successMessage: string
) => {
  try {
    const pharmacistID = req.user?.id;

    if (!pharmacistID) {
      return res.status(401).json({
        message: "Unauthorized",
      });
    }

    const { imexType, value, note, items } = req.body;

    const imexLog = await createImexLogService({
      imexType,
      pharmacistID,
      value,
      note,
      items,
    });

    return res.status(201).json({
      message: successMessage,
      data: imexLog,
    });
  } catch (error) {
    next(error);
  }
};

export const createImexLog = async (
  req: Request,
  res: Response,
  next: NextFunction
) => createImexLogForCurrentPharmacist(req, res, next, "Imex log created successfully");

export const createManyImexLog = async (
  req: Request,
  res: Response,
  next: NextFunction
) => createImexLogForCurrentPharmacist(req, res, next, "Imex log created successfully");

export const getImexById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id: imexID } = req.params;

    const imexLog = await getImexByIdService(imexID as string);

    if (!imexLog) {
      return res.status(404).json({ message: "Imex log not found" });
    }

    return res.status(200).json({
      message: "Imex log retrieved successfully",
      data: imexLog,
    });
  } catch (error) {
    next(error);
  }
};

export const updateImexLog = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id: imexID } = req.params;
    const { value, note, items } = req.body;

    const imexLog = await updateImexLogService(imexID as string, {
      value,
      note,
      items,
    });

    return res.status(200).json({
      message: "Imex log updated successfully",
      data: imexLog,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteImexLog = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id: imexID } = req.params;

    await deleteImexLogService(imexID as string);

    return res.status(200).json({
      message: "Imex log deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};
