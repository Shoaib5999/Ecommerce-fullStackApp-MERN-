import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    deliveryAddresses: [
      {
        label: { type: String, default: "Home" },
        street: { type: String, required: true },
        city: { type: String, required: true },
        state: { type: String, default: "" },
        zip: { type: String, default: "" },
        country: { type: String, required: true },
        isDefault: { type: Boolean, default: false },
      },
    ],
    answer: {
      type: String,
      required: false,
    },
    role: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

const User = mongoose.model("users", userSchema);

export default User;
