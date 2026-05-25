import { ZodError } from "zod";
import { ProhibitedError } from "../api/admin/appointment/appointment.service.js";
function isPrismaLikeError(err) {
    return typeof err === "object" && err !== null && "code" in err;
}
export const errorHandler = (err, req, res, next) => {
    if (err instanceof ZodError) {
        return res.status(400).json({
            message: "Invalid input",
            errors: err.flatten(),
        });
    }
    if (isPrismaLikeError(err)) {
        if (err.code === "P2002") {
            return res.status(409).json({ message: "Duplicate resource", err });
        }
        if (err.code === "P2025") {
            return res.status(404).json({ message: "Resource not found", err });
        }
        if (err.code === "P9999") {
            return next();
        }
    }
    if (err instanceof ProhibitedError) {
        return res.status(403).json({ message: err.message });
    }
    console.error(err);
    return res.status(500).json({ message: "Internal Server Error", err });
};
//# sourceMappingURL=error.middleware.js.map