import prisma from "../../../utils/prisma.js";
import { getConfigAtEndOfDay } from "../../../utils/configHistory.js";


// Lấy giới hạn bệnh nhân trong ngày từ cấu hình hệ thống
export const getMaxPatientsPerDay = async (): Promise<number> => {
    const config = await prisma.systemConfig.findUnique({
        where: { key: "MAX_PATIENTS_PER_DAY" }
    });
    return config ? parseInt(config.value, 10) : 40; // Default là 40
};

// BM1: Lấy danh sách khám bệnh theo ngày
export const getAppointmentsByDate = async (dateStr: string) => {
    const dateObj = new Date(dateStr);
    return await prisma.appointment.findMany({
        where: {
            scheduleDate: {
                equals: dateObj
            },
            status: "approved"
        },
        include: {
            patient: {
                include: {
                    account: {
                        select: {
                            firstName: true,
                            lastName: true,
                            gender: true,
                            birthDate: true,
                            address: true
                        }
                    }
                }
            }
        },
        orderBy: {
            createdAt: 'asc'
        }
    });
};
export const getExamineLogDetails = async (examineId: string) => {
    return await prisma.examineLog.findUnique({
        where: { examineID: examineId },
        include: {
            patient: {
                include: {
                    account: {
                        select: {
                            firstName: true,
                            lastName: true
                        }
                    }
                }
            },
            details: {
                include: {
                    disease: true
                }
            },
            prescription: {
                include: {
                    details: {
                        include: {
                        medicine: {
                            include: {
                                unit: true
                            }
                        }
                        }
                    }
                }
            }
        }
    });
};

// BM3: Danh Sách Bệnh Nhân theo ngày
export const getExamineLogsByDate = async (dateStr: string) => {
    const startOfDay = new Date(dateStr);
    startOfDay.setUTCHours(0, 0, 0, 0);
    const endOfDay = new Date(dateStr);
    endOfDay.setUTCHours(23, 59, 59, 999);

    return await prisma.examineLog.findMany({
        where: {
            createdAt: {
                gte: startOfDay,
                lte: endOfDay
            },
            status: "done"
        },
        include: {
            patient: {
                include: {
                    account: {
                        select: {
                            firstName: true,
                            lastName: true
                        }
                    }
                }
            },
            details: {
                include: {
                    disease: true
                }
            }
        },
        orderBy: {
            createdAt: 'asc'
        }
    });
};

export const getExamineLogsByKeyword = async (keyword: string) => {
    return await prisma.examineLog.findMany({
        where: {
            status: "done",
            patient: {
                account: {
                    OR: [
                        { firstName: { contains: keyword, mode: "insensitive" } },
                        { lastName: { contains: keyword, mode: "insensitive" } },
                        { phoneNumber: { contains: keyword, mode: "insensitive" } }
                    ]
                }
            }
        },
        orderBy: { createdAt: 'desc' },
        include: {
            patient: {
                include: {
                    account: {
                        select: {
                            firstName: true,
                            lastName: true
                        }
                    }
                }
            },
            details: {
                include: {
                    disease: true
                }
            }
        }
    });
};

// BM5.1: Báo Cáo Doanh Thu Theo Tháng
export const getMonthlyRevenueReport = async (month: number, year: number) => {
    const startDate = new Date(Date.UTC(year, month - 1, 1));
    const endDate = new Date(Date.UTC(year, month, 0, 23, 59, 59, 999));

    const [appointments, prescriptions] = await Promise.all([
        prisma.appointment.findMany({
            where: {
                scheduleDate: { gte: startDate, lte: endDate },
                status: "approved"
            },
            select: { scheduleDate: true }
        }),

        // Dùng payAmount đã lưu khi duyệt thuốc — KHÔNG tính lại từ medicine.price
        // (tránh sai lệch khi giá thuốc thay đổi sau này)
        prisma.prescription.findMany({
            where: {
                createdAt: { gte: startDate, lte: endDate },
                status: "done"
            },
            select: {
                payAmount: true,
                createdAt: true
            }
        })
    ]);

    const daysInMonth = new Date(Date.UTC(year, month, 0)).getUTCDate();
    const dailyData = new Map<number, { patientCount: number; revenue: number }>();

    for (let i = 1; i <= daysInMonth; i++) {
        dailyData.set(i, { patientCount: 0, revenue: 0 });
    }

    // Bước 1: Gom appointment theo ngày, sau đó lấy giá khám từng ngày một lần
    const appointmentsByDay = new Map<number, number>(); // day → count
    appointments.forEach(app => {
        // Dùng getUTCDate() để tránh lệch múi giờ
        const day = app.scheduleDate.getUTCDate();
        appointmentsByDay.set(day, (appointmentsByDay.get(day) ?? 0) + 1);
    });

    // Lấy giá khám cho từng ngày có appointment (dùng end-of-day của ngày đó)
    for (const [day, count] of appointmentsByDay.entries()) {
        const dayDate = new Date(Date.UTC(year, month - 1, day));
        const examFeeValue = await getConfigAtEndOfDay("COUNT_FEE", dayDate);
        const examFee = examFeeValue ? parseFloat(examFeeValue) : 0;

        const data = dailyData.get(day);
        if (data) {
            data.patientCount += count;
            data.revenue += examFee * count;
        }
    }

    // Bước 2: Cộng tiền thuốc từ payAmount đã lưu (không tính lại từ medicine.price)
    prescriptions.forEach(pres => {
        const day = pres.createdAt.getUTCDate();
        const data = dailyData.get(day);
        if (data) {
            data.revenue += Number(pres.payAmount ?? 0);
        }
    });

    const reports = [];
    for (let i = 1; i <= daysInMonth; i++) {
        const data = dailyData.get(i)!;
        if (data.patientCount > 0 || data.revenue > 0) {
            reports.push({
                date: i,
                month,
                year,
                patientCount: data.patientCount,
                revenue: data.revenue
            });
        }
    }

    return reports;
};


// BM5.2: Báo Cáo Sử Dụng Thuốc
export const getMedicineUsageReport = async (month: number, year: number) => {
    const startDate = new Date(Date.UTC(year, month - 1, 1));
    const endDate = new Date(Date.UTC(year, month, 0, 23, 59, 59, 999));

    const prescriptions = await prisma.prescription.findMany({
        where: {
            createdAt: { gte: startDate, lte: endDate },
            status: "done"
        },
        include: {
            details: {
                include: {
                    medicine: {
                        include: {
                            unit: true
                        }
                    }
                }
            }
        }
    });

    const medicineMap = new Map<string | number, { medicine: any, soLuong: number, soLanDung: number }>();

    prescriptions.forEach(p => {
        p.details.forEach(d => {
            const medId = d.medicineID;
            if (!medicineMap.has(medId)) {
                medicineMap.set(medId, {
                    medicine: d.medicine,
                    soLuong: 0,
                    soLanDung: 0
                });
            }
            const data = medicineMap.get(medId)!;
            data.soLuong += d.quantity;
            data.soLanDung += 1; // Mỗi đơn tính là 1 lần xuất dùng
        });
    });

    const report = Array.from(medicineMap.values()).map(item => ({
        medicine: item.medicine,
        soLuong: item.soLuong,
        soLanDung: item.soLanDung
    }));

    report.sort((a, b) => b.soLuong - a.soLuong);

    return report;
};
