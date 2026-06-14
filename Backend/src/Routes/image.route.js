import { authmiddleware } from "../Middleware/auth.middleware.js";
import { Router } from "express";
import { upload } from "../Middleware/multer.middleware.js";
import {
  uploadimagecontroller,
  getallimagecontroller,
  gettransformimagecontroller,
  getJobStatusController,
  transformimagepostcontroller,
} from "../Controllers/image.controller.js";
export const imageroute = Router();

imageroute.use((req, res, next) => {
  console.log("AGRAHARI AAKRITI .....Hyy in the image route middleware");
  next();
});
imageroute
  .route("/upload")
  .post(   authmiddleware, upload.single("file"), uploadimagecontroller);

imageroute
  .route("/transformimage/:imageCode")
  .get(authmiddleware, gettransformimagecontroller);

imageroute
  .route("/transformimage/:imageCode")
  .post(authmiddleware, transformimagepostcontroller);

imageroute.route("/getallimg").get(authmiddleware, getallimagecontroller);

imageroute.route("/job-status/:jobId").get((req, res, next) => {
  console.log("AAKRITI .....Hyy in the transform image route middleware");
  next();
}, getJobStatusController);
