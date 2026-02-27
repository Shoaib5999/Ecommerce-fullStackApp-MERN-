import express from "express";
import { isAdmin, requireSignIn } from "./../middlewares/authMiddleware.js";
import {
  createProductController,
  deleteProductController,
  getProductController,
  getProductCountController,
  getProductsPerPageController,
  getSingleProduct,
  productPhotoController,
  updateProductController,
  searchProductsController,
  brainTreePaymentController,
  braintreeTokenController,
  toggleFeaturedProduct,
  razorpayCreateOrderController,
  razorpayVerifyPaymentController,
} from "../controllers/productController.js";
import formidableMiddleware from "express-formidable";

const router = express.Router();

//routes
router.post(
  "/create-product",
  formidableMiddleware({ multiples: true }),
  requireSignIn,
  isAdmin,
  createProductController,
);
router.get("/get-products", getProductController);
router.get("/get-product/:slug", getSingleProduct);
router.get("/get-product-photo/:pid", productPhotoController);
router.put(
  "/update-product/:slug",
  requireSignIn,
  isAdmin,
  formidableMiddleware({ multiples: true }),
  updateProductController,
);
router.delete(
  "/delete-product/:slug",
  requireSignIn,
  isAdmin,
  deleteProductController,
);

//count product
router.get("/get-product-count", getProductCountController);
// router.put("/update-product/:id",requireSignIn,isAdmin,updateProductController)
//get product perpage
router.post("/get-products-per-page/:page", getProductsPerPageController);
router.get("/search/:keyword", searchProductsController);
//togle featured products
router.post("/featured-product/:id", toggleFeaturedProduct);
//@Payment
//token
router.get("/braintree/token", braintreeTokenController);

//payments
router.post("/braintree/payment", requireSignIn, brainTreePaymentController);

//@Payment (Razorpay - sample; replace keys via env later)
// Create order (server calculates amount, returns order + keyId)
router.post(
  "/razorpay/create-order",
  // requireSignIn,
  razorpayCreateOrderController,
);

// Verify signature + create DB order
router.post(
  "/razorpay/verify-payment",
  requireSignIn,
  razorpayVerifyPaymentController,
);

export default router;
