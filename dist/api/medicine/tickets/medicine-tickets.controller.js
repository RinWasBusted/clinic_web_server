import { getMedicineTicketsService, updateMedicineTicketStatusService, createMedicineTicketService, dispenseMedicineTicketService, MedicineTicketServiceError, } from "./medicine-tickets.service.js";
export const getMedicineTickets = async (req, res, next) => {
    try {
        const { date } = req.query;
        if (date && typeof date !== "string") {
            return res.status(400).json({
                message: "Invalid date format. Please use YYYY-MM-DD",
            });
        }
        // Validate date format if provided
        if (typeof date === "string") {
            const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
            if (!dateRegex.test(date)) {
                return res.status(400).json({
                    message: "Invalid date format. Please use YYYY-MM-DD",
                });
            }
            let [year, month, day] = date.split("-").map(Number);
            if (!year)
                year = new Date().getFullYear();
            if (!month)
                month = new Date().getMonth() + 1;
            if (!day)
                day = new Date().getDate();
            const parsedDate = new Date(year, month - 1, day);
            if (parsedDate.getFullYear() !== year ||
                parsedDate.getMonth() !== month - 1 ||
                parsedDate.getDate() !== day) {
                return res.status(400).json({
                    message: "Invalid date value. Please use a valid YYYY-MM-DD date",
                });
            }
        }
        const tickets = await getMedicineTicketsService(date);
        return res.status(200).json({
            message: "Medicine tickets retrieved successfully",
            data: tickets,
        });
    }
    catch (error) {
        next(error);
    }
};
export const updateMedicineTicketStatus = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { status } = req.body;
        // Validate required fields
        if (!id) {
            return res.status(400).json({
                message: "Ticket ID is required",
            });
        }
        if (!status) {
            return res.status(400).json({
                message: "Status is required",
            });
        }
        if (!["pending", "done"].includes(status)) {
            return res.status(400).json({
                message: "Invalid status. Must be 'pending' or 'done'",
            });
        }
        const updatedTicket = await updateMedicineTicketStatusService(id, status);
        return res.status(200).json({
            message: "Medicine ticket status updated successfully",
            data: updatedTicket,
        });
    }
    catch (error) {
        next(error);
    }
};
export const createMedicineTicket = async (req, res, next) => {
    try {
        const { prescriptionDisplayID } = req.body;
        const accountID = req.user?.id;
        if (!accountID) {
            return res.status(401).json({
                message: "Unauthorized",
            });
        }
        // Validate required fields
        if (!prescriptionDisplayID || typeof prescriptionDisplayID !== "string" || !prescriptionDisplayID.trim()) {
            return res.status(400).json({
                message: "prescriptionDisplayID is required",
            });
        }
        const newTicket = await createMedicineTicketService(prescriptionDisplayID, accountID);
        return res.status(201).json({
            message: "Medicine ticket created successfully",
            data: newTicket,
        });
    }
    catch (error) {
        if (error instanceof MedicineTicketServiceError) {
            return res.status(error.statusCode).json({
                message: error.message,
            });
        }
        next(error);
    }
};
export const dispenseMedicineTicket = async (req, res, next) => {
    try {
        const { id } = req.query;
        const accountID = req.user?.id;
        if (!accountID) {
            return res.status(401).json({
                message: "Unauthorized",
            });
        }
        if (!id || typeof id !== "string") {
            return res.status(400).json({
                message: "Ticket ID is required",
            });
        }
        const result = await dispenseMedicineTicketService(id, accountID);
        return res.status(200).json({
            message: "Medicine dispensed successfully",
            data: result,
        });
    }
    catch (error) {
        if (error instanceof MedicineTicketServiceError) {
            return res.status(error.statusCode).json({
                message: error.message,
            });
        }
        next(error);
    }
};
//# sourceMappingURL=medicine-tickets.controller.js.map