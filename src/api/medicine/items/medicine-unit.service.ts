import prisma from "../../../utils/prisma.js";

export const getAllMedicineUnitsService = () => {
  return prisma.medicineUnit.findMany({
    orderBy: { unitName: "asc" },
  });
};

export const getMedicineUnitByIdService = (unitID: number) => {
  return prisma.medicineUnit.findUnique({
    where: { unitID },
  });
};

export const createMedicineUnitService = (unitName: string) => {
  return prisma.medicineUnit.create({
    data: { unitName: unitName.trim() },
  });
};

export const updateMedicineUnitService = (unitID: number, unitName: string) => {
  return prisma.medicineUnit.update({
    where: { unitID },
    data: { unitName: unitName.trim() },
  });
};

export const deleteMedicineUnitService = (unitID: number) => {
  return prisma.medicineUnit.delete({
    where: { unitID },
  });
};
