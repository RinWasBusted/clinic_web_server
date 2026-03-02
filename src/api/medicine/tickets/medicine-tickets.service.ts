import prisma from "../../../utils/prisma.js";
import type { Prisma } from "../../../generated/prisma/index.js";

/**
 * Get medicine tickets by date and roomId
 * @param date - Date to filter tickets (format: YYYY-MM-DD). If not provided, defaults to today
 * @param roomId - Room ID to filter tickets
 * @returns List of medicine tickets sorted by orderNum ascending
 */
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

/**
 * Update medicine ticket status
 * @param ticketId - Ticket ID
 * @param status - New status (pending or done)
 * @returns Updated medicine ticket
 */
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
