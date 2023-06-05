const { hashPassword, comparePassword } = require("../helpers/authHelper.js");
const User = require("../models/userModels.js").User;
// console.log(userModel);
const JWT = require("jsonwebtoken"); //this token we do send while login

exports.registerController = async (req, res) => {
  // console.log(req.body);

  try {
    const { name, email, password, phone, address } = req.body; //destructuring data coming from req.body

    //validations
    if (!name) {
      return res.send({ message: "Name is Required" });
    }
    if (!email) {
      return res.send({ message: "Email is Required" });
    }
    if (!password) {
      return res.send({ message: "Password is Required" });
    }
    if (!phone) {
      return res.send({ message: "Phone is Required" });
    }
    if (!address) {
      return res.send({ message: "Address is Required" });
    }
    //check user
    const existingUser = await User.findOne({ email });
    //existing user
    if (existingUser) {
      console.log("existing user found");
      return res.status(200).send({
        success: true,
        message: "Already Registerd user please login",
      });
    }
    //register user
    const hashedPassword = await hashPassword(password); //we are able to handle req.body.password directly by passsword because we already d-stuccture everything coming from req.body

    // console.log("hashed password is :", hashedPassword);
    //save
    const user = await new User({
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
    const user = await User.findOne({ email });
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
//forgotPassword Controller
exports.forgotPasswordController = async (req, res) => {
  const [email, answer, newPassword] = req.body; //destructuring what is coming from req
  //validatin
  try {
    if (!email) {
      res.status(500).send({ message: "Email is required" });
    }
    if (!answer) {
      res.status(500).send({ message: "Answer is required" });
    }
    if (!newPassword) {
      res.status(500).send({ message: "newPassword is required" });
    }
    //check weather given email and the answer is exactly match or not
    const user = User.findOne({ email, answer }); //here it will search for both the email and the same answer
    if (!user) {
      res.status(500).send({
        success: false,
        message: "Wrong email or answer",
      });
    }
    //now hash the new password before saving to the db
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

//TEST CONTROLLER
exports.testController = (req, res) => {
  res.send("working fine");
};
