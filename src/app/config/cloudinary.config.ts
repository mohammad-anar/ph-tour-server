import { v2 as cloudinary } from "cloudinary";
import { envVars } from "./env";
import AppError from "../errorHelpers/AppError";

cloudinary.config({
  cloud_name: envVars.CLOUDINARY.CLOUDINARY_CLOUD_NAME,
  api_key: envVars.CLOUDINARY.CLOUDINARY_API_KEY,
  api_secret: envVars.CLOUDINARY.CLOUDINARY_API_SECRET,
});

// const uploadToCoudinary = cloudinary.uploader.upload();

// we will do the upload with "multer storage cloudinary" package

export const cloudinaryUpload = cloudinary;

// delete image from cloudinary

export const deleteImageFromCloudinary = async (url: string) => {
  try {
    const regex = /\/v\d+\/(.*?)\.(jpg|jpeg|png|gif|webp|svg)$/i;
    const match = url.match(regex);

    if (match && match[1]) {
      const public_id = match[1];
      await cloudinary.uploader.destroy(public_id);
      console.log("file deleted form cloudinary");
    }
  } catch (error: any) {
    throw new AppError(401, `Error: ${error.message}`);
  }
};
