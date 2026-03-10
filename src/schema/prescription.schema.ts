import z from "zod";

const medicine = z.object(
  {
    medicineID: z.number().int().positive("Mã thuốc không hợp lệ"),
    usage: z
      .string()
      .trim()
      .max(255)
      .transform((v) => v.replace(/\s+/g, " ")),
    note: z.string().max(255).optional(),
    quantity: z.number().int().positive("Số lượng dùng mỗi ngày phải hợp lệ").optional(),
  },
  "Thông tin kê thuốc không hợp lệ"
);

const log = z.object({
  examineID: z.string().uuid("Mã khám không hợp lệ"),
  note: z.string().max(255).optional(),
  needReExamine: z.boolean().optional(),
  totalTreatmentDays: z.number().int().positive("Số ngày điều trị phải hợp lệ"),
  details: z.array(medicine.strict()).min(1, "Phải kê ít nhất một loại thuốc"),
});

const prescriptionSchema = {
  new: log.strict(),
  update: log
    .omit({ examineID: true, details: true }) // examineID không cần thiết khi cập nhật, vì nó không được thay đổi
    .partial()
    .strict(),
  updateDetails: log
    .pick({ details: true })
    .extend({
      deleteList: z.array(z.number().int().positive(), "Danh sách thuốc cần xóa không hợp lệ").optional(),
    })
    .strict(),
};

export default prescriptionSchema;
