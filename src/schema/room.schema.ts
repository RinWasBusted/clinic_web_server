import { z } from "zod";

export const createRoomSchema = z.object({
    roomType: z.enum(["examination", "pharmacy", "cashier", "lab"])
        .refine(Boolean, { message: "roomType required" }),
    roomName: z
        .string()
        .min(1, "roomName required")
        .max(10, "roomName max 10 characters")
        .optional(),
    facultyId: z
        .string()
        .uuid("facultyId must be a valid UUID")
        .optional(),
});