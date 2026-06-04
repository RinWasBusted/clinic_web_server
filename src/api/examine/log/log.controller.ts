import type { Request, Response, NextFunction } from "express";
import ExamineLogService from "./log.service.js";
import { getExamineLogsByDate, getExamineLogsByKeyword } from "../../admin/report/report.service.js";
export async function createExamineLogHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const examinedBy = req.user?.id;
    const payload = { ...req.body, examinedBy };
    const result = await ExamineLogService.submit(payload);
    return res.json({ message: "Tạo mới hồ sơ khám bệnh thành công", data: result });
  } catch (error) {
    next(error);
  }
}

export async function getExamineLogHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const { id } = req.params;
    const result = await ExamineLogService.getExamineLogByID(id as string);
    return res.json({ examineLog: result });
  } catch (error) {
    next(error);
  }
}

export async function getExamineLogByTicketIDHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const { ticketID } = req.params;
    const result = await ExamineLogService.getExamineLogByTicketID(ticketID as string);
    return res.json({ examineLog: result });
  } catch (error) {
    next(error);
  }
}
export async function getExamineLogWithPrescriptionHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const { id } = req.params;
    const result = await ExamineLogService.getExamineLogByID(id as string, true);
    return res.json({ examineLog: result });
  } catch (error) {
    next(error);
  }
}
export async function updateExamineLogHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const { id } = req.params;
    const result = await ExamineLogService.updateExamineLog(id as string, req.body);
    return res.json({ message: "Đã cập nhật hồ sơ khám bệnh", data: result });
  } catch (error) {
    next(error);
  }
}

export async function getPrintableExamineLogHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const { id } = req.params;
    const result = await ExamineLogService.getPrintableExamineLog(id as string);
    return res.json({ examineLog: result });
  } catch (error) {
    next(error);
  }
}

export async function getPatientLookupHandler(req: Request, res: Response, next: NextFunction) {
  try {
      const { date, keyword } = req.query;
      let logs: any[] = [];
      
      if (keyword && typeof keyword === "string") {
          logs = await getExamineLogsByKeyword(keyword);
      } else if (date && typeof date === "string") {
          logs = await getExamineLogsByDate(date);
      } else {
          return res.status(400).json({ message: "Vui lòng cung cấp tham số 'date' hoặc 'keyword'" });
      }
      
      const data = logs.map((log, index) => {
          const account = log.patient.account;
          const fullName = `${account.firstName || ""} ${account.lastName || ""}`.trim();
          const predictedDiseases = log.details.map((d: any) => d.disease.diseaseName).join(", ");
          
          return {
              stt: index + 1,
              patientId: log.patient.patientID,
              examineLogId: log.examineID,
              fullName: fullName,
              date: log.createdAt.toISOString().split("T")[0],
              diseaseType: predictedDiseases,
              symptoms: log.symptoms
          };
      });

      return res.status(200).json({
          title: "Tra cứu bệnh án điện tử",
          date: date,
          totalPatients: data.length,
          data: data
      });
  } catch (error) {
      next(error);
  }
}

