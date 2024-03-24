import express from "express";
import dotenv from "dotenv";
import morgan from "morgan";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
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

// Database configuration

// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));
app.use(express.static(join(__dirname, "./client/build")));

// Routes
app.use("/api/v1/auth", authRoute);
app.use("/api/v1/category", categoryRoutes);
app.use("/api/v1/products", productRoutes);

// APIs
app.use("*", function (req, res) {
  res.sendFile(join(__dirname, "./client/build/index.html"));
});
connectDB().then(() => {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
});
