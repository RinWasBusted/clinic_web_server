import { z } from "zod";

export const registerSchema = z.object({
  firstName: z.string().min(1, "firstName required").max(50),
  lastName: z.string().min(1, "lastName required").max(75),
  email: z.string().email().max(254),
  role: z.enum(["manager", "doctor", "staff", "pharmacist"]),
  birthDate: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "birthDate must be YYYY-MM-DD")
    .transform((s) => new Date(s)),
  phoneNumber: z.string().max(12).optional(),
});
export const registerManySchema = z.array(registerSchema).min(1);
export const UpdateAccountSchema = registerSchema
.pick({ firstName: true, lastName: true, birthDate: true, phoneNumber: true })
.partial()
.strict();
export const deleteAccountParamsSchema = z.object({
  id: z.string().uuid(),
});
export const deleteAccountBodySchema = z.object({
    accountIdToDelete: z.string().uuid(),
})