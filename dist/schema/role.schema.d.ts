import { z } from "zod";
export declare const createRoleSchema: z.ZodObject<{
    roleName: z.ZodString;
    roleDescription: z.ZodOptional<z.ZodString>;
    permissions: z.ZodOptional<z.ZodArray<z.ZodString>>;
}, z.core.$strip>;
export declare const updateRoleSchema: z.ZodObject<{
    roleName: z.ZodOptional<z.ZodString>;
    roleDescription: z.ZodOptional<z.ZodString>;
    permissions: z.ZodOptional<z.ZodArray<z.ZodString>>;
}, z.core.$strip>;
export declare const roleParamsSchema: z.ZodObject<{
    id: z.ZodString;
}, z.core.$strip>;
export type CreateRoleInput = z.infer<typeof createRoleSchema>;
export type UpdateRoleInput = z.infer<typeof updateRoleSchema>;
//# sourceMappingURL=role.schema.d.ts.map