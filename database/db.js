import { createPool } from "mysql";
import dotenv from "dotenv";

dotenv.config();

const db = createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  connectionLimit: 10
})

export default db;