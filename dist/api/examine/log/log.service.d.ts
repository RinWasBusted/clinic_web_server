import { ExamineStatus } from "../../../generated/prisma/index.js";
import { ObjectType } from "../../../utils/types/index.js";
type ExamineLogPayload = {
    appointmentID: string;
    patientID: string;
    symptoms: string;
    status: ExamineStatus;
    treatmentPlan: string;
    examinedBy: string;
    diagnose: string[];
    note?: string;
};
declare class ExamineLogService {
    private prefix;
    private readonly diseaseProjection;
    private readonly prescriptionProjection;
    constructor(prefix?: string);
    generateDisplayID(sequence: number): string;
    submit(payload: ExamineLogPayload): Promise<{
        details: {
            diseaseID: string;
        }[];
    } & {
        createdAt: Date;
        patientID: string;
        status: import("../../../generated/prisma/index.js").$Enums.ExamineStatus;
        note: string | null;
        appointmentID: string;
        examineID: string;
        symptoms: string;
        examinedBy: string;
        examineDisplayID: string | null;
        height: number | null;
        weight: number | null;
        blood: import("../../../generated/prisma/index.js").$Enums.BloodType | null;
        treatmentPlan: string | null;
        createdAtLocal: string | null;
    }>;
    getExamineLogByID(examineID: string, isFull?: boolean): Promise<({
        details: {
            diseaseID: string;
        }[];
    } & {
        createdAt: Date;
        patientID: string;
        status: import("../../../generated/prisma/index.js").$Enums.ExamineStatus;
        note: string | null;
        appointmentID: string;
        examineID: string;
        symptoms: string;
        examinedBy: string;
        examineDisplayID: string | null;
        height: number | null;
        weight: number | null;
        blood: import("../../../generated/prisma/index.js").$Enums.BloodType | null;
        treatmentPlan: string | null;
        createdAtLocal: string | null;
    }) | {
        prescription: {
            details: {
                medicine: {
                    medicineName: string;
                };
                medicineID: number;
                quantity: number;
                usage: string;
            }[];
            totalTreatmentDays: number;
            needReExamine: boolean;
        } | null;
        details?: {
            diseaseID: string;
        }[] | undefined;
        createdAt?: Date | undefined;
        patientID?: string | undefined;
        status?: import("../../../generated/prisma/index.js").$Enums.ExamineStatus | undefined;
        note?: string | null | undefined;
        appointmentID?: string | undefined;
        examineID?: string | undefined;
        symptoms?: string | undefined;
        examinedBy?: string | undefined;
        examineDisplayID?: string | null | undefined;
        height?: number | null | undefined;
        weight?: number | null | undefined;
        blood?: import("../../../generated/prisma/index.js").$Enums.BloodType | null | undefined;
        treatmentPlan?: string | null | undefined;
        createdAtLocal?: string | null | undefined;
    } | null>;
    updateExamineLog(examineID: string, payload: Partial<ExamineLogPayload>): Promise<{
        details: {
            diseaseID: string;
        }[];
    } & {
        createdAt: Date;
        patientID: string;
        status: import("../../../generated/prisma/index.js").$Enums.ExamineStatus;
        note: string | null;
        appointmentID: string;
        examineID: string;
        symptoms: string;
        examinedBy: string;
        examineDisplayID: string | null;
        height: number | null;
        weight: number | null;
        blood: import("../../../generated/prisma/index.js").$Enums.BloodType | null;
        treatmentPlan: string | null;
        createdAtLocal: string | null;
    }>;
    beautifyExamineLog(examineLog: ObjectType): ObjectType | null;
    getPrintableExamineLog(examineID: string): Promise<ObjectType | null>;
}
declare const _default: ExamineLogService;
export default _default;
//# sourceMappingURL=log.service.d.ts.map