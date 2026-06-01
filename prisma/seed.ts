import "dotenv/config";
import prisma from "../src/utils/prisma.js";
import bcrypt from "bcryptjs";
import { createReadStream } from "node:fs";
import { resolve } from "node:path";
import { createInterface } from "node:readline";

async function seedDiseases() {
  const filePath = resolve("data/icd10cm-codes-April-1-2026.txt");
  const batchSize = 5000;
  const batch: Array<{ diseaseCode: string; diseaseName: string }> = [];
  let processed = 0;

  const flushBatch = async () => {
    if (!batch.length) return;
    const values = batch
      .map(
        (d) =>
          `('${d.diseaseCode.replace(/'/g, "''")}', '${d.diseaseName.replace(
            /'/g,
            "''"
          )}', 'ACTIVE')`
      )
      .join(",");

    await prisma.$executeRawUnsafe(`
      INSERT INTO "Disease" ("diseaseCode", "diseaseName", "status")
      VALUES ${values}
      ON CONFLICT ("diseaseCode") 
      DO UPDATE SET 
        "diseaseName" = EXCLUDED."diseaseName",
        "status" = EXCLUDED."status";
    `);
    processed += batch.length;
    console.log(`Bulk Upserted ${processed} diseases...`);
    batch.length = 0;
  };

  const rl = createInterface({
    input: createReadStream(filePath),
    crlfDelay: Infinity,
  });

  for await (const line of rl) {
    const trimmed = line.trim();
    if (!trimmed) continue;
    const match = trimmed.match(/^(\S+)\s+(.+)$/);
    if (!match) continue;
    const [, diseaseCode, diseaseName] = match;
    batch.push({ diseaseCode, diseaseName });
    if (batch.length >= batchSize) {
      await flushBatch();
    }
  }

  await flushBatch();
  console.log("Seeded diseases");
}

async function seedPermissions() {
  const filePath = resolve("data/permissions.txt");
  const rl = createInterface({
    input: createReadStream(filePath),
    crlfDelay: Infinity,
  });

  const permissions: Array<{
    code: string;
    permissionName: string;
    description: string;
  }> = [];

  for await (const line of rl) {
    const trimmed = line.trim();
    if (!trimmed) continue;
    // Split by multiple spaces (2 or more) to handle the aligned columns
    const parts = trimmed.split(/\s{2,}/);
    if (parts.length < 2) continue;
    const [code, permissionName, description = ""] = parts;
    permissions.push({ code, permissionName, description });
  }

  for (const p of permissions) {
    await prisma.permission.upsert({
      where: { code: p.code },
      update: {
        permissionName: p.permissionName,
        description: p.description,
      },
      create: p,
    });
  }
  console.log(`Seeded ${permissions.length} permissions`);
}


async function seedAdminAccount() {
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

  // Assign all permissions to Admin role
  const allPermissions = await prisma.permission.findMany();
  for (const p of allPermissions) {
    await prisma.rolePermission.upsert({
      where: {
        roleID_permissionID: {
          roleID: adminRole.roleID,
          permissionID: p.permissionID
        }
      },
      update: {},
      create: {
        roleID: adminRole.roleID,
        permissionID: p.permissionID
      }
    });
  }

  console.log("Seeded admin:", admin);
}

async function main() {
  // Seed permissions from file
  await seedPermissions();

  // Upsert admin account
  await seedAdminAccount();

  // 3. Seed diseases data
  // await seedDiseases();

}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });