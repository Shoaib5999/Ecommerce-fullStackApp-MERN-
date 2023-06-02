const express = require("express");
const dotenv = require("dotenv");
const morgan = require("morgan");
const { connectDB } = require("./config/db.js");
const authRoute = require("./routes/authRoute.js");
const cors = require("cors");
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
app.use(morgan("dev")); //i think it just give us the colorful console or i don't know

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
