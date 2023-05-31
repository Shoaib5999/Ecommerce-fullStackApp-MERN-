const JWT = require("jsonwebtoken");
const { User } = require("../models/userModels.js");
//protected routes token base
exports.requireSignIn = async (req, res, next) => {
  JWT_token = req.headers["authorization"]; //this takes jwt_token which is being sent through headers
  // console.log(JWT_token);
  try {
    const decode = JWT.verify(JWT_token, process.env.JWT_SECRET);
    console.log(decode);
    req.user = decode; //now i know what this decode is it is actually an object that contains _id and the login time and expire login time we are sending this to the req so we can access this in the middleware
    next();
  } catch (error) {
    console.log(error);
  }
};

//admin access
exports.isAdmin = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id); //
    if (user.role !== 1) {
      //user.role is just a field in mongoDB database 1 represent admit 0 represent no admin

      return res.status(401).send({
        success: false,
        message: "UnAuthorized Access",
      });
    } else {
      next();
    }
  } catch (error) {
    res.status(404).send({
      success: false,
      message: "unAuthorised person , not an admin",
      error,
    });
    console.log(error);
  }
};
