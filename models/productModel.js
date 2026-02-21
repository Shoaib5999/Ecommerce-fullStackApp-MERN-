import mongoose from "mongoose";
import Counter from "./counterModel.js";

const productSchema = new mongoose.Schema(
  {
    productId: {
      type: Number,
      unique: true, // Ensure uniqueness for productId
    },
    name: { type: String, required: true },
    slug: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    category: { type: mongoose.ObjectId, ref: "Category", required: true },
    quantity: { type: Number, required: true },
    photoUrl: { type: String, required: true },
    photoUrls: [{ type: String }],
    featured: { type: Boolean, default: false },
    shipping: { type: Boolean },
  },
  { timestamps: true }
);

// Pre-save hook to assign an auto-incremented productId
productSchema.pre("save", async function (next) {
  if (this.isNew) {
    try {
      // Find the counter and increment the sequence number
      const counter = await Counter.findOneAndUpdate(
        { name: "productId" }, // Search by counter name
        { $inc: { seq: 1 } }, // Increment the sequence
        { new: true, upsert: true } // Create counter if it doesn't exist
      );

      this.productId = counter.seq; // Assign incremented productId to product
      next();
    } catch (error) {
      next(error);
    }
  } else {
    next();
  }
});

export default mongoose.model("Products", productSchema);
