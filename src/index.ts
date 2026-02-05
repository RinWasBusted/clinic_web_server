import 'dotenv/config';
import app from './server.js';
import { initUsersTable } from './features/auth/auth.model.js';
import authRoutes from './features/auth/auth.route.js';
import express from 'express';

const PORT = process.env.PORT || 9999;

const startServer = async () => {
    await initUsersTable();
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
    app.use(express.json());

    app.use('/api/auth', authRoutes);
}

startServer();
