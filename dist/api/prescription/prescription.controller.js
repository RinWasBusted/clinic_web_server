import prescriptionService from "./prescription.service.js";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/client";
export async function createPrescriptionHandler(req, res, next) {
    try {
        const data = { ...req.body, doctorID: req.user?.id };
        const prescriptionData = await prescriptionService.refinePrescriptionData(data);
        const newPrescription = await prescriptionService.submit(prescriptionData);
        return res.json({ message: "Create prescription successfully", prescription: newPrescription });
    }
    catch (error) {
        next(error);
    }
}
export async function getPrescriptionHandler(req, res, next) {
    try {
        const prescriptionID = req.params?.id;
        const prescription = await prescriptionService.getPrescriptionByID(prescriptionID, null, {
            mode: "INTERNAL",
            onlyAllowDraft: false,
        });
        if (!prescription) {
            return res.status(404).json({ message: "Không tìm thấy đơn thuốc." });
        }
        return res.json({ prescription });
    }
    catch (error) {
        next(error);
    }
}
export async function updateLogHandler(req, res, next) {
    try {
        const { id } = req.params;
        // validateUpdateHandler đã kiểm tra tính hợp lệ của việc cập nhật.
        const updatedPrescription = await prescriptionService.update(id, req.targetItem, req.body);
        return res.json({ message: "Đã cập nhật toa thuốc", prescription: updatedPrescription });
    }
    catch (error) {
        next(error);
    }
}
export async function updateDoseHandler(req, res, next) {
    try {
        const { id } = req.params;
        // validateUpdateHandler đã kiểm tra tính hợp lệ của việc cập nhật.
        const updatedPrescription = await prescriptionService.updateDetails(id, req.targetItem, req.body);
        if (!updatedPrescription)
            return res.json({
                message: "Đã xóa toa thuốc",
                reason: "Không có thuốc nào được kê ở toa này sau khi đã cập nhật",
            });
        return res.json({ message: "Đã cập nhật toa thuốc", prescription: updatedPrescription });
    }
    catch (error) {
        next(error);
    }
}
export async function deletePrescriptionHandler(req, res, next) {
    try {
        const prescriptionID = req.params?.id;
        const doctorID = req.user?.id;
        try {
            await prescriptionService.deletePrescriptionByID(prescriptionID, null, doctorID);
        }
        catch (error) {
            if (error instanceof PrismaClientKnownRequestError) {
                return res.status(404).json({ message: "Không tìm thấy đơn thuốc" });
            }
            throw error;
        }
        return res.json({ message: "Đã xóa đơn thuốc" });
    }
    catch (error) {
        next(error);
    }
}
//# sourceMappingURL=prescription.controller.js.map