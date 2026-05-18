import { Prisma } from "../../../utils/prisma.js";
import type { MedicineUnit } from "../../../generated/prisma/index.js";
interface CreateMedicineInput {
    medicineName: string;
    unit: MedicineUnit;
    price: number;
    quantity?: number;
    description?: string;
    medicineImage?: string;
}
interface BulkCreateMedicineSuccessItem {
    index: number;
    medicineName: string;
}
interface BulkCreateMedicineFailedItem {
    index: number;
    medicineName: string;
    reason: string;
}
interface BulkCreateMedicineResult {
    requestCount: number;
    successCount: number;
    failedCount: number;
    success: BulkCreateMedicineSuccessItem[];
    failed: BulkCreateMedicineFailedItem[];
}
export declare const createMedicineService: (data: CreateMedicineInput) => import("../../../generated/prisma/runtime/client.js").DynamicModelExtensionFluentApi<Prisma.TypeMap<import("../../../generated/prisma/runtime/client.js").InternalArgs & {
    result: {
        account: {
            fullName: () => {
                needs: {
                    firstName: true;
                    lastName: true;
                };
                compute(account: {
                    firstName: string;
                    lastName: string;
                }): string;
            };
            genderDisplay: () => {
                needs: {
                    gender: true;
                };
                compute(account: {
                    gender: import("../../../generated/prisma/index.js").$Enums.Gender | null;
                }): "Nam" | "Nữ";
            };
            createdAtLocal: () => {
                needs: {
                    createdAt: true;
                };
                compute(model: any): string | null;
            };
        };
        $allModels: {
            createdAtLocal: () => {
                needs: {
                    createdAt: true;
                };
                compute(model: any): string | null;
            };
        };
        refreshToken: {
            createdAtLocal: () => {
                needs: {
                    createdAt: true;
                };
                compute(model: any): string | null;
            };
        };
        permission: {
            createdAtLocal: () => {
                needs: {
                    createdAt: true;
                };
                compute(model: any): string | null;
            };
        };
        role: {
            createdAtLocal: () => {
                needs: {
                    createdAt: true;
                };
                compute(model: any): string | null;
            };
        };
        rolePermission: {
            createdAtLocal: () => {
                needs: {
                    createdAt: true;
                };
                compute(model: any): string | null;
            };
        };
        accountWorkspace: {
            createdAtLocal: () => {
                needs: {
                    createdAt: true;
                };
                compute(model: any): string | null;
            };
        };
        patient: {
            createdAtLocal: () => {
                needs: {
                    createdAt: true;
                };
                compute(model: any): string | null;
            };
        };
        faculty: {
            createdAtLocal: () => {
                needs: {
                    createdAt: true;
                };
                compute(model: any): string | null;
            };
        };
        room: {
            createdAtLocal: () => {
                needs: {
                    createdAt: true;
                };
                compute(model: any): string | null;
            };
        };
        timetable: {
            createdAtLocal: () => {
                needs: {
                    createdAt: true;
                };
                compute(model: any): string | null;
            };
        };
        appointment: {
            createdAtLocal: () => {
                needs: {
                    createdAt: true;
                };
                compute(model: any): string | null;
            };
        };
        enterTicket: {
            createdAtLocal: () => {
                needs: {
                    createdAt: true;
                };
                compute(model: any): string | null;
            };
        };
        disease: {
            createdAtLocal: () => {
                needs: {
                    createdAt: true;
                };
                compute(model: any): string | null;
            };
        };
        examineLog: {
            createdAtLocal: () => {
                needs: {
                    createdAt: true;
                };
                compute(model: any): string | null;
            };
        };
        examineLogDetails: {
            createdAtLocal: () => {
                needs: {
                    createdAt: true;
                };
                compute(model: any): string | null;
            };
        };
        test: {
            createdAtLocal: () => {
                needs: {
                    createdAt: true;
                };
                compute(model: any): string | null;
            };
        };
        testLog: {
            createdAtLocal: () => {
                needs: {
                    createdAt: true;
                };
                compute(model: any): string | null;
            };
        };
        testDetails: {
            createdAtLocal: () => {
                needs: {
                    createdAt: true;
                };
                compute(model: any): string | null;
            };
        };
        medicine: {
            createdAtLocal: () => {
                needs: {
                    createdAt: true;
                };
                compute(model: any): string | null;
            };
        };
        prescription: {
            createdAtLocal: () => {
                needs: {
                    createdAt: true;
                };
                compute(model: any): string | null;
            };
        };
        prescriptionDetails: {
            createdAtLocal: () => {
                needs: {
                    createdAt: true;
                };
                compute(model: any): string | null;
            };
        };
        medicineTicket: {
            createdAtLocal: () => {
                needs: {
                    createdAt: true;
                };
                compute(model: any): string | null;
            };
        };
        imexMedicineLog: {
            createdAtLocal: () => {
                needs: {
                    createdAt: true;
                };
                compute(model: any): string | null;
            };
        };
        imexMedicineDetails: {
            createdAtLocal: () => {
                needs: {
                    createdAt: true;
                };
                compute(model: any): string | null;
            };
        };
        paymentHistory: {
            createdAtLocal: () => {
                needs: {
                    createdAt: true;
                };
                compute(model: any): string | null;
            };
        };
        medicineMonthReport: {
            createdAtLocal: () => {
                needs: {
                    createdAt: true;
                };
                compute(model: any): string | null;
            };
        };
        paymentMonthReport: {
            createdAtLocal: () => {
                needs: {
                    createdAt: true;
                };
                compute(model: any): string | null;
            };
        };
        notification: {
            createdAtLocal: () => {
                needs: {
                    createdAt: true;
                };
                compute(model: any): string | null;
            };
        };
        systemConfig: {
            createdAtLocal: () => {
                needs: {
                    createdAt: true;
                };
                compute(model: any): string | null;
            };
        };
    };
    model: {};
    query: {};
    client: {};
}, {}>, "Medicine", "create", never> & import("../../../generated/prisma/runtime/client.js").PrismaPromise<{
    description: string | null;
    price: Prisma.Decimal;
    medicineID: number;
    medicineName: string;
    medicineImage: string | null;
    unit: import("../../../generated/prisma/index.js").$Enums.MedicineUnit;
    quantity: number;
}>;
export declare const createManyMedicineService: (medicines: CreateMedicineInput[]) => Promise<BulkCreateMedicineResult>;
export declare const getMedicinesService: () => import("../../../generated/prisma/runtime/client.js").PrismaPromise<{
    createdAt: Date;
    description: string | null;
    price: Prisma.Decimal;
    medicineID: number;
    medicineName: string;
    medicineImage: string | null;
    unit: import("../../../generated/prisma/index.js").$Enums.MedicineUnit;
    quantity: number;
}[]>;
export declare const getMedicineByIdService: (medicineID: number) => import("../../../generated/prisma/runtime/client.js").DynamicModelExtensionFluentApi<Prisma.TypeMap<import("../../../generated/prisma/runtime/client.js").InternalArgs & {
    result: {
        account: {
            fullName: () => {
                needs: {
                    firstName: true;
                    lastName: true;
                };
                compute(account: {
                    firstName: string;
                    lastName: string;
                }): string;
            };
            genderDisplay: () => {
                needs: {
                    gender: true;
                };
                compute(account: {
                    gender: import("../../../generated/prisma/index.js").$Enums.Gender | null;
                }): "Nam" | "Nữ";
            };
            createdAtLocal: () => {
                needs: {
                    createdAt: true;
                };
                compute(model: any): string | null;
            };
        };
        $allModels: {
            createdAtLocal: () => {
                needs: {
                    createdAt: true;
                };
                compute(model: any): string | null;
            };
        };
        refreshToken: {
            createdAtLocal: () => {
                needs: {
                    createdAt: true;
                };
                compute(model: any): string | null;
            };
        };
        permission: {
            createdAtLocal: () => {
                needs: {
                    createdAt: true;
                };
                compute(model: any): string | null;
            };
        };
        role: {
            createdAtLocal: () => {
                needs: {
                    createdAt: true;
                };
                compute(model: any): string | null;
            };
        };
        rolePermission: {
            createdAtLocal: () => {
                needs: {
                    createdAt: true;
                };
                compute(model: any): string | null;
            };
        };
        accountWorkspace: {
            createdAtLocal: () => {
                needs: {
                    createdAt: true;
                };
                compute(model: any): string | null;
            };
        };
        patient: {
            createdAtLocal: () => {
                needs: {
                    createdAt: true;
                };
                compute(model: any): string | null;
            };
        };
        faculty: {
            createdAtLocal: () => {
                needs: {
                    createdAt: true;
                };
                compute(model: any): string | null;
            };
        };
        room: {
            createdAtLocal: () => {
                needs: {
                    createdAt: true;
                };
                compute(model: any): string | null;
            };
        };
        timetable: {
            createdAtLocal: () => {
                needs: {
                    createdAt: true;
                };
                compute(model: any): string | null;
            };
        };
        appointment: {
            createdAtLocal: () => {
                needs: {
                    createdAt: true;
                };
                compute(model: any): string | null;
            };
        };
        enterTicket: {
            createdAtLocal: () => {
                needs: {
                    createdAt: true;
                };
                compute(model: any): string | null;
            };
        };
        disease: {
            createdAtLocal: () => {
                needs: {
                    createdAt: true;
                };
                compute(model: any): string | null;
            };
        };
        examineLog: {
            createdAtLocal: () => {
                needs: {
                    createdAt: true;
                };
                compute(model: any): string | null;
            };
        };
        examineLogDetails: {
            createdAtLocal: () => {
                needs: {
                    createdAt: true;
                };
                compute(model: any): string | null;
            };
        };
        test: {
            createdAtLocal: () => {
                needs: {
                    createdAt: true;
                };
                compute(model: any): string | null;
            };
        };
        testLog: {
            createdAtLocal: () => {
                needs: {
                    createdAt: true;
                };
                compute(model: any): string | null;
            };
        };
        testDetails: {
            createdAtLocal: () => {
                needs: {
                    createdAt: true;
                };
                compute(model: any): string | null;
            };
        };
        medicine: {
            createdAtLocal: () => {
                needs: {
                    createdAt: true;
                };
                compute(model: any): string | null;
            };
        };
        prescription: {
            createdAtLocal: () => {
                needs: {
                    createdAt: true;
                };
                compute(model: any): string | null;
            };
        };
        prescriptionDetails: {
            createdAtLocal: () => {
                needs: {
                    createdAt: true;
                };
                compute(model: any): string | null;
            };
        };
        medicineTicket: {
            createdAtLocal: () => {
                needs: {
                    createdAt: true;
                };
                compute(model: any): string | null;
            };
        };
        imexMedicineLog: {
            createdAtLocal: () => {
                needs: {
                    createdAt: true;
                };
                compute(model: any): string | null;
            };
        };
        imexMedicineDetails: {
            createdAtLocal: () => {
                needs: {
                    createdAt: true;
                };
                compute(model: any): string | null;
            };
        };
        paymentHistory: {
            createdAtLocal: () => {
                needs: {
                    createdAt: true;
                };
                compute(model: any): string | null;
            };
        };
        medicineMonthReport: {
            createdAtLocal: () => {
                needs: {
                    createdAt: true;
                };
                compute(model: any): string | null;
            };
        };
        paymentMonthReport: {
            createdAtLocal: () => {
                needs: {
                    createdAt: true;
                };
                compute(model: any): string | null;
            };
        };
        notification: {
            createdAtLocal: () => {
                needs: {
                    createdAt: true;
                };
                compute(model: any): string | null;
            };
        };
        systemConfig: {
            createdAtLocal: () => {
                needs: {
                    createdAt: true;
                };
                compute(model: any): string | null;
            };
        };
    };
    model: {};
    query: {};
    client: {};
}, {}>, "Medicine", "findUnique", null> & import("../../../generated/prisma/runtime/client.js").PrismaPromise<{
    createdAt: Date;
    description: string | null;
    price: Prisma.Decimal;
    medicineID: number;
    medicineName: string;
    medicineImage: string | null;
    unit: import("../../../generated/prisma/index.js").$Enums.MedicineUnit;
    quantity: number;
} | null>;
export declare const getMedicineItemsService: (search: string, page: number, pageSize: number) => Promise<{
    data: {
        createdAt: Date;
        description: string | null;
        price: Prisma.Decimal;
        medicineID: number;
        medicineName: string;
        medicineImage: string | null;
        unit: import("../../../generated/prisma/index.js").$Enums.MedicineUnit;
        quantity: number;
    }[];
    currentPage: number;
    pageSize: number;
    totalItems: number;
    totalPages: number;
}>;
export declare const updateMedicineService: (medicineID: number, data: Partial<CreateMedicineInput>) => import("../../../generated/prisma/runtime/client.js").DynamicModelExtensionFluentApi<Prisma.TypeMap<import("../../../generated/prisma/runtime/client.js").InternalArgs & {
    result: {
        account: {
            fullName: () => {
                needs: {
                    firstName: true;
                    lastName: true;
                };
                compute(account: {
                    firstName: string;
                    lastName: string;
                }): string;
            };
            genderDisplay: () => {
                needs: {
                    gender: true;
                };
                compute(account: {
                    gender: import("../../../generated/prisma/index.js").$Enums.Gender | null;
                }): "Nam" | "Nữ";
            };
            createdAtLocal: () => {
                needs: {
                    createdAt: true;
                };
                compute(model: any): string | null;
            };
        };
        $allModels: {
            createdAtLocal: () => {
                needs: {
                    createdAt: true;
                };
                compute(model: any): string | null;
            };
        };
        refreshToken: {
            createdAtLocal: () => {
                needs: {
                    createdAt: true;
                };
                compute(model: any): string | null;
            };
        };
        permission: {
            createdAtLocal: () => {
                needs: {
                    createdAt: true;
                };
                compute(model: any): string | null;
            };
        };
        role: {
            createdAtLocal: () => {
                needs: {
                    createdAt: true;
                };
                compute(model: any): string | null;
            };
        };
        rolePermission: {
            createdAtLocal: () => {
                needs: {
                    createdAt: true;
                };
                compute(model: any): string | null;
            };
        };
        accountWorkspace: {
            createdAtLocal: () => {
                needs: {
                    createdAt: true;
                };
                compute(model: any): string | null;
            };
        };
        patient: {
            createdAtLocal: () => {
                needs: {
                    createdAt: true;
                };
                compute(model: any): string | null;
            };
        };
        faculty: {
            createdAtLocal: () => {
                needs: {
                    createdAt: true;
                };
                compute(model: any): string | null;
            };
        };
        room: {
            createdAtLocal: () => {
                needs: {
                    createdAt: true;
                };
                compute(model: any): string | null;
            };
        };
        timetable: {
            createdAtLocal: () => {
                needs: {
                    createdAt: true;
                };
                compute(model: any): string | null;
            };
        };
        appointment: {
            createdAtLocal: () => {
                needs: {
                    createdAt: true;
                };
                compute(model: any): string | null;
            };
        };
        enterTicket: {
            createdAtLocal: () => {
                needs: {
                    createdAt: true;
                };
                compute(model: any): string | null;
            };
        };
        disease: {
            createdAtLocal: () => {
                needs: {
                    createdAt: true;
                };
                compute(model: any): string | null;
            };
        };
        examineLog: {
            createdAtLocal: () => {
                needs: {
                    createdAt: true;
                };
                compute(model: any): string | null;
            };
        };
        examineLogDetails: {
            createdAtLocal: () => {
                needs: {
                    createdAt: true;
                };
                compute(model: any): string | null;
            };
        };
        test: {
            createdAtLocal: () => {
                needs: {
                    createdAt: true;
                };
                compute(model: any): string | null;
            };
        };
        testLog: {
            createdAtLocal: () => {
                needs: {
                    createdAt: true;
                };
                compute(model: any): string | null;
            };
        };
        testDetails: {
            createdAtLocal: () => {
                needs: {
                    createdAt: true;
                };
                compute(model: any): string | null;
            };
        };
        medicine: {
            createdAtLocal: () => {
                needs: {
                    createdAt: true;
                };
                compute(model: any): string | null;
            };
        };
        prescription: {
            createdAtLocal: () => {
                needs: {
                    createdAt: true;
                };
                compute(model: any): string | null;
            };
        };
        prescriptionDetails: {
            createdAtLocal: () => {
                needs: {
                    createdAt: true;
                };
                compute(model: any): string | null;
            };
        };
        medicineTicket: {
            createdAtLocal: () => {
                needs: {
                    createdAt: true;
                };
                compute(model: any): string | null;
            };
        };
        imexMedicineLog: {
            createdAtLocal: () => {
                needs: {
                    createdAt: true;
                };
                compute(model: any): string | null;
            };
        };
        imexMedicineDetails: {
            createdAtLocal: () => {
                needs: {
                    createdAt: true;
                };
                compute(model: any): string | null;
            };
        };
        paymentHistory: {
            createdAtLocal: () => {
                needs: {
                    createdAt: true;
                };
                compute(model: any): string | null;
            };
        };
        medicineMonthReport: {
            createdAtLocal: () => {
                needs: {
                    createdAt: true;
                };
                compute(model: any): string | null;
            };
        };
        paymentMonthReport: {
            createdAtLocal: () => {
                needs: {
                    createdAt: true;
                };
                compute(model: any): string | null;
            };
        };
        notification: {
            createdAtLocal: () => {
                needs: {
                    createdAt: true;
                };
                compute(model: any): string | null;
            };
        };
        systemConfig: {
            createdAtLocal: () => {
                needs: {
                    createdAt: true;
                };
                compute(model: any): string | null;
            };
        };
    };
    model: {};
    query: {};
    client: {};
}, {}>, "Medicine", "update", never> & import("../../../generated/prisma/runtime/client.js").PrismaPromise<{
    createdAt: Date;
    description: string | null;
    price: Prisma.Decimal;
    medicineID: number;
    medicineName: string;
    medicineImage: string | null;
    unit: import("../../../generated/prisma/index.js").$Enums.MedicineUnit;
    quantity: number;
}>;
export declare const deleteMedicineService: (medicineID: number) => import("../../../generated/prisma/runtime/client.js").DynamicModelExtensionFluentApi<Prisma.TypeMap<import("../../../generated/prisma/runtime/client.js").InternalArgs & {
    result: {
        account: {
            fullName: () => {
                needs: {
                    firstName: true;
                    lastName: true;
                };
                compute(account: {
                    firstName: string;
                    lastName: string;
                }): string;
            };
            genderDisplay: () => {
                needs: {
                    gender: true;
                };
                compute(account: {
                    gender: import("../../../generated/prisma/index.js").$Enums.Gender | null;
                }): "Nam" | "Nữ";
            };
            createdAtLocal: () => {
                needs: {
                    createdAt: true;
                };
                compute(model: any): string | null;
            };
        };
        $allModels: {
            createdAtLocal: () => {
                needs: {
                    createdAt: true;
                };
                compute(model: any): string | null;
            };
        };
        refreshToken: {
            createdAtLocal: () => {
                needs: {
                    createdAt: true;
                };
                compute(model: any): string | null;
            };
        };
        permission: {
            createdAtLocal: () => {
                needs: {
                    createdAt: true;
                };
                compute(model: any): string | null;
            };
        };
        role: {
            createdAtLocal: () => {
                needs: {
                    createdAt: true;
                };
                compute(model: any): string | null;
            };
        };
        rolePermission: {
            createdAtLocal: () => {
                needs: {
                    createdAt: true;
                };
                compute(model: any): string | null;
            };
        };
        accountWorkspace: {
            createdAtLocal: () => {
                needs: {
                    createdAt: true;
                };
                compute(model: any): string | null;
            };
        };
        patient: {
            createdAtLocal: () => {
                needs: {
                    createdAt: true;
                };
                compute(model: any): string | null;
            };
        };
        faculty: {
            createdAtLocal: () => {
                needs: {
                    createdAt: true;
                };
                compute(model: any): string | null;
            };
        };
        room: {
            createdAtLocal: () => {
                needs: {
                    createdAt: true;
                };
                compute(model: any): string | null;
            };
        };
        timetable: {
            createdAtLocal: () => {
                needs: {
                    createdAt: true;
                };
                compute(model: any): string | null;
            };
        };
        appointment: {
            createdAtLocal: () => {
                needs: {
                    createdAt: true;
                };
                compute(model: any): string | null;
            };
        };
        enterTicket: {
            createdAtLocal: () => {
                needs: {
                    createdAt: true;
                };
                compute(model: any): string | null;
            };
        };
        disease: {
            createdAtLocal: () => {
                needs: {
                    createdAt: true;
                };
                compute(model: any): string | null;
            };
        };
        examineLog: {
            createdAtLocal: () => {
                needs: {
                    createdAt: true;
                };
                compute(model: any): string | null;
            };
        };
        examineLogDetails: {
            createdAtLocal: () => {
                needs: {
                    createdAt: true;
                };
                compute(model: any): string | null;
            };
        };
        test: {
            createdAtLocal: () => {
                needs: {
                    createdAt: true;
                };
                compute(model: any): string | null;
            };
        };
        testLog: {
            createdAtLocal: () => {
                needs: {
                    createdAt: true;
                };
                compute(model: any): string | null;
            };
        };
        testDetails: {
            createdAtLocal: () => {
                needs: {
                    createdAt: true;
                };
                compute(model: any): string | null;
            };
        };
        medicine: {
            createdAtLocal: () => {
                needs: {
                    createdAt: true;
                };
                compute(model: any): string | null;
            };
        };
        prescription: {
            createdAtLocal: () => {
                needs: {
                    createdAt: true;
                };
                compute(model: any): string | null;
            };
        };
        prescriptionDetails: {
            createdAtLocal: () => {
                needs: {
                    createdAt: true;
                };
                compute(model: any): string | null;
            };
        };
        medicineTicket: {
            createdAtLocal: () => {
                needs: {
                    createdAt: true;
                };
                compute(model: any): string | null;
            };
        };
        imexMedicineLog: {
            createdAtLocal: () => {
                needs: {
                    createdAt: true;
                };
                compute(model: any): string | null;
            };
        };
        imexMedicineDetails: {
            createdAtLocal: () => {
                needs: {
                    createdAt: true;
                };
                compute(model: any): string | null;
            };
        };
        paymentHistory: {
            createdAtLocal: () => {
                needs: {
                    createdAt: true;
                };
                compute(model: any): string | null;
            };
        };
        medicineMonthReport: {
            createdAtLocal: () => {
                needs: {
                    createdAt: true;
                };
                compute(model: any): string | null;
            };
        };
        paymentMonthReport: {
            createdAtLocal: () => {
                needs: {
                    createdAt: true;
                };
                compute(model: any): string | null;
            };
        };
        notification: {
            createdAtLocal: () => {
                needs: {
                    createdAt: true;
                };
                compute(model: any): string | null;
            };
        };
        systemConfig: {
            createdAtLocal: () => {
                needs: {
                    createdAt: true;
                };
                compute(model: any): string | null;
            };
        };
    };
    model: {};
    query: {};
    client: {};
}, {}>, "Medicine", "delete", never> & import("../../../generated/prisma/runtime/client.js").PrismaPromise<{
    createdAt: Date;
    description: string | null;
    price: Prisma.Decimal;
    medicineID: number;
    medicineName: string;
    medicineImage: string | null;
    unit: import("../../../generated/prisma/index.js").$Enums.MedicineUnit;
    quantity: number;
    createdAtLocal: string | null;
}>;
export {};
//# sourceMappingURL=medicine-items.service.d.ts.map