import { PrismaClient, Prisma } from "../generated/prisma/index.js";
import { PrismaPg } from "@prisma/adapter-pg";
declare const prismaClient: PrismaClient<{
    adapter: PrismaPg;
}, never, import("../generated/prisma/runtime/client.js").DefaultArgs>;
declare const prisma: import("../generated/prisma/runtime/client.js").DynamicClientExtensionThis<Prisma.TypeMap<import("../generated/prisma/runtime/client.js").InternalArgs & {
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
                    gender: import("../generated/prisma/index.js").$Enums.Gender | null;
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
}, {}>, Prisma.TypeMapCb<{
    adapter: PrismaPg;
}>, {
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
                    gender: import("../generated/prisma/index.js").$Enums.Gender | null;
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
}>;
export { prisma, Prisma, prismaClient as prismaRaw };
export default prisma;
//# sourceMappingURL=prisma.d.ts.map