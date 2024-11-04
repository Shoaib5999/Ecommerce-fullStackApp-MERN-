import mongoose from "mongoose";

const counterSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true }, // Counter name, e.g., "productId"
  seq: { type: Number, default: 0 }, // Current count, starting from 0
});

const Counter = mongoose.model("Counter", counterSchema);
export default Counter;
