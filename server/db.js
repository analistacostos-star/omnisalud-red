import mysql from "mysql2/promise";
import dotenv from "dotenv";

dotenv.config();

const required = ["DB_HOST", "DB_USER", "DB_NAME"];
const missing = required.filter((k) => !process.env[k]);
if (missing.length) {
  throw new Error(`Missing required env vars: ${missing.join(", ")}`);
}

export const pool = mysql.createPool({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT || 3306),
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: Number(process.env.DB_CONNECTION_LIMIT || 10),
  connectTimeout: Number(process.env.DB_CONNECT_TIMEOUT_MS || 10000),
  charset: "utf8mb4",
  decimalNumbers: true,
  namedPlaceholders: true,
});

export async function ping() {
  const conn = await pool.getConnection();
  try {
    await conn.ping();
    return true;
  } finally {
    conn.release();
  }
}
