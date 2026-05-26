import mysql from "mysql2/promise";
import pg from "pg";
import dotenv from "dotenv";
import fs from "fs";

dotenv.config();

export const DB_TYPE = (process.env.DB_TYPE || "mysql").toLowerCase();

// ── MySQL helpers ─────────────────────────────────────────────

function loadPEM(envKey) {
  const v = process.env[envKey];
  if (!v) return undefined;
  let content;
  if (v.includes("-----BEGIN")) {
    content = v.replace(/\\n/g, "\n");
  } else {
    try {
      content = fs.readFileSync(v, "utf8");
    } catch (err) {
      console.warn(`Could not read file for ${envKey} at ${v}: ${err.message}`);
      return undefined;
    }
  }
  if (!content.endsWith("\n")) content += "\n";
  return content;
}

// ── Pool init ─────────────────────────────────────────────────

const required = ["DB_HOST", "DB_USER", "DB_NAME"];
const missing = required.filter((k) => !process.env[k]);
if (missing.length) throw new Error(`Missing required env vars: ${missing.join(", ")}`);

let _mysqlPool;
let _pgPool;

if (DB_TYPE === "pg") {
  const { Pool } = pg;
  _pgPool = new Pool({
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT || 5432),
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD || "",
    database: process.env.DB_NAME,
    max: Number(process.env.DB_CONNECTION_LIMIT || 10),
    connectionTimeoutMillis: Number(process.env.DB_CONNECT_TIMEOUT_MS || 10000),
    ssl: { rejectUnauthorized: false },
  });
} else {
  const sslKey = loadPEM("DB_SSL_KEY");
  const sslCert = loadPEM("DB_SSL_CERT");
  const sslCA = loadPEM("DB_SSL_CA");

  const opts = {
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
    opts.ssl = {
      ...(sslKey && { key: sslKey }),
      ...(sslCert && { cert: sslCert }),
      ...(sslCA && { ca: sslCA }),
    };
  }

  _mysqlPool = mysql.createPool(opts);
}

// ── Unified query adapter ─────────────────────────────────────
// Always use $1, $2 ... positional params in SQL.
// For MySQL, this adapter converts them to ? and expands the values array.

export async function query(sql, values = []) {
  if (DB_TYPE === "pg") {
    const result = await _pgPool.query(sql, values);
    return { rows: result.rows, rowCount: result.rowCount };
  }

  // Convert $1, $2... → ? and expand duplicate references
  const mysqlValues = [];
  const mysqlSql = sql.replace(/\$(\d+)/g, (_, n) => {
    mysqlValues.push(values[Number(n) - 1]);
    return "?";
  });

  const [result] = await _mysqlPool.execute(mysqlSql, mysqlValues);
  if (Array.isArray(result)) {
    return { rows: result, rowCount: result.length };
  }
  return { rows: [], rowCount: result.affectedRows || 0 };
}

// ── Ping ──────────────────────────────────────────────────────

export async function ping() {
  if (DB_TYPE === "pg") {
    const client = await _pgPool.connect();
    try {
      await client.query("SELECT 1");
    } finally {
      client.release();
    }
  } else {
    const conn = await _mysqlPool.getConnection();
    try {
      await conn.ping();
    } finally {
      conn.release();
    }
  }
  return true;
}
