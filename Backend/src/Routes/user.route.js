import { Router } from "express";
import {
  signupcontroller,
  signincontroller,
  logoutcontroller,
  refreshTokenGeneratorcontroller,
} from "../Controllers/user.controller.js";

import { authmiddleware } from "../Middleware/auth.middleware.js";
export const userroute = Router();


userroute.route("/signup").post(signupcontroller);
userroute.route("/signin").post(signincontroller);
userroute.route("/logout").get(authmiddleware, logoutcontroller);
userroute.route("/refresh").get(refreshTokenGeneratorcontroller);
