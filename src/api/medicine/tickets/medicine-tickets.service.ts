import prisma from "../../../utils/prisma.js";
import type { Prisma } from "../../../generated/prisma/index.js";

export class MedicineTicketServiceError extends Error {
  statusCode: number;
  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
  }
}

export const getMedicineTicketsService = async (
  date?: string
) => {
  const baseDate = date ? new Date(`${date}T00:00:00`) : new Date();
  const startOfDay = new Date(
    baseDate.getFullYear(),
    baseDate.getMonth(),
    baseDate.getDate(),
    0,
    0,
    0,
    0
  );
  const endOfDay = new Date(
    baseDate.getFullYear(),
    baseDate.getMonth(),
    baseDate.getDate(),
    23,
    59,
    59,
    999
  );

  const whereClause: Prisma.MedicineTicketFindManyArgs["where"] = {
    createdAt: {
      gte: startOfDay,
      lte: endOfDay,
    },
  };

  const tickets = await prisma.medicineTicket.findMany({
    where: whereClause,
    select: {
      prescription: {
        select: {
          prescriptionDisplayID: true,
          patient: {
            select: {
              account: {
                select: {
                  firstName: true,
                  lastName: true,
                },
              },
            },
          },
        },
      },
      orderNum: true,
      status: true,
      room: {
        select: {
          roomName: true,
        },
      },
      createdAt: true,
    },
    orderBy: {
      orderNum: "asc",
    },
  });

  return tickets.map((ticket) => ({
    prescriptionDisplayID: ticket.prescription.prescriptionDisplayID,
    patientName: ticket.prescription.patient?.account
      ? `${ticket.prescription.patient.account.lastName} ${ticket.prescription.patient.account.firstName}`.trim()
      : "",
    orderNum: ticket.orderNum,
    status: ticket.status,
    roomName: ticket.room.roomName,
    createdAt: ticket.createdAt,
  }));
};

export const createMedicineTicketService = async (
  prescriptionDisplayID: string,
  accountID: string
) => {
  const normalizedPrescriptionDisplayID = prescriptionDisplayID.trim();

  return prisma.$transaction(async (tx) => {
    const pharmacistAccount = await tx.account.findUnique({
      where: {
        accountID,
      },
      select: {
        roleName: true,
        pharmacist: {
          select: {
            roomID: true,
          },
        },
      },
    });

    console.log("Pharmacist account:", pharmacistAccount);

    if (!pharmacistAccount || pharmacistAccount.roleName !== "pharmacist") {
      throw new MedicineTicketServiceError("Forbidden", 403);
    }

    if (!pharmacistAccount.pharmacist?.roomID) {
      throw new MedicineTicketServiceError("Pharmacist account is not assigned to any room", 400);
    }

    const prescription = await tx.prescription.findFirst({
      where: {
        prescriptionDisplayID: normalizedPrescriptionDisplayID,
      },
      orderBy: {
        createdAt: "desc",
      },
      select: {
        prescriptionID: true,
      },
    });

    if (!prescription) {
      throw new MedicineTicketServiceError("Prescription not found", 404);
    }

    const existingTicket = await tx.medicineTicket.findFirst({
      where: {
        prescriptionID: prescription.prescriptionID,
      },
      select: {
        ticketID: true,
      },
    });

    if (existingTicket) {
      throw new MedicineTicketServiceError("Medicine ticket for this prescription already exists", 409);
    }

    const today = new Date();
    const startOfDay = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate(),
      0,
      0,
      0,
      0
    );
    const endOfDay = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate(),
      23,
      59,
      59,
      999
    );

    const lastTicketInDay = await tx.medicineTicket.findFirst({
      where: {
        createdAt: {
          gte: startOfDay,
          lte: endOfDay,
        },
      },
      orderBy: {
        orderNum: "desc",
      },
      select: {
        orderNum: true,
      },
    });

    const orderNum = (lastTicketInDay?.orderNum ?? 0) + 1;

    return tx.medicineTicket.create({
      data: {
        prescriptionID: prescription.prescriptionID,
        orderNum,
        roomID: pharmacistAccount.pharmacist.roomID,
        status: "pending",
      },
      select: {
        ticketID: true,
        orderNum: true,
        status: true,
        createdAt: true,
        prescription: {
          select: {
            prescriptionDisplayID: true,
          },
        },
      },
    });
  });
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
