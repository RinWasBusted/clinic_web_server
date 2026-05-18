import { getImexLogsService, createImexLogService, updateImexLogService, deleteImexLogService, getImexByIdService, } from "./medicine-imex.service.js";
export const getImexLogs = async (req, res, next) => {
    try {
        const { type, from, to, page, pageSize } = res.locals.query;
        const fromDate = from ? new Date(from) : undefined;
        const toDate = to ? new Date(to) : undefined;
        const result = await getImexLogsService(type, fromDate, toDate, page, pageSize);
        return res.status(200).json({
            message: "Imex logs retrieved successfully",
            data: result.data,
            pagination: {
                currentPage: result.currentPage,
                pageSize: result.pageSize,
                totalItems: result.totalItems,
                totalPages: result.totalPages,
            },
        });
    }
    catch (error) {
        next(error);
    }
};
const createImexLogForCurrentAccount = async (req, res, next, successMessage) => {
    try {
        const accountID = req.user?.id;
        if (!accountID) {
            return res.status(401).json({
                message: "Unauthorized",
            });
        }
        const { imexType, value, note, items } = req.body;
        const imexLog = await createImexLogService({
            imexType,
            accountID,
            value,
            note,
            items,
        });
        return res.status(201).json({
            message: successMessage,
            data: imexLog,
        });
    }
    catch (error) {
        next(error);
    }
};
export const createImexLog = async (req, res, next) => createImexLogForCurrentAccount(req, res, next, "Imex log created successfully");
export const createManyImexLog = async (req, res, next) => createImexLogForCurrentAccount(req, res, next, "Imex log created successfully");
export const getImexById = async (req, res, next) => {
    try {
        const { id: imexID } = req.params;
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
        const imexLog = await updateImexLogService(imexID, {
            value,
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