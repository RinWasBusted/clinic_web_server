import { Request, Response, NextFunction } from "express";
import {
  createMedicineService,
  getMedicineByIdService,
  getMedicineItemsService,
  updateMedicineService,
  deleteMedicineService,
} from "./medicine-items.service.js";
import cloudinary from "../../../utils/cloudinary.js";

export const createMedicine = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { medicineName, unit, price, description } = req.body;

    // Validate required fields
    if (!medicineName || !unit || !price) {
      return res.status(400).json({
        message: "Missing required fields: medicineName, unit, price",
      });
    }

    let medicineImage: string = "https://static.vecteezy.com/system/resources/previews/068/129/863/non_2x/mockup-of-supplement-pill-bottle-no-label-isolated-on-the-transparent-background-png.png";

    // If file uploaded, get the image URL from multer-storage-cloudinary
    if (req.file) {
      const file = req.file as Express.Multer.File & { path?: string };
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
  } catch (error) {
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

export const getMedicineItems = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const search = (req.query.search as string) || "";
    const page = (req.query.page as string) ? parseInt(req.query.page as string) : 1;
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
  } catch (error) {
    next(error);
  }
};

export const getMedicineById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ message: "Missing medicine ID" });
    }

    const medicine = await getMedicineByIdService(parseInt(id as string));

    if (!medicine) {
      return res.status(404).json({ message: "Medicine not found" });
    }

    return res.status(200).json({
      message: "Medicine retrieved successfully",
      data: medicine,
    });
  } catch (error) {
    next(error);
  }
};

export const updateMedicine = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const { medicineName, unit, price, description } = req.body;

    if (!id) {
      return res.status(400).json({ message: "Missing medicine ID" });
    }

    let medicineImage: string | undefined;

    // If new file uploaded, get the image URL from multer
    if (req.file) {
      const file = req.file as Express.Multer.File & { path?: string };
      medicineImage = file.path;

      // Delete old image from Cloudinary if it exists
      const oldMedicine = await getMedicineByIdService(parseInt(id as string));
      if (oldMedicine?.medicineImage) {
        try {
          const publicId = oldMedicine.medicineImage
            .split("/")
            .slice(-2)
            .join("/")
            .split(".")[0];
          await cloudinary.uploader.destroy(publicId as string);
        } catch (err) {
          console.error("Failed to delete old image from Cloudinary:", err);
        }
      }
    }

    const medicine = await updateMedicineService(parseInt(id as string), {
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
  } catch (error) {
    next(error);
  }
};

export const deleteMedicine = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ message: "Missing medicine ID" });
    }

    // Get medicine to delete its image from Cloudinary
    const medicine = await getMedicineByIdService(parseInt(id as string));

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
        await cloudinary.uploader.destroy(publicId as string);
      } catch (err) {
        console.error("Failed to delete image from Cloudinary:", err);
      }
    }

    await deleteMedicineService(parseInt(id as string));

    return res.status(200).json({
      message: "Medicine deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};