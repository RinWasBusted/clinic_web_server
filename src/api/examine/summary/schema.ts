import * as z from "zod";
import examineLogSchema from "../../../schema/examineLog.schema.js";
import prescriptionSchema from "../../../schema/prescription.schema.js";

export const recordSchema = z.object({
  examine: examineLogSchema.create,
  prescription: prescriptionSchema.new,
});
