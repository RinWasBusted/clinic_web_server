import { z } from "zod";

const imexTypeSchema = z.enum(["import", "export"]);

const dateTimeStringSchema = z
  .string()
  .refine((value) => !Number.isNaN(new Date(value).getTime()), {
    message: "Must be a valid date string",
  });

const imexItemSchema = z
  .object({
    medicineID: z.coerce.number().int().positive(),
    quantity: z.coerce.number().int().positive(),
    note: z.string().optional().nullable(),
  })
  .strict();

const valueSchema = z.coerce.number().finite().min(0).optional();
const noteSchema = z.string().optional().nullable();

export const getImexLogsQuerySchema = z
  .object({
    type: imexTypeSchema.optional(),
    from: dateTimeStringSchema.optional(),
    to: dateTimeStringSchema.optional(),
    page: z.coerce.number().int().positive().default(1),
    pageSize: z.coerce.number().int().positive().default(10),
  })
  .strict();

export const imexLogParamsSchema = z
  .object({
    id: z.string().uuid(),
  })
  .strict();

export const createImexLogBodySchema = z
  .object({
    imexType: imexTypeSchema,
    value: valueSchema,
    note: noteSchema,
    items: z.array(imexItemSchema).min(1),
  })
  .strict();

export const createManyImexLogBodySchema = createImexLogBodySchema;

export const updateImexLogBodySchema = z
  .object({
    value: valueSchema,
    note: noteSchema,
    items: z.array(imexItemSchema).min(1).optional(),
  })
  .strict()
  .refine(
    (data) =>
      data.value !== undefined ||
      data.note !== undefined ||
      data.items !== undefined,
    {
      message: "At least one of value, note, or items must be provided",
    }
  );

export type GetImexLogsQuery = z.infer<typeof getImexLogsQuerySchema>;
