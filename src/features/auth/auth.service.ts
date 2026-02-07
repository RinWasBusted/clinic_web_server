import pool from '../../db.js';
import redisClient from '../../redis.client.js'; 

export const isEmailExist = async (email: string) : Promise<boolean> => {
    const query = `SELECT id FROM users WHERE email = $1`;
    const values = [email];
    const result = await pool.query(query, values);
    return result.rows.length > 0;
}

export const registerUser = async (fullname: string, email: string, password: string) => {
    const query = `INSERT INTO users (fullname, email, password, role) VALUES ($1, $2, $3, 'doctor') RETURNING id, fullname, email`;
    const values = [fullname, email, password];
    try {
        const result = await pool.query(query, values);
        return result.rows[0];
    } catch (error) {
        throw new Error('Error registering user: ' + error);
    }
};

export const verifyUserEmail = async (userId: number) => {
    const query = `UPDATE users SET is_email_verified = TRUE WHERE id = $1`;
    const values = [userId];
    try {
        await pool.query(query, values);
        return true;
    } catch (error) {
        throw new Error('Error verifying user email: ' + error);
    }
};

export const loginUser = async (email: string, password: string) => {
    const query = `SELECT id, role FROM users WHERE email = $1 AND password = $2`;
    const values = [email, password];
    try {
        const result = await pool.query(query, values);
        if(result.rows.length == 0) {
            return null;
        }
        return result.rows[0];
    } catch (error) {
        throw new Error('Error logging in user: ' + error);
    }
};

export const createRefeshToken = async (userId:number, role: string, refreshToken: string, expireIn: number) => {
    const key = 'rt:' + refreshToken;
    try {
        await redisClient.set(key, JSON.stringify({ userId, role }), { EX: expireIn });
    } catch(error) {
        throw new Error('Error creating refresh token: ' + error);
    }
};

export const checkRefreshToken = async (refreshToken: string) => {
    const key = 'rt:' + refreshToken;
    try {
        const user = await redisClient.get(key);
        if(!user) {
            return null;
        }
        return JSON.parse(user);
    } catch (error) {
        throw new Error('Error checking refresh token: ' + error);
    }
};

export const deleteRefreshToken = async (refreshToken: string) => {
    const key = 'rt:' + refreshToken;
    try {
        await redisClient.del(key);
    } catch (error) {
        throw new Error('Error deleting refresh token: ' + error);
    }
}