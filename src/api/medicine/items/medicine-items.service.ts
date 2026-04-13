import prisma, { Prisma } from "../../../utils/prisma.js";
import type { MedicineUnit } from "../../../generated/prisma/index.js";

interface CreateMedicineInput {
  medicineName: string;
  unit: MedicineUnit;
  price: number;
  quantity?: number;
  description?: string;
  medicineImage?: string;
}

interface BulkCreateMedicineSuccessItem {
  index: number;
  medicineName: string;
}

interface BulkCreateMedicineFailedItem {
  index: number;
  medicineName: string;
  reason: string;
}

interface BulkCreateMedicineResult {
  requestCount: number;
  successCount: number;
  failedCount: number;
  success: BulkCreateMedicineSuccessItem[];
  failed: BulkCreateMedicineFailedItem[];
}

export const createMedicineService = (data: CreateMedicineInput) => {
  return prisma.medicine.create({
    data: {
      medicineName: data.medicineName,
      unit: data.unit,
      price: data.price,
      quantity: data.quantity || 0,
      description: data.description,
      medicineImage: data.medicineImage,
    },
    select: {
      medicineID: true,
      medicineName: true,
      unit: true,
      price: true,
      quantity: true,
      description: true,
      medicineImage: true,
      createdAt: false,
    },
  });
};

export const createManyMedicineService = async (
  medicines: CreateMedicineInput[]
): Promise<BulkCreateMedicineResult> => {
  const tasks = medicines.map((medicine, index) => (async () => {
    const { medicineName, unit, price, description, quantity, medicineImage } = medicine;

    if (!medicineName || !unit || price === undefined || Number.isNaN(price)) {
      throw new Error(
        `Missing required fields for medicine at index ${index}: medicineName, unit, price`
      );
    }

    await createMedicineService({
      medicineName,
      unit,
      price,
      description,
      quantity,
      medicineImage,
    });

    return medicine;
  })());

  const settled = await Promise.allSettled(tasks);

  const success: BulkCreateMedicineSuccessItem[] = [];
  const failed: BulkCreateMedicineFailedItem[] = [];

  settled.forEach((result, index) => {
    const medicine = medicines[index];
    const medicineName = medicine?.medicineName || `index ${index}`;

    if (result.status === "fulfilled") {
      success.push({ index, medicineName });
      return;
    }

    const err = result.reason;

    if (err instanceof Prisma.PrismaClientKnownRequestError) {
      if (err.code === "P2002") {
        failed.push({ index, medicineName, reason: "DUPLICATE_UNIQUE" });
        return;
      }

      failed.push({ index, medicineName, reason: `PRISMA_${err.code}` });
      return;
    }

    failed.push({
      index,
      medicineName,
      reason: err instanceof Error ? err.message : "UNKNOWN_ERROR",
    });
  });

  return {
    requestCount: medicines.length,
    successCount: success.length,
    failedCount: failed.length,
    success,
    failed,
  };
};

export const getMedicinesService = () => {
  return prisma.medicine.findMany({
    select: {
      medicineID: true,
      medicineName: true,
      unit: true,
      price: true,
      quantity: true,
      description: true,
      medicineImage: true,
      createdAt: true,
    },
  });
};

export const getMedicineByIdService = (medicineID: number) => {
  return prisma.medicine.findUnique({
    where: { medicineID },
    select: {
      medicineID: true,
      medicineName: true,
      unit: true,
      price: true,
      quantity: true,
      description: true,
      medicineImage: true,
      createdAt: true,
    },
  });
};

export const getMedicineItemsService = async (
  search: string,
  page: number,
  pageSize: number
) => {
  const skip = (page - 1) * pageSize;
  const trimmedSearch = search.trim();
  const whereClause =
    trimmedSearch.length === 0
      ? undefined
      : {
          OR: [
            {
              medicineName: {
                startsWith: trimmedSearch,
                mode: "insensitive" as const,
              },
            },
            {
              medicineName: {
                contains: ` ${trimmedSearch}`,
                mode: "insensitive" as const,
              },
            },
          ],
        };

  const [data, totalItems] = await Promise.all([
    prisma.medicine.findMany({
      where: whereClause,
      select: {
        medicineID: true,
        medicineName: true,
        unit: true,
        price: true,
        quantity: true,
        description: true,
        medicineImage: true,
        createdAt: true,
      },
      skip,
      take: pageSize,
      orderBy: {
        createdAt: "desc",
      },
    }),
    prisma.medicine.count({
      where: whereClause,
    }),
  ]);

  const totalPages = Math.ceil(totalItems / pageSize);

  return {
    data,
    currentPage: page,
    pageSize,
    totalItems,
    totalPages,
  };
};

export const updateMedicineService = (
  medicineID: number,
  data: Partial<CreateMedicineInput>
) => {
  return prisma.medicine.update({
    where: { medicineID },
    data: {
      medicineName: data.medicineName,
      unit: data.unit,
      price: data.price,
      description: data.description,
      medicineImage: data.medicineImage,
    },
    select: {
      medicineID: true,
      medicineName: true,
      unit: true,
      price: true,
      quantity: true,
      description: true,
      medicineImage: true,
      createdAt: true,
    },
  });
};

export const deleteMedicineService = (medicineID: number) => {
  return prisma.medicine.delete({
    where: { medicineID },
  });
};
