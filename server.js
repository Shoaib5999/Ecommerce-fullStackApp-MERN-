const express = require("express");
const dotenv = require("dotenv"); //to manage environment variables
const morgan = require("morgan"); //It gives us idea about from where request is coming and all in console
const { connectDB } = require("./config/db.js");
const authRoute = require("./routes/authRoute.js");
const cors = require("cors"); //just to handle cross origin requests from frontend
// console.log(authRoute);
//rest object
const app = express();

//configure env
dotenv.config(); //because we are configuring first dotenv file then running the next connectDB function thats why we are able to use env variables in further file without requiring them
//database config
// console.log(connectDB);
connectDB();

//middleware
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

//routes
app.use("/api/v1/auth", authRoute);

//apis
app.get("/", (req, res) => {
  res.send("<h1>Welcome to our ecommerce website</h1>");
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log("Server is running on port" + PORT);
});
