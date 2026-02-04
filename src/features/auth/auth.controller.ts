import pool from "../../db.js";
import { Request, Response } from "express";

export const loginUser = async (req: Request, res: Response) => {
  const { username, password } = req.body;
  const query = `SELECT id, role FROM users WHERE username = ${username} AND password = ${password}`;
  const result = await pool.query(query);
  if (result.rows.length == 0) {
    return res.status(401).json({ message: "Invalid credentials" });
  } else {
    return res
      .status(200)
      .json({ message: "Login successful", user: result.rows[0] });
  }
};
