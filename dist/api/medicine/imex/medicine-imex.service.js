import prisma from "../../../utils/prisma.js";
export const getImexLogsService = async (type, fromDate, toDate) => {
    const where = {};
    if (type) {
        where.imexType = type;
    }
    if (fromDate || toDate) {
        where.createdAt = {};
        if (fromDate) {
            where.createdAt.gte = fromDate;
        }
        if (toDate) {
            where.createdAt.lte = toDate;
        }
    }
    return prisma.imexMedicineLog.findMany({
        where,
        select: {
            imexID: true,
            imexType: true,
            pharmacistID: true,
            value: true,
            createdAt: true,
            note: true,
            details: {
                select: {
                    medicineID: true,
                    quantity: true,
                    note: true,
                    medicine: {
                        select: {
                            medicineName: true,
                            unit: true,
                            price: true,
                        },
                    },
                },
            },
        },
        orderBy: {
            createdAt: "desc",
        },
    });
};
export const createImexLogService = async (data) => {
    const { imexType, pharmacistID, value, note, items } = data;
    // Start transaction
    return prisma.$transaction(async (tx) => {
        // Create imex log
        const imexLog = await tx.imexMedicineLog.create({
            data: {
                imexType,
                pharmacistID,
                value: value || 0,
                note,
            },
            select: {
                imexID: true,
                imexType: true,
                pharmacistID: true,
                value: true,
                createdAt: true,
                note: true,
            },
        });
        // Add items to imex
        for (const item of items) {
            // For export, store quantity as negative; for import, store as positive
            const quantityToStore = imexType === "export" ? -item.quantity : item.quantity;
            await tx.imexMedicineDetails.create({
                data: {
                    imexID: imexLog.imexID,
                    medicineID: item.medicineID,
                    quantity: quantityToStore,
                    note: item.note,
                },
            });
            // Update medicine quantity
            await updateMedicineQuantityService(item.medicineID, tx);
        }
        // Fetch complete imex log with details
        return tx.imexMedicineLog.findUnique({
            where: { imexID: imexLog.imexID },
            select: {
                imexID: true,
                imexType: true,
                pharmacistID: true,
                value: true,
                createdAt: true,
                note: true,
                details: {
                    select: {
                        medicineID: true,
                        quantity: true,
                        note: true,
                        medicine: {
                            select: {
                                medicineName: true,
                                unit: true,
                                price: true,
                            },
                        },
                    },
                },
            },
        });
    });
};
export const updateImexLogService = async (imexID, data) => {
    return prisma.$transaction(async (tx) => {
        // Check if imex log exists
        const imexLog = await tx.imexMedicineLog.findUnique({
            where: { imexID },
        });
        if (!imexLog) {
            throw new Error("Imex log not found");
        }
        // Update imex log metadata if provided
        if (data.value !== undefined || data.note !== undefined) {
            await tx.imexMedicineLog.update({
                where: { imexID },
                data: {
                    value: data.value,
                    note: data.note,
                },
            });
        }
        // Update items if provided
        if (data.items && data.items.length > 0) {
            for (const item of data.items) {
                // For export, store quantity as negative; for import, store as positive
                const quantityToStore = imexLog.imexType === "export" ? -item.quantity : item.quantity;
                await tx.imexMedicineDetails.upsert({
                    where: {
                        imexID_medicineID: {
                            imexID,
                            medicineID: item.medicineID,
                        },
                    },
                    update: {
                        quantity: quantityToStore,
                        note: item.note,
                    },
                    create: {
                        imexID,
                        medicineID: item.medicineID,
                        quantity: quantityToStore,
                        note: item.note,
                    },
                });
                // Update medicine quantity
                await updateMedicineQuantityService(item.medicineID, tx);
            }
        }
        // Fetch updated imex log
        return tx.imexMedicineLog.findUnique({
            where: { imexID },
            select: {
                imexID: true,
                imexType: true,
                pharmacistID: true,
                value: true,
                createdAt: true,
                note: true,
                details: {
                    select: {
                        medicineID: true,
                        quantity: true,
                        note: true,
                        medicine: {
                            select: {
                                medicineName: true,
                                unit: true,
                                price: true,
                            },
                        },
                    },
                },
            },
        });
    });
};
export const deleteImexLogService = async (imexID) => {
    return prisma.$transaction(async (tx) => {
        // Get all medicines in this imex log before deleting
        const details = await tx.imexMedicineDetails.findMany({
            where: { imexID },
            select: { medicineID: true },
        });
        // Delete the imex log (will cascade delete details)
        await tx.imexMedicineLog.delete({
            where: { imexID },
        });
        // Update medicine quantities for all affected medicines
        for (const detail of details) {
            await updateMedicineQuantityService(detail.medicineID, tx);
        }
        return { message: "Imex log deleted successfully" };
    });
};
// Calculate and update medicine quantity from all imex details
const updateMedicineQuantityService = async (medicineID, tx = prisma) => {
    // Get all imex details for this medicine
    const imexDetails = await tx.imexMedicineDetails.findMany({
        where: { medicineID },
        select: {
            quantity: true,
        },
    });
    // Calculate total quantity (simply sum all quantities)
    const totalQuantity = Math.max(0, imexDetails.reduce((sum, detail) => sum + detail.quantity, 0));
    // Update medicine quantity
    return tx.medicine.update({
        where: { medicineID },
        data: {
            quantity: totalQuantity,
        },
    });
};
export const getImexByIdService = (imexID) => {
    return prisma.imexMedicineLog.findUnique({
        where: { imexID },
        select: {
            imexID: true,
            imexType: true,
            pharmacistID: true,
            value: true,
            createdAt: true,
            note: true,
            details: {
                select: {
                    medicineID: true,
                    quantity: true,
                    note: true,
                    medicine: {
                        select: {
                            medicineName: true,
                            unit: true,
                            price: true,
                        },
                    },
                },
            },
        },
    });
};
//# sourceMappingURL=medicine-imex.service.js.map