import prisma from "../../utils/prisma.js";
import { PrismaClient } from "@prisma/client/extension";
interface PrescriptionItem {
    medicineID: number;
    usage: string;
    note?: string;
    quantity?: number;
}
interface PrescriptionType {
    examineID: string;
    doctorID: string;
    note?: string | null;
    needReExamine?: boolean;
    totalTreatmentDays: number;
    finishTreatmentDate: Date;
    details: PrescriptionItem[];
    deleteList?: number[];
}
type FindUniqueEnum = "RISK" | "LITE" | "INTERNAL";
interface FindUniqueType {
    onlyAllowDraft?: boolean;
    mode?: FindUniqueEnum;
}
type Client = typeof prisma | PrismaClient;
declare class PrescriptionService {
    constructor();
    static readonly prescriptionDetailLite: {
        quantity: boolean;
        usage: boolean;
        medicine: {
            select: {
                medicineID: boolean;
                medicineName: boolean;
                medicineImage: boolean;
                unit: boolean;
                price: boolean;
                quantity: boolean;
            };
        };
    };
    static readonly prescriptionDetailFull: {
        quantity: boolean;
        usage: boolean;
        medicine: {
            select: {
                medicineID: boolean;
                medicineName: boolean;
                medicineImage: boolean;
                unit: boolean;
                price: boolean;
                quantity: boolean;
            };
        };
    };
    static readonly prescriptionView: {
        prescriptionID: boolean;
        prescriptionDisplayID: boolean;
        createdAt: boolean;
        createdAtLocal: boolean;
        note: boolean;
        needReExamine: boolean;
        totalTreatmentDays: boolean;
    };
    static readonly prescriptionInternalView: {
        details: {
            select: {
                quantity: boolean;
                usage: boolean;
                medicine: {
                    select: {
                        medicineID: boolean;
                        medicineName: boolean;
                        medicineImage: boolean;
                        unit: boolean;
                        price: boolean;
                        quantity: boolean;
                    };
                };
            };
        };
        prescriptionID: boolean;
        prescriptionDisplayID: boolean;
        createdAt: boolean;
        createdAtLocal: boolean;
        note: boolean;
        needReExamine: boolean;
        totalTreatmentDays: boolean;
    };
    private resolveClient;
    private findByID;
    private calculateTotalDose;
    private renderDoseList;
    refinePrescriptionData(data: PrescriptionType): Promise<{
        examineID: string;
        doctorID: string | undefined;
        details: {
            medicineID: number;
            usage: string;
            note?: string;
            quantity?: number;
        }[];
        totalTreatmentDays: number;
        note?: string | null;
        needReExamine?: boolean;
        finishTreatmentDate: Date;
        deleteList?: number[];
    }>;
    getPrescriptionByID(prescriptionID: string, tx?: Client, options?: FindUniqueType): Promise<any>;
    private upsertMany;
    private deleteMany;
    submit(refinedData: PrescriptionType): Promise<{
        createdAt: Date;
        createdAtLocal: string | null;
        note: string | null;
        details: {
            medicine: {
                price: import("@prisma/client-runtime-utils").Decimal;
                medicineID: number;
                medicineName: string;
                medicineImage: string | null;
                unit: import("../../generated/prisma/index.js").$Enums.MedicineUnit;
                quantity: number;
            };
            quantity: number;
            usage: string;
        }[];
        prescriptionID: string;
        prescriptionDisplayID: string | null;
        needReExamine: boolean;
        totalTreatmentDays: number;
    }>;
    isValidUpdate(payload: PrescriptionType): boolean;
    countMedicine(prescriptionID: string, tx?: Client): Promise<any>;
    update(prescriptionID: string, target: unknown, payload: PrescriptionType): Promise<{
        createdAt: Date;
        createdAtLocal: string | null;
        note: string | null;
        details: {
            medicine: {
                price: import("@prisma/client-runtime-utils").Decimal;
                medicineID: number;
                medicineName: string;
                medicineImage: string | null;
                unit: import("../../generated/prisma/index.js").$Enums.MedicineUnit;
                quantity: number;
            };
            quantity: number;
            usage: string;
        }[];
        prescriptionID: string;
        prescriptionDisplayID: string | null;
        needReExamine: boolean;
        totalTreatmentDays: number;
    }>;
    updateDetails(prescriptionID: string, target: unknown, payload: PrescriptionType): Promise<any>;
    deletePrescriptionByID(prescriptionID: string, tx?: Client, doctorID?: string): Promise<any>;
}
declare const _default: PrescriptionService;
export default _default;
//# sourceMappingURL=prescription.service.d.ts.map