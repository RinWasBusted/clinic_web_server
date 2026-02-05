import pool from '../../db.js';

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