const express = require("express");
const {
  registerController,
  loginController,
  testController,
  forgotPasswordController,
} = require("../controllers/authController");
const { requireSignIn, isAdmin } = require("../middlewares/authMiddleware");
const { token } = require("morgan");

//router object
const router = express.Router();

//routing
//REGISTER || METHOD POST
router.post("/register", registerController);
//LOGIN || METHOD POST
router.post("/login", loginController);

//TEST ROUTE
router.get("/test", requireSignIn, isAdmin, testController); //This route is private to use this route user should be singed in and isAdmin should be true then testController will run

//Forot password
router.post("/forgot-password", forgotPasswordController);

//protected auth route
router.get("/user-auth", requireSignIn, (req, res) => {
  // console.log("connected from backend");
  res.status(200).send({
    ok: true,
    message: "welcome to the dashboard",
    
  });
});
//protected admin route
router.get("/admin-auth", requireSignIn,isAdmin, (req, res) => {
  // console.log("connected from backend");
  res.status(200).send({
    ok: true,
    message: "welcome to the admin dashboard",
    
  });
});

// const authRoute = "hey there";
module.exports = router;
