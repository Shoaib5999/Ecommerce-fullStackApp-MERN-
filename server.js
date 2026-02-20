import express from "express";
import dotenv from "dotenv";
import morgan from "morgan";
import cors from "cors";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import { existsSync } from "fs";

import { connectDB } from "./config/db.js";

import authRoute from "./routes/authRoute.js";
import categoryRoutes from "./routes/categoryRoutes.js";
import productRoutes from "./routes/productRoutes.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load .env from project root (must run before any code that reads env)
dotenv.config({ path: join(__dirname, ".env") });

const app = express();

/**
 * In Vercel serverless, you must not call `app.listen`.
 * Instead, export the Express `app` and let the platform handle requests.
 *
 * Also ensure DB connection is established per cold start (and reused on warm
 * invocations via caching in `connectDB`).
 */
let dbReadyPromise = null;
const ensureDbReady = async () => {
  if (!dbReadyPromise) {
    dbReadyPromise = connectDB();
  }
  return dbReadyPromise;
};

// Middleware
app.use(
  cors({
    origin: true,
    credentials: true,
  }),
);
app.use(express.json({ limit: "2mb" }));
app.use(morgan("dev"));

// Serve React build when present (Vercel will primarily serve static output,
// but this keeps parity for other hosts too)
const clientBuildPath = join(__dirname, "./client/build");
const hasClientBuild = existsSync(clientBuildPath);
if (hasClientBuild) {
  app.use(express.static(clientBuildPath));
}

// Make sure DB is connected for all API requests
app.use("/api", async (req, res, next) => {
  try {
    await ensureDbReady();
    next();
  } catch (err) {
    console.error("MongoDB connection error:", err?.message || err);
    res.status(500).json({
      success: false,
      message: "Database connection failed",
    });
  }
});

// Routes
app.use("/api/v1/auth", authRoute);
app.use("/api/v1/category", categoryRoutes);
app.use("/api/v1/products", productRoutes);

// Health check (useful for Vercel / debugging)
app.get("/api/health", async (req, res) => {
  try {
    await ensureDbReady();
    res.status(200).json({ ok: true });
  } catch (err) {
    res.status(500).json({ ok: false });
  }
});

// SPA fallback: serve React index.html for non-API routes if build exists.
// Otherwise provide a simple message.
app.use("*", (req, res) => {
  if (hasClientBuild) {
    return res.sendFile(join(clientBuildPath, "index.html"));
  }
  return res.status(404).json({
    message:
      "API server running. React build not found. In development, run the client separately.",
  });
});

// When running locally (not on Vercel), start the HTTP server.
// Vercel uses api/index.js and does not call listen().
if (!process.env.VERCEL) {
  const PORT = process.env.PORT || 8080;
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

export default app;
