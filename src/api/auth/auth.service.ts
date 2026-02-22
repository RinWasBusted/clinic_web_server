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
const checkRoleToRegister = (currentRole: string, newRole: string) => {
    if (currentRole !== "manager" && currentRole !== "staff") {
    return { status: 403, message: "Forbidden: Only manager or staff can register new users" };
    }
    if (newRole === "staff" && currentRole !== "manager") {
        return { status: 403, message: "Forbidden: Only manager can create staff accounts" };
    }
}
const checkRoleToDelete = (currentrole: string, accountToDeleterole: string) => {
    if (currentrole !== "manager" && currentrole !== "staff") {
    return { status: 403, message: "Forbidden: Only manager or staff can delete accounts" };
  }
  if (currentrole !== "manager" && (accountToDeleterole === "staff" || accountToDeleterole === "manager")) {
    return { status: 403, message: "Forbidden: Only manager can delete staff or manager accounts" };
  }
  if (accountToDeleterole === "root") {
    return { status: 403, message: "Forbidden: Cannot delete root account" };
  }
}
export { addRefreshTokenToCookieToWhitelist, findRefreshTokenInWhitelist, deleteRefreshTokenFromWhitelist, revokeTokensByUser, checkRoleToDelete, checkRoleToRegister }
