import express from "express";
import { isAdmin, requireSignIn } from "./../middlewares/authMiddleware.js";
import { createProductController, deleteProductController, getProductController, getSingleProduct, productPhotoController, updateProductController, } from "../controllers/productController.js";
import formidableMiddleware from  'express-formidable';


const router = express.Router();

//routes
router.post("/create-product",requireSignIn,isAdmin,formidableMiddleware(),createProductController)
router.get("/get-products/:count",getProductController)
router.get("/get-product/:slug",getSingleProduct)
router.get("/get-product-photo/:pid",productPhotoController)
router.put("/update-product/:pid",requireSignIn,isAdmin,formidableMiddleware(),updateProductController)
router.delete("delete-product/:pid",requireSignIn,isAdmin,deleteProductController)
// router.put("/update-product/:id",requireSignIn,isAdmin,updateProductController)

export default router;