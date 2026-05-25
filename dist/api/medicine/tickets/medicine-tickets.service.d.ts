export declare class MedicineTicketServiceError extends Error {
    statusCode: number;
    constructor(message: string, statusCode: number);
}
export declare const getMedicineTicketsService: (date?: string) => Promise<{
    ticketID: string;
    prescriptionDisplayID: string | null;
    prescriptionID: string;
    patientName: string;
    orderNum: number;
    status: import("../../../generated/prisma/index.js").$Enums.MedicineTicketStatus;
    roomName: string | null;
    createdAt: Date;
}[]>;
export declare const createMedicineTicketService: (prescriptionDisplayID: string, accountID: string) => Promise<{
    prescription: {
        prescriptionDisplayID: string | null;
    };
    createdAt: Date;
    status: import("../../../generated/prisma/index.js").$Enums.MedicineTicketStatus;
    ticketID: string;
    orderNum: number;
}>;
export declare const updateMedicineTicketStatusService: (ticketId: string, status: "pending" | "done") => Promise<{
    status: import("../../../generated/prisma/index.js").$Enums.MedicineTicketStatus;
    ticketID: string;
    orderNum: number;
    prescriptionID: string;
}>;
export declare const dispenseMedicineTicketService: (ticketId: string, accountID: string) => Promise<{
    ticketID: string;
    status: "done";
    prescriptionID: string;
    prescriptionDisplayID: string | null;
    imexID: string;
}>;
//# sourceMappingURL=medicine-tickets.service.d.ts.map