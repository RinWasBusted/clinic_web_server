import { NextFunction, Request, Response } from "express";
import prisma from "../../../utils/prisma.js";

export const CreateRoom = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { roomType, roomName, FacultyID } = req.body;
    
    const existingRoom = await prisma.room.findUnique({
      where: { roomName }
    });

    if (existingRoom) {
      return res.status(409).json({ message: "Room with this type already exists" });
    }

    const newRoom = await prisma.room.create({
      data: {
        roomType,
        roomName,
        FacultyID
      }
    });

    return res.status(201).json({ room: newRoom });
  } catch (error) {
    next(error);
  }
};

export const GetAllRooms = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const rooms = await prisma.room.findMany({
      include: {
        faculty: true
      }
    });
    return res.status(200).json({ rooms });
  } catch (error) {
    next(error);
  }
};

export const GetRoomById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const roomID = Array.isArray(id) ? id[0] : id;

    if (!roomID) {
      return res.status(400).json({ message: "Room ID is required" });
    }
    const room = await prisma.room.findUnique({
      where: { roomID },
      include: {
        faculty: true
      }
    });

    if (!room) {
      return res.status(404).json({ message: "Room not found" });
    }

    return res.status(200).json({ room });
  } catch (error) {
    next(error);
  }
};

export const UpdateRoomById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const roomID = req.room?.roomID;
    const data = req.body;
    const result = await prisma.room.update({
      where: { roomID },
      data,
      include: {
        faculty: true
      }
    });

    if (result) {
      return res.status(200).json({
        message: "Update successful",
        room: result
      });
    }
  } catch (error) {
    next(error);
  }
};

export const DeleteRoomById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const roomID = req.room?.roomID;
    const result = await prisma.room.update({
      where: { roomID },
      data: { status: "INACTIVE" }
    });

    if (result) {
      return res.status(200).json({
        message: "Delete Successful"
      });
    }
  } catch (error) {
    next(error);
  }
};

export const DeleteManyRooms = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { roomIds } = req.body;
    const results = [];
    if (!Array.isArray(roomIds) || roomIds.length === 0) {
    return res.status(400).json({
        message: "roomIds must be a non-empty array"
    });
  }
    for (const id of roomIds) {
      const result = await prisma.room.update({
        where: { roomID: id },
        data: { status: "INACTIVE" }
      });
      if (result) {
        results.push(result);
      } else {
        results.push({ id, status: "not found" });
      }
    }
    return res.status(200).json({
      message: "Delete successful",
      results
    });
  } catch (error) {
    next(error);
  }
};