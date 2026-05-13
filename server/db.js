import mysql from "mysql2/promise";
import dotenv from "dotenv";
import fs from "fs";

dotenv.config();

function loadPEM(envKey) {
  const v = process.env[envKey];
  if (!v) return undefined;
  if (v.includes("-----BEGIN")) return v;
  try {
    return fs.readFileSync(v, "utf8");
  } catch (err) {
    console.warn(`Could not read file for ${envKey} at ${v}: ${err.message}`);
    return undefined;
  }
}

const sslKey = loadPEM("DB_SSL_KEY");
const sslCert = loadPEM("DB_SSL_CERT");
const sslCA = loadPEM("DB_SSL_CA");

const required = ["DB_HOST", "DB_USER", "DB_NAME"];
const missing = required.filter((k) => !process.env[k]);
if (missing.length) {
  throw new Error(`Missing required env vars: ${missing.join(", ")}`);
}

const poolOptions = {
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
};

if (sslKey || sslCert || sslCA) {
  poolOptions.ssl = {
    ...(sslKey ? { key: sslKey } : {}),
    ...(sslCert ? { cert: sslCert } : {}),
    ...(sslCA ? { ca: sslCA } : {}),
  };
}

export const pool = mysql.createPool(poolOptions);

export async function ping() {
  const conn = await pool.getConnection();
  try {
    await conn.ping();
    return true;
  } finally {
    conn.release();
  }
}
