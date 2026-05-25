import { z } from "zod";
export declare const createRoomSchema: z.ZodObject<{
    roomType: z.ZodEnum<{
        examination: "examination";
        pharmacy: "pharmacy";
        cashier: "cashier";
        lab: "lab";
    }>;
    roomName: z.ZodOptional<z.ZodString>;
    facultyId: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
//# sourceMappingURL=room.schema.d.ts.map