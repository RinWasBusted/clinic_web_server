import type { ImexType } from "../../../generated/prisma/index.js";
interface AddImexItemsInput {
    medicineID: number;
    quantity: number;
    note?: string;
}
interface CreateImexInput {
    imexType: ImexType;
    pharmacistID: string;
    value?: number;
    note?: string;
    items: AddImexItemsInput[];
}
export declare const getImexLogsService: (type?: ImexType, fromDate?: Date, toDate?: Date) => Promise<{
    createdAt: Date;
    details: {
        quantity: number;
        medicineID: number;
        medicine: {
            medicineName: string;
            unit: import("../../../generated/prisma/index.js").$Enums.MedicineUnit;
            price: import("@prisma/client-runtime-utils").Decimal;
        };
        note: string | null;
    }[];
    imexID: string;
    imexType: import("../../../generated/prisma/index.js").$Enums.ImexType;
    pharmacistID: string;
    value: import("@prisma/client-runtime-utils").Decimal | null;
    note: string | null;
}[]>;
export declare const createImexLogService: (data: CreateImexInput) => Promise<{
    createdAt: Date;
    details: {
        quantity: number;
        medicineID: number;
        medicine: {
            medicineName: string;
            unit: import("../../../generated/prisma/index.js").$Enums.MedicineUnit;
            price: import("@prisma/client-runtime-utils").Decimal;
        };
        note: string | null;
    }[];
    imexID: string;
    imexType: import("../../../generated/prisma/index.js").$Enums.ImexType;
    pharmacistID: string;
    value: import("@prisma/client-runtime-utils").Decimal | null;
    note: string | null;
} | null>;
export declare const updateImexLogService: (imexID: string, data: Partial<CreateImexInput>) => Promise<{
    createdAt: Date;
    details: {
        quantity: number;
        medicineID: number;
        medicine: {
            medicineName: string;
            unit: import("../../../generated/prisma/index.js").$Enums.MedicineUnit;
            price: import("@prisma/client-runtime-utils").Decimal;
        };
        note: string | null;
    }[];
    imexID: string;
    imexType: import("../../../generated/prisma/index.js").$Enums.ImexType;
    pharmacistID: string;
    value: import("@prisma/client-runtime-utils").Decimal | null;
    note: string | null;
} | null>;
export declare const deleteImexLogService: (imexID: string) => Promise<{
    message: string;
}>;
export declare const getImexByIdService: (imexID: string) => import("../../../generated/prisma/index.js").Prisma.Prisma__ImexMedicineLogClient<{
    createdAt: Date;
    details: {
        quantity: number;
        medicineID: number;
        medicine: {
            medicineName: string;
            unit: import("../../../generated/prisma/index.js").$Enums.MedicineUnit;
            price: import("@prisma/client-runtime-utils").Decimal;
        };
        note: string | null;
    }[];
    imexID: string;
    imexType: import("../../../generated/prisma/index.js").$Enums.ImexType;
    pharmacistID: string;
    value: import("@prisma/client-runtime-utils").Decimal | null;
    note: string | null;
} | null, null, import("../../../generated/prisma/runtime/client.js").DefaultArgs, {
    adapter: import("@prisma/adapter-pg").PrismaPg;
}>;
export {};
//# sourceMappingURL=medicine-imex.service.d.ts.map