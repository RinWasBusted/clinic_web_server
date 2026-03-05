import { ExamineStatus } from "../../../generated/prisma/index.js";
import _o from "../../../utils/data/object.js";
import prisma from "../../../utils/prisma.js";

type ExamineLogPayload = {
  appointmentID: string;
  patientID: string;
  symptoms: string;
  status: ExamineStatus;
  examinedBy: string;
  diagnose: string[];
  note?: string;
};

class ExamineLogService {
  constructor(private prefix: string = "") {
    this.prefix = prefix;
  }

  generateDisplayID(sequence: number) {
    const yearString = new Date().getFullYear().toString().slice(-2);
    const sequenceString = sequence.toString().padStart(8, "0");
    return `${this.prefix}${yearString}${sequenceString}`;
  }

  async submit(payload: ExamineLogPayload) {
    const { appointmentID, patientID, symptoms, status, examinedBy, diagnose, note } = payload;
    const newExamineLog = await prisma.$transaction(async (tx) => {
      // Only get the examine log with ID and sequence. Used for further transactions
      const examineLite = await tx.examineLog.create({
        data: {
          appointmentID,
          patientID,
          symptoms,
          status,
          examinedBy,
          note,
        },
        select: {
          examineID: true,
          sequence: true,
        },
      });

      // Add diagnose ID and display ID
      const examineID = examineLite.examineID;
      const diagnoseDetails = diagnose.map((diseaseID: string) => ({ examineID, diseaseID }));
      await tx.examineLogDetails.createMany({
        data: diagnoseDetails,
      });

      // Update examine log with display ID
      const examineDisplayID = this.generateDisplayID(examineLite.sequence);

      const updatedExamineLog = await tx.examineLog.update({
        where: { examineID },
        data: { examineDisplayID },
        include: {
          details: {
            select: {
              diseaseID: true,
            },
          },
        },
        omit: {
          sequence: true,
        },
      });

      return updatedExamineLog;
    });
    return newExamineLog;
  }

  async getExamineLogByID(examineID: string) {
    const examineLog = await prisma.examineLog.findUnique({
      where: { examineID },
      include: {
        details: {
          select: {
            diseaseID: true,
          },
        },
      },
      omit: { sequence: true },
    });
    return examineLog;
  }

  async updateExamineLog(examineID: string, payload: Partial<ExamineLogPayload>) {
    const { symptoms, status, diagnose, note } = payload;
    const updatedExamineLog = await prisma.$transaction(async (tx) => {
      // If diagnose is provided, delete all old diagnose and create new ones
      if (diagnose) {
        await tx.examineLogDetails.deleteMany({
          where: { examineID },
        });
        const diagnoseDetails = diagnose.map((diseaseID: string) => ({ examineID, diseaseID }));
        await tx.examineLogDetails.createMany({
          data: diagnoseDetails,
        });
      }
      const examineLog = await tx.examineLog.update({
        where: { examineID },
        data: {
          symptoms,
          status,
          note,
        },
        include: {
          details: {
            select: {
              diseaseID: true,
            },
          },
        },
        omit: {
          sequence: true,
        },
      });
      return examineLog;
    });
    return updatedExamineLog;
  }

  beautifyExamineLog(examineLog: any) {
    const details = examineLog.details.map((detail: any) => {
      return _o.killPrefix(_o.flatten(detail), "disease");
    });
    const newExamineLog = { ...examineLog, details };
    return newExamineLog;
  }

  // Not yet finished
  async getPrintableExamineLog(examineID: string) {
    const examineLog = await prisma.examineLog.findUnique({
      where: { examineID },
      include: {
        details: {
          select: {
            diseaseID: true,
            disease: {
              select: {
                diseaseName: true,
              },
            },
          },
        },
      },
      omit: {
        sequence: true,
      },
    });

    if (!examineLog) return null;
    return this.beautifyExamineLog(examineLog);
  }
}

export default new ExamineLogService();
