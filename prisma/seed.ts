import "dotenv/config";
import prisma from "../src/utils/prisma.js";
import bcrypt from "bcryptjs";

async function main() {
  const email = process.env.ADMIN_EMAIL;
  const password = process.env.ADMIN_PASSWORD;
  if (!email || !password) {
    throw new Error("Missing ADMIN_EMAIL or ADMIN_PASSWORD in environment");
  }
  const hashed = await bcrypt.hash(password, 10);
  let adminRole = await prisma.role.findFirst({
    where: { roleName: "Admin" }
  });

  if (!adminRole) {
    adminRole = await prisma.role.create({
      data: {
        roleName: "Admin",
        roleDescription: "System Administrator",
      }
    });
  }

  // Seed default permissions
  const defaultPermissions = [
    { code: "account.read", permissionName: "View accounts", description: "Read user accounts" },
    { code: "account.write", permissionName: "Manage accounts", description: "Create, update, delete user accounts" },
    { code: "medicine.read", permissionName: "View medicine stock", description: "Read medicine inventory" },
    { code: "medicine.write", permissionName: "Manage medicine", description: "Manage medicine inventory and tickets" },
    { code: "appointment.read", permissionName: "View appointments", description: "Read appointments" },
    { code: "appointment.write", permissionName: "Manage appointments", description: "Create, update appointments" },
    { code: "report.read", permissionName: "View reports", description: "View system reports" },
  ];

  for (const p of defaultPermissions) {
    await prisma.permission.upsert({
      where: { code: p.code },
      update: {
        permissionName: p.permissionName,
        description: p.description
      },
      create: p
    });
  }

  // 2. Upsert admin account
  const admin = await prisma.account.upsert({
    where: { email },
    update: {
      roleID: adminRole.roleID,
      roleName: adminRole.roleName,
      firstName: "System",
      lastName: "Admin",
      password: hashed,
    },
    create: {
      email,
      roleID: adminRole.roleID,
      roleName: adminRole.roleName,
      firstName: "System",
      lastName: "Admin",
      password: hashed,
      birthDate: new Date("2000-01-01"),
    },
    select: { accountID: true, email: true, roleName: true },
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