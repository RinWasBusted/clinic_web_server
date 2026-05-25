import { z } from "zod";
export declare const registerSchema: z.ZodObject<{
    firstName: z.ZodString;
    lastName: z.ZodString;
    role: z.ZodString;
    email: z.ZodString;
    birthDate: z.ZodPipe<z.ZodString, z.ZodTransform<Date, string>>;
    phoneNumber: z.ZodOptional<z.ZodString>;
    avatarUrl: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export declare const registerManySchema: z.ZodArray<z.ZodObject<{
    firstName: z.ZodString;
    lastName: z.ZodString;
    role: z.ZodString;
    email: z.ZodString;
    birthDate: z.ZodPipe<z.ZodString, z.ZodTransform<Date, string>>;
    phoneNumber: z.ZodOptional<z.ZodString>;
    avatarUrl: z.ZodOptional<z.ZodString>;
}, z.core.$strip>>;
export declare const UpdateAccountSchema: z.ZodObject<{
    role: z.ZodOptional<z.ZodString>;
    firstName: z.ZodOptional<z.ZodString>;
    lastName: z.ZodOptional<z.ZodString>;
    phoneNumber: z.ZodOptional<z.ZodOptional<z.ZodString>>;
    avatarUrl: z.ZodOptional<z.ZodOptional<z.ZodString>>;
    birthDate: z.ZodOptional<z.ZodPipe<z.ZodString, z.ZodTransform<Date, string>>>;
}, z.core.$strict>;
export declare const deleteAccountParamsSchema: z.ZodObject<{
    id: z.ZodString;
}, z.core.$strip>;
export declare const deleteAccountBodySchema: z.ZodObject<{
    accountIdToDelete: z.ZodString;
}, z.core.$strip>;
//# sourceMappingURL=auth.schema.d.ts.map