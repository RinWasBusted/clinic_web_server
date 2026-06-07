import prisma from "./prisma.js";

/**
 * Tính ngày có hiệu lực = ngày hôm nay + 1 (UTC Date-only, không có giờ).
 *
 * Quy tắc nghiệp vụ: admin cập nhật config hôm nay →
 * giá mới chỉ áp dụng từ ngày mai trở đi.
 * → Mọi hóa đơn/báo cáo hôm nay đều dùng giá cũ, KHÔNG bị ảnh hưởng
 *   dù admin cập nhật bao nhiêu lần trong ngày.
 */
export function getTomorrowUTCDate(): Date {
  const d = new Date();
  d.setUTCDate(d.getUTCDate() + 1);
  d.setUTCHours(0, 0, 0, 0);
  return d;
}

/**
 * Ghi (hoặc ghi đè) history khi admin thay đổi giá trị config.
 *
 * effectiveDate luôn = ngày mai (UTC).
 * Nếu admin cập nhật 2 lần trong cùng 1 ngày → upsert theo (key, effectiveDate)
 * → chỉ giữ lại bản mới nhất, changedAt cập nhật thành thời điểm gần nhất.
 *
 * @param key      - Key của config (VD: "COUNT_FEE")
 * @param newValue - Giá trị MỚI sẽ có hiệu lực từ ngày mai
 */
export async function recordConfigChange(
  key: string,
  newValue: string
): Promise<void> {
  const effectiveDate = getTomorrowUTCDate();

  await prisma.systemConfigHistory.upsert({
    where: { key_effectiveDate: { key, effectiveDate } },
    create: { key, value: newValue, effectiveDate },
    update: { value: newValue, changedAt: new Date() }, // ghi đè bản cũ trong ngày
  });
}

/**
 * Lấy giá trị của một SystemConfig key ÁP DỤNG VÀO MỘT NGÀY CỤ THỂ.
 *
 * Logic:
 *  1. Tìm bản history gần nhất có effectiveDate <= date
 *     (tức là giá trị đang có hiệu lực vào ngày đó).
 *  2. Nếu không có history → fallback về giá trị hiện tại trong SystemConfig
 *     (trường hợp config chưa bao giờ có lịch sử).
 *  3. Nếu key không tồn tại → trả về null.
 *
 * @param key  - Key của config (VD: "COUNT_FEE")
 * @param date - Ngày muốn tra cứu (thường là scheduleDate của appointment)
 */
export async function getConfigAtDate(
  key: string,
  date: Date
): Promise<string | null> {
  // Chuẩn hóa về đầu ngày UTC để so sánh DATE-only
  const dayOnly = new Date(Date.UTC(
    date.getUTCFullYear(),
    date.getUTCMonth(),
    date.getUTCDate()
  ));

  const historyRecord = await prisma.systemConfigHistory.findFirst({
    where: {
      key,
      effectiveDate: { lte: dayOnly },
    },
    orderBy: { effectiveDate: "desc" },
    select: { value: true },
  });

  if (historyRecord) {
    return historyRecord.value;
  }

  // Fallback: config chưa có lịch sử → dùng giá trị hiện tại
  const current = await prisma.systemConfig.findUnique({
    where: { key },
    select: { value: true },
  });

  return current?.value ?? null;
}

/**
 * @deprecated Dùng getConfigAtDate() thay thế.
 * Giữ lại để không breaking change với các nơi đang import.
 */
export const getConfigAtEndOfDay = getConfigAtDate;
