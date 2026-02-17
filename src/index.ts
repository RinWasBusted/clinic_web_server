import 'dotenv/config';
import app from './server.js';
import pool from './utils/db.js';
import { initUsersTable } from './api/auth/auth.model.js';
import authRoutes from './api/auth/auth.route.js';
import { setupSwagger } from './swagger.js';
import express from "express";

const PORT = process.env.PORT || 3000;

app.use(express.json());
setupSwagger(app);
app.use('/api/auth', authRoutes);

const startServer = async () => {
    try {
        await initUsersTable();
        const client = await pool.connect();
        console.log('Database connected successfully');
        client.release();
    }
    catch (error) {
        console.error('Database connection error:', error);
        process.exit(1);
    }

    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
}

startServer();
