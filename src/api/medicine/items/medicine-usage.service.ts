import prisma from "../../../utils/prisma.js";

export const getAllMedicineUsagesService = () => {
  return prisma.medicineUsage.findMany({
    orderBy: { id: "asc" },
  });
};

export const getMedicineUsageByIdService = (id: number) => {
  return prisma.medicineUsage.findUnique({
    where: { id },
  });
};

export const createMedicineUsageService = (usage: string) => {
  return prisma.medicineUsage.create({
    data: { usage: usage.trim() },
  });
};

export const updateMedicineUsageService = (id: number, usage: string) => {
  return prisma.medicineUsage.update({
    where: { id },
    data: { usage: usage.trim() },
  });
};

export const deleteMedicineUsageService = (id: number) => {
  return prisma.medicineUsage.delete({
    where: { id },
  });
};
