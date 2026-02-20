declare const addRefreshTokenToCookieToWhitelist: (params: {
    refreshToken: string;
    userId: string;
}) => import("../../generated/prisma/index.js").Prisma.Prisma__RefreshTokenClient<{
    id: number;
    hashedToken: string;
    revoked: boolean;
    createdAt: Date;
    updatedAt: Date;
    expiresAt: Date;
    userId: string | null;
}, never, import("../../generated/prisma/runtime/client.js").DefaultArgs, {
    adapter: import("@prisma/adapter-pg").PrismaPg;
}>;
declare const findRefreshTokenInWhitelist: (refreshToken: string) => import("../../generated/prisma/index.js").Prisma.Prisma__RefreshTokenClient<{
    id: number;
    hashedToken: string;
    revoked: boolean;
    createdAt: Date;
    updatedAt: Date;
    expiresAt: Date;
    userId: string | null;
} | null, null, import("../../generated/prisma/runtime/client.js").DefaultArgs, {
    adapter: import("@prisma/adapter-pg").PrismaPg;
}>;
declare const deleteRefreshTokenFromWhitelist: (refreshToken: string) => import("../../generated/prisma/index.js").Prisma.PrismaPromise<import("../../generated/prisma/index.js").Prisma.BatchPayload>;
declare const revokeTokensByUser: (userId: string) => import("../../generated/prisma/index.js").Prisma.PrismaPromise<import("../../generated/prisma/index.js").Prisma.BatchPayload>;
export { addRefreshTokenToCookieToWhitelist, findRefreshTokenInWhitelist, deleteRefreshTokenFromWhitelist, revokeTokensByUser };
//# sourceMappingURL=auth.service.d.ts.map