import { z } from "zod";

export const dispenseMedicineTicketQuerySchema = z
  .object({
    id: z.string().uuid(),
  })
  .strict();
