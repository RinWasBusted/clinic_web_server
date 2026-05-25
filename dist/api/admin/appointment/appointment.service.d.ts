import { AppointmentStatus } from "../../../generated/prisma/index.js";
declare function isAppointment(v: unknown): v is AppointmentStatus;
export { isAppointment };
export declare class NotFoundError extends Error {
    statusCode: number;
    constructor(message: string);
}
export declare class ProhibitedError extends Error {
    statusCode: number;
    constructor(message: string);
}
type VerifyRefsInput = {
    patientID?: string | null;
    roomID?: string | null;
};
export declare const verifyRefsForUpdate: ({ patientID, roomID }: VerifyRefsInput) => Promise<void>;
//# sourceMappingURL=appointment.service.d.ts.map