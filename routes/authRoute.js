const express = require("express");
const {
  registerController,
  loginController,
  testController,
} = require("../controllers/authController");
const { requireSignIn, isAdmin } = require("../middlewares/authMiddleware");

//router object
const router = express.Router();

//routing
//REGISTER || METHOD POST
router.post("/register", registerController);
//LOGIN || METHOD POST
router.post("/login", loginController);

//TEST ROUTE
router.get("/test", requireSignIn, isAdmin, testController);

// const authRoute = "hey there";
module.exports = router;
