import express from "express";
import { isAdmin, requireSignIn } from "./../middlewares/authMiddleware.js";
import {
  getCategoryControlller,
  createCategoryController,
  deleteCategoryController,
  singleCategoryController,
  updateCategoryController,
} from "./../controllers/categoryController.js";

const router = express.Router();

//routes
// create category
router.post(
  "/create-category",
  requireSignIn,
  isAdmin,
  createCategoryController
);

// //update category
router.put("/update-category/:id", requireSignIn,isAdmin,updateCategoryController)

//getALl category
router.get("/get-category", getCategoryControlller);

// //single category
// router.get("/single-category/:slug", singleCategoryController);

// //delete category
router.delete("/delete-category/:id",requireSignIn,isAdmin,deleteCategoryController)

//single category
router.get("/get-category/:id",singleCategoryController)

export default router;
