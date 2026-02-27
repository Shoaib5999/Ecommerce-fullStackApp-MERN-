import JWT from "jsonwebtoken";
import User from "../models/userModels.js";

// Protected routes token base
export const requireSignIn = async (req, res, next) => {
  try {
    const authHeader = req.headers["authorization"];

    if (!authHeader) {
      return res.status(401).json({
        success: false,
        message: "Authorization header is missing",
      });
    }

    // Supports:
    // - "Bearer <token>"
    // - "<token>"
    const token = authHeader.startsWith("Bearer ")
      ? authHeader.slice("Bearer ".length).trim()
      : authHeader.trim();

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "JWT is missing",
      });
    }

    const decode = JWT.verify(token, process.env.JWT_SECRET);
    req.user = decode;
    return next();
  } catch (error) {
    // TokenExpiredError, JsonWebTokenError, NotBeforeError
    return res.status(401).json({
      success: false,
      message:
        error?.name === "TokenExpiredError" ? "JWT expired" : "Invalid JWT",
    });
  }
};

// Admin access
export const isAdmin = async (req, res, next) => {
  try {
    if (!req.user?._id) {
      return res.status(401).send({
        success: false,
        message: "Unauthorized Access",
      });
    }

    const user = await User.findById(req.user._id);
    if (!user || user.role !== 1) {
      return res.status(401).send({
        success: false,
        message: "Unauthorized Access",
      });
    }
    return next();
  } catch (error) {
    return res.status(500).send({
      success: false,
      message: "Error while checking admin role",
    });
  }
};
