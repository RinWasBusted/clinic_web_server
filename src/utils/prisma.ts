import { PrismaClient, Prisma } from "../generated/prisma/index.js"; 
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const adapter = new PrismaPg(pool);
const prismaClient = new PrismaClient({ adapter });
const prisma = prismaClient.$extends({
  query: {
    $allModels: {
      async findFirst({ args, query }) {
        args.where = { 
          ...args.where, 
          is_active: true
        };
        return query(args);
      },
      async findMany({ args, query }) {
        args.where = { 
          ...args.where, 
          is_active: true
        };
        return query(args);
      },
      async count({ args, query }) {
        args.where = { 
          ...args.where, 
          is_active: true
        };
        return query(args);
      }
    },
}
});

export { prisma, Prisma, prismaClient as prismaRaw }; 
export default prisma;