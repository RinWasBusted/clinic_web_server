import prisma from "../../../utils/prisma.js";
import { NotFoundError } from "../../admin/appointment/appointment.service.js";
import { getLocalStartAndEndOfDayInUTC, toLocalDateString, toLocalForAPI } from "../../../utils/datetime.js";
import { paginateQuery } from "../../../utils/pagination.js";
import { TicketStatus, Prisma } from "../../../generated/prisma/index.js";
// type NestedRecord = { [Key: string]: NestedRecord | string | number | boolean | Date | null };
interface AppointmentPayload {
  appointmentID: string;
  note?: string;
}
interface TicketPayload {
  appointmentID: string;
  patientID: string;
  roomID: string;
  note?: string;
}

interface RawTicketDataType {
  orderNum: number;
  patient: {
    account: {
      firstName: string;
      lastName: string;
      birthDate: Date;
    };
  };
  room: {
    roomName: string;
  };
}

class EnterTicketService {
  defaultCount: number;
  defaultPage: number;
  ticketProjection: Record<string, unknown>;
  ticketDisplayProjection: Record<string, unknown>;

  constructor() {
    // Default pagination settings in case the client does not provide them
    this.defaultCount = 10;
    this.defaultPage = 1;
    this.ticketProjection = {
      patient: {
        select: {
          patientID: true,
        },
      },
      room: {
        select: {
          roomID: true,
          roomName: true,
        },
      },
    };
    this.ticketDisplayProjection = {
      orderNum: true,
      patient: {
        select: {
          account: {
            select: {
              firstName: true,
              lastName: true,
              birthDate: true,
            },
          },
        },
      },
      room: {
        select: {
          roomName: true,
        },
      },
    };
  }
  async findAppointment(payload: AppointmentPayload): Promise<TicketPayload> {
    const { appointmentID, note } = payload;
    const appointment = await prisma.appointment.findFirst({
      where: {
        appointmentID: appointmentID,
        status: "approved",
      },
      select: {
        appointmentID: true,
        patientID: true,
        roomID: true,
      },
    });

    if (!appointment) throw new NotFoundError("Appointment not found");

    const { patientID, roomID } = appointment;
    if (!roomID) throw new NotFoundError("Appointment data is incomplete");

    return {
      note,
      appointmentID,
      patientID,
      roomID,
    };
  }

  // Important: The date comparision must be done in UTC + 7
  // Do not just compare with server's local time because it can cause issues when the server is in a different timezone.
  async findLatestOrderNum(roomID: string): Promise<number> {
    // Check the ticket within day (in timezone format UTC + 7)
    const { start, end } = getLocalStartAndEndOfDayInUTC();
    const latestTicket = await prisma.enterTicket.findFirst({
      where: {
        roomID,
        checkIn: {
          gte: start,
          lt: end,
        },
      },
      orderBy: { checkIn: "desc" },
    });
    return latestTicket?.orderNum || 0;
  }

  async generateTicket(payload: TicketPayload) {
    // Problem: An appointment can have multiple tickets if the staff tries to check in multiple times. This can cause issues with orderNum and room capacity.
    // --> Fix the db schema to set unique constraint on appointmentID in enterTicket table to prevent multiple tickets for the same appointment.

    const { appointmentID, patientID, roomID, note } = payload;
    if (!patientID || !roomID) throw new NotFoundError("Appointment data is incomplete");
    const orderNum = (await this.findLatestOrderNum(roomID)) + 1;
    const newTicket = await prisma.enterTicket.create({
      data: {
        appointmentID,
        patientID,
        roomID,
        note,
        orderNum,
      },
    });
    return { newTicket };
  }

  async countAllList(where: Prisma.EnterTicketWhereInput): Promise<number> {
    const totalItems = await prisma.enterTicket.count({ where });
    return totalItems;
  }

  async getWaitingList(query: Record<string, string>) {
    const { date, status, page, limit, roomID } = query;

    // Query builder
    const where: Prisma.EnterTicketWhereInput = {};
    if (date) {
      const { start, end } = getLocalStartAndEndOfDayInUTC(date);
      where.checkIn = {
        gte: start,
        lt: end,
      };
    }
    if (status) where.status = status as TicketStatus;
    if (roomID) where.roomID = roomID;

    const include = this.ticketProjection;
    const orderBy = { orderNum: "asc" };

    // Paginate service
    const waitingList = await paginateQuery(
      prisma.enterTicket,
      where,
      { page, limit },
      {
        include,
        orderBy,
      }
    );

    // Convert checkIn to local time (UTC + 7) for API response
    if (waitingList.data && Array.isArray(waitingList.data)) {
      waitingList.data.forEach((ticket: Record<string, unknown>) => {
        if (ticket.checkIn instanceof Date) {
          ticket.checkIn = toLocalForAPI(ticket.checkIn);
        }
      });
    }

    return waitingList;
  }

  async getEnterTicketByID(ticketID: string) {
    const ticket = await prisma.enterTicket.findUnique({
      where: { ticketID },
      include: this.ticketProjection,
    });
    return ticket;
  }

  async updateEnterTicket(ticketID: string, status: TicketStatus) {
    const updatedTicket = await prisma.enterTicket.update({
      where: { ticketID },
      data: { status },
      include: this.ticketProjection,
    });
    return updatedTicket;
  }

  async callNextTicket(roomID: string) {
    const nextTicket = await prisma.$transaction(async (prisma) => {
      const { start, end } = getLocalStartAndEndOfDayInUTC();
      // Update the current in_check ticket to done
      const oldTicket = await prisma.enterTicket.findFirst({
        where: {
          roomID: roomID,
          status: TicketStatus.in_check,
          checkIn: {
            gte: start,
            lt: end,
          },
        },
        orderBy: { orderNum: "asc" },
      });
      if (oldTicket)
        await prisma.enterTicket.update({
          where: { ticketID: oldTicket.ticketID },
          data: { status: TicketStatus.done },
        });

      // Find the next pending ticket and update its status to in_check
      const nextTicket = await prisma.enterTicket.findFirst({
        where: {
          roomID: roomID,
          status: TicketStatus.pending,
          checkIn: {
            gte: start,
            lt: end,
          },
        },
        orderBy: { orderNum: "asc" },
        include: this.ticketProjection,
      });
      if (!nextTicket) return null;
      const updatedTicket = await prisma.enterTicket.update({
        where: { ticketID: nextTicket.ticketID },
        data: { status: TicketStatus.in_check },
        include: this.ticketProjection,
      });
      return updatedTicket;
    });
    return nextTicket;
  }

  // Todo: Flatten the output display
  async getCurrentTicket(roomID: string) {
    const { start, end } = getLocalStartAndEndOfDayInUTC();

    function renderTicketViewToDisplay(ticket: RawTicketDataType) {
      if (!ticket) return null;
      return {
        orderNum: ticket.orderNum,
        patientName: `${ticket.patient.account.firstName} ${ticket.patient.account.lastName}`,
        birthDate: toLocalDateString(ticket.patient.account.birthDate),
        roomName: ticket.room.roomName,
      };
    }

    const ticketInService = await prisma.enterTicket.findFirst({
      where: {
        roomID: roomID,
        status: TicketStatus.in_check,
        checkIn: {
          gte: start,
          lt: end,
        },
      },
      orderBy: { orderNum: "asc" },
      select: this.ticketDisplayProjection,
    });
    return renderTicketViewToDisplay(ticketInService as unknown as RawTicketDataType);
  }
}

export default new EnterTicketService();
