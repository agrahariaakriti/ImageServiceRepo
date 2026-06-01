import { redis } from "./rate.limiter.config.file.js";
async function userRateLimiterReq(req, res, next) {
  try {
    const ip = req.ip;
    const key = `useridentity//:${ip}`;
    const getuser = await redis.incr(key);
    if (getuser == 1) {
      console.log("The time is ", Date.now());

      await redis.expire(key, 60);
    } else if (getuser > 100) {
      return res
        .status(429)
        .json({ msg: "Too many request,Please try after sometime" });
    }

    console.log("Redis Connected:");
    next();
  } catch (error) {
    console.log("Redis Error:", error);
    next();
  }
}

export { userRateLimiterReq };
