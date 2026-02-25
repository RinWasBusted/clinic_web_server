import prisma from "../../../utils/prisma.js";
import type { MedicineUnit } from "../../../generated/prisma/index.js";

interface CreateMedicineInput {
  medicineName: string;
  unit: MedicineUnit;
  price: number;
  quantity?: number;
  description?: string;
  medicineImage?: string;
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

  const [data, totalItems] = await Promise.all([
    prisma.medicine.findMany({
      where: {
        medicineName: {
          contains: search,
          mode: "insensitive" as const,
        },
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
      skip,
      take: pageSize,
      orderBy: {
        createdAt: "desc",
      },
    }),
    prisma.medicine.count({
      where: {
        medicineName: {
          contains: search,
          mode: "insensitive" as const,
        },
      },
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
