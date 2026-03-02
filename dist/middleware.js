import jwt from 'jsonwebtoken';
function notFound(req, res, next) {
    res.status(404);
    const error = new Error(`🔍 - Not Found - ${req.originalUrl}`);
    next(error);
}
function errorHandler(err, req, res, 
// eslint-disable-next-line @typescript-eslint/no-unused-vars
next) {
    const statusCode = res.statusCode !== 200 ? res.statusCode : 500;
    res.status(statusCode);
    res.json({
        message: err.message,
        stack: process.env.NODE_ENV === 'production' ? '🥞' : err.stack,
    });
}
function isAuthenticated(req, res, next) {
    const { authorization } = req.headers;
    if (!authorization) {
        res.status(401);
        throw new Error('🚫 Un-Authorized 🚫');
    }
    try {
        const token = authorization.split(' ')[1];
        // @ts-expect-error JWT_ACCESS_SECRET may be undefined at runtime, but must be set in env
        const payload = jwt.verify(token, process.env.JWT_SECRET);
        req.payload = payload;
    }
    catch (err) {
        res.status(401);
        if (err instanceof Error && err.name === 'TokenExpiredError') {
            throw new Error(err.name);
        }
        throw new Error('🚫 Un-Authorized 🚫');
    }
    return next();
}
export { notFound, errorHandler, isAuthenticated };
//# sourceMappingURL=middleware.js.map