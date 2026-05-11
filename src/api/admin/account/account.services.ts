import { prisma } from "../../../utils/prisma.js";

/**
 * Map a role's profileType to a Prisma nested-create payload.
 * profileType is stored on the Role record (e.g. "staff", "doctor", etc.)
 * Returns an empty object for unknown / custom roles (no sub-table).
 */
export function buildProfileCreate(profileType: string | null | undefined) {
  switch (profileType) {
    case "staff": return { staff: { create: {} } };
    case "doctor": return { doctor: { create: {} } };
    case "pharmacist": return { pharmacist: { create: {} } };
    case "manager": return { manager: { create: {} } };
    case "patient": return { patient: { create: {} } };
    default: return {};
  }
}

const updateAvatar = async (accountId: string, url: string) => {
  await prisma.account.update({
    where: { accountID: accountId },
    data: { avatarUrl: url }
  })
  return { status: 200, message: "Avatar updated successfully" };
}

export { updateAvatar }