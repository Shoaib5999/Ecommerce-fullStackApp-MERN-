const { hashPassword, comparePassword } = require("../helpers/authHelper.js");
const userModel = require("../models/userModels.js");
const JWT = require("jsonwebtoken");

exports.registerController = async (req, res) => {
  try {
    const { name, email, password, phone, address } = req.body;

    //validations
    if (!name) {
      return res.send({ error: "Name is Required" });
    }
    if (!email) {
      return res.send({ error: "Email is Required" });
    }
    if (!password) {
      return res.send({ error: "Password is Required" });
    }
    if (!phone) {
      return res.send({ error: "Phone is Required" });
    }
    if (!address) {
      return res.send({ error: "Address is Required" });
    }
    //check user
    const existingUser = await userModel.findOne({ email });
    //existing user
    if (existingUser) {
      console.log("existing user found");
      return res.status(200).send({
        success: true,
        message: "Already Registerd user please login",
      });
    }
    //register user
    const hashedPassword = await hashPassword(password);
    console.log("hashed password is :", hashedPassword);
    //save
    const user = await new userModel({
      name: name,
      email: email,
      phone: phone,
      address: address,
      password: hashedPassword,
    }).save();
    res.status(201).send({
      success: true,
      message: "User Register Successfully",
      user,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in Registration",
      error,
    });
  }
};

//LOGIN POST
exports.loginController = async (req, res) => {
  try {
    const { email, password } = req.body; //we are destructuring the email and password because we know that from the login page only email and password will come

    //validation - we are performing like form validation if there is no email or password we will through error
    if (!email || !password) {
      return res.status(404).send({
        //404 is a bad req
        success: false,
        message: "Invalid email or password",
      });
    }
    //AUTHENTICATION - we are performing authentication if email and password same as the backend stored authenticated user
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(404).send("Email is not registered");
    }
    //if user is available we are now performing password match if the password entered on login page is same or not
    const match = await comparePassword(password, user.password);
    if (!match) {
      return res.status(200).send({
        success: false,
        message: "Invalid Password",
      });
    }
    //token - we send token while login through the response if everything is ok like the password is matched and ofcourse after authentication and authorisation

    const token = await JWT.sign({ _id: user._id }, process.env.JWT_SECRET, {
      //{ _id: user._id } this should be the unique thing
      expiresIn: "7d",
    });
    res.status(200).send({
      success: true,
      message: "login successfully",
      user: {
        name: user.name,
        email: user.email,
        phone: user.phone,
        address: user.address,
      },
      token, //sending the token from login
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

//TEST CONTROLLER
exports.testController = (req, res) => {
  res.send("working fine");
};
