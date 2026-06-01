import mongoose from "mongoose";

const imageSchema = new mongoose.Schema(
  {
    originalUrl: {
      type: String,
      required: true,
    },
    generatedCode: {
      type: String,
      required: true,
      unique: true,
    },
    publicId: {
      type: String,
      required: true,
    },

    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    mimeType: {
      type: String,
      enum: ["image/png", "image/jpeg", "image/webp", "image/jpg"],
      required: true,
    },

    imageSize: {
      height: { type: Number, required: true },
      width: {
        type: Number,
        required: true,
      },
    },
    bytes: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true },
);

export const Imagedb = mongoose.model("Image", imageSchema);


// {
//   "msg": "Hyy inside the controller transformation22222",
//   "response": {
//       "asset_id": "6ccd4bc2e06992fecb9116a034fb225b",
//       "public_id": "edited-images/wlrssvogjia79omvdbmu",
//       "version": 1779303261,
//       "version_id": "8ce8b751c6b93052c0fde1f92284334d",
//       "signature": "3f12f4929dd86cd420db7b0514041e58d298770a",
//       "width": 180,
//       "height": 180,
//       "format": "jpg",
//       "resource_type": "image",
//       "created_at": "2026-05-20T18:54:21Z",
//       "tags": [],
//       "bytes": 8053,
//       "type": "upload",
//       "etag": "02e1b50fae1423091e7e6d77902a7d8e",
//       "placeholder": false,
//       "url": "http://res.cloudinary.com/dvaoookvd/image/upload/v1779303261/edited-images/wlrssvogjia79omvdbmu.jpg",
//       "secure_url": "https://res.cloudinary.com/dvaoookvd/image/upload/v1779303261/edited-images/wlrssvogjia79omvdbmu.jpg",
//       "asset_folder": "edited-images",
//       "display_name": "wlrssvogjia79omvdbmu",
//       "original_filename": "file",
//       "api_key": "254932677312234"
//   }
// }