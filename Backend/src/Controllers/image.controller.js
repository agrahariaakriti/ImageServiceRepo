import {
  imageUploadService,
  getimageservice,
  getallimageservice,
  transformgetimageservice,
  removeimageservice,
} from "../Services/image.service.js";
import { imageTransformQueue } from "../Queues/image.queue.js";
import { loginUserService } from "../Services/user.service.js";
// import "../Workers/image.woker.js";

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

  const imageinfo = await getimageservice(imagecode);
  return res
    .status(200)
    .json({ msg: "Hyy inside the controller transformation1111", imageinfo });
};

export const transformimagepostcontroller = async (req, res) => {
  console.log("Hyy in the transform image errr");

  const data = {
    userId: req.userId,
    imageCode: req.params.imageCode,
    transformingparameter: req.body,
  };
  const job = await imageTransformQueue.add("image-processing", data, {
    attempts: 3,
    removeOnComplete: { age: 3600 },
    removeOnFail: { age: 86400 },
  });

  return res.status(202).json({ msg: "Processing...", jobId: job.id });
};

export const getJobStatusController = async (req, res) => {
  try {
    console.log("hyy oin the controller function ....", req.params.jobId);

    const jobId = req.params.jobId;
    const job = await imageTransformQueue.getJob(jobId);
    if (!job) {
      return res.status(404).json({
        msg: "Job not found",
      });
    }

    console.log("HYY RES FROM THE WORKER END ", job.returnvalue);

    const state = await job.getState();
    if (state === "completed") {
      const result = job.returnvalue;
      return res.status(200).json({ msg: "Job completed", result });
    }

    if (state === "failed") {
      return res.status(200).json({
        msg: "Job failed",
        reason: job.failedReason,
      });
    }

    return res.status(200).json({
      msg: "Job status retrieved",
      jobId: job.id,
      jobState: state,
      image: job.returnvalue || null,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

export const getallimagecontroller = async (req, res) => {
  try {
    const get_image_arr = await getallimageservice(req);
    console.log("hyy image ARRAY IS HERE CONTROLLER ....", get_image_arr);
    return res.status(200).json({ msg: get_image_arr });
  } catch (error) {
    return res.status(error.statusCode || 500).json({ message: error.message });
  }
};

export const removeimagecontroller = async (req, res) => {
  try {
    const imageCode = req.params.jobId;
    console.log("rajaaaaa....", imageCode);

    const responce = await removeimageservice(imageCode);

    return res.status(200).json({ msg: "DELETD SUCCESSFULY 🎉" });
  } catch (error) {
    console.log("hdscsbc....", error);

    return res.status(error.statusCode || 500).json({ message: error.message });
  }
};
