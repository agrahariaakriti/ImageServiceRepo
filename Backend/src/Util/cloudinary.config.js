import dotenv from "dotenv";
dotenv.config();
import streamifier from "streamifier";
import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_CLOUD_API_KEY,
  api_secret: process.env.CLOUDINARY_CLOUD_API_SECRET,
});

export const uploadOnCloudinar = async (localFilepath) => {
  try {
    if (!localFilepath) {
      return null;
    } else {
      const response = await cloudinary.uploader.upload(localFilepath, {
        resource_type: "auto",
      });
      console.log("File uploaded successfully", response);
      fs.unlinkSync(localFilepath);
      return response;
    }
  } catch (error) {
    console.log("The error while uploading file...", error);

    fs.unlinkSync(localFilepath);
    return null;
  }
};

export const uploadBufferDataToCloudinary =async (buffer) => {
  return new Promise((resolve, reject) => {

    const stream = cloudinary.uploader.upload_stream(
      {
        folder: "edited-images",
      },
      (error, result) => {
        if (error) {
          reject(error);
        } else {
          resolve(result);
        }
      }
    );

    streamifier.createReadStream(buffer).pipe(stream);

  });
};