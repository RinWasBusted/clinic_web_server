import pool from "../../utils/db.js";
import { Request, Response } from "express";

export const loginUser = async (req: Request, res: Response) => {
  const { username, password } = req.body;
  
  try {
    const query = `SELECT id, role FROM users WHERE username = $1 AND password = $2`;
    const result = await pool.query(query, [username, password]);
    
    if (result.rows.length === 0) {
      return res.status(401).json({ message: "Invalid credentials" });
    }
    
    return res.status(200).json({ 
      message: "Login successful", 
      user: result.rows[0] 
    });
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
