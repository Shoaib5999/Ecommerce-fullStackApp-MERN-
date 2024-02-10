import express from "express";
import dotenv from "dotenv";
import morgan from "morgan";
import { connectDB } from "./config/db.js";
import authRoute from "./routes/authRoute.js";
import cors from "cors";

const app = express();

// Configure environment variables
dotenv.config();

// Database configuration
connectDB();

// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

// Routes
app.use("/api/v1/auth", authRoute);

// APIs
app.get("/", (req, res) => {
  res.send("<h1>Welcome to our ecommerce website</h1>");
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
