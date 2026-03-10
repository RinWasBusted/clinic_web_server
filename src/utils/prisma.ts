import { PrismaClient, Prisma } from "../generated/prisma/index.js";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";
import AccountExtension from "./model/extension/account.js";
import AllExtension from "./model/extension/all.js";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const adapter = new PrismaPg(pool);
const prismaClient = new PrismaClient({ adapter });

// Danh sách các bảng dùng is_active
const ACTIVE_MODELS = ["Account"];
// Danh sách các bảng dùng status (ẩn đi những dữ liệu đã bị xóa mềm)
const STATUS_MODELS = ["Faculty", "Room"];

const prisma = prismaClient
  .$extends({
    query: {
      $allModels: {
        async findFirst({ model, args, query }) {
          if (model && ACTIVE_MODELS.includes(model)) {
            args.where = { ...args.where, is_active: true };
          } else if (model && STATUS_MODELS.includes(model)) {
            args.where = { ...args.where, status: { not: "DELETED" } };
          }
          return query(args);
        },
        async findMany({ model, args, query }) {
          if (model && ACTIVE_MODELS.includes(model)) {
            args.where = { ...args.where, is_active: true };
          } else if (model && STATUS_MODELS.includes(model)) {
            args.where = { ...args.where, status: { not: "DELETED" } };
          }
          return query(args);
        },
        async count({ model, args, query }) {
          if (model && ACTIVE_MODELS.includes(model)) {
            args.where = { ...args.where, is_active: true };
          } else if (model && STATUS_MODELS.includes(model)) {
            args.where = { ...args.where, status: { not: "DELETED" } };
          }
          return query(args);
        },
      },
    },
  })
  .$extends(AccountExtension)
  .$extends(AllExtension);

export { prisma, Prisma, prismaClient as prismaRaw };
export default prisma;
