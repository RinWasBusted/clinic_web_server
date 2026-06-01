import prisma from "../../../utils/prisma.js";

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
            }
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

// BM5.1: Báo Cáo Doanh Thu Theo Tháng
export const getMonthlyRevenueReport = async (month: number, year: number) => {
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0, 23, 59, 59, 999);

    // Lấy giá tiền khám từ cấu hình hệ thống (COUNT_FEE)
    const examFeeConfig = await prisma.systemConfig.findUnique({
        where: { key: "COUNT_FEE" }
    });
    const examFee = examFeeConfig ? parseFloat(examFeeConfig.value) : 40000;

    const appointments = await prisma.appointment.findMany({
        where: {
            scheduleDate: {
                gte: startDate,
                lte: endDate
            },
            status: "approved"
        }
    });

    const prescriptions = await prisma.prescription.findMany({
        where: {
            createdAt: {
                gte: startDate,
                lte: endDate
            },
            status: "done"
        },
        include: {
            details: {
                include: {
                    medicine: true
                }
            }
        }
    });

    const daysInMonth = new Date(year, month, 0).getDate();
    const dailyData = new Map<number, { patientCount: number; revenue: number }>();
    
    for (let i = 1; i <= daysInMonth; i++) {
        dailyData.set(i, { patientCount: 0, revenue: 0 });
    }

    appointments.forEach(app => {
        const date = app.scheduleDate.getDate();
        const data = dailyData.get(date);
        if (data) {
            data.patientCount += 1;
            data.revenue += examFee;
        }
    });

    prescriptions.forEach(pres => {
        const date = pres.createdAt.getDate();
        const data = dailyData.get(date);
        if (data) {
            let medicineFee = 0;
            pres.details.forEach(d => {
                medicineFee += d.quantity * Number(d.medicine.price || 0);
            });
            data.revenue += medicineFee;
        }
    });

    const reports = [];
    for (let i = 1; i <= daysInMonth; i++) {
        const data = dailyData.get(i)!;
        if (data.patientCount > 0 || data.revenue > 0) {
            reports.push({
                date: i,
                month: month,
                year: year,
                patientCount: data.patientCount,
                revenue: data.revenue
            });
        }
    }

    return reports;
};

// BM5.2: Báo Cáo Sử Dụng Thuốc
export const getMedicineUsageReport = async (month: number, year: number) => {
    return await prisma.medicineMonthReport.findMany({
        where: {
            month: month,
            year: year
        },
        include: {
            medicine: {
                include: {
                    unit: true
                }
            }
        },
        orderBy: {
            useCount: 'desc'
        }
    });
};
