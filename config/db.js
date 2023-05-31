const mongoose = require("mongoose");
// const dotenv = require("dotenv"); we dont need because in our server file we config it before using this function
// dotenv.config();

// Replace 'your_database_url' with the actual URL of your MongoDB database

const connectDB = async () => {
  try {
    // console.log(process.env.MONGO_URL); //the question here is how am i able to use environment variable here without requiring it or without config like as we did in server .js file
    const conn = await mongoose.connect(process.env.MONGO_URL);
    console.log(`Connected to the mongodb database ${conn.connection.host}`);
  } catch (e) {
    console.log(`Error in Mongodb Connection ${e}`);
  }
};
module.exports.connectDB = connectDB;
