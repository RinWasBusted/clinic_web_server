import "dotenv/config";
import prisma from "../src/utils/prisma.js";
import bcrypt from "bcryptjs";

async function main() {
  const email = process.env.ADMIN_EMAIL ;
  const password = process.env.ADMIN_PASSWORD ;
    if (!email || !password) {
    throw new Error("Missing ADMIN_EMAIL or ADMIN_PASSWORD in environment");
    }
  const hashed = await bcrypt.hash(password, 10);

  // Upsert: nếu đã có admin theo email -> update, chưa có -> create
  const admin = await prisma.account.upsert({
    where: { email },
    update: {
      role: "manager",
      firstName: "System",
      lastName: "Admin",
      password: hashed,
    },
    create: {
      email,
      role: "manager",
      firstName: "System",
      lastName: "Admin",
      password: hashed,
      birthDate: new Date("2000-01-01"),
    },
    select: { accountID: true, email: true, role: true },
  });

  console.log("Seeded admin:", admin);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });