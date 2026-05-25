import z from "zod";
declare const enterTicketSchema: {
    new: z.ZodObject<{
        appointmentID: z.ZodString;
        note: z.ZodOptional<z.ZodString>;
    }, z.z.core.$strip>;
    viewList: z.ZodObject<{
        date: z.ZodOptional<z.ZodString>;
        status: z.ZodOptional<z.ZodEnum<{
            [x: string]: string;
        }>>;
        page: z.ZodOptional<z.ZodString>;
        limit: z.ZodOptional<z.ZodString>;
        roomID: z.ZodOptional<z.ZodString>;
    }, z.z.core.$strip>;
    update: z.ZodObject<{
        status: z.ZodEnum<{
            [x: string]: string;
        }>;
    }, z.z.core.$strip>;
    query: z.ZodObject<{
        roomID: z.ZodString;
    }, z.z.core.$strip>;
};
export default enterTicketSchema;
//# sourceMappingURL=enterTicket.schema.d.ts.map