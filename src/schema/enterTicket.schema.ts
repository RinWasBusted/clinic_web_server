import z from "zod";
import enumValueOf from "../types/enum.js";

const enterTicketSchema = {
  new: z.object({
    appointmentID: z.string().uuid("Invalid appointment ID format"),
    note: z.string().max(255).optional(),
  }),
  viewList: z.object({
    date: z
      .string()
      .refine((date) => !isNaN(Date.parse(date)), {
        message: "Invalid date format",
      })
      .optional(),
    status: z.enum(enumValueOf.ticket).optional(),
    page: z.string().regex(/^\d+$/, "Page must be a positive integer").optional(),
    limit: z.string().regex(/^\d+$/, "Items count must be a positive integer").optional(),
    roomID: z.string().uuid("Invalid room ID format").optional(),
  }),
  update: z.object({
    status: z.enum(enumValueOf.ticket),
  }),
  query: z.object({
    roomID: z.string("Need to specify the room ID").uuid("Invalid room ID format"),
  }),
};

export default enterTicketSchema;
