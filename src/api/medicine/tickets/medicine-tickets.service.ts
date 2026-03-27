import prisma from "../../../utils/prisma.js";
import type { Prisma } from "../../../generated/prisma/index.js";


export const getMedicineTicketsService = async (
  date?: string,
  roomId?: string
) => {
  // If date is not provided, use today's date
  const filterDate = date || new Date().toISOString().split("T")[0];

  // Parse the date to create start and end of day
  const startOfDay = new Date(`${filterDate}T00:00:00Z`);
  const endOfDay = new Date(`${filterDate}T23:59:59Z`);

  // Build where clause
  const whereClause: Prisma.MedicineTicketFindManyArgs["where"] = {
    createdAt: {
      gte: startOfDay,
      lte: endOfDay,
    },
  };

  // Add roomId filter if provided
  if (roomId) {
    whereClause.roomID = roomId;
  }

  // Get tickets sorted by orderNum ascending
  const tickets = await prisma.medicineTicket.findMany({
    where: whereClause,
    select: {
      ticketID: true,
      orderNum: true,
      status: true,
      prescriptionID: true,
    },
    orderBy: {
      orderNum: "asc",
    },
  });

  return tickets;
};

export const createMedicineTicketService = async (
  prescriptionID: string,
  roomID: string
) => {
  // Get today's date range
  const today = new Date();
  const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 0, 0, 0);
  const endOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 23, 59, 59);

  // Count existing tickets for today in the same room
  const existingTicketsCount = await prisma.medicineTicket.count({
    where: {
      roomID: roomID,
      createdAt: {
        gte: startOfDay,
        lte: endOfDay,
      },
    },
  });

  // Calculate next order number (start from 1 if no tickets exist)
  const orderNum = existingTicketsCount + 1;

  // Create the medicine ticket
  const newTicket = await prisma.medicineTicket.create({
    data: {
      prescriptionID: prescriptionID,
      roomID: roomID,
      orderNum: orderNum,
      status: "pending",
    },
    select: {
      ticketID: true,
      orderNum: true,
      status: true,
      prescriptionID: true,
      roomID: true,
      createdAt: true,
    },
  });

  return newTicket;
};


export const updateMedicineTicketStatusService = async (
  ticketId: string,
  status: "pending" | "done"
) => {
  // Validate status value
  if (!["pending", "done"].includes(status)) {
    throw new Error("Invalid status. Must be 'pending' or 'done'");
  }

  // Update the ticket status
  const updatedTicket = await prisma.medicineTicket.update({
    where: {
      ticketID: ticketId,
    },
    data: {
      status: status,
    },
    select: {
      ticketID: true,
      orderNum: true,
      status: true,
      prescriptionID: true,
    },
  });

  return updatedTicket;
};
