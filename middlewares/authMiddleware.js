import JWT from "jsonwebtoken";
import User from "../models/userModels.js";

// Protected routes token base
export const requireSignIn = async (req, res, next) => {
  const JWT_token = req.headers["authorization"];
  try {
    const decode = JWT.verify(JWT_token, process.env.JWT_SECRET);
    console.log(decode);
    req.user = decode;
    next();
  } catch (error) {
    console.log(error);
  }
};

// Admin access
export const isAdmin = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    if (user.role !== 1) {
      return res.status(401).send({
        success: false,
        message: "Unauthorized Access",
      });
    } else {
      next();
    }
  } catch (error) {
    res.status(404).send({
      success: false,
      message: "Unauthorized person, not an admin",
      error,
    });
    console.log(error);
  }
};
