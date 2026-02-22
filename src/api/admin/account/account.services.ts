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
export { checkRoleToDelete, checkRoleToRegister }