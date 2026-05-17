import { Router } from "express";
import { live, ready } from "./health.controller.js";

const healthRoutes = Router();

/**
 * @swagger
 * /health/live:
 *   get:
 *     summary: Liveness check
 *     description: Confirms the Express process is running and able to serve requests
 *     tags:
 *       - Health
 *     responses:
 *       200:
 *         description: Service is alive
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: ok
 *                 service:
 *                   type: string
 *                   example: clinic_web_server
 *                 timestamp:
 *                   type: string
 *                   format: date-time
 */
healthRoutes.get("/live", live);

/**
 * @swagger
 * /health/ready:
 *   get:
 *     summary: Readiness check
 *     description: Confirms the application is ready to receive traffic by validating required dependencies
 *     tags:
 *       - Health
 *     responses:
 *       200:
 *         description: Service is ready
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: ok
 *                 service:
 *                   type: string
 *                   example: clinic_web_server
 *                 timestamp:
 *                   type: string
 *                   format: date-time
 *                 dependencies:
 *                   type: object
 *                   properties:
 *                     database:
 *                       type: string
 *                       example: up
 *                     redis:
 *                       type: string
 *                       example: up
 *       503:
 *         description: Database is unavailable
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: error
 *                 service:
 *                   type: string
 *                   example: clinic_web_server
 *                 timestamp:
 *                   type: string
 *                   format: date-time
 *                 dependencies:
 *                   type: object
 *                   properties:
 *                     database:
 *                       type: string
 *                       example: down
 *                     redis:
 *                       type: string
 *                       example: down
 */
healthRoutes.get("/ready", ready);

export default healthRoutes;
