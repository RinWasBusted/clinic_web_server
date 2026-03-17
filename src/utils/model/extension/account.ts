import { Prisma } from "../../prisma.js";

const AccountExtension = Prisma.defineExtension({
  name: "accountFullName",
  result: {
    account: {
      fullName: {
        needs: { firstName: true, lastName: true },
        compute(account) {
          // Display as Vietnamese format: LastName FirstName
          return `${account.lastName} ${account.firstName}`;
        },
      },
      genderDisplay: {
        // Hiển thị giới tính theo định dạng tiếng Việt
        needs: { gender: true },
        compute(account) {
          return account.gender === "male" ? "Nam" : "Nữ";
        },
      },
    },
  },
});
export default AccountExtension;
