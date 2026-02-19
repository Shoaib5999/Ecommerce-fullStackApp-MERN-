import express from "express";
import dotenv from "dotenv";
import morgan from "morgan";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import { existsSync } from "fs";
import { connectDB } from "./config/db.js";
import authRoute from "./routes/authRoute.js";
import categoryRoutes from "./routes/categoryRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import cors from "cors";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();

// Configure environment variables
dotenv.config();

const clientBuildPath = join(__dirname, "./client/build");
const hasClientBuild = existsSync(clientBuildPath);

// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

// Only serve React build in production (when client/build exists)
if (hasClientBuild) {
  app.use(express.static(clientBuildPath));
}

// Routes
app.use("/api/v1/auth", authRoute);
app.use("/api/v1/category", categoryRoutes);
app.use("/api/v1/products", productRoutes);

// Serve index.html only when build exists; otherwise 404 for non-API routes
app.use("*", function (req, res) {
  if (hasClientBuild) {
    res.sendFile(join(clientBuildPath, "index.html"));
  } else {
    res.status(404).json({
      message:
        "API server running. In development, use the React app at http://localhost:3000",
    });
  }
});

connectDB()
  .then(() => {
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Server not started: MongoDB connection failed.", err.message);
    process.exit(1);
  });
