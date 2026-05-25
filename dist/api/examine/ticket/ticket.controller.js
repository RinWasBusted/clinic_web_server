import EnterTicketService from "./ticket.service.js";
export async function generateNewTicket(req, res, next) {
    try {
        const appointmentData = await EnterTicketService.findAppointment(req.body);
        const newTicket = await EnterTicketService.generateTicket(appointmentData);
        res.status(201).json(newTicket);
    }
    catch (error) {
        next(error);
    }
}
export async function viewWaitingList(req, res, next) {
    try {
        const { data, pagination } = await EnterTicketService.getWaitingList(req.query);
        return res.json({ data, pagination });
    }
    catch (error) {
        next(error);
    }
}
export async function viewEnterTicket(req, res, next) {
    try {
        const { id: ticketID } = req.params ?? {};
        const ticket = await EnterTicketService.getEnterTicketByID(ticketID);
        if (!ticket) {
            return res.status(404).json({ message: "Không tìm thấy" });
        }
        return res.json(ticket);
    }
    catch (error) {
        next(error);
    }
}
export async function updateEnterTicket(req, res, next) {
    try {
        const { id: ticketID } = req.params ?? {};
        const { status } = req.body ?? {};
        const updatedTicket = await EnterTicketService.updateEnterTicket(ticketID, status);
        if (!updatedTicket) {
            return res.status(404).json({ message: "Không tìm thấy" });
        }
        else {
            return res.json({
                message: "Trạng thái ticket đã được cập nhật thành công",
                ticket: updatedTicket,
            });
        }
    }
    catch (error) {
        next(error);
    }
}
export async function getNextTicket(req, res, next) {
    try {
        const { roomID } = req.query;
        const nextTicket = await EnterTicketService.callNextTicket(roomID);
        return res.json({
            message: nextTicket ? "Đã gọi STT tiếp theo" : "Không còn STT nào trong danh sách chờ",
            ticket: nextTicket,
        });
    }
    catch (error) {
        next(error);
    }
}
export async function getCurrentTicket(req, res, next) {
    try {
        // View currently served patient
        const { roomID } = req.query;
        const currentTicket = await EnterTicketService.getCurrentTicket(roomID);
        return res.json({
            currentlyServing: !!currentTicket,
            ticket: currentTicket,
        });
    }
    catch (error) {
        next(error);
    }
}
//# sourceMappingURL=ticket.controller.js.map