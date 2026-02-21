import mongoose from "mongoose";
import { hashPassword, comparePassword } from "../helpers/authHelper.js";
import User from "../models/userModels.js";
import JWT from "jsonwebtoken";
// import User from "../models/userModels.js";
export const registerController = async (req, res) => {
  try {
    const { name, email, password, phone, address } = req.body;

    if (!name || !email || !password || !phone || !address) {
      return res.send({ message: "All fields are required" });
    }

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(200).send({
        success: true,
        message: "Already registered user. Please login.",
      });
    }

    const hashedPassword = await hashPassword(password);
    console.log("hashedPassword", hashedPassword);

    const user = await new User({
      name,
      email,
      phone,
      address,
      password: hashedPassword,
    }).save();

    res.status(201).send({
      success: true,
      message: "User registered successfully",
      user,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in registration",
      error,
    });
  }
};

export const loginController = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(404).send({
        success: false,
        message: "Invalid email or password",
      });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).send({
        success: false,
        message: "Email is not registered",
      });
    }

    const match = await comparePassword(password, user.password);

    if (!match) {
      return res.status(401).send({
        success: false,
        message: "Invalid password",
      });
    }

    const token = await JWT.sign({ _id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.status(200).send({
      success: true,
      message: "Login successful",
      user: {
        name: user.name,
        email: user.email,
        phone: user.phone,
        address: user.address,
        role: user.role,
        deliveryAddresses: user.deliveryAddresses || [],
      },
      token,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in login",
      error,
    });
  }
};

export const forgotPasswordController = async (req, res) => {
  const [email, answer, newPassword] = req.body;

  try {
    if (!email || !answer || !newPassword) {
      res.status(500).send({ message: "All fields are required" });
    }

    const user = await User.findOne({ email, answer });

    if (!user) {
      res.status(500).send({
        success: false,
        message: "Wrong email or answer",
      });
    }

    const hashed = await hashPassword(newPassword);
    await User.findByIdAndUpdate(user._id, { password: hashed });

    res.status(200).send({
      success: true,
      message: "Password reset successfully",
    });
  } catch (error) {
    console.log(error);
  }
};
export const updateProfileController = async (req, res) => {
  try {
    const { name, email, password, address, phone } = req.body;
    const user = await User.findById(req.user._id);
    if (password && password.length < 6) {
      return res.json({
        error: "Password is required and is must be 6> charectors",
      });
    }
    const hashedPassword = password ? await hashPassword(password) : undefined;

    const updateUser = await User.findByIdAndUpdate(
      req.user._id,
      {
        name: name || user.name,
        password: hashedPassword || user.password,
        phone: phone || user.phone,
        address: address || user.address,
      },
      { new: true }
    );

    res.status(200).send({
      success: true,
      message: "Profile Updated Successfully",
      updateUser,
    });
  } catch (error) {
    res.status(400).send({
      success: false,
      message: "Error while Update Profile",
      error,
    });
  }
};

export const testController = (req, res) => {
  res.send("Working fine");
};

// --- Delivery addresses (separate from profile) ---
export const getAddressesController = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("deliveryAddresses");
    res.status(200).json({
      success: true,
      deliveryAddresses: user.deliveryAddresses || [],
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching addresses",
      error: error.message,
    });
  }
};

export const addAddressController = async (req, res) => {
  try {
    const { label, street, city, state, zip, country, isDefault } = req.body;
    if (!street || !city || !country) {
      return res.status(400).json({
        success: false,
        message: "Street, city and country are required",
      });
    }
    const user = await User.findById(req.user._id);
    const addresses = user.deliveryAddresses || [];
    if (isDefault) {
      addresses.forEach((a) => (a.isDefault = false));
    }
    const newAddr = {
      _id: new mongoose.Types.ObjectId(),
      label: label || "Home",
      street,
      city,
      state: state || "",
      zip: zip || "",
      country,
      isDefault: !!isDefault,
    };
    addresses.push(newAddr);
    await User.findByIdAndUpdate(req.user._id, { deliveryAddresses: addresses });
    res.status(201).json({
      success: true,
      message: "Address added",
      deliveryAddresses: addresses,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error adding address",
      error: error.message,
    });
  }
};

export const updateAddressController = async (req, res) => {
  try {
    const { id } = req.params;
    const { label, street, city, state, zip, country, isDefault } = req.body;
    const user = await User.findById(req.user._id);
    const addresses = user.deliveryAddresses || [];
    const idx = addresses.findIndex((a) => a._id.toString() === id);
    if (idx === -1) {
      return res.status(404).json({ success: false, message: "Address not found" });
    }
    if (street) addresses[idx].street = street;
    if (city) addresses[idx].city = city;
    if (label !== undefined) addresses[idx].label = label;
    if (state !== undefined) addresses[idx].state = state;
    if (zip !== undefined) addresses[idx].zip = zip;
    if (country !== undefined) addresses[idx].country = country;
    if (isDefault === true) {
      addresses.forEach((a, i) => (addresses[i].isDefault = i === idx));
    }
    await User.findByIdAndUpdate(req.user._id, { deliveryAddresses: addresses });
    res.status(200).json({
      success: true,
      message: "Address updated",
      deliveryAddresses: addresses,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error updating address",
      error: error.message,
    });
  }
};

export const deleteAddressController = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(req.user._id);
    let addresses = user.deliveryAddresses || [];
    const idx = addresses.findIndex((a) => a._id.toString() === id);
    if (idx === -1) {
      return res.status(404).json({ success: false, message: "Address not found" });
    }
    addresses = addresses.filter((_, i) => i !== idx);
    await User.findByIdAndUpdate(req.user._id, { deliveryAddresses: addresses });
    res.status(200).json({
      success: true,
      message: "Address deleted",
      deliveryAddresses: addresses,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error deleting address",
      error: error.message,
    });
  }
};

export const setDefaultAddressController = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(req.user._id);
    const addresses = user.deliveryAddresses || [];
    const idx = addresses.findIndex((a) => a._id.toString() === id);
    if (idx === -1) {
      return res.status(404).json({ success: false, message: "Address not found" });
    }
    addresses.forEach((a, i) => (addresses[i].isDefault = i === idx));
    await User.findByIdAndUpdate(req.user._id, { deliveryAddresses: addresses });
    res.status(200).json({
      success: true,
      message: "Default address updated",
      deliveryAddresses: addresses,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error setting default address",
      error: error.message,
    });
  }
};
