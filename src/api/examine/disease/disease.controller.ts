import type { Request, Response, NextFunction } from "express";
import diseaseService from "./disease.service.js";

export async function findDiseaseByWords(req: Request, res: Response, next: NextFunction) {
  try {
    const { keyword } = req.query ?? {};
    if (!keyword) return res.status(200).send({ message: "Must type a word", data: [] });
    const list = await diseaseService.findDiseaseByWord(keyword as string);
    if (list) {
      return res.status(200).send({ message: "OK", data: list });
    } else {
      return res.status(200).send({ message: "No disease matches!", data: [] });
    }
  } catch (error) {
    next(error);
  }
}

export async function searchDiseaseByName(req: Request, res: Response, next: NextFunction) {
  try {
    const { keyword } = req.query ?? {};
    if (!keyword) return res.status(200).send({ message: "Must type a word", data: [] });
    const list = await diseaseService.searchDiseaseByName(keyword as string);
    if (list) {
      return res.status(200).send({ message: "OK", data: list });
    } else {
      return res.status(200).send({ message: "No disease matches!", data: [] });
    }
  } catch (error) {
    next(error);
  }
}

export async function createDisease(req: Request, res: Response, next: NextFunction) {
  try {
    const { diseaseID, diseaseName, note } = req.body;
    if (!diseaseID || !diseaseName) {
      return res.status(400).send({ message: "diseaseID and diseaseName are required" });
    }
    const newDisease = await diseaseService.createDisease({ diseaseID, diseaseName, note });
    return res.status(201).send({ message: "Disease created successfully", data: newDisease });
  } catch (error) {
    next(error);
  }
}

export async function updateDisease(req: Request, res: Response, next: NextFunction) {
  try {
    const { id } = req.params;
    const { diseaseName, note } = req.body;
    if (!id) {
      return res.status(400).send({ message: "diseaseID is required" });
    }
    const updatedDisease = await diseaseService.updateDisease(id as string, { diseaseName, note });
    return res.status(200).send({ message: "Disease updated successfully", data: updatedDisease });
  } catch (error: any) {
    if (error.code === 'P2025') { // Prisma RecordNotFound
      return res.status(404).send({ message: "Disease not found" });
    }
    next(error);
  }
}

export async function deleteDisease(req: Request, res: Response, next: NextFunction) {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).send({ message: "diseaseID is required" });
    }
    await diseaseService.deleteDisease(id as string);
    return res.status(200).send({ message: "Disease deleted successfully" });
  } catch (error: any) {
    if (error.code === 'P2025') {
      return res.status(404).send({ message: "Disease not found" });
    }
    next(error);
  }
}

export async function getAllDiseases(req: Request, res: Response, next: NextFunction) {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const result = await diseaseService.getAllDiseases(page, limit);
    return res.status(200).send({ message: "OK", data: result });
  } catch (error) {
    next(error);
  }
}

export async function getDiseaseById(req: Request, res: Response, next: NextFunction) {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).send({ message: "diseaseID is required" });
    }
    const disease = await diseaseService.getDiseaseById(id as string);
    if (!disease) {
      return res.status(404).send({ message: "Disease not found" });
    }
    return res.status(200).send({ message: "OK", data: disease });
  } catch (error) {
    next(error);
  }
}
