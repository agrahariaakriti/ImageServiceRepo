import {
  createUserService,
  loginUserService,
  logoutUserService,
  refreshTokenGeneratorservice,
} from "../Services/user.service.js";

export const signupcontroller = async (req, res) => {
  try {
    const userData = req.body;

    const user = await createUserService(userData);
    return res.status(201).json({
      message: "User created successfully",
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
      },
    });
  } catch (error) {
    return res.status(error.statusCode || 500).json({ message: error.message });
  }
};

export const signincontroller = async (req, res) => {
  try {
    console.log("In side controllrer login", req.body);

    const userData = req.body;
    if (!userData.email || !userData.password) {
      return res.status(400).json({ message: "All fields are required" });
    }
    console.log("In side controllrer login");
    const options = {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      maxAge: 24 * 60 * 60 * 1000,
    };

    const loginUser = await loginUserService(userData);
    console.log("In side controllrer login", loginUser.accessToken);
    return res
      .status(200)
      .cookie("accessToken", loginUser.accessToken, options)
      .cookie("refreshToken", loginUser.refreshToken, options)
      .json({ message: "User login successfully" });
  } catch (error) {
    return res.status(error.statusCode || 500).json({ message: error.message });
  }
};

export const logoutcontroller = async (req, res) => {
  try {
    const userId = req.userId;
    await logoutUserService(userId);

    const options = {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      maxAge: 24 * 60 * 60 * 1000,
    };
    return res
      .status(200)
      .clearCookie("accessToken", options)
      .clearCookie("refreshToken", options)
      .json({ message: "User logout successFully" });
  } catch (error) {
    return res.status(error.statusCode || 500).json({ message: error.message });
  }
};

export const refreshTokenGeneratorcontroller = async (req, res) => {
  //   const user = req.cookie.refreshToken;
  try {
    const response = await refreshTokenGeneratorservice(req);
    const options = {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      maxAge: 24 * 60 * 60 * 1000,
    };
    return res
      .status(200)
      .cookie("accessToken", response, options)
      .json({ message: "User login successfully" });
  } catch (error) {
    return res
      .status(error.statusCode || 500)
      .json({ msg: error.message || "Internal server error" });
  }
};
