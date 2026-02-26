import { prisma } from "../../../utils/prisma.js";

const checkRole = (currentrole: string, accountToDeleterole: string) => {
  if (currentrole !== "manager" && currentrole !== "staff") {
    return { status: 403, message: "Forbidden: Only manager or staff can use " };
  }
  if (currentrole !== "manager" && (accountToDeleterole === "staff" || accountToDeleterole === "manager")) {
    return { status: 403, message: "Forbidden: Only manager can use " };
  }
  if (currentrole === accountToDeleterole) {
    return { status: 400, message: "Bad Request: not use for same role" };
  }
  return null;
}

const updateAvatar = async (accountId: string, url: string) => {
  await prisma.account.update({
    where: { accountID: accountId },
    data: { avatarUrl: url }
  })
  return { status: 200, message: "Avatar updated successfully" };
}

export { checkRole, updateAvatar }