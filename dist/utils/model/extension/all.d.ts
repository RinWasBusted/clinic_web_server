declare const AllExtension: (client: any) => import("@prisma/client/extension").PrismaClientExtends<import("@prisma/client/runtime/client").InternalArgs<{
    $allModels: {
        createdAtLocal: {
            needs: {
                createdAt: true;
            };
            compute(model: any): string | null;
        };
    };
}, {}, {}, {}>>;
export default AllExtension;
//# sourceMappingURL=all.d.ts.map