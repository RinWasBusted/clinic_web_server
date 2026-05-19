import prisma from "../../../utils/prisma.js";

class DiseaseService {
  // J, J0, J07...
  async findDiseaseByWord(keyword: string) {
    return await prisma.disease.findMany({
      where: {
        diseaseID: {
          startsWith: keyword,
        },
      },
      omit: {
        note: true,
      },
      take: 10,
    });
  }
}

export default new DiseaseService();
