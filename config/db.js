import mongoose from "mongoose";

/**
 * Serverless-friendly Mongo connection helper.
 *
 * In serverless environments (like Vercel), your code may run in many short-lived
 * instances. This caches the connection on the global object so warm invocations
 * can reuse it and you don't create a new connection per request.
 */

// Cache across hot reloads / warm invocations
global._mongooseCache = global._mongooseCache || { conn: null, promise: null };

const connectDB = async () => {
  const MONGO_URL = process.env.MONGO_URL;
  if (!MONGO_URL) {
    throw new Error("MONGO_URL is not set in environment variables");
  }

  if (global._mongooseCache.conn) return global._mongooseCache.conn;

  if (!global._mongooseCache.promise) {
    global._mongooseCache.promise = mongoose
      .connect(MONGO_URL, {
        // These options are harmless for newer mongoose versions; kept for clarity.
        // Mongoose 7+ uses sensible defaults.
      })
      .then((m) => m);
  }

  global._mongooseCache.conn = await global._mongooseCache.promise;
  return global._mongooseCache.conn;
};

export { connectDB };
