import jwt from "jsonwebtoken";
function mustGetEnv(name) {
    const v = process.env[name];
    if (!v)
        throw new Error(`Missing ${name} in environment`);
    return v;
}
const JWT_SECRET = mustGetEnv("JWT_SECRET");
function isAuthPayload(p) {
    if (!p || typeof p !== "object")
        return false;
    const obj = p;
    return typeof obj.id === "string" && typeof obj.email === "string";
}
export function verifyAccessToken(req, res, next) {
    const token = req.cookies?.accessToken;
    if (!token)
        return res.status(401).json({ message: "Missing access token" });
    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        if (typeof decoded === "string" || !isAuthPayload(decoded)) {
            return res.status(401).json({ message: "Invalid token payload" });
        }
        req.user = { id: decoded.id, email: decoded.email };
        return next();
    }
    catch {
        return res.status(401).json({ message: "Invalid or expired access token" });
    }
}
//# sourceMappingURL=verifyToken.js.map