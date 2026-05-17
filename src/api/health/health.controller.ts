import type { Request, Response } from "express";
import prisma from "../../utils/prisma.js";
import RedisClient from "../../services/redis/redis.config.js";

const SERVICE_NAME = "clinic_web_server";

export async function live(_req: Request, res: Response) {
  return res.status(200).json({
    status: "ok",
    service: SERVICE_NAME,
    timestamp: new Date().toISOString(),
  });
}

export async function ready(_req: Request, res: Response) {
  const timestamp = new Date().toISOString();
  const redisStatus = RedisClient.isReady ? "up" : "down";

  try {
    await prisma.$queryRaw`SELECT 1`;

    const status = redisStatus === "up" ? "ok" : "degraded";

    return res.status(200).json({
      status,
      service: SERVICE_NAME,
      timestamp,
      dependencies: {
        database: "up",
        redis: redisStatus,
      },
    });
  } catch {
    return res.status(503).json({
      status: "error",
      service: SERVICE_NAME,
      timestamp,
      dependencies: {
        database: "down",
        redis: redisStatus,
      },
    });
  }
}
