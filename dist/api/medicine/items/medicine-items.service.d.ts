import type { MedicineUnit } from "../../../generated/prisma/index.js";
interface CreateMedicineInput {
    medicineName: string;
    unit: MedicineUnit;
    price: number;
    quantity?: number;
    description?: string;
    medicineImage?: string;
}
export declare const createMedicineService: (data: CreateMedicineInput) => import("../../../generated/prisma/index.js").Prisma.Prisma__MedicineClient<{
    medicineName: string;
    medicineImage: string | null;
    unit: import("../../../generated/prisma/index.js").$Enums.MedicineUnit;
    quantity: number;
    price: import("@prisma/client-runtime-utils").Decimal;
    description: string | null;
    medicineID: number;
}, never, import("../../../generated/prisma/runtime/client.js").DefaultArgs, {
    adapter: import("@prisma/adapter-pg").PrismaPg;
}>;
export declare const getMedicinesService: () => import("../../../generated/prisma/index.js").Prisma.PrismaPromise<{
    createdAt: Date;
    medicineName: string;
    medicineImage: string | null;
    unit: import("../../../generated/prisma/index.js").$Enums.MedicineUnit;
    quantity: number;
    price: import("@prisma/client-runtime-utils").Decimal;
    description: string | null;
    medicineID: number;
}[]>;
export declare const getMedicineByIdService: (medicineID: number) => import("../../../generated/prisma/index.js").Prisma.Prisma__MedicineClient<{
    createdAt: Date;
    medicineName: string;
    medicineImage: string | null;
    unit: import("../../../generated/prisma/index.js").$Enums.MedicineUnit;
    quantity: number;
    price: import("@prisma/client-runtime-utils").Decimal;
    description: string | null;
    medicineID: number;
} | null, null, import("../../../generated/prisma/runtime/client.js").DefaultArgs, {
    adapter: import("@prisma/adapter-pg").PrismaPg;
}>;
export declare const getMedicineItemsService: (search: string, page: number, pageSize: number) => Promise<{
    data: {
        createdAt: Date;
        medicineName: string;
        medicineImage: string | null;
        unit: import("../../../generated/prisma/index.js").$Enums.MedicineUnit;
        quantity: number;
        price: import("@prisma/client-runtime-utils").Decimal;
        description: string | null;
        medicineID: number;
    }[];
    currentPage: number;
    pageSize: number;
    totalItems: number;
    totalPages: number;
}>;
export declare const updateMedicineService: (medicineID: number, data: Partial<CreateMedicineInput>) => import("../../../generated/prisma/index.js").Prisma.Prisma__MedicineClient<{
    createdAt: Date;
    medicineName: string;
    medicineImage: string | null;
    unit: import("../../../generated/prisma/index.js").$Enums.MedicineUnit;
    quantity: number;
    price: import("@prisma/client-runtime-utils").Decimal;
    description: string | null;
    medicineID: number;
}, never, import("../../../generated/prisma/runtime/client.js").DefaultArgs, {
    adapter: import("@prisma/adapter-pg").PrismaPg;
}>;
export declare const deleteMedicineService: (medicineID: number) => import("../../../generated/prisma/index.js").Prisma.Prisma__MedicineClient<{
    createdAt: Date;
    medicineName: string;
    medicineImage: string | null;
    unit: import("../../../generated/prisma/index.js").$Enums.MedicineUnit;
    quantity: number;
    price: import("@prisma/client-runtime-utils").Decimal;
    description: string | null;
    medicineID: number;
}, never, import("../../../generated/prisma/runtime/client.js").DefaultArgs, {
    adapter: import("@prisma/adapter-pg").PrismaPg;
}>;
export {};
//# sourceMappingURL=medicine-items.service.d.ts.map