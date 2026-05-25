import { z } from "zod";
export declare const getImexLogsQuerySchema: z.ZodObject<{
    type: z.ZodOptional<z.ZodEnum<{
        export: "export";
        import: "import";
    }>>;
    from: z.ZodOptional<z.ZodString>;
    to: z.ZodOptional<z.ZodString>;
    page: z.ZodDefault<z.ZodCoercedNumber<unknown>>;
    pageSize: z.ZodDefault<z.ZodCoercedNumber<unknown>>;
}, z.core.$strict>;
export declare const imexLogParamsSchema: z.ZodObject<{
    id: z.ZodString;
}, z.core.$strict>;
export declare const createImexLogBodySchema: z.ZodObject<{
    imexType: z.ZodEnum<{
        export: "export";
        import: "import";
    }>;
    value: z.ZodOptional<z.ZodCoercedNumber<unknown>>;
    note: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    items: z.ZodArray<z.ZodObject<{
        medicineID: z.ZodCoercedNumber<unknown>;
        quantity: z.ZodCoercedNumber<unknown>;
        note: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    }, z.core.$strict>>;
}, z.core.$strict>;
export declare const createManyImexLogBodySchema: z.ZodObject<{
    imexType: z.ZodEnum<{
        export: "export";
        import: "import";
    }>;
    value: z.ZodOptional<z.ZodCoercedNumber<unknown>>;
    note: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    items: z.ZodArray<z.ZodObject<{
        medicineID: z.ZodCoercedNumber<unknown>;
        quantity: z.ZodCoercedNumber<unknown>;
        note: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    }, z.core.$strict>>;
}, z.core.$strict>;
export declare const updateImexLogBodySchema: z.ZodObject<{
    value: z.ZodOptional<z.ZodCoercedNumber<unknown>>;
    note: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    items: z.ZodOptional<z.ZodArray<z.ZodObject<{
        medicineID: z.ZodCoercedNumber<unknown>;
        quantity: z.ZodCoercedNumber<unknown>;
        note: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    }, z.core.$strict>>>;
}, z.core.$strict>;
export type GetImexLogsQuery = z.infer<typeof getImexLogsQuerySchema>;
//# sourceMappingURL=medicine-imex.schema.d.ts.map