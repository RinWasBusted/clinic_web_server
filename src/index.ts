import 'dotenv/config';
import app from './server.js';
import { initAuthTables } from './features/auth/auth.model.js';
import authRoutes from './features/auth/auth.route.js';
import express from 'express';
import cookieParser from 'cookie-parser';
import { connectRedis } from './redis.client.js';
import { setupSwagger } from './swagger.js';

const PORT = process.env.PORT || 9999;

const startServer = async () => {
    await initAuthTables();
    app.use(express.json());
    app.use(cookieParser());

    connectRedis();
    app.use('/api/auth', authRoutes);

    setupSwagger(app);

    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
}

startServer();
