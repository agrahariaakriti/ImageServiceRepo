import bcrypt from "bcrypt";
import {
  emailValidation,
  usernameValidation,
  passwordValidation,
} from "./user.validate.service.js";

import { User } from "../Models/user.model.js";
import jwt from "jsonwebtoken";

const generateaccesstoken = async (user) => {
  const accesstoken = jwt.sign(
    { userId: user._id },
    process.env.JWT_ACCESS_TOKEN_SECRET,
    { expiresIn: process.env.JWT_ACCESS_TOKEN_EXPIRES_IN },
  );
  return accesstoken;
};

const generaterefreshtoken = async (user) => {
  const refreshtoken = jwt.sign(
    { userId: user._id },
    process.env.JWT_REFRESH_TOKEN_SECRET,
    { expiresIn: process.env.JWT_REFRESH_TOKEN_EXPIRES_IN },
  );
  return refreshtoken;
};

export const createUserService = async (userData) => {
  console.log("inside the code base controller");
  if (
    !userData.username ||
    !userData.email ||
    !userData.password ||
    !userData.fullname
  ) {
    const error = new Error("All fields are required");
    error.statusCode = 400;
    throw error;
  }

  if (!emailValidation(userData.email)) {
    const error = new Error("Invalid email");
    error.statusCode = 400;
    throw error;
  }
  if (!usernameValidation(userData.username)) {
    const error = new Error("Invalid username");
    error.statusCode = 400;
    throw error;
  }
  if (!passwordValidation(userData.password)) {
    const error = new Error("Invalid password");
    error.statusCode = 400;
    throw error;
  }
  const existingUser = await User.findOne({ email: userData.email });
  if (existingUser) {
    const error = new Error("User already exists");
    error.statusCode = 400;
    throw error;
  }
  const existingUsername = await User.findOne({ username: userData.username });
  if (existingUsername) {
    const error = new Error("Username already exists");
    error.statusCode = 400;
    throw error;
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(userData.password, salt);

  const user = await User.create({
    username: userData.username,
    password: hashedPassword,
    email: userData.email,
    fullname: userData.fullname,
  });
  return user;
};

export const loginUserService = async (userData) => {
  const user = await User.findOne({ email: userData.email });
  if (!user) {
    const error = new Error("User not found");
    error.statusCode = 400;
    throw error;
  }
  const isPasswordCorrect = await bcrypt.compare(
    userData.password,
    user.password,
  );
  if (!isPasswordCorrect) {
    const error = new Error("Invalid password");
    error.statusCode = 400;
    throw error;
  }
  const accessToken = await generateaccesstoken(user);
  const refreshToken = await generaterefreshtoken(user);
  user.refreshToken = refreshToken;
  await user.save();
  return { accessToken, refreshToken };
};

export const logoutUserService = async (userId) => {
  console.log("Aakriti agraharil....", userId);

  await User.findByIdAndUpdate(
    userId,
    {
      $set: {
        refreshToken: null,
      },
    },
    {
      new: true,
    },
  );
  return null;
};

export const refreshTokenGeneratorservice = async (req) => {
  const token = req.cookies?.refreshToken;
  if (!token) {
    const error = Error("Unauthorized");
    error.statusCode = 401;
    throw error;
  }

  const decodedToken = jwt.verify(token, process.env.JWT_REFRESH_TOKEN_SECRET);

  if (!decodedToken) {
    const error = Error("Unauthorized");
    error.statusCode = 401;
    throw error;
  }
  const user = await User.findById(decodedToken.userId);
  if (user == null || user.refreshToken != token) {
    const error = Error("Unauthorized");
    error.statusCode = 401;
    throw error;
  }
  const accessToken = await generateaccesstoken(user);
  return accessToken;
};
