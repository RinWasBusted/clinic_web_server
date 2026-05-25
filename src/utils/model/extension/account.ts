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
      age: {
        needs: { birthDate: true },
        compute(account) {
          const bd = account.birthDate ? new Date(account.birthDate) : null;
          if (!bd || isNaN(bd.getTime())) return null;
          const today = new Date();
          let age = today.getFullYear() - bd.getFullYear();
          const m = today.getMonth() - bd.getMonth();
          if (m < 0 || (m === 0 && today.getDate() < bd.getDate())) {
            age--;
          }
          return age;
        },
      },
    },
  },
});
export default AccountExtension;
