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

  // 1. Tính toán in-memory các thay đổi quantity
  const medicineQuantityMap = new Map<number, number>();
  items.forEach((item) => {
    const quantityChange = imexType === "export" ? -item.quantity : item.quantity;
    medicineQuantityMap.set(
      item.medicineID,
      (medicineQuantityMap.get(item.medicineID) || 0) + quantityChange
    );
  });

  // 2. Tạo imex log, items, và update medicine quantities TRONG transaction
  const imexLog = await prisma.$transaction(
    async (tx) => {
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

      const itemsData = items.map((item) => ({
        imexID: log.imexID,
        medicineID: item.medicineID,
        quantity: imexType === "export" ? -item.quantity : item.quantity,
        note: item.note,
      }));

      await tx.imexMedicineDetails.createMany({
        data: itemsData,
      });

      for (const [medicineId, quantityChange] of medicineQuantityMap.entries()) {
        await tx.medicine.update({
          where: { medicineID: medicineId },
          data: { quantity: { increment: quantityChange } },
        });
      }

      return log;
    },
    { isolationLevel: "ReadCommitted",
      maxWait: 5000,
      timeout: 10000,
    }
  );

  // 3. Fetch complete imex log with details
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
  const medicineQuantityMap = new Map<number, number>();
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
        medicineQuantityMap.set(
          item.medicineID,
          (medicineQuantityMap.get(item.medicineID) || 0) + quantityChange
        );
      }
    }

    // Items bị xóa - cần trừ lại số lượng
    for (const medicineId of toDeleteIds) {
      const deletedQuantity = oldDetailsMap.get(medicineId) || 0;
      if (deletedQuantity !== 0) {
        medicineQuantityMap.set(
          medicineId,
          (medicineQuantityMap.get(medicineId) || 0) - deletedQuantity
        );
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

      // Query 5+: Update tồn kho (n queries using atomic increment)
      for (const [medicineId, quantityChange] of medicineQuantityMap.entries()) {
        await tx.medicine.update({
          where: { medicineID: medicineId },
          data: { quantity: { increment: quantityChange } },
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
    { isolationLevel: "ReadCommitted",
      maxWait: 5000, 
      timeout: 10000,
    }
  );
};

export const deleteImexLogService = async (imexID: string) => {
  // 1. Fetch dữ liệu cũ để tính quantity changes
  const allDetails = await prisma.imexMedicineDetails.findMany({
    where: { imexID },
    select: { medicineID: true, quantity: true },
  });

  if (allDetails.length === 0) {
    throw new Error("Imex log not found");
  }

  // 2. Tính toán in-memory các thay đổi quantity (đảo dấu để reverse imex operation)
  const medicineQuantityMap = new Map<number, number>();
  for (const detail of allDetails) {
    medicineQuantityMap.set(
      detail.medicineID,
      (medicineQuantityMap.get(detail.medicineID) || 0) - detail.quantity
    );
  }

  // 3. Delete imex log và update medicine quantities 
  await prisma.$transaction(
    async (tx) => {
      await tx.imexMedicineLog.delete({
        where: { imexID },
      });

      for (const [medicineId, quantityChange] of medicineQuantityMap.entries()) {
        await tx.medicine.update({
          where: { medicineID: medicineId },
          data: { quantity: { increment: quantityChange } },
        });
      }
    },
    { isolationLevel: "ReadCommitted",
      maxWait: 5000,
      timeout: 10000,
    }
  );

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
