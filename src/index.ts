import 'dotenv/config';
import app from './server.js';
import pool from './db.js';
import { initUsersTable } from './features/auth/auth.model.js';
import authRoutes from './features/auth/auth.route.js';

const PORT = process.env.PORT || 3000;

app.use('/api/auth', authRoutes);

const startServer = async () => {
    try {
        await initUsersTable();
        const client = await pool.connect();
        const result = await client.query('SELECT * from users');
        console.log('Database connected successfully');
        console.log('Users data:', result.rows);
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
