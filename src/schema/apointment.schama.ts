import { z } from "zod";
export const getAllAppointmentsQuerySchema = z
  .object({
    status: z.enum(["pending", "approved", "canceled"]),
    facultyID: z.string().min(1),
    RoomID: z.string().min(1).optional(),
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
    firstName: z.string().min(1, "firstName is required"),
    lastName: z.string().min(1, "lastName is required"),
    phoneNumber: z.string().min(1, "phoneNumber is required"),
    email: z.string().email().optional(),
    appointmentType: z.string().min(1).optional(),
    scheduleDate: z
      .string()
      .min(1, "scheduleDate is required")
      .refine((v) => !Number.isNaN(new Date(v).getTime()), {
        message: "scheduleDate must be a valid date string (YYYY-MM-DD or ISO)",
      }),
    roomID: z.string().min(1).optional().nullable(),
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