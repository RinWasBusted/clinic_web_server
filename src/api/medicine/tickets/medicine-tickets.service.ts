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
      ticketID: true,
      prescription: {
        select: {
          prescriptionDisplayID: true,
          prescriptionID: true,
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
    ticketID: ticket.ticketID,
    prescriptionDisplayID: ticket.prescription.prescriptionDisplayID,
    prescriptionID: ticket.prescription.prescriptionID,
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

export const dispenseMedicineTicketService = async (
  ticketId: string,
  accountID: string
) => {
  return prisma.$transaction(
    async (tx) => {
      const pharmacistAccount = await tx.account.findUnique({
        where: {
          accountID,
        },
        select: {
          roleName: true,
          pharmacist: {
            select: {
              pharmacistID: true,
            },
          },
        },
      });

      if (!pharmacistAccount || pharmacistAccount.roleName !== "pharmacist") {
        throw new MedicineTicketServiceError("Forbidden", 403);
      }

      if (!pharmacistAccount.pharmacist?.pharmacistID) {
        throw new MedicineTicketServiceError("Pharmacist account is invalid", 400);
      }

      const ticket = await tx.medicineTicket.findUnique({
        where: {
          ticketID: ticketId,
        },
        select: {
          ticketID: true,
          status: true,
          prescriptionID: true,
          prescription: {
            select: {
              prescriptionID: true,
              prescriptionDisplayID: true,
              status: true,
              details: {
                select: {
                  medicineID: true,
                  quantity: true,
                  note: true,
                  medicine: {
                    select: {
                      medicineID: true,
                      medicineName: true,
                      quantity: true,
                      price: true,
                    },
                  },
                },
              },
            },
          },
        },
      });

      if (!ticket) {
        throw new MedicineTicketServiceError("Medicine ticket not found", 404);
      }

      if (ticket.status === "done") {
        throw new MedicineTicketServiceError("Medicine ticket has already been completed", 409);
      }

      if (ticket.prescription.status === "done") {
        throw new MedicineTicketServiceError("Prescription has already been completed", 409);
      }

      if (ticket.prescription.details.length === 0) {
        throw new MedicineTicketServiceError("Prescription does not contain any medicine", 400);
      }

      const insufficientMedicines = ticket.prescription.details.filter(
        (detail) => detail.medicine.quantity < detail.quantity
      );

      if (insufficientMedicines.length > 0) {
        const shortageMessage = insufficientMedicines
          .map(
            (detail) =>
              `${detail.medicine.medicineName} (cần ${detail.quantity}, còn ${detail.medicine.quantity})`
          )
          .join(", ");

        throw new MedicineTicketServiceError(`Insufficient stock: ${shortageMessage}`, 400);
      }

      const prescriptionCode =
        ticket.prescription.prescriptionDisplayID ?? ticket.prescription.prescriptionID;
      const exportNote = `Xuat thuoc cho don thuoc co ma ${prescriptionCode}`;
      const exportValue = ticket.prescription.details.reduce(
        (total, detail) => total + Number(detail.medicine.price) * detail.quantity,
        0
      );

      const imexLog = await tx.imexMedicineLog.create({
        data: {
          imexType: "export",
          pharmacistID: pharmacistAccount.pharmacist.pharmacistID,
          value: exportValue,
          note: exportNote,
        },
        select: {
          imexID: true,
        },
      });

      await tx.imexMedicineDetails.createMany({
        data: ticket.prescription.details.map((detail) => ({
          imexID: imexLog.imexID,
          medicineID: detail.medicineID,
          quantity: -detail.quantity,
          note: exportNote,
        })),
      });

      for (const detail of ticket.prescription.details) {
        await tx.medicine.update({
          where: {
            medicineID: detail.medicineID,
          },
          data: {
            quantity: {
              decrement: detail.quantity,
            },
          },
        });
      }

      await tx.medicineTicket.update({
        where: {
          ticketID: ticket.ticketID,
        },
        data: {
          status: "done",
        },
      });

      await tx.prescription.update({
        where: {
          prescriptionID: ticket.prescriptionID,
        },
        data: {
          status: "done",
          pharmacistID: pharmacistAccount.pharmacist.pharmacistID,
        },
      });

      return {
        ticketID: ticket.ticketID,
        status: "done" as const,
        prescriptionID: ticket.prescriptionID,
        prescriptionDisplayID: ticket.prescription.prescriptionDisplayID,
        imexID: imexLog.imexID,
      };
    },
    {
      isolationLevel: "Serializable",
      maxWait: 5000,
      timeout: 10000,
    }
  );
};
