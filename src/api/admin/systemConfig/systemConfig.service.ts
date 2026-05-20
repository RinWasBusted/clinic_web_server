import prisma from "../../../utils/prisma.js";

class SystemConfigService {
  /** Lấy tất cả config */
  async getAll() {
    return await prisma.systemConfig.findMany({
      orderBy: { key: "asc" },
    });
  }

  /** Lấy 1 config theo key */
  async getByKey(key: string) {
    return await prisma.systemConfig.findUnique({
      where: { key },
    });
  }

  /** Tạo mới 1 config */
  async create(key: string, value: string, description?: string) {
    return await prisma.systemConfig.create({
      data: { key, value, description },
    });
  }

  /** Cập nhật value (và description nếu có) theo key */
  async update(key: string, value: string, description?: string) {
    return await prisma.systemConfig.update({
      where: { key },
      data: {
        value,
        ...(description !== undefined && { description }),
      },
    });
  }

  /** Upsert: tạo nếu chưa có, cập nhật nếu đã có */
  async upsert(key: string, value: string, description?: string) {
    return await prisma.systemConfig.upsert({
      where: { key },
      create: { key, value, description },
      update: {
        value,
        ...(description !== undefined && { description }),
      },
    });
  }

  /** Xóa 1 config theo key */
  async delete(key: string) {
    return await prisma.systemConfig.delete({
      where: { key },
    });
  }
}

export default new SystemConfigService();
