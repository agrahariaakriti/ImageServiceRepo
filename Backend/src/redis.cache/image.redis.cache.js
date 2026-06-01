import { redis } from "../rate.limiter.service/rate.limiter.config.file.js";

export const getimagerediscache = async (imageCode) => {
  const key = `imageCode:${imageCode}`;
  const getimage = await redis.get(key);

  if (!getimage) return null;

  try {
    return JSON.parse(getimage);
  } catch (err) {
    console.log("Bad Redis cache value:", getimage);
    return null;
  }
};

export const setimagerediscache = async (imageCode, imageInfo) => {
  const key = `imageCode:${imageCode}`;
  const setimageinfo = await redis.set(
    key,
    JSON.parse(JSON.stringify(imageInfo)),
    {
      ex: 60 * 1,
    },
  );
};
