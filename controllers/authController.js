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
    if (!password) {
      return res.json({ error: "Password is required" });
    }
    const hashedPassword = password ? await hashPassword(password) : undefined;
    const updateUser = await User.findByIdAndUpdate(
      req.user._id,
      {},
      {
        name: name || user.name,
        password: password || user.password,
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
