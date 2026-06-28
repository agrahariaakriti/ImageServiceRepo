import { Imagedb } from "../Models/image.model.js";
import { nanoid } from "nanoid";
import {
  uploadOnCloudinar,
  uploadBufferDataToCloudinary,
  deleteFromCloudinary,
} from "../Util/cloudinary.config.js";
import {
  getimagerediscache,
  setimagerediscache,
  deleteimagerediscache,
} from "../redis.cache/image.redis.cache.js";
import { processImgae } from "../Util/python.service.config.js";

export const imageUploadService = async (req) => {
  const imagefile = req.file;
  const user = req.userId;
  if (!user) {
    const error = new Error("Unauthorized");
    error.statusCode = 401;
    throw error;
  }

  if (!imagefile) {
    const error = new Error("No file found");
    error.statusCode = 400;
    throw error;
  }
  const mimeType = imagefile.mimetype;
  const allMimeType = ["image/png", "image/jpeg", "image/webp", "image/jpg"];
  if (!allMimeType.includes(mimeType)) {
    const error = new Error("Unsupported Media Type");
    error.statusCode = 415;
    throw error;
  }

  const imageCode = nanoid(8);
  const generatedimageUrl = `${process.env.imageurl}/${imageCode}`;
  const response = await uploadOnCloudinar(imagefile.path);
  if (!response) {
    const error = new Error("Cloudinary upload failed");
    error.statusCode = 500;
    throw error;
  }

  const val = await Imagedb.create({
    originalUrl: response.secure_url,
    generatedCode: imageCode,
    publicId: response.public_id,
    userId: user,
    mimeType: mimeType,
    imageSize: {
      height: response.height,
      width: response.width,
    },
    bytes: response.bytes,
  });

  return {
    url: generatedimageUrl,
    publicId: imageCode,
  };
};

export const getimageservice = async (imageCode) => {
  if (!imageCode) {
    const error = new Error("Invalid url");
    error.statusCode = 400;
    throw error;
  }

  const getimagecache = await getimagerediscache(imageCode);
  if (getimagecache) {
    return getimagecache;
  }

  const imageInfo = await Imagedb.findOne({ generatedCode: imageCode });

  if (!imageInfo) {
    const error = new Error("Invalid url");
    error.statusCode = 400;
    throw error;
  }

  await setimagerediscache(imageCode, imageInfo);

  return imageInfo;
};

export const transformgetimageservice = async (data) => {
  try {
    const userId = data.userId;
    const parameter = data.imageCode;
    const transformingparameter = data.transformingparameter;

    if (!parameter) {
      const error = new Error("Invalid url");
      error.statusCode = 400;
      throw error;
    }

    const imageInfo = await Imagedb.findOne({ generatedCode: parameter });

    if (!imageInfo) {
      const error = new Error("Invalid url");
      error.statusCode = 400;
      throw error;
    }

    if (Object.keys(transformingparameter).length == 0) {
      return imageInfo;
    }

    const responce = await processImgae(
      imageInfo.originalUrl,
      transformingparameter,
    );
    if (!responce || responce.length === 0) {
      throw new Error("Invalid image from Python");
    }

    const imageCode = nanoid(8);
    const generatedimageUrl = `${process.env.imageurl}/fetch/${imageCode}`;

    const cloudinaryRes = await uploadBufferDataToCloudinary(responce);
    if (!cloudinaryRes) {
      const error = new Error("Cloudinary upload failed");
      error.statusCode = 500;
      throw error;
    }

    const newimage = await Imagedb.create({
      originalUrl: cloudinaryRes.secure_url,
      generatedCode: imageCode,
      publicId: cloudinaryRes.public_id,
      userId: userId,
      mimeType: imageInfo.mimeType,
      imageSize: {
        height: cloudinaryRes.height,
        width: cloudinaryRes.width,
      },

      bytes: cloudinaryRes.bytes,
    });


    return {
      url: generatedimageUrl,
      code: imageCode,
      image: newimage,
      height: cloudinaryRes.height,
      width: cloudinaryRes.width,
      format: cloudinaryRes.format,
    };
  } catch (error) {
    throw error;
  }
};

export const getallimageservice = async (req) => {
  const userId = req.userId;
  if (!userId) {
    const error = new Error(
      "Can not get the image. Please try after sometime ",
    );

    error.statuscode = 402;
    throw error;
  }
  const img_arr = await Imagedb.find({ userId }).sort({ createdAt: -1 });

  return img_arr;
};

export const removeimageservice = async (imageCode) => {
  const image = await Imagedb.findOne({ generatedCode: imageCode });

  if (!image) {
    throw new Error("Image not found");
  }

  // deleting image from cloudinary
  const cloudinaryRes = await deleteFromCloudinary(image.publicId);

  if (!cloudinaryRes || cloudinaryRes.result !== "ok") {
    throw new Error("Cloudinary deletion failed");
  }

  const result_db = await Imagedb.deleteOne({
    generatedCode: image.generatedCode,
  });
 
  if (!result_db) {
    const error = new Error("Cloudinary deletion failed");
    error.statusCode = 500;

    throw error;
  }

  await deleteimagerediscache(imageCode);
  return true;
};
