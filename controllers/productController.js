import productModel from "../models/productModel.js";
import slugify from "slugify";
import braintree from "braintree";
import orderModel from "../models/orderModel.js";
import cloudinary from "../middlewares/cloudinary.js";
import { logAction } from "../helpers/auditLogger.js";
import crypto from "crypto";
import Razorpay from "razorpay";

//@Payment Gateway (Braintree - legacy/sample)
var gateway = new braintree.BraintreeGateway({
  environment: braintree.Environment.Sandbox,
  merchantId: "your_sandbox_merchant_id",
  publicKey: "sandbox_public_key_here",
  privateKey: "sandbox_private_key_here",
});

//@Payment Gateway (Razorpay - live via env)
// Required env vars:
// - RAZORPAY_KEY_ID
// - RAZORPAY_KEY_SECRET
const getRazorpayClient = () => {
  const key_id = process.env.RAZORPAY_KEY_ID;
  const key_secret = process.env.RAZORPAY_KEY_SECRET;

  if (!key_id || !key_secret) {
    throw new Error(
      "Razorpay keys missing. Set RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET in environment variables.",
    );
  }

  return new Razorpay({ key_id, key_secret });
};

const normalizePhotos = (input) => {
  if (!input) return [];
  if (Array.isArray(input)) return input;
  if (input.path) return [input];
  return Object.values(input).filter((item) => item?.path);
};

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
    const { name, description, price, category, quantity, shipping } =
      req.fields || {};
    const photosInput = req.files?.photos ?? req.files?.photo;
    const photos = normalizePhotos(photosInput);

    if (!name || !description || !price || !category || !quantity) {
      return res.status(400).json({
        success: false,
        message:
          "All fields are required (name, description, price, category, quantity)",
      });
    }
    if (!photos.length) {
      return res.status(400).json({
        success: false,
        message: "At least one photo is required",
      });
    }
    if (photos.some((photo) => photo?.size > 3000000)) {
      return res.status(400).json({
        success: false,
        message: "Each photo should be less than 3MB",
      });
    }

    const product = new productModel({
      name,
      slug: slugify(name),
      description,
      price: Number(price),
      category,
      quantity: Number(quantity),
      shipping: shipping === "1" || shipping === true,
    });

    const uploads = await Promise.all(
      photos.map((photo) =>
        cloudinary.uploader.upload(photo.path, { folder: "ProductsImages" }),
      ),
    );
    const urls = uploads.map((result) => result.secure_url);
    product.photoUrl = urls[0];
    product.photoUrls = urls;

    await product.save();

    res.status(201).json({
      success: true,
      message: "Product created successfully",
      product,
    });
  } catch (error) {
    console.log("Error in adding product", error);
    res.status(500).json({
      success: false,
      message: "Error in adding product",
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
    const photosInput = req.files?.photos ?? req.files?.photo;
    const photos = normalizePhotos(photosInput);
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
      { ...req.fields, slug: slugify(name) },
    );

    if (photos.length) {
      if (photos.some((photo) => photo?.size > 3000000)) {
        return res.status(400).send({
          success: false,
          message: "Each photo should be less than 3MB",
        });
      }
      const uploads = await Promise.all(
        photos.map((photo) =>
          cloudinary.uploader.upload(photo.path, { folder: "ProductsImages" }),
        ),
      );
      const urls = uploads.map((result) => result.secure_url);
      product.photoUrl = urls[0];
      product.photoUrls = urls;
    }

    await product.save();
    console.log(product);
    res.status(200).send({
      success: true,
      message: "Product Updated Successfully",
      product: product,
    });
    await logAction({
      userId: req.user._id,
      action: "Update",
      entity: "Product",
      entityId: product._id,
      changes: {
        before: product,
        after: product,
      },
      ipAddress: req.ip,
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
    await logAction({
      userId: req.user._id,
      action: "Delete",
      entity: "Product",
      entityId: deleted._id,
      changes: {
        before: deleted,
        after: null,
      },
      ipAddress: req.ip,
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
    (console.log(error),
      res.status(500).send({
        message: "Error in Count product",
        error,
      }));
  }
};
//get product perpage
export const getProductsPerPageController = async (req, res) => {
  const perPage = 10;
  const { checked, search } = req.body;
  const page = parseInt(req.params.page) || 1;

  try {
    console.log("Received checked array:", checked);

    const query =
      checked && checked.length > 0
        ? { category: { $in: checked.map(String) } }
        : {};
    console.log("Generated query:", query);

    const [products, totalCount] = await Promise.all([
      productModel
        .find(query)
        .select("-photo")
        .skip((page - 1) * perPage)
        .limit(perPage)
        .sort({ featured: -1, createdAt: -1 }),
      productModel.countDocuments(query),
    ]);

    const hasNextPage = page * perPage < totalCount;
    const hasPreviousPage = page > 1;

    res.status(200).send({
      success: true,
      message: "Filtered Products Per Page",
      products,
      totalCount,
      perPage,
      page,
      hasNextPage,
      hasPreviousPage,
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
//search products suggestions controller
export const searchProductsSuggestionsController = async (req, res) => {
  try {
    const { keyword } = req.params;
    const products = await productModel.find({
      $or: [
        { name: { $regex: keyword, $options: "i" } },
        { description: { $regex: keyword, $options: "i" } },
      ],
    });
    res.status(200).send({
      sucess: true,
      message: "Search products suggestions",
      products,
    });
  } catch (error) {
    console.log(error);
    res.status(400).send({
      message: "Error in search products suggestions",
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
      },
    );
  } catch (error) {
    console.log(error);
  }
};

/**
 * =========================
 * Razorpay (Sample) - Server APIs
 * =========================
 *
 * Flow:
 * 1) Client calls `razorpayCreateOrderController` with cart + totals.
 * 2) Server computes amount (in paise), creates Razorpay order (sample here), and returns:
 *    - orderId
 *    - amount
 *    - currency
 *    - keyId (public)
 * 3) Client opens Razorpay Checkout and receives:
 *    - razorpay_payment_id
 *    - razorpay_order_id
 *    - razorpay_signature
 * 4) Client sends these to `razorpayVerifyPaymentController`
 * 5) Server verifies signature using `RAZORPAY_KEY_SECRET` and creates an Order in DB.
 */

// Create a Razorpay order (REAL implementation using Razorpay SDK)
export const razorpayCreateOrderController = async (req, res) => {
  try {
    const { cart, promoCode } = req.body || {};

    if (!Array.isArray(cart) || cart.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Cart is required",
      });
    }

    // Server-side amount calculation (do not trust client totals)
    const subtotal = cart.reduce((sum, i) => {
      const qty = Number(i?.qty || 1);
      const price = Number(i?.price || 0);
      return sum + price * qty;
    }, 0);

    // Keep promo logic aligned with frontend sample (SAVE10)
    const normalizedPromo = String(promoCode || "")
      .trim()
      .toUpperCase();
    const discount = normalizedPromo === "SAVE10" ? subtotal * 0.1 : 0;

    // Mirror the frontend logic (shipping/tax)
    const shipping = subtotal >= 100 ? 0 : subtotal === 0 ? 0 : 9.99;
    const tax = subtotal * 0.08;

    const total = Math.max(0, subtotal + shipping + tax - discount);

    // Razorpay expects amount in paise (smallest unit)
    const amountInPaise = Math.round(total * 100);

    // Create order via Razorpay SDK
    const razorpay = getRazorpayClient();
    const receipt = `rcpt_${Date.now()}`;

    const order = await razorpay.orders.create({
      amount: amountInPaise,
      currency: "INR",
      receipt,
      notes: {
        promoCode: normalizedPromo || undefined,
        userId: String(req.user?._id || ""),
      },
    });

    return res.status(200).json({
      success: true,
      message: "Razorpay order created",
      keyId: process.env.RAZORPAY_KEY_ID,
      order,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Error creating Razorpay order",
      error: error?.message,
    });
  }
};

// Verify Razorpay signature and create DB order
export const razorpayVerifyPaymentController = async (req, res) => {
  try {
    const {
      cart,
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      promoCode,
    } = req.body || {};

    if (!Array.isArray(cart) || cart.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Cart is required",
      });
    }

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({
        success: false,
        message:
          "Missing required Razorpay fields (razorpay_order_id, razorpay_payment_id, razorpay_signature)",
      });
    }

    const keySecret =
      process.env.RAZORPAY_KEY_SECRET || "RAZORPAY_KEY_SECRET_HERE";

    // Verify signature: HMAC_SHA256(order_id + "|" + payment_id, key_secret)
    const body = `${razorpay_order_id}|${razorpay_payment_id}`;
    const expectedSignature = crypto
      .createHmac("sha256", keySecret)
      .update(body)
      .digest("hex");

    const signatureIsValid =
      String(expectedSignature) === String(razorpay_signature);

    if (!signatureIsValid) {
      return res.status(400).json({
        success: false,
        message: "Invalid payment signature",
      });
    }

    // Create order record in DB
    const payment = {
      gateway: "razorpay",
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      promoCode:
        String(promoCode || "")
          .trim()
          .toUpperCase() || undefined,
      verified: true,
      verifiedAt: new Date().toISOString(),
    };

    const order = await new orderModel({
      products: cart,
      payment,
      buyer: req.user._id,
    }).save();

    return res.status(200).json({
      success: true,
      message: "Payment verified and order created",
      order,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Error verifying Razorpay payment",
      error: error?.message,
    });
  }
};
