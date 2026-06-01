import { imageroute } from "./src/Routes/image.route.js";
import express from "express";
import { userroute } from "./src/Routes/user.route.js";
export const app = express();
// import { rateLimiterReq } from "./src/rate.limiter.service/rate.limiter.config.file.js";
import { userRateLimiterReq } from "./src/rate.limiter.service/user.rate.limiter.js";
import cookieParser from "cookie-parser";
import { getimagecontroller } from "./src/Controllers/image.controller.js";
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(userRateLimiterReq);
app.use(
  "/api/v1/users",
  userroute,
);
app.use(
  "/api/v1/image",
  imageroute,
);

app.get("/fetch/:imageCode", getimagecontroller);

