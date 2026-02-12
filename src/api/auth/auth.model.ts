import pool from "../../utils/db.js";

export const initUsersTable = async () => {
  const query = `
    CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        username VARCHAR(50) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        avatar_url VARCHAR(500),
        role VARCHAR(20) NOT NULL,
        is_email_verified BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )`;
  try {
    await pool.query(query);
    console.log("Users table initialized");
  } catch (error) {
    console.error("Error creating users table:", error);
  }
};
