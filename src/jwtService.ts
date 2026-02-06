import jwt from 'jsonwebtoken';
import { VerifyTokenPayload } from './interfaces/auth.interface.js';

export class JwtService {
    private static readonly SECRET_KEY = process.env.JWT_SECRET || 'default_secret_key';
    static generateToken(payload: object, expiresIn: number) : string {
        return jwt.sign(payload, this.SECRET_KEY, {expiresIn});
    }

    static verifyToken(token:string): VerifyTokenPayload {
        return jwt.verify(token, this.SECRET_KEY) as VerifyTokenPayload;
    }
}