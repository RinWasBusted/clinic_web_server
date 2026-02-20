declare const generateAccesToken: (user: {
    id: string;
    email: string;
}) => string;
declare const generateRefreshToken: () => string;
declare const generateTokens: (user: {
    id: string;
    email: string;
}) => {
    accessToken: string;
    refreshToken: string;
};
export { generateAccesToken, generateRefreshToken, generateTokens };
//# sourceMappingURL=jwt.d.ts.map