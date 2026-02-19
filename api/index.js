/**
 * Vercel Serverless Function entrypoint.
 *
 * This file is required because Vercel expects backend code under `api/`.
 * We export the Express app (no `listen()`).
 */
import app from "../server.js";

export default app;
