import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import serviciosRouter from "./routes/servicios.js";
import { ping } from "./db.js";

dotenv.config();

const app = express();
const PORT = Number(process.env.API_PORT || 3001);
const CORS_ORIGIN = process.env.API_CORS_ORIGIN || "http://localhost:5173";
const allowedOrigins = CORS_ORIGIN
  .split(",")
  .map((s) => s.trim().replace(/^["']|["']$/g, ""))
  .filter(Boolean);

console.log("[api] allowed origins:", allowedOrigins);

app.use(
  cors({
    origin: (origin, cb) => {
      if (!origin || allowedOrigins.includes(origin)) return cb(null, true);
      cb(new Error(`CORS: origin "${origin}" not in ${JSON.stringify(allowedOrigins)}`));
    },
    credentials: false,
  })
);
app.use(express.json());

app.use("/api", serviciosRouter);

app.use((err, _req, res, _next) => {
  console.error("[api] error:", err);
  res.status(500).json({ error: "internal_error", message: err.message });
});

(async () => {
  try {
    await ping();
    console.log("[api] DB connection OK");
  } catch (err) {
    console.error("[api] DB connection FAILED:", err.message);
    process.exit(1);
  }
  app.listen(PORT, () => {
    console.log(`[api] listening on http://localhost:${PORT}`);
  });
})();
