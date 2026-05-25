import z from "zod";
declare const examineLogSchema: {
    create: z.ZodObject<{
        appointmentID: z.ZodString;
        patientID: z.ZodString;
        symptoms: z.ZodString;
        status: z.ZodEnum<{
            [x: string]: string;
        }>;
        diagnose: z.ZodOptional<z.ZodArray<z.ZodString>>;
        note: z.ZodOptional<z.ZodString>;
        treatmentPlan: z.ZodString;
    }, z.z.core.$strict>;
    update: z.ZodObject<{
        appointmentID: z.ZodOptional<z.ZodString>;
        patientID: z.ZodOptional<z.ZodString>;
        symptoms: z.ZodOptional<z.ZodString>;
        status: z.ZodOptional<z.ZodEnum<{
            [x: string]: string;
        }>>;
        diagnose: z.ZodOptional<z.ZodOptional<z.ZodArray<z.ZodString>>>;
        note: z.ZodOptional<z.ZodOptional<z.ZodString>>;
        treatmentPlan: z.ZodOptional<z.ZodString>;
    }, z.z.core.$strip>;
};
export default examineLogSchema;
//# sourceMappingURL=examineLog.schema.d.ts.map