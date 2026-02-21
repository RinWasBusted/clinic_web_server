import prisma from "../../../utils/prisma.js";
import type { ImexType } from "../../../generated/prisma/index.js";

interface AddImexItemsInput {
  medicineID: number;
  quantity: number;
  note?: string;
}

interface CreateImexInput {
  imexType: ImexType;
  pharmacistID: string;
  value?: number;
  note?: string;
  items: AddImexItemsInput[];
}

export const getImexLogsService = async (
  type?: ImexType,
  fromDate?: Date,
  toDate?: Date
) => {
  const where: Record<string, ImexType | { gte?: Date; lte?: Date }> = {};

  if (type) {
    where.imexType = type;
  }

  if (fromDate || toDate) {
    where.createdAt = {};
    if (fromDate) {
      where.createdAt.gte = fromDate;
    }
    if (toDate) {
      where.createdAt.lte = toDate;
    }
  }

  return prisma.imexMedicineLog.findMany({
    where,
    select: {
      imexID: true,
      imexType: true,
      pharmacist: {
        select: {
          account: {
            select: {
              firstName: true,
              lastName: true,
              email: true,
            },
          },
        },
      },
      value: true,
      createdAt: true,
      note: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
};

export const createImexLogService = async (data: CreateImexInput) => {
  const { imexType, pharmacistID, value, note, items } = data;

  // Create imex log and items in transaction
  const imexLog = await prisma.$transaction(
    async (tx) => {
      // Create imex log
      const log = await tx.imexMedicineLog.create({
        data: {
          imexType,
          pharmacistID,
          value: value || 0,
          note,
        },
        select: {
          imexID: true,
          imexType: true,
          pharmacistID: true,
          value: true,
          createdAt: true,
          note: true,
        },
      });

      // Prepare items data for bulk create
      const itemsData = items.map((item) => ({
        imexID: log.imexID,
        medicineID: item.medicineID,
        quantity: imexType === "export" ? -item.quantity : item.quantity,
        note: item.note,
      }));

      // Create all items in one query
      await tx.imexMedicineDetails.createMany({
        data: itemsData,
      });

      return log;
    },
    { isolationLevel: "ReadCommitted" }
  );

  const medicineQuantityMap = new Map<number, number>();
  items.forEach((item) => {
    const quantityChange = imexType === "export" ? -item.quantity : item.quantity;
    medicineQuantityMap.set(
      item.medicineID,
      (medicineQuantityMap.get(item.medicineID) || 0) + quantityChange
    );
  });

  // Update medicine quantities outside transaction
  if (medicineQuantityMap.size > 0) {
    const medicineIds = Array.from(medicineQuantityMap.keys());

    // Fetch all medicines that need updating
    const medicines = await prisma.medicine.findMany({
      where: { medicineID: { in: medicineIds } },
      select: { medicineID: true, quantity: true },
    });

    // Batch update all medicines
    for (const medicine of medicines) {
      const quantityChange = medicineQuantityMap.get(medicine.medicineID) || 0;
      const newQuantity = medicine.quantity + quantityChange;
      await prisma.medicine.update({
        where: { medicineID: medicine.medicineID },
        data: { quantity: newQuantity },
      });
    }
  }

  // Fetch complete imex log with details
  return prisma.imexMedicineLog.findUnique({
    where: { imexID: imexLog.imexID },
    select: {
      imexID: true,
      imexType: true,
      pharmacistID: true,
      value: true,
      createdAt: true,
      note: true,
      details: {
        select: {
          medicineID: true,
          quantity: true,
          note: true,
          medicine: {
            select: {
              medicineName: true,
              unit: true,
              price: true,
            },
          },
        },
      },
    },
  });
};

export const updateImexLogService = async (
  imexID: string,
  data: Partial<CreateImexInput>
) => {
  // 1. Fetch dữ liệu cũ NGOÀI transaction
  const imexLog = await prisma.imexMedicineLog.findUnique({
    where: { imexID },
  });

  if (!imexLog) {
    throw new Error("Imex log not found");
  }

  // Fetch old details và medicines trước khi update
  let oldDetailsMap = new Map<number, number>();
  let medicineQuantityMap = new Map<number, number>();
  let toDeleteIds: number[] = [];
  const toCreate: Array<{
    imexID: string;
    medicineID: number;
    quantity: number;
    note?: string;
  }> = [];
  const toUpdateIds = new Set<number>();

  if (data.items && data.items.length > 0) {
    // Fetch dữ liệu cũ
    const oldDetails = await prisma.imexMedicineDetails.findMany({
      where: { imexID },
      select: { medicineID: true, quantity: true },
    });

    oldDetailsMap = new Map(oldDetails.map((d) => [d.medicineID, d.quantity]));

    // Fetch medicine quantities hiện tại
    const medicines = await prisma.medicine.findMany({
      where: { medicineID: { in: data.items.map((item) => item.medicineID) } },
      select: { medicineID: true, quantity: true },
    });

    medicineQuantityMap = new Map(medicines.map((m) => [m.medicineID, m.quantity]));

    // 2. Tính toán in-memory các array thao tác
    const newItemIds = new Set(data.items.map((item) => item.medicineID));
    const oldItemIds = new Set(oldDetailsMap.keys());

    // Items cần xóa (có trong cũ nhưng không có trong mới)
    toDeleteIds = Array.from(oldItemIds).filter((id) => !newItemIds.has(id));

    // Items cần tạo hoặc cập nhật
    for (const item of data.items) {
      const quantityToStore =
        imexLog.imexType === "export" ? -item.quantity : item.quantity;

      if (!oldDetailsMap.has(item.medicineID)) {
        // Item mới
        toCreate.push({
          imexID,
          medicineID: item.medicineID,
          quantity: quantityToStore,
          note: item.note,
        });
      } else {
        // Item cũ - cần update
        toUpdateIds.add(item.medicineID);
      }
    }

    // Tính toán quantity changes cho kho hàng
    for (const item of data.items) {
      const quantityToStore =
        imexLog.imexType === "export" ? -item.quantity : item.quantity;
      const oldQuantity = oldDetailsMap.get(item.medicineID) || 0;
      const quantityChange = quantityToStore - oldQuantity;

      if (quantityChange !== 0) {
        const currentQuantity = medicineQuantityMap.get(item.medicineID) || 0;
        const newQuantity = Math.max(0, currentQuantity + quantityChange);
        medicineQuantityMap.set(item.medicineID, newQuantity);
      }
    }

    // Items bị xóa - cần trừ lại số lượng
    for (const medicineId of toDeleteIds) {
      const deletedQuantity = oldDetailsMap.get(medicineId) || 0;
      if (deletedQuantity !== 0) {
        const currentQuantity = medicineQuantityMap.get(medicineId) || 0;
        const newQuantity = Math.max(0, currentQuantity - deletedQuantity);
        medicineQuantityMap.set(medicineId, newQuantity);
      }
    }
  }

  // 3. Chạy prisma.$transaction([]) với các queries riêng biệt
  return await prisma.$transaction(
    async (tx) => {
      // Query 1: Update metadata ImexMedicineLog
      if (data.value !== undefined || data.note !== undefined) {
        await tx.imexMedicineLog.update({
          where: { imexID },
          data: {
            value: data.value,
            note: data.note,
          },
        });
      }

      // Query 2: Delete chi tiết bị xóa
      if (toDeleteIds.length > 0) {
        await tx.imexMedicineDetails.deleteMany({
          where: {
            imexID,
            medicineID: { in: toDeleteIds },
          },
        });
      }

      // Query 3: Create chi tiết mới
      if (toCreate.length > 0) {
        await tx.imexMedicineDetails.createMany({
          data: toCreate,
        });
      }

      // Query 4: Update chi tiết bị sửa
      if (toUpdateIds.size > 0 && data.items) {
        for (const item of data.items) {
          if (toUpdateIds.has(item.medicineID)) {
            const quantityToStore =
              imexLog.imexType === "export" ? -item.quantity : item.quantity;

            await tx.imexMedicineDetails.update({
              where: { imexID_medicineID: { imexID, medicineID: item.medicineID } },
              data: {
                quantity: quantityToStore,
                note: item.note,
              },
            });
          }
        }
      }

      // Query 5+: Update tồn kho (n queries increment/decrement)
      for (const [medicineId, newQuantity] of medicineQuantityMap.entries()) {
        await tx.medicine.update({
          where: { medicineID: medicineId },
          data: { quantity: newQuantity },
        });
      }

      // Fetch và return kết quả
      return tx.imexMedicineLog.findUnique({
        where: { imexID },
        select: {
          imexID: true,
          imexType: true,
          pharmacistID: true,
          value: true,
          createdAt: true,
          note: true,
          details: {
            select: {
              medicineID: true,
              quantity: true,
              note: true,
              medicine: {
                select: {
                  medicineName: true,
                  unit: true,
                  price: true,
                },
              },
            },
          },
        },
      });
    },
    { isolationLevel: "ReadCommitted" }
  );
};

export const deleteImexLogService = async (imexID: string) => {
  // Delete imex log and fetch details in transaction
  const allDetails = await prisma.$transaction(
    async (tx) => {
      // Fetch all imex details before deleting
      const details = await tx.imexMedicineDetails.findMany({
        where: { imexID },
        select: { medicineID: true, quantity: true },
      });

      // Delete the imex log (will cascade delete details)
      await tx.imexMedicineLog.delete({
        where: { imexID },
      });

      return details;
    },
    { isolationLevel: "ReadCommitted" }
  );

  // Calculate quantity changes outside transaction
  const medicineQuantityMap = new Map<number, number>();
  for (const detail of allDetails) {
    medicineQuantityMap.set(
      detail.medicineID,
      (medicineQuantityMap.get(detail.medicineID) || 0) - detail.quantity
    );
  }

  // Update medicine quantities outside transaction
  if (medicineQuantityMap.size > 0) {
    const medicines = await prisma.medicine.findMany({
      where: { medicineID: { in: Array.from(medicineQuantityMap.keys()) } },
      select: { medicineID: true, quantity: true },
    });

    for (const medicine of medicines) {
      const quantityChange = medicineQuantityMap.get(medicine.medicineID) || 0;
      const newQuantity = Math.max(0, medicine.quantity + quantityChange);
      await prisma.medicine.update({
        where: { medicineID: medicine.medicineID },
        data: { quantity: newQuantity },
      });
    }
  }

  return { message: "Imex log deleted successfully" };
};


export const getImexByIdService = (imexID: string) => {
  return prisma.imexMedicineLog.findUnique({
    where: { imexID },
    select: {
      imexID: true,
      imexType: true,
      pharmacistID: true,
      value: true,
      createdAt: true,
      note: true,
      details: {
        select: {
          medicineID: true,
          quantity: true,
          note: true,
          medicine: {
            select: {
              medicineName: true,
              unit: true,
              price: true,
            },
          },
        },
      },
    },
  });
};
