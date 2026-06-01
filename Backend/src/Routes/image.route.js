import { authmiddleware } from "../Middleware/auth.middleware.js";
import { Router } from "express";
import { upload } from "../Middleware/multer.middleware.js";
import {
  uploadimagecontroller,
  getallimagecontroller,
  gettransformimagecontroller,
  transformimagepostcontroller,
} from "../Controllers/image.controller.js";
export const imageroute = Router();

imageroute
  .route("/imageupload")
  .post(authmiddleware, upload.single("file"), uploadimagecontroller);

imageroute
  .route("/transformimage/:imageCode")
  .get(authmiddleware, gettransformimagecontroller);

imageroute
  .route("/transformimage/:imageCode")
  .post(authmiddleware, transformimagepostcontroller);

imageroute.route("/getallimg").get(authmiddleware, getallimagecontroller);
