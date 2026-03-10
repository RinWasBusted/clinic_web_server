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
    },
  },
});
export default AccountExtension;
