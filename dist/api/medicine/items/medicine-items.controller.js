import { createMedicineService, getMedicineByIdService, getMedicineItemsService, updateMedicineService, deleteMedicineService, } from "./medicine-items.service.js";
import cloudinary from "../../../utils/cloudinary.js";
export const createMedicine = async (req, res, next) => {
    try {
        const { medicineName, unit, price, description } = req.body;
        // Validate required fields
        if (!medicineName || !unit || !price) {
            return res.status(400).json({
                message: "Missing required fields: medicineName, unit, price",
            });
        }
        let medicineImage = "https://static.vecteezy.com/system/resources/previews/068/129/863/non_2x/mockup-of-supplement-pill-bottle-no-label-isolated-on-the-transparent-background-png.png";
        // If file uploaded, get the image URL from multer-storage-cloudinary
        if (req.file) {
            const file = req.file;
            medicineImage = file?.path || medicineImage;
        }
        // Create medicine with image URL
        const medicine = await createMedicineService({
            medicineName,
            unit,
            price: parseFloat(price),
            description,
            medicineImage,
        });
        return res.status(201).json({
            message: "Medicine created successfully",
            data: medicine,
        });
    }
    catch (error) {
        next(error);
    }
};
// export const getMedicines = async (
//   req: Request,
//   res: Response,
//   next: NextFunction
// ) => {
//   try {
//     const medicines = await getMedicinesService();
//     return res.status(200).json({
//       message: "Medicines retrieved successfully",
//       data: medicines,
//     });
//   } catch (error) {
//     next(error);
//   }
// };
export const getMedicineItems = async (req, res, next) => {
    try {
        const search = req.query.search || "";
        const page = req.query.page ? parseInt(req.query.page) : 1;
        const pageSize = 10;
        if (page < 1) {
            return res.status(400).json({ message: "Page must be at least 1" });
        }
        const result = await getMedicineItemsService(search, page, pageSize);
        return res.status(200).json({
            message: "Medicines retrieved successfully",
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
export const getMedicineById = async (req, res, next) => {
    try {
        const { id } = req.params;
        if (!id) {
            return res.status(400).json({ message: "Missing medicine ID" });
        }
        const medicine = await getMedicineByIdService(parseInt(id));
        if (!medicine) {
            return res.status(404).json({ message: "Medicine not found" });
        }
        return res.status(200).json({
            message: "Medicine retrieved successfully",
            data: medicine,
        });
    }
    catch (error) {
        next(error);
    }
};
export const updateMedicine = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { medicineName, unit, price, description } = req.body;
        if (!id) {
            return res.status(400).json({ message: "Missing medicine ID" });
        }
        let medicineImage;
        // If new file uploaded, get the image URL from multer
        if (req.file) {
            const file = req.file;
            medicineImage = file.path;
            // Delete old image from Cloudinary if it exists
            const oldMedicine = await getMedicineByIdService(parseInt(id));
            if (oldMedicine?.medicineImage) {
                try {
                    const publicId = oldMedicine.medicineImage
                        .split("/")
                        .slice(-2)
                        .join("/")
                        .split(".")[0];
                    await cloudinary.uploader.destroy(publicId);
                }
                catch (err) {
                    console.error("Failed to delete old image from Cloudinary:", err);
                }
            }
        }
        const medicine = await updateMedicineService(parseInt(id), {
            medicineName,
            unit,
            price: price ? parseFloat(price) : undefined,
            description,
            medicineImage,
        });
        return res.status(200).json({
            message: "Medicine updated successfully",
            data: medicine,
        });
    }
    catch (error) {
        next(error);
    }
};
export const deleteMedicine = async (req, res, next) => {
    try {
        const { id } = req.params;
        if (!id) {
            return res.status(400).json({ message: "Missing medicine ID" });
        }
        // Get medicine to delete its image from Cloudinary
        const medicine = await getMedicineByIdService(parseInt(id));
        if (!medicine) {
            return res.status(404).json({ message: "Medicine not found" });
        }
        if (medicine.medicineImage) {
            try {
                const publicId = medicine.medicineImage
                    .split("/")
                    .slice(-2)
                    .join("/")
                    .split(".")[0];
                await cloudinary.uploader.destroy(publicId);
            }
            catch (err) {
                console.error("Failed to delete image from Cloudinary:", err);
            }
        }
        await deleteMedicineService(parseInt(id));
        return res.status(200).json({
            message: "Medicine deleted successfully",
        });
    }
    catch (error) {
        next(error);
    }
};
//# sourceMappingURL=medicine-items.controller.js.map