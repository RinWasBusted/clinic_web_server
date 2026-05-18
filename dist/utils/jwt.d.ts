interface JwtPayload {
    id: string;
    email: string;
    role: string;
    roleName?: string | null;
    roleID?: string | null;
}
declare const generateAccesToken: (user: JwtPayload) => string;
declare const generateRefreshToken: () => string;
declare const generateTokens: (user: JwtPayload) => {
    accessToken: string;
    refreshToken: string;
};
export { generateAccesToken, generateRefreshToken, generateTokens };
//# sourceMappingURL=jwt.d.ts.map