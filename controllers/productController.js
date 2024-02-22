import productModel from "../models/productModel.js";
import slugify from "slugify";
import fs from "fs";

export const createProductController = async (req, res) => {
  try {
    const { name, slug, description, price, category, quantity, shipping } =
      req.fields;
    const { photo } = req.files;
    switch (true) {
      case !name:
        return res.status(500).send({ error: "Name Is Required" });
      case !description:
        return res.status(500).send({ error: "Description Is Required" });
      case !price:
        return res.status(500).send({ error: "Price Is Required" });
      case !category:
        return res.status(500).send({ error: "Category Is Required" });
      case !quantity:
        return res.status(500).send({ error: "Quantity Is Required" });
      case !photo || (photo && photo.size > 1000000):
        return res
          .status(500)
          .send({ error: "Photo Is Required And Should Be <1mb" });
    }
    const products = new productModel({ ...req.fields, slug: slugify(name) });
    if (photo) {
      products.photo.data = fs.readFileSync(photo.path);
      products.photo.contentType = photo.type;
    }
    await products.save();
    res.status(200).send({
      success: true,
      message: "Product Created Successfully",
      product: products,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      success: false,
      message: "Error In Creating Product",
      error: error,
    });
  }
};

export const getProductController = async (req, res) => {
  try {
    // const products = await (await productModel.find()).filter("-photo").limit(req.params.count).sort({createdAt:-1})
    const products = await productModel
      .find()
      .select("-photo") // Exclude the 'photo' field
      .sort({ createdAt: -1 })
      .lean(); // Convert Mongoose documents to plain JavaScript objects

    // console.log(products);

    res.status(200).send({
      success: true,
      message: "Product Lists",
      products: products,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      success: false,
      message: "Error In Getting Products",
      error: error,
    });
  }
};

export const getSingleProduct = async (req, res) => {
  try {
    const products = await productModel
      .findOne({ _id: req.params.pid })
      .select("-photo") // Exclude the 'photo' field
      .limit(req.params.count);
    res.status(200).send({
      success: true,
      message: "Product Fetched",
      products: products,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error While Getting Product",
      error: error,
    });
  }
};

//photo controller
export const productPhotoController = async (req, res) => {
  try {
    const product = await productModel
      .findById({ _id: req.params.pid })
      .select("photo");
    if (product.photo.data) {
      res.set("Content-type", product.photo.contentType);
      return res.status(200).send(product.photo.data);
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error While Getting Product Photo",
      error: error,
    });
  }
};
//update products
export const updateProductController = async (req, res) => {
  try {
    const { name, slug, description, price, category, quantity, shipping } =
      req.fields;
    switch (true) {
      case !name:
        return res.status(500).send({ error: "Name Is Required" });
      case !description:
        return res.status(500).send({ error: "Description Is Required" });
      case !price:
        return res.status(500).send({ error: "Price Is Required" });
      case !category:
        return res.status(500).send({ error: "Category Is Required" });
      case !quantity:
        return res.status(500).send({ error: "Quantity Is Required" });
    }
    const product = await productModel
      .findByIdAndUpdate(req.params.pid, { ...req.fields, slug: slugify(name) })
      .select("-photo");
    console.log(product);
    await product.save();
    res.status(200).send({
      success: true,
      message: "Product Updated Successfully",
      product: product,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      success: false,
      message: "Error In Updating Product",
      error: error,
    });
  }
};
//delete COntroller
export const deleteProductController = async (req, res) => {
  try {
    const deleted = await productModel.findByIdAndDelete(req.params.pid);
    res.status(200).send({
      success: true,
      message: "Deleted Successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      message: "Error In Deletion Of The Product",
    });
  }
};

//product count controller
export const getProductCountController = async (req, res) => {
  try {
    const total = await productModel.find({}).estimatedDocumentCount();
    res.status(200).send({
      success: false,
      total,
    });
  } catch (error) {
    console.log(error),
      res.status(500).send({
        message: "Error in Count product",
        error,
      });
  }
};
//get product perpage
export const getProductsPerPageController = async (req, res) => {
  const perPage = 2;
  const { checked, search } = req.body;
  const page = parseInt(req.params.page) || 1;

  try {
    console.log("Received checked array:", checked);

    const query =
      checked && checked.length > 0
        ? { category: { $in: checked.map(String) } }
        : {};
    console.log("Generated query:", query);

    const products = await productModel
      .find(query)
      .select("-photo")
      .skip((page - 1) * perPage)
      .limit(perPage)
      .sort({ createdAt: -1 });

    console.log("Products:", products);

    res.status(200).send({
      success: true,
      message: "Filtered Products Per Page",
      products,
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send({
      message: "Error in Get Products Per Page",
      error,
    });
  }
};
export const searchProductsController = async (req, res) => {
  try {
    let { keyword } = req.params;
    const results = await productModel
      .find({
        $or: [
          { name: { $regex: keyword, $option: "i" } },
          { description: { $regex: keyword, $option: "i" } },
        ],
      })
      .select("-photo");
    res.status(200).send({
      message: true,
      results,
    });
  } catch (error) {
    res.status(400).send({
      message: "Error in search",
      error,
    });
  }
};
