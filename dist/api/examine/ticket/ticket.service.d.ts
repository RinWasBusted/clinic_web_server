import { TicketStatus, Prisma } from "../../../generated/prisma/index.js";
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
declare class EnterTicketService {
    defaultCount: number;
    defaultPage: number;
    ticketProjection: Record<string, unknown>;
    ticketListProjection: Record<string, unknown>;
    ticketDisplayProjection: Record<string, unknown>;
    private readonly patientProjection;
    private readonly roomProjection;
    private readonly appointmentProjection;
    constructor();
    findAppointment(payload: AppointmentPayload): Promise<TicketPayload>;
    findLatestOrderNum(roomID: string): Promise<number>;
    generateTicket(payload: TicketPayload): Promise<{
        newTicket: {
            roomID: string;
            patientID: string;
            status: import("../../../generated/prisma/index.js").$Enums.TicketStatus;
            note: string | null;
            appointmentID: string;
            ticketID: string;
            orderNum: number;
            checkIn: Date;
            createdAtLocal: string | null;
        };
    }>;
    countAllList(where: Prisma.EnterTicketWhereInput): Promise<number>;
    getWaitingList(query: Record<string, string>): Promise<{
        data: any;
        pagination: import("../../../utils/pagination.js").PaginationMeta;
    }>;
    getEnterTicketByID(ticketID: string): Promise<{
        [x: string]: never;
        roomID?: string | undefined;
        patientID?: string | undefined;
        status?: import("../../../generated/prisma/index.js").$Enums.TicketStatus | undefined;
        note?: string | null | undefined;
        appointmentID?: string | undefined;
        ticketID?: string | undefined;
        orderNum?: number | undefined;
        checkIn?: Date | undefined;
        createdAtLocal?: string | null | undefined;
    }>;
    updateEnterTicket(ticketID: string, status: TicketStatus): Promise<{
        [x: string]: never;
    } & {
        roomID: string;
        patientID: string;
        status: import("../../../generated/prisma/index.js").$Enums.TicketStatus;
        note: string | null;
        appointmentID: string;
        ticketID: string;
        orderNum: number;
        checkIn: Date;
        createdAtLocal: string | null;
    }>;
    callNextTicket(roomID: string): Promise<({
        [x: string]: never;
    } & {
        roomID: string;
        patientID: string;
        status: import("../../../generated/prisma/index.js").$Enums.TicketStatus;
        note: string | null;
        appointmentID: string;
        ticketID: string;
        orderNum: number;
        checkIn: Date;
        createdAtLocal: string | null;
    }) | null>;
    getCurrentTicket(roomID: string): Promise<{
        orderNum: number;
        patientName: string;
        birthDate: string;
        roomName: string;
    } | null>;
}
declare const _default: EnterTicketService;
export default _default;
//# sourceMappingURL=ticket.service.d.ts.map