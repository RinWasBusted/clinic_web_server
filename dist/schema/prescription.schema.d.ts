import z from "zod";
declare const prescriptionSchema: {
    new: z.ZodObject<{
        examineID: z.ZodString;
        note: z.ZodOptional<z.ZodString>;
        needReExamine: z.ZodOptional<z.ZodBoolean>;
        totalTreatmentDays: z.ZodNumber;
        details: z.ZodArray<z.ZodObject<{
            medicineID: z.ZodNumber;
            usage: z.ZodPipe<z.ZodString, z.ZodTransform<string, string>>;
            note: z.ZodOptional<z.ZodString>;
            quantity: z.ZodOptional<z.ZodNumber>;
        }, z.z.core.$strict>>;
    }, z.z.core.$strict>;
    update: z.ZodObject<{
        note: z.ZodOptional<z.ZodOptional<z.ZodString>>;
        needReExamine: z.ZodOptional<z.ZodOptional<z.ZodBoolean>>;
        totalTreatmentDays: z.ZodOptional<z.ZodNumber>;
    }, z.z.core.$strict>;
    updateDetails: z.ZodObject<{
        details: z.ZodArray<z.ZodObject<{
            medicineID: z.ZodNumber;
            usage: z.ZodPipe<z.ZodString, z.ZodTransform<string, string>>;
            note: z.ZodOptional<z.ZodString>;
            quantity: z.ZodOptional<z.ZodNumber>;
        }, z.z.core.$strict>>;
        deleteList: z.ZodOptional<z.ZodArray<z.ZodNumber>>;
    }, z.z.core.$strict>;
};
export default prescriptionSchema;
//# sourceMappingURL=prescription.schema.d.ts.map