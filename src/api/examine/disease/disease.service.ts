import prisma from "../../../utils/prisma.js";

class DiseaseService {
  // J, J0, J07...
  async findDiseaseByWord(keyword: string) {
    return await prisma.disease.findMany({
      where: {
        diseaseID: {
          startsWith: keyword,
        },
        status: { not: "DELETED" },
      },
      omit: {
        note: true,
      },
      take: 10,
    });
  }

  // Search by disease name (case-insensitive, partial match)
  async searchDiseaseByName(keyword: string) {
    return await prisma.disease.findMany({
      where: {
        diseaseName: {
          contains: keyword,
          mode: "insensitive",
        },
        status: { not: "DELETED" },
      },
      omit: {
        note: true,
      },
      take: 10,
    });
  }
  // Get all diseases with pagination
  async getAllDiseases(page: number = 1, limit: number = 10) {
    const skip = (page - 1) * limit;
    const [total, data] = await Promise.all([
      prisma.disease.count({
        where: { status: { not: "DELETED" } },
      }),
      prisma.disease.findMany({
        where: { status: { not: "DELETED" } },
        skip,
        take: limit,
      }),
    ]);
    return { total, data };
  }

  // Get disease by ID
  async getDiseaseById(id: string) {
    return await prisma.disease.findFirst({
      where: {
        diseaseID: id,
        status: { not: "DELETED" },
      },
    });
  }

  // Create new disease
  async createDisease(data: { diseaseID: string; diseaseName: string; note?: string }) {
    return await prisma.disease.create({
      data,
    });
  }

  // Update existing disease
  async updateDisease(id: string, data: { diseaseName?: string; note?: string }) {
    return await prisma.disease.update({
      where: { diseaseID: id },
      data,
    });
  }

  // Delete disease (soft delete)
  async deleteDisease(id: string) {
    return await prisma.disease.update({
      where: { diseaseID: id },
      data: { status: "DELETED" }
    });
  }
}

export default new DiseaseService();
