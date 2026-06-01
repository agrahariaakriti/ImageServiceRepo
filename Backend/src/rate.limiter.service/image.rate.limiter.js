import { redis } from "./rate.limiter.config.file.js";

export const imageratelimiter = async (req, res, next) => {
  try {
    const imagecode = req.params.imageCode;
    const userId = req.user._id;
    if (!userId) {
      return res.status(402).json({ msg: "Unauthorized" });
    }
    userId = userId.toString();
    const key = `imagecode:${userId}:${imagecode}`;

    const imageReq = await redis.incr(key);
    if (imageReq == 1) {
      const time = 60 * 5;
      await redis.expire(key, time);
    } else if (imageReq > 100) {
      return res
        .status(429)
        .json({ msg: "Too many re please try after sometime" });
    }
    next();
  } catch (error) {
    console.log("Image Rate Limiter Error:", error);
    next();
  }
};

export { imageratelimiter };
