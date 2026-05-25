import { PrismaClient } from "@prisma/client/extension";
import { ExamineStatus } from "../../../generated/prisma/index.js";

import prisma from "../../../utils/prisma.js";

type Client = typeof prisma | PrismaClient;
type ExamineLogPayload = {
  enterTicketID: string;
  patientID: string;
  symptoms: string;
  status: ExamineStatus;
  treatmentPlan: string;
  examinedBy: string;

  height?: number;
  weight?: number;
  bloodPressure?: string;

  diagnose: string | string[];
  note?: string;
};

/** Normalize diagnose to always be a string array.
 *  Handles: string[] → as-is | "J00, J01" → ["J00", "J01"] | undefined → [] */
function normalizeDiagnose(diagnose: string | string[] | undefined): string[] {
  if (!diagnose) return [];
  if (Array.isArray(diagnose)) return diagnose.map((d) => d.trim()).filter(Boolean);
  return diagnose
    .split(",")
    .map((d) => d.trim())
    .filter(Boolean);
}

class ExamineLogService {
  private readonly diseaseProjection = {
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
  };

  private readonly prescriptionProjection = {
    details: {
      select: {
        medicineID: true,
        medicine: {
          select: {
            medicineName: true,
          },
        },
        quantity: true,
        usage: true,
      },
    },
  };

  constructor(private prefix: string = "") {
    this.prefix = prefix;
  }

  generateDisplayID(sequence: number) {
    const yearString = new Date().getFullYear().toString().slice(-2);
    const sequenceString = sequence.toString().padStart(8, "0");
    return `${this.prefix}${yearString}${sequenceString}`;
  }

  async submit(payload: ExamineLogPayload, tx: Client = prisma) {
    const {
      enterTicketID,
      patientID,
      symptoms,
      status,
      examinedBy,
      note,
      treatmentPlan,
      height,
      weight,
      bloodPressure,
    } = payload;
    const diagnoseList = normalizeDiagnose(payload.diagnose);

    // Only get the examine log with ID and sequence. Used for further transactions
    const examineLite = await tx.examineLog.create({
      data: {
        enterTicketID,
        patientID,
        symptoms,
        status,
        examinedBy,
        note,
        treatmentPlan,
        height,
        weight,
        bloodPressure,
      },
      select: {
        examineID: true,
        sequence: true,
      },
    });

    // Add diagnose ID and display ID
    const examineID = examineLite.examineID;
    const diagnoseDetails = diagnoseList.map((diseaseID: string) => ({ examineID, diseaseID }));
    await tx.examineLogDetails.createMany({
      data: diagnoseDetails,
    });

    // Update examine log with display ID
    const examineDisplayID = this.generateDisplayID(examineLite.sequence);

    const newExamineLog = await tx.examineLog.update({
      where: { examineID },
      data: { examineDisplayID },
      include: { ...this.diseaseProjection },
      omit: {
        sequence: true,
      },
    });

    return newExamineLog;
  }
  private resolveClient(tx?: Client): Client {
    return tx ?? prisma;
  }
  async getExamineLogByID(examineID: string, isFull: boolean = false, tx?: Client) {
    if (!isFull) {
      return await this.resolveClient(tx).examineLog.findUnique({
        where: { examineID },
        include: {
          ...this.diseaseProjection,
        },
        omit: { sequence: true },
      });
    } else {
      // Get full with prescription
      const raw = await this.resolveClient(tx).prescription.findUnique({
        where: { examineID },
        include: {
          ...this.prescriptionProjection,
          examine: {
            omit: { sequence: true },
            include: {
              ...this.diseaseProjection,
            },
          },
        },
      });

      return {
        ...raw?.examine,
        prescription: raw
          ? {
              details: raw.details,
              totalTreatmentDays: raw.totalTreatmentDays,
              needReExamine: raw.needReExamine,
            }
          : null,
      };
    }
  }

  async getExamineLogByTicketID(enterTicketID: string) {
    return await prisma.examineLog.findFirst({
      where: { enterTicketID },
      include: { ...this.diseaseProjection },
      omit: { sequence: true },
    });
  }

  async updateExamineLog(examineID: string, payload: Partial<ExamineLogPayload>) {
    const { symptoms, status, note, treatmentPlan } = payload;
    const updatedExamineLog = await prisma.$transaction(async (tx) => {
      // If diagnose is provided, delete all old diagnose and create new ones
      if (payload.diagnose) {
        const diagnoseList = normalizeDiagnose(payload.diagnose);
        await tx.examineLogDetails.deleteMany({
          where: { examineID },
        });
        const diagnoseDetails = diagnoseList.map((diseaseID: string) => ({ examineID, diseaseID }));
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
          treatmentPlan,
        },
        include: {
          ...this.diseaseProjection,
        },
        omit: {
          sequence: true,
        },
      });
      return examineLog;
    });
    return updatedExamineLog;
  }

  /* beautifyExamineLog(examineLog: ObjectType): ObjectType | null {
    const rawDetails = examineLog.details;
    if (rawDetails && Array.isArray(rawDetails)) {
      const details = rawDetails.map((detail: unknown) => {
        const flattenedDetail: RecordType = _o.flatten(detail as RecordType);
        return _o.killPrefix(flattenedDetail, "disease");
      });
      const newExamineLog: ObjectType = { ...examineLog, details };
      return newExamineLog;
    }
    return null;
  }

  // Not yet finished
  async getPrintableExamineLog(examineID: string): Promise<ObjectType | null> {
    const examineLog = (await prisma.examineLog.findUnique({
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
    })) satisfies ObjectType | null;

    if (!examineLog) return null;
    return this.beautifyExamineLog(examineLog);
  } */
}

export default new ExamineLogService();
