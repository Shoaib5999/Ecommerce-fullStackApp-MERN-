// config/cloudinaryConfig.js
import { v2 as cloudinary } from "cloudinary";
cloudinary.config({
  // cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  cloud_name: "dei1kplrb",
  // api_key: process.env.CLOUDINARY_API_KEY,
  api_key: "471731855486996",
  // api_secret: process.env.CLOUDINARY_API_SECRET,
  api_secret: "ZNpvfUBbnvCVSIgzCumTlbrWblA",
});

export default cloudinary;
