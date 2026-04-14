import z from "zod";
import prisma from "../../utils/prisma.js";
import { NotFoundError } from "../admin/appointment/appointment.service.js";
import examineLogService from "./../examine/log/log.service.js";
import { PrismaClient } from "@prisma/client/extension";
import { ObjectNoArrayType } from "../../utils/types/index.js";
import { PrescriptionStatus } from "../../generated/prisma/index.js";
// Regex pattern for solely dose format, which is the format that only contains the number of tablets to be taken per day.
// For example: "uống 2 viên sáng, 3 viên chiều" or "uống 5 viên mỗi ngày"
const solelyDoseFormat =
  /^uống(?:(?:\s*[,]{1}\s*)(?:sáng|trưa|chiều|tối)\s*\d+[ ]*viên[ a-zA-Z0-9ÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂưăạảấầẩẫậắằẳẵặẹẻẽềềểỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễếệỉịọỏốồổỗộớờởỡợụủứừỬỮỰỲỴÝỶỸửữựỳỵỷỹ]*)+$/gim;

interface PrescriptionItem {
  medicineID: number;
  usage: string;
  note?: string;
  quantity?: number;
}

interface PrescriptionType {
  examineID: string;
  doctorID: string;
  note?: string | null;
  needReExamine?: boolean;
  totalTreatmentDays: number;
  finishTreatmentDate: Date;
  details: PrescriptionItem[];
  deleteList?: number[];
}

type FindUniqueEnum = "RISK" | "LITE" | "INTERNAL";

interface FindUniqueType {
  onlyAllowDraft?: boolean;
  mode?: FindUniqueEnum;
}

type Client = typeof prisma | PrismaClient;

class PrescriptionService {
  constructor() {}

  // Specify the fields to select for prescription details when fetching prescription data. This is used to avoid fetching unnecessary data and to prevent circular references when fetching related data.
  static readonly prescriptionDetailLite = {
    quantity: true,
    usage: true,
    medicine: {
      select: {
        medicineID: true,
        medicineName: true,
        medicineImage: true,
        unit: true,
        price: true,
        quantity: true,
      },
    },
  };

  static readonly prescriptionDetailFull = {
    ...this.prescriptionDetailLite,
  };

  static readonly prescriptionView = {
    prescriptionID: true,
    prescriptionDisplayID: true,
    createdAt: true,
    createdAtLocal: true, // Local time string for createdAt
    note: true,
    needReExamine: true,
    totalTreatmentDays: true,
  };

  static readonly prescriptionInternalView = {
    ...this.prescriptionView,
    details: {
      select: {
        ...this.prescriptionDetailLite,
      },
    },
  };

  private resolveClient(tx?: Client): Client {
    return tx ?? prisma;
  }

  private async findByID(prescriptionID: string, tx: Client, options: FindUniqueType = {}) {
    const { onlyAllowDraft = false, mode = "INTERNAL" } = options;
    const queryOption: Partial<ObjectNoArrayType> = {};
    switch (mode) {
      case "RISK":
        queryOption.select = { ...PrescriptionService.prescriptionInternalView, doctorID: true };
        break;
      case "LITE":
        queryOption.select = PrescriptionService.prescriptionView;
        break;
      case "INTERNAL":
      default:
        queryOption.select = PrescriptionService.prescriptionInternalView;
        // queryOption.select.details = this.prescriptionDetailLite;
        break;
    }

    const whereOption: Record<string, string> = {
      prescriptionID,
      status: PrescriptionStatus.draft,
    };
    if (!onlyAllowDraft) delete whereOption.status;
    console.log(whereOption);
    return await this.resolveClient(tx).prescription.findUnique({
      where: whereOption,
      ...queryOption,
    });
  }

  private calculateTotalDose(usage: string) {
    const input = usage.replace(/[^\d]/gm, " ").replace(/\s+/g, " ").trim();
    return input.split(" ").reduce((total, current) => total + (+current || 0), 0);
  }

  private renderDoseList(data: PrescriptionItem[], treatmentDays: number) {
    // Implementation for verifying prescription data. This only validate the prescriptions with solely unit dose (a.k.a number of tablets)
    const prescriptionList = data.filter((item) => typeof item !== "undefined");
    return prescriptionList.map((item) => {
      if (!item.usage.match(solelyDoseFormat)) {
        // Not solely dose format, return the data as is
        z.number(`Mã thuốc ${item.medicineID} cần nhập số lượng`).parse(item.quantity);
        return { ...item };
      } else {
        // Solely dose format, extract the total dose per day from the usage string
        const totalDose = this.calculateTotalDose(item.usage);
        // Calculate the total quantity based on the total dose per day and the total treatment days
        return { ...item, quantity: totalDose * treatmentDays };
      }
    });
  }

  async refinePrescriptionData(data: PrescriptionType) {
    const { examineID, details, totalTreatmentDays } = data;

    const examineLog = await examineLogService.getExamineLogByID(examineID);
    if (!examineLog) {
      throw new NotFoundError("Không tìm thấy thông tin khám bệnh để kê đơn thuốc");
    }

    // Count total dose per day
    const refinedDetails = this.renderDoseList(details, totalTreatmentDays);
    return { ...data, examineID, doctorID: examineLog.examinedBy, details: refinedDetails, totalTreatmentDays };
  }

  async getPrescriptionByID(prescriptionID: string, tx?: Client, options: FindUniqueType = {}) {
    return this.findByID(prescriptionID, tx, options);
  }

  private async upsertMany(prescriptionID: string, details: PrescriptionItem[], tx: Client) {
    await Promise.all(
      details.map(({ medicineID, ...rest }) =>
        tx.prescriptionDetails.upsert({
          where: {
            prescriptionID_medicineID: { prescriptionID, medicineID },
          },
          update: {
            ...rest,
          },
          create: {
            prescriptionID,
            medicineID,
            ...rest,
          },
        })
      )
    );
  }

  private async deleteMany(prescriptionID: string, deleteList: number[], tx: Client) {
    await tx.prescriptionDetails.deleteMany({
      where: {
        prescriptionID,
        medicineID: {
          in: deleteList,
        },
      },
    });
  }

  async submit(refinedData: PrescriptionType) {
    // Implementation for submitting prescription data
    console.time("Prisma Transaction");
    const prescription = await prisma.$transaction(async (tx) => {
      const { details: prescriptionDetails, ...rest } = refinedData;

      const newPrescription = await tx.prescription.create({
        data: {
          ...rest,
          details: {
            create: [...prescriptionDetails],
          },
        },
        select: PrescriptionService.prescriptionInternalView,
      });
      return newPrescription;
    });
    console.timeEnd("Prisma Transaction");
    return prescription;
  }

  isValidUpdate(payload: PrescriptionType) {
    // Không được vừa update vừa xóa.
    if (!Array.isArray(payload.deleteList) || !Array.isArray(payload.details)) return true;
    if (payload.deleteList?.length == 0) return true;
    if (payload.details?.length == 0) return true;
    if (payload.details.some((medicine) => payload.deleteList?.includes(medicine.medicineID))) return false;
    return true;
  }

  async countMedicine(prescriptionID: string, tx?: Client) {
    return await this.resolveClient(tx).prescriptionDetails.count({ where: { prescriptionID } });
  }

  // 1 - Đã xóa chi tiết thuốc thì có xóa luôn cái prescription ko
  // 2 - Đã cập nhật số ngày thì cập nhật lại hế
  async update(prescriptionID: string, target: unknown, payload: PrescriptionType) {
    // Tìm toa thuốc
    const { totalTreatmentDays = 1 } = (target as Partial<PrescriptionType>) ?? {};
    const { totalTreatmentDays: dateDiff, note, needReExamine } = payload;

    // Prisma transaction
    const prescription = await prisma.$transaction(async (tx) => {
      // Kiểm tra nếu có thay đổi ngày hay không
      if (dateDiff !== totalTreatmentDays) {
        // Need recalculate quantity if totalTreatmentDays is updated
        console.log(dateDiff / Number(totalTreatmentDays));
        const ratio = parseFloat((dateDiff / Number(totalTreatmentDays)).toFixed(4)) || 1;
        if (ratio !== 1)
          // Cannot use updateMany with calculation, have to use executeRaw. Type check is done in the controller layer, if quantity is not valid then it will return 422 before calling this update function
          await tx.$executeRaw`
            UPDATE "PrescriptionDetails"
            SET "quantity" = CAST (("quantity"* ${dateDiff} / ${totalTreatmentDays}) as INT)
            WHERE "prescriptionID" = ${prescriptionID}
          `;
      }
      const finalPrescription = await tx.prescription.update({
        where: { prescriptionID },
        data: { note, needReExamine, totalTreatmentDays: dateDiff },
        select: PrescriptionService.prescriptionInternalView,
      });
      return finalPrescription;
    });
    return prescription;
  }

  async updateDetails(prescriptionID: string, target: unknown, payload: PrescriptionType) {
    const { details, deleteList } = payload;
    console.log(deleteList, details);
    const { totalTreatmentDays = 1 } = (target as Partial<PrescriptionType>) ?? {};
    const updatedPrescription = await prisma.$transaction(async (tx) => {
      if (deleteList && deleteList.length > 0) {
        await this.deleteMany(prescriptionID, deleteList, tx);
        if ((await this.countMedicine(prescriptionID, tx)) == 0) {
          // Manually delete
          await this.deletePrescriptionByID(prescriptionID, tx);
          return null;
        }
      }
      if (details.length > 0) {
        const upsertDetails = this.renderDoseList(details, totalTreatmentDays);
        await this.upsertMany(prescriptionID, upsertDetails, tx);
      }
      return await this.findByID(prescriptionID, tx, { mode: "INTERNAL", onlyAllowDraft: true });
    });
    return updatedPrescription;
  }

  async deletePrescriptionByID(prescriptionID: string, tx?: Client, doctorID?: string) {
    const deletedItem = await this.resolveClient(tx).prescription.delete({
      where: { prescriptionID, doctorID, status: PrescriptionStatus.draft },
    });
    return deletedItem;
  }
}
export default new PrescriptionService();
