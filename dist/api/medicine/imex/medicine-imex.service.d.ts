import type { ImexType } from "../../../generated/prisma/index.js";
interface AddImexItemsInput {
    medicineID: number;
    quantity: number;
    note?: string;
}
interface CreateImexInput {
    imexType: ImexType;
    accountID: string;
    value?: number;
    note?: string;
    items: AddImexItemsInput[];
}
export declare const getImexLogsService: (type?: ImexType, fromDate?: Date, toDate?: Date, page?: number, pageSize?: number) => Promise<{
    data: {
        account: {
            accountID: string;
            firstName: string;
            lastName: string;
            email: string;
        };
        createdAt: Date;
        note: string | null;
        imexID: string;
        imexType: import("../../../generated/prisma/index.js").$Enums.ImexType;
        value: import("@prisma/client-runtime-utils").Decimal | null;
    }[];
    currentPage: number;
    pageSize: number;
    totalItems: number;
    totalPages: number;
}>;
export declare const createImexLogService: (data: CreateImexInput) => Promise<{
    accountID: string;
    createdAt: Date;
    note: string | null;
    details: {
        medicine: {
            price: import("@prisma/client-runtime-utils").Decimal;
            medicineName: string;
            unit: import("../../../generated/prisma/index.js").$Enums.MedicineUnit;
        };
        note: string | null;
        medicineID: number;
        quantity: number;
    }[];
    imexID: string;
    imexType: import("../../../generated/prisma/index.js").$Enums.ImexType;
    value: import("@prisma/client-runtime-utils").Decimal | null;
} | null>;
export declare const updateImexLogService: (imexID: string, data: Partial<CreateImexInput>) => Promise<{
    accountID: string;
    createdAt: Date;
    note: string | null;
    details: {
        medicine: {
            price: import("@prisma/client-runtime-utils").Decimal;
            medicineName: string;
            unit: import("../../../generated/prisma/index.js").$Enums.MedicineUnit;
        };
        note: string | null;
        medicineID: number;
        quantity: number;
    }[];
    imexID: string;
    imexType: import("../../../generated/prisma/index.js").$Enums.ImexType;
    value: import("@prisma/client-runtime-utils").Decimal | null;
} | null>;
export declare const deleteImexLogService: (imexID: string) => Promise<{
    message: string;
}>;
export declare const getImexByIdService: (imexID: string) => Promise<{
    imexID: string;
    imexType: import("../../../generated/prisma/index.js").$Enums.ImexType;
    account: {
        id: string;
        name: string;
    };
    value: import("@prisma/client-runtime-utils").Decimal | null;
    createdAt: Date;
    note: string | null;
    details: {
        medicine: {
            price: import("@prisma/client-runtime-utils").Decimal;
            medicineName: string;
            unit: import("../../../generated/prisma/index.js").$Enums.MedicineUnit;
        };
        note: string | null;
        medicineID: number;
        quantity: number;
    }[];
} | null>;
export {};
//# sourceMappingURL=medicine-imex.service.d.ts.map