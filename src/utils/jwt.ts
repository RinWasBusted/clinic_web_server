import jwt from "jsonwebtoken"
import crypto from "crypto";
const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) throw new Error("Missing JWT_SECRET in environment");
const generateAccesToken = (user:{id: string, email: string, role: string}) => {
    return jwt.sign(
        { id: user.id, email: user.email, role: user.role },
        JWT_SECRET,
        { expiresIn: "1h" }
    );
}
const generateRefreshToken = () => {
    return crypto.randomBytes(32).toString("hex");
}
// const verifyToken = (token: string) => {
//     try {
//         return jwt.verify(token, JWT_SECRET);
//     } catch (error) {
//         return null;
//     }
// }
const generateTokens = (user:{id: string, email: string, role: string}) => {
    const accessToken = generateAccesToken(user);
    const refreshToken = generateRefreshToken();
    return { accessToken, refreshToken };
}
export { generateAccesToken, generateRefreshToken, generateTokens }