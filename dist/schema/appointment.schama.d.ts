import { z } from "zod";
export declare const getAllAppointmentsQuerySchema: z.ZodObject<{
    status: z.ZodOptional<z.ZodEnum<{
        pending: "pending";
        approved: "approved";
        cancelled: "cancelled";
    }>>;
    roomID: z.ZodOptional<z.ZodString>;
    facultyID: z.ZodOptional<z.ZodString>;
    patientID: z.ZodOptional<z.ZodString>;
    scheduleDate: z.ZodOptional<z.ZodString>;
}, z.core.$strict>;
export declare const createAppointmentBodySchema: z.ZodObject<{
    firstName: z.ZodString;
    lastName: z.ZodString;
    phoneNumber: z.ZodString;
    email: z.ZodOptional<z.ZodString>;
    appointmentType: z.ZodOptional<z.ZodString>;
    scheduleDate: z.ZodString;
    roomID: z.ZodNullable<z.ZodOptional<z.ZodString>>;
}, z.core.$strict>;
export declare const updateAppointmentBodySchema: z.ZodObject<{
    firstName: z.ZodOptional<z.ZodString>;
    lastName: z.ZodOptional<z.ZodString>;
    phoneNumber: z.ZodOptional<z.ZodString>;
    email: z.ZodOptional<z.ZodOptional<z.ZodString>>;
    appointmentType: z.ZodOptional<z.ZodOptional<z.ZodString>>;
    roomID: z.ZodOptional<z.ZodNullable<z.ZodOptional<z.ZodString>>>;
    scheduleDate: z.ZodOptional<z.ZodString>;
}, z.core.$strict>;
//# sourceMappingURL=appointment.schama.d.ts.map