import { ZodError } from "zod";
export const validateBody = (schema) => (req, res, next) => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
        return res.status(400).json({
            message: "Invalid input",
            errors: result.error.flatten(),
        });
    }
    req.body = result.data;
    next();
};
export const validateParams = (schema) => (req, res, next) => {
    const result = schema.safeParse(req.params);
    if (!result.success) {
        return res.status(400).json({
            message: "Invalid URL parameters",
            errors: result.error.format(),
        });
    }
    req.params = result.data; // ✅ type-safe
    next();
};
export const validateQuery = (schema) => (req, res, next) => {
    try {
        const parsed = schema.parse(req.query);
        res.locals.query = parsed;
        next();
    }
    catch (err) {
        if (err instanceof ZodError) {
            return res.status(400).json({
                message: "Invalid query parameters",
                errors: err.flatten(),
            });
        }
        next(err);
    }
};
//# sourceMappingURL=validate.js.map