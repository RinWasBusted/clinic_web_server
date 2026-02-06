export interface VerifyTokenPayload {
    id: number;
    role: string;
    purpose: "email_verification";
    iat: number;
    exp: number;
}