import { User } from "../Models/user.model.js";
import jwt from "jsonwebtoken";
export const authmiddleware = async (req, res, next) => {
  try {
    console.log("Inside the auth middleware ");

    const token = req.cookies?.accessToken;
    if (!token) {
      return res.status(401).json({
        message: "Please Signin ",
        data: req.cookies.AccessToken,
      });
    }

    const decodedToken = jwt.verify(token, process.env.JWT_ACCESS_TOKEN_SECRET);

    if (!decodedToken) {
      return res.status(401).json({ message: "Invalid user" });
    }
    // const user = await User.findById(decodedToken?.userId).select("-password");

    req.userId = decodedToken.userId;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid User" });
  }
};
