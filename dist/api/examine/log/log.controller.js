import ExamineLogService from "./log.service.js";
export async function createExamineLogHandler(req, res, next) {
    try {
        const examinedBy = req.user?.id;
        const payload = { ...req.body, examinedBy };
        const result = await ExamineLogService.submit(payload);
        return res.json({ message: "Tạo mới hồ sơ khám bệnh thành công", data: result });
    }
    catch (error) {
        next(error);
    }
}
export async function getExamineLogHandler(req, res, next) {
    try {
        const { id } = req.params;
        const result = await ExamineLogService.getExamineLogByID(id);
        return res.json({ examineLog: result });
    }
    catch (error) {
        next(error);
    }
}
export async function getExamineLogWithPrescriptionHandler(req, res, next) {
    try {
        const { id } = req.params;
        const result = await ExamineLogService.getExamineLogByID(id, true);
        return res.json({ examineLog: result });
    }
    catch (error) {
        next(error);
    }
}
export async function updateExamineLogHandler(req, res, next) {
    try {
        const { id } = req.params;
        const result = await ExamineLogService.updateExamineLog(id, req.body);
        return res.json({ message: "Đã cập nhật hồ sơ khám bệnh", data: result });
    }
    catch (error) {
        next(error);
    }
}
export async function getPrintableExamineLogHandler(req, res, next) {
    try {
        const { id } = req.params;
        const result = await ExamineLogService.getPrintableExamineLog(id);
        return res.json({ examineLog: result });
    }
    catch (error) {
        next(error);
    }
}
//# sourceMappingURL=log.controller.js.map