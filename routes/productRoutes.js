import express from "express";
import { isAdmin, requireSignIn } from "./../middlewares/authMiddleware.js";
import { createProductController, deleteProductController, getProductController, getSingleProduct, productPhotoController, updateProductController, } from "../controllers/productController.js";
import formidableMiddleware from  'express-formidable';


const router = express.Router();

//routes
router.post("/create-product",formidableMiddleware(),requireSignIn,isAdmin,createProductController)
router.get("/get-products",getProductController)
router.get("/get-product/:pid",getSingleProduct)
router.get("/get-product-photo/:pid",productPhotoController)
router.put("/update-product/:pid",requireSignIn,isAdmin,formidableMiddleware(),updateProductController)
router.delete("/delete-product/:pid",requireSignIn,isAdmin,deleteProductController)
// router.put("/update-product/:id",requireSignIn,isAdmin,updateProductController)

export default router;