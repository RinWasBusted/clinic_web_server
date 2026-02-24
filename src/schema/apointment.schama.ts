import { z } from "zod";
export const getAllAppointmentsQuerySchema = z
  .object({
    status: z.enum(["PENDING", "APPROVED", "CANCELLED"]),
    facultyID: z.string().min(1).optional(),
    patientID: z.string().min(1).optional(),
    scheduleDate: z
      .string()
      .optional()
      .refine((v) => !v || !Number.isNaN(new Date(v).getTime()), {
        message: "scheduleDate must be a valid date string",
      }),
  })
  .strict();
export const createAppointmentBodySchema = z
  .object({
    appointmentType: z.string().min(1).optional(), // nếu là enum thì đổi xuống dưới
    scheduleDate: z
      .string()
      .min(1, "scheduleDate is required")
      .refine((v) => !Number.isNaN(new Date(v).getTime()), {
        message: "scheduleDate must be a valid date string (YYYY-MM-DD or ISO)",
      }),
    roomID: z.string().min(1).optional().nullable(),
    patientID: z.string().min(1, "patientID is required"),
    facultyID: z.string().min(1, "facultyID is required"),
  })
  .strict();
// Update: tất cả field optional (PATCH)
export const updateAppointmentBodySchema = createAppointmentBodySchema
  .partial()
  .extend({
    // scheduleDate trong create là required, update thì optional nhưng vẫn validate nếu có
    scheduleDate: createAppointmentBodySchema.shape.scheduleDate.optional(),
  })
  .strict();