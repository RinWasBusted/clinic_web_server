import jwt from 'jsonwebtoken';

export class JwtService {
    private static readonly SECRET_KEY = process.env.JWT_SECRET || 'default_secret_key';
    static generateToken(payload: object, expiresIn: number) : string {
        return jwt.sign(payload, this.SECRET_KEY, {expiresIn});
    }

    static verifyToken(token:string): object | null {
        try {
            return jwt.verify(token, this.SECRET_KEY) as object;
        } catch {
            return null;
        }
    }
}