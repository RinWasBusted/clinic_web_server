export declare const getMaxPatientsPerDay: () => Promise<number>;
export declare const getAppointmentsByDate: (dateStr: string) => Promise<({
    patient: {
        account: {
            firstName: string;
            lastName: string;
            birthDate: Date;
            gender: import("../../../generated/prisma/index.js").$Enums.Gender | null;
            address: string | null;
        };
    } & {
        patientID: string;
        previousRecord: string | null;
        createdAtLocal: string | null;
    };
} & {
    createdAt: Date;
    roomID: string | null;
    patientID: string;
    status: import("../../../generated/prisma/index.js").$Enums.AppointmentStatus;
    appointmentID: string;
    appointmentDisplayID: string;
    appointmentType: import("../../../generated/prisma/index.js").$Enums.AppointmentType;
    scheduleDate: Date;
    approvedBy: string | null;
    doctorID: string | null;
    reason: string | null;
    depositStatus: import("../../../generated/prisma/index.js").$Enums.DepositStatus;
    createdAtLocal: string | null;
})[]>;
export declare const getExamineLogDetails: (examineId: string) => Promise<({
    patient: {
        account: {
            firstName: string;
            lastName: string;
        };
    } & {
        patientID: string;
        previousRecord: string | null;
        createdAtLocal: string | null;
    };
    prescription: ({
        details: ({
            medicine: {
                createdAt: Date;
                description: string | null;
                price: import("@prisma/client-runtime-utils").Decimal;
                medicineID: number;
                medicineName: string;
                medicineImage: string | null;
                unit: import("../../../generated/prisma/index.js").$Enums.MedicineUnit;
                quantity: number;
                createdAtLocal: string | null;
            };
        } & {
            note: string | null;
            medicineID: number;
            quantity: number;
            prescriptionID: string;
            usage: string;
            createdAtLocal: string | null;
        })[];
    } & {
        createdAt: Date;
        patientID: string | null;
        status: import("../../../generated/prisma/index.js").$Enums.PrescriptionStatus;
        note: string | null;
        doctorID: string;
        examineID: string;
        prescriptionID: string;
        prescriptionDisplayID: string | null;
        pharmacistID: string | null;
        payAmount: import("@prisma/client-runtime-utils").Decimal | null;
        needReExamine: boolean;
        totalTreatmentDays: number;
        createdAtLocal: string | null;
    }) | null;
    details: ({
        disease: {
            note: string | null;
            diseaseID: string;
            diseaseName: string;
            createdAtLocal: string | null;
        };
    } & {
        note: string | null;
        diseaseID: string;
        examineID: string;
        createdAtLocal: string | null;
    })[];
} & {
    createdAt: Date;
    patientID: string;
    status: import("../../../generated/prisma/index.js").$Enums.ExamineStatus;
    note: string | null;
    appointmentID: string;
    examineID: string;
    symptoms: string;
    examinedBy: string;
    sequence: number;
    examineDisplayID: string | null;
    height: number | null;
    weight: number | null;
    blood: import("../../../generated/prisma/index.js").$Enums.BloodType | null;
    treatmentPlan: string | null;
    createdAtLocal: string | null;
}) | null>;
//# sourceMappingURL=report.service.d.ts.map