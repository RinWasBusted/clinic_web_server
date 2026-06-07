import prisma from "../../../utils/prisma.js";
import { recordConfigChange, getTomorrowUTCDate } from "../../../utils/configHistory.js";

class SystemConfigService {
  /** Lấy tất cả config hiện tại */
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

  /**
   * Tạo mới 1 config.
   * KHÔNG ghi history cho lần tạo đầu tiên vì giá này áp dụng ngay hôm nay
   * (history chỉ track các lần thay đổi sau đó, hiệu lực ngày mai).
   */
  async create(key: string, value: string, description?: string) {
    return await prisma.systemConfig.create({
      data: { key, value, description },
    });
  }

  /**
   * Cập nhật value (và description nếu có) theo key.
   *
   * - SystemConfig.value được cập nhật ngay (để getAll/getByKey trả về giá mới nhất).
   * - SystemConfigHistory ghi nhận với effectiveDate = ngày mai → hóa đơn/báo cáo
   *   hôm nay vẫn dùng giá cũ, từ ngày mai mới dùng giá mới.
   * - Nếu admin cập nhật 2 lần trong ngày → upsert theo (key, effectiveDate)
   *   → chỉ giữ bản mới nhất, không chồng chất lịch sử.
   */
  async update(key: string, value: string, description?: string) {
    return await prisma.$transaction(async (tx) => {
      // 1. Ghi history với effectiveDate = ngày mai
      await recordConfigChange(key, value);

      // 2. Cập nhật giá trị hiện tại
      return await tx.systemConfig.update({
        where: { key },
        data: {
          value,
          ...(description !== undefined && { description }),
        },
      });
    });
  }

  /**
   * Upsert: tạo nếu chưa có, cập nhật nếu đã có.
   * Tương tự update — ghi history với effectiveDate = ngày mai.
   */
  async upsert(key: string, value: string, description?: string) {
    return await prisma.$transaction(async (tx) => {
      // 1. Ghi history (effectiveDate = ngày mai, upsert nếu đã có)
      await recordConfigChange(key, value);

      // 2. Cập nhật giá trị hiện tại
      return await tx.systemConfig.upsert({
        where: { key },
        create: { key, value, description },
        update: {
          value,
          ...(description !== undefined && { description }),
        },
      });
    });
  }

  /** Xóa 1 config theo key — history bị xóa theo (onDelete: Cascade) */
  async delete(key: string) {
    return await prisma.systemConfig.delete({
      where: { key },
    });
  }

  /**
   * Lấy lịch sử thay đổi của 1 config key, sắp xếp theo effectiveDate mới nhất.
   * Bao gồm cả các thay đổi chưa có hiệu lực (effectiveDate > hôm nay).
   */
  async getHistory(key: string, limit = 50) {
    const today = new Date();
    return await prisma.systemConfigHistory.findMany({
      where: { key },
      orderBy: { effectiveDate: "desc" },
      take: limit,
      select: {
        id: true,
        key: true,
        value: true,
        changedAt: true,
        effectiveDate: true,
        // Thêm trường tiện lợi: giá này đã có hiệu lực chưa?
      },
    }).then(records => records.map(r => ({
      ...r,
      isPending: r.effectiveDate > today, // true = chưa có hiệu lực (effectiveDate là ngày mai+)
    })));
  }

  /**
   * Lấy thay đổi đang chờ hiệu lực (effectiveDate = ngày mai) của 1 key.
   * Dùng để hiển thị "giá sẽ áp dụng từ ngày mai" trên UI admin.
   */
  async getPendingChange(key: string) {
    const tomorrow = getTomorrowUTCDate();
    return await prisma.systemConfigHistory.findUnique({
      where: { key_effectiveDate: { key, effectiveDate: tomorrow } },
    });
  }
}

export default new SystemConfigService();
