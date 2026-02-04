import app from './server.js';
import { initUsersTable } from './features/auth/auth.model.js';
import authRoutes from './features/auth/auth.route.js';

const PORT = process.env.PORT || 3000;

const startServer = async () => {
    await initUsersTable();
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });

    app.use('/api/auth', authRoutes);
}

startServer();
