import axios from "axios";

export const processImgae = async (imageurl, changingparameter) => {
  try {
    var { resized, crop, grayscale, rotate } = changingparameter;
    if (grayscale == null) {
      grayscale = "";
    }

    const responce = await axios.post(
      "http://127.0.0.1:8000/transform",
      {
        imageurl: imageurl,
        changingparameter: changingparameter,
      },
      { responseType: "arraybuffer", timeout: 10000 },
    );

    return responce.data;
  } catch (error) {
    const err = Error(`Internal serveer error ${error}`);
    err.statusCode = 500;
    throw err;
  }
};
// data.grayscale

// Original Image
//       ↓
// Crop
//       ↓
// Resize
//       ↓
// Grayscale
//       ↓
// Compress
//       ↓
// Upload

// Frontend
//    ↓
// Node Backend API
//    ↓
// Axios POST request
//    ↓
// Python FastAPI Server
//    ↓
// Pydantic validates JSON
//    ↓
// Creates nested objects
//    ↓
// Download original image
//    ↓
// BytesIO converts binary → stream
//    ↓
// PIL opens image
//    ↓
// Resize
//    ↓
// Crop
//    ↓
// Grayscale
//    ↓
// Save final image
//    ↓
// Return binary image response
//    ↓
// Node receives arraybuffer
//    ↓
// Buffer created
//    ↓
// streamifier converts buffer → stream
//    ↓
// Cloudinary upload stream
//    ↓
// Cloudinary URL returned
//    ↓
// Frontend receives final hosted image URL
