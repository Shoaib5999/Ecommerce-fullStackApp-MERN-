import productModel from "../models/productModel.js";
import slugify from "slugify";
import fs from "fs";
import braintree from "braintree";
import orderModel from "../models/orderModel.js";
import cloudinary from "../middlewares/cloudinary.js";
//@Payment Gateway
var gateway = new braintree.BraintreeGateway({
  environment: braintree.Environment.Sandbox,
  merchantId: "your_sandbox_merchant_id",
  publicKey: "sandbox_public_key_here",
  privateKey: "sandbox_private_key_here",
});

export const createProductController1 = async (req, res) => {
  try {
    const { name, slug, description, price, category, quantity, shipping } =
      req.fields;
    const { photo } = req.files;

    // Validate required fields
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

    // Create product with fields only (photo will be added after Cloudinary upload)
    const products = new productModel({ ...req.fields, slug: slugify(name) });

    if (photo) {
      // Upload photo to Cloudinary
      const result = await cloudinary.uploader.upload(photo.path, {
        folder: "ProductsImages",
      });
      // Set the Cloudinary URL as the product's photo field
      products.photoUrl = result.secure_url;
    }

    // Save the product to the database
    await products.save();

    // Send the success response
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
      error: error.message,
    });
  }
};

//To bulk upload products in json form

export const createProductController = async (req, res) => {
  try {
    const products = [
      {
        name: "Paracetamol 500mg",
        slug: "paracetamol-500mg",
        description: "A common pain relief and fever reducer.",
        price: 50,
        category: "65d2e2b6940b49d1dbe41a56",
        quantity: 100,
        photoUrl:
          "https://res.cloudinary.com/demo/image/upload/v1591850000/sample.jpg",
        shipping: true,
      },
      {
        name: "Vitamin C Tablets",
        slug: "vitamin-c-tablets",
        description: "Immune-boosting supplement with 500mg Vitamin C.",
        price: 150,
        category: "666687b7ab429d56df0c87ba",
        quantity: 200,
        photoUrl:
          "https://res.cloudinary.com/demo/image/upload/v1591850001/sample.jpg",
        shipping: true,
      },
      {
        name: "Herbal Face Wash",
        slug: "herbal-face-wash",
        description: "Gentle herbal face wash for all skin types.",
        price: 80,
        category: "666687c2ab429d56df0c87bf",
        quantity: 150,
        photoUrl:
          "https://res.cloudinary.com/demo/image/upload/v1591850002/sample.jpg",
        shipping: true,
      },
      {
        name: "Omega-3 Fish Oil",
        slug: "omega-3-fish-oil",
        description: "Supports heart and brain health.",
        price: 300,
        category: "666687b7ab429d56df0c87ba",
        quantity: 100,
        photoUrl:
          "https://res.cloudinary.com/demo/image/upload/v1591850003/sample.jpg",
        shipping: true,
      },
      {
        name: "Hand Sanitizer",
        slug: "hand-sanitizer",
        description: "Kills 99.9% of germs instantly.",
        price: 40,
        category: "666687c2ab429d56df0c87bf",
        quantity: 300,
        photoUrl:
          "https://res.cloudinary.com/demo/image/upload/v1591850004/sample.jpg",
        shipping: true,
      },
      // Add more products as needed
    ];

    // Using `Promise.all` to handle async calls in `.map()`
    const savedProducts = await Promise.all(
      products.map(async (item) => {
        const newProduct = new productModel({
          ...item,
          slug: slugify(item.name),
        });
        return await newProduct.save();
      })
    );

    // Return a success response with the saved products
    res.status(201).json({
      message: "Products added successfully",
      data: savedProducts,
    });
  } catch (error) {
    console.log("Error in adding products", error);
    res.status(500).json({
      message: "Error in adding products",
      error: error.message,
    });
  }
};

export const getProductController = async (req, res) => {
  try {
    // const products = await (await productModel.find()).filter("-photo").limit(req.params.count).sort({createdAt:-1})
    const products = await productModel
      .find()
      .select("-photo") // Exclude the 'photo' field
      .sort({ featured: -1, createdAt: -1 })
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
    console.log("getsingleprodyct route");
    const products = await productModel
      .findOne({ slug: req.params.slug })
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
    }
    const product = await productModel.findOneAndUpdate(
      { slug: req.params.slug },
      { ...req.fields, slug: slugify(name) }
    );

    if (photo) {
      product.photo.data = fs.readFileSync(photo.path);
      product.photo.contentType = photo.type;
    }

    await product.save();
    console.log(product);
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
    const deleted = await productModel.findOneAndDelete({
      slug: req.params.slug,
    });
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
      .sort({ featured: -1, createdAt: -1 });

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
    let keyword = req.params.keyword; // Extracting 'search' parameter
    console.log(keyword);

    const results = await productModel
      .find({
        $or: [
          { name: { $regex: keyword, $options: "i" } },
          { description: { $regex: keyword, $options: "i" } },
        ],
      })
      .select("-photo")
      .sort({ featured: -1 });

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

//featured products api function
export const toggleFeaturedProduct = async (req, res) => {
  try {
    const id = req.params.id;
    // Find the product by ID
    const product = await productModel.findOne({ productId: id });

    // Check if the product exists
    if (!product) {
      return res.status(404).send({
        message: "Product not found",
      });
    }

    // Toggle the 'featured' field
    product.featured = !product.featured;

    // Save the updated product
    await product.save();

    // Send a success response
    res.status(200).send({
      message: "Featured status toggled successfully",
      product,
    });
  } catch (error) {
    res.status(400).send({
      message: "Error in toggling featured product",
      error,
    });
  }
};

//payment gateway api
//token
export const braintreeTokenController = async (req, res) => {
  try {
    gateway.clientToken.generate({}, function (err, response) {
      if (err) {
        res.status(500).send(err);
      } else {
        res.send(response);
      }
    });
  } catch (error) {
    console.log(error);
  }
};
export const brainTreePaymentController = async () => {
  try {
    const { cart, nonce } = req.body;
    let total = 0;
    cart.map((i) => (total += i.price));
    let newTransaction = gateway.transaction.sale(
      {
        amount: total,
        paymentMethodNonce: nonce,
        options: {
          submitForSettlement: true,
        },
      },
      function (error, result) {
        if (error) {
          const order = new orderModel({
            products: cart,
            payment: result,
            buyer: req.user._id,
          }).save();
          res.json({ ok: true });
        } else {
          res.status(500).send(error);
        }
      }
    );
  } catch (error) {
    console.log(error);
  }
};
