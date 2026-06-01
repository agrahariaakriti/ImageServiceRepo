import {
  imageUploadService,
  getimageservice,
  getallimageservice,
  transformgetimageservice,
} from "../Services/image.service.js";

export const uploadimagecontroller = async (req, res) => {
  try {
    const response = await imageUploadService(req);
    return res
      .status(200)
      .json({ message: "File uploaded successfully", response });
  } catch (error) {
    return res
      .status(error.statusCode || 500)
      .json({ message: error.message || `Internal server error ${error}` });
  }
};

export const getimagecontroller = async (req, res) => {
  try {
    console.log("In the service AAKRITIAGRAHAI.BSVCGDJ...........SDFGV ");

    const imageCode = req.params.imageCode;
    const response = await getimageservice(imageCode);
    return res.redirect(response.originalUrl);
  } catch (error) {
    return res
      .status(error.statusCode || 500)
      .json({ message: error.message || `Internal server error ${error}` });
  }
};

export const gettransformimagecontroller = async (req, res) => {
  const imagecode = req.params.imageCode;
  console.log("Hyy in the function controler", imagecode);

  const imageinfo = await getimageservice(imagecode);
  return res
    .status(200)
    .json({ msg: "Hyy inside the controller transformation1111", imageinfo });
};

export const transformimagepostcontroller = async (req, res) => {
  console.log("Hyy in the Controller Service .... Right Now ");

  const response = await transformgetimageservice(req);

  return res
    .status(200)
    .json({ msg: "Hyy inside the controller transformation22222", response });
};

export const getallimagecontroller = async (req, res) => {
  try {
    const get_image_arr = await getallimageservice(req);
    return res.status(200).json({ msg: get_image_arr });
  } catch (error) {
    return res.status(error.statusCode || 500).json({ message: error.message });
  }
};
