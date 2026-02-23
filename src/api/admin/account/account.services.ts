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

export { checkRole }