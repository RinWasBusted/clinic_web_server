import { getImexLogsService, createImexLogService, updateImexLogService, deleteImexLogService, getImexByIdService, } from "./medicine-imex.service.js";
export const getImexLogs = async (req, res, next) => {
    try {
        const type = req.query.type;
        const from = req.query.from;
        const to = req.query.to;
        const fromDate = from ? new Date(from) : undefined;
        const toDate = to ? new Date(to) : undefined;
        // Validate dates
        if (from && isNaN(fromDate.getTime())) {
            return res.status(400).json({ message: "Invalid 'from' date format" });
        }
        if (to && isNaN(toDate.getTime())) {
            return res.status(400).json({ message: "Invalid 'to' date format" });
        }
        const logs = await getImexLogsService(type, fromDate, toDate);
        return res.status(200).json({
            message: "Imex logs retrieved successfully",
            data: logs,
        });
    }
    catch (error) {
        next(error);
    }
};
export const createImexLog = async (req, res, next) => {
    try {
        const { imexType, pharmacistID, value, note, items } = req.body;
        // Validate required fields
        if (!imexType || !pharmacistID || !items || items.length === 0) {
            return res.status(400).json({
                message: "Missing required fields: imexType, pharmacistID, items (non-empty array)",
            });
        }
        if (!["import", "export"].includes(imexType)) {
            return res.status(400).json({
                message: "Invalid imexType. Must be 'import' or 'export'",
            });
        }
        // Validate items
        for (const item of items) {
            if (!item.medicineID || !item.quantity || item.quantity <= 0) {
                return res.status(400).json({
                    message: "Invalid items. Each item must have medicineID and quantity > 0",
                });
            }
        }
        const imexLog = await createImexLogService({
            imexType,
            pharmacistID,
            value: value ? parseFloat(value) : 0,
            note,
            items,
        });
        return res.status(201).json({
            message: "Imex log created successfully",
            data: imexLog,
        });
    }
    catch (error) {
        next(error);
    }
};
export const getImexById = async (req, res, next) => {
    try {
        const { id: imexID } = req.params;
        if (!imexID) {
            return res.status(400).json({ message: "Missing imex ID" });
        }
        const imexLog = await getImexByIdService(imexID);
        if (!imexLog) {
            return res.status(404).json({ message: "Imex log not found" });
        }
        return res.status(200).json({
            message: "Imex log retrieved successfully",
            data: imexLog,
        });
    }
    catch (error) {
        next(error);
    }
};
export const updateImexLog = async (req, res, next) => {
    try {
        const { id: imexID } = req.params;
        const { value, note, items } = req.body;
        // Validate required fields
        if (!imexID) {
            return res.status(400).json({ message: "Missing imex ID" });
        }
        // At least one of value, note, or items must be provided
        if (value === undefined && note === undefined && !items) {
            return res.status(400).json({
                message: "At least one of value, note, or items must be provided",
            });
        }
        // If items provided, validate them
        if (items) {
            if (!Array.isArray(items) || items.length === 0) {
                return res.status(400).json({
                    message: "items must be a non-empty array",
                });
            }
            for (const item of items) {
                if (!item.medicineID || !item.quantity || item.quantity <= 0) {
                    return res.status(400).json({
                        message: "Invalid items. Each item must have medicineID and quantity > 0",
                    });
                }
            }
        }
        const imexLog = await updateImexLogService(imexID, {
            value: value ? parseFloat(value) : undefined,
            note,
            items,
        });
        return res.status(200).json({
            message: "Imex log updated successfully",
            data: imexLog,
        });
    }
    catch (error) {
        next(error);
    }
};
export const deleteImexLog = async (req, res, next) => {
    try {
        const { id: imexID } = req.params;
        // Validate required fields
        if (!imexID) {
            return res.status(400).json({
                message: "Missing imex ID",
            });
        }
        await deleteImexLogService(imexID);
        return res.status(200).json({
            message: "Imex log deleted successfully",
        });
    }
    catch (error) {
        next(error);
    }
};
//# sourceMappingURL=medicine-imex.controller.js.map