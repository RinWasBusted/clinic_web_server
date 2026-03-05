import z from "zod";
import enumValueOf from "../types/enum.js";

const examineLogBaseSchema = z.object(
  {
    appointmentID: z.string().uuid("Mã hẹn không hợp lệ"),
    patientID: z.string().uuid("Mã bệnh nhân không hợp lệ"),
    symptoms: z.string("Vui lòng nhập triệu chứng").max(255),
    status: z.enum(enumValueOf.examineLog, "Trạng thái đơn khám bị sai"),
    diagnose: z.array(z.string("Kiểm tra lại mã bệnh theo đúng định dạng ICD-10").max(255)).optional(),
    note: z.string().max(255).optional(),
  },
  "Thông tin đơn khám không hợp lệ"
);

const examineLogSchema = {
  create: examineLogBaseSchema.strict(),
  update: examineLogBaseSchema.partial(),
};

export default examineLogSchema;
