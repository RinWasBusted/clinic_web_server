import { AccountRole } from "../../generated/prisma/index.js";

function isAccountRole(v: unknown): v is AccountRole {
    return typeof v === "string" && (Object.values(AccountRole) as string[]).includes(v);
}
export {isAccountRole}