import { Pool } from "pg";

const pool = new Pool({
  user: "admin",
  host: "localhost",
  database: "mydatabase",
  password: "admin123",
  port: 5432,
});

export default pool;
