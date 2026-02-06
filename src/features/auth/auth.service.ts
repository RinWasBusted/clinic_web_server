import pool from '../../db.js';
import redisClient from '../../redis.client.js'; 

export const isEmailExist = async (email: string) : Promise<boolean> => {
    const query = `SELECT id FROM users WHERE email = '${email}'`;
    const result = await pool.query(query);
    return result.rows.length > 0;
}

export const registerUser = async (fullname: string, email: string, password: string) => {
    const query = `INSERT INTO users (fullname, email, password, role) VALUES ('${fullname}', '${email}', '${password}', 'client') RETURNING id, fullname, email`;
    try {
        const result = await pool.query(query);
        return result.rows[0];
    } catch (error) {
        throw new Error('Error registering user: ' + error);
    }
};

export const verifyUserEmail = async (userId: number) => {
    const query = `UPDATE users SET is_email_verified = TRUE WHERE id = ${userId}`;
    try {
        await pool.query(query);
        return true;
    } catch (error) {
        throw new Error('Error verifying user email: ' + error);
    }
};

export const loginUser = async (email: string, password: string) => {
    const query = `SELECT id, role FROM users WHERE email = '${email}' AND password = '${password}'`;
    try {
        const result = await pool.query(query);
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