import { AppointmentStatus } from "../../../generated/prisma/index.js";
import prisma from "../../../utils/prisma.js";
function isAppointment(v) {
    return typeof v === "string" && Object.values(AppointmentStatus).includes(v);
}
export { isAppointment };
export class NotFoundError extends Error {
    statusCode = 404;
    constructor(message) {
        super(message);
    }
}
export class ProhibitedError extends Error {
    statusCode = 403;
    constructor(message) {
        super(message);
    }
}
export const verifyRefsForUpdate = async ({ patientID, roomID }) => {
    if (patientID != null) {
        const patient = await prisma.patient.findUnique({ where: { patientID } });
        if (!patient)
            throw new NotFoundError("Patient not found");
    }
    if (roomID != null) {
        const room = await prisma.room.findUnique({ where: { roomID } });
        if (!room)
            throw new NotFoundError("Room not found");
    }
};
//# sourceMappingURL=appointment.service.js.map