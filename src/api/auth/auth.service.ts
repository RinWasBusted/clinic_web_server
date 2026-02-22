import prisma from "../../utils/prisma.js"
import { hashToken } from "../../utils/hash.js"
const addRefreshTokenToCookieToWhitelist = (params:{refreshToken: string, userId: string}) => {
    return  prisma.refreshToken.create({
        data: {
            hashedToken: hashToken(params.refreshToken),
            userId: params.userId,
            expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
        }
    })
}
const findRefreshTokenInWhitelist = (refreshToken: string) => {
    return prisma.refreshToken.findFirst({
        where: {
            hashedToken: hashToken(refreshToken),
            revoked: false,
            expiresAt: { gt: new Date() },
        }
    })
}
const deleteRefreshTokenFromWhitelist = (refreshToken: string) => {
    return prisma.refreshToken.deleteMany({
        where: {
            hashedToken: hashToken(refreshToken)
        }
    })
}
// chặn token khi user logout hoặc token hết hạn
const revokeTokensByUser = (userId: string) => {
    return prisma.refreshToken.updateMany({
        where: {

            userId: userId
        },
        data: {
           revoked: true
        }
    })
}

export { addRefreshTokenToCookieToWhitelist, findRefreshTokenInWhitelist, deleteRefreshTokenFromWhitelist, revokeTokensByUser }
