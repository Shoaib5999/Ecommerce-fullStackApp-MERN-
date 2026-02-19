import mongoose from "mongoose";

const connectDB = async () => {
  const url = process.env.MONGO_URL;
  if (!url) {
    throw new Error("MONGO_URL is not set in .env");
  }
  const conn = await mongoose.connect(url);
  console.log(`Connected to the MongoDB database ${conn.connection.host}`);
  return conn;
};

export { connectDB };
