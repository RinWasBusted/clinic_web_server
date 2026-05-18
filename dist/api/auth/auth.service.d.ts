declare const addRefreshTokenToCookieToWhitelist: (params: {
    refreshToken: string;
    userId: string;
}) => import("../../generated/prisma/runtime/client.js").DynamicModelExtensionFluentApi<import("../../utils/prisma.js").Prisma.TypeMap<import("../../generated/prisma/runtime/client.js").InternalArgs & {
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
                    gender: import("../../generated/prisma/index.js").$Enums.Gender | null;
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
}, {}>, "RefreshToken", "create", never> & import("../../generated/prisma/runtime/client.js").PrismaPromise<{
    createdAt: Date;
    id: number;
    userId: string | null;
    hashedToken: string;
    revoked: boolean;
    updatedAt: Date;
    expiresAt: Date;
    createdAtLocal: string | null;
}>;
declare const findRefreshTokenInWhitelist: (refreshToken: string) => import("../../generated/prisma/runtime/client.js").DynamicModelExtensionFluentApi<import("../../utils/prisma.js").Prisma.TypeMap<import("../../generated/prisma/runtime/client.js").InternalArgs & {
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
                    gender: import("../../generated/prisma/index.js").$Enums.Gender | null;
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
}, {}>, "RefreshToken", "findFirst", null> & import("../../generated/prisma/runtime/client.js").PrismaPromise<{
    createdAt: Date;
    id: number;
    userId: string | null;
    hashedToken: string;
    revoked: boolean;
    updatedAt: Date;
    expiresAt: Date;
    createdAtLocal: string | null;
} | null>;
declare const deleteRefreshTokenFromWhitelist: (refreshToken: string) => import("../../generated/prisma/runtime/client.js").PrismaPromise<import("../../generated/prisma/runtime/client.js").GetBatchResult>;
declare const revokeTokensByUser: (userId: string) => import("../../generated/prisma/runtime/client.js").PrismaPromise<import("../../generated/prisma/runtime/client.js").GetBatchResult>;
export { addRefreshTokenToCookieToWhitelist, findRefreshTokenInWhitelist, deleteRefreshTokenFromWhitelist, revokeTokensByUser };
//# sourceMappingURL=auth.service.d.ts.map