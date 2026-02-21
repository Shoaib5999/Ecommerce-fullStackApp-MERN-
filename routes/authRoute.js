import express from "express";
import {
  registerController,
  loginController,
  testController,
  forgotPasswordController,
  updateProfileController,
  getAddressesController,
  addAddressController,
  updateAddressController,
  deleteAddressController,
  setDefaultAddressController,
} from "../controllers/authController.js";
import { requireSignIn, isAdmin } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/register", registerController);
router.post("/login", loginController);
router.get("/test", requireSignIn, isAdmin, testController);
router.post("/forgot-password", forgotPasswordController);
router.put("/profile", requireSignIn, updateProfileController);

router.get("/addresses", requireSignIn, getAddressesController);
router.post("/addresses", requireSignIn, addAddressController);
router.put("/addresses/:id", requireSignIn, updateAddressController);
router.delete("/addresses/:id", requireSignIn, deleteAddressController);
router.patch("/addresses/:id/default", requireSignIn, setDefaultAddressController);

router.get("/user-auth", requireSignIn, (req, res) => {
  res.status(200).send({
    ok: true,
    message: "welcome to the dashboard",
  });
});

router.get("/admin-auth", requireSignIn, isAdmin, (req, res) => {
  res.status(200).send({
    ok: true,
    message: "welcome to the admin dashboard",
  });
});

export default router;
