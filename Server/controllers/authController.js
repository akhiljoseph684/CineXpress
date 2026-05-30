import User from "../models/userModel.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { generateAccessToken, generateRefreshToken } from "../utils/token.js";
import Theatre from "../models/theatreModel.js";
import Notification from "../models/notificationModel.js";

export const register = async (req, res) => {
  const {
    name,

    email,

    password,

    secretCode,
  } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({
      success: false,
      field: !name ? "name" : !email ? "email" : "password",
      message: "Fill the Empty Fields",
    });
  }

  try {
    let validEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!validEmail.test(email)) {
      return res.status(400).json({
        success: false,
        field: "email",
        message: "Please enter a valid email address.",
      });
    }

    const existUser = await User.findOne({ email });

    if (existUser) {
      return res.status(409).json({
        success: false,
        field: "email",
        message: "User is Already exists",
      });
    }

    if (password.length < 8) {
      return res.status(400).json({
        success: false,
        field: "password",
        message: "Password must be at least 8 characters",
      });
    }

    const hashPassword = await bcrypt.hash(password, 10);

    let userRole = "user";
    const theatre = await Theatre.findOne({
      ownerEmail: email.toLowerCase(),
      isDeleted: false,
    });

    if (theatre) {
      userRole = "theatre_owner";
    }

    if (theatre && theatre?.secretCode !== secretCode) {
      return res.status(400).json({
        success: false,
        message: "Does not Create Account With This Email",
      });
    }

    let status = "active";

    let provider = "local";

    const user = await User.create({
      name,
      email,
      password: hashPassword,
      role: userRole,
      status,
      provider,
    });

    if (theatre) {
      theatre.status = "approved";
      theatre.ownerId = user._id;
      await theatre.save();

      await Notification.create({
        title: "New Theatre Registered",

        message: `${user.name} registered theatre "${theatre.name}" in ${theatre.city}`,

        type: "THEATRE_CREATED",
      });
    }

    const accessToken = generateAccessToken({ id: user._id, role: user.role });
    const refreshToken = generateRefreshToken({
      id: user._id,
      role: user.role,
    });

    user.refreshToken = refreshToken;
    await user.save();

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.status(201).json({
      success: true,
      message: "User Registered Successfully",
      user: {
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        role: user.role,
        status: user.status,
        preferredCity: user.preferredCity,
        phone: user.phone,
      },
      accessToken,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        field: !email ? "email" : "password",
        message: "Fill the Empty Fields",
      });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    if (user.provider !== "local") {
      return res.status(400).json({
        success: false,
        message: "Please Login with Google",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    const accessToken = generateAccessToken({ id: user._id, role: user.role });
    const refreshToken = generateRefreshToken({
      id: user._id,
      role: user.role,
    });

    user.refreshToken = refreshToken;
    await user.save();

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.status(200).json({
      success: true,
      message: "Login successful",
      user: {
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        role: user.role,
        status: user.status,
        preferredCity: user.preferredCity,
        phone: user.phone,
      },
      accessToken,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const logout = async (req, res) => {
  const token = req.cookies.refreshToken;

  if (token) {
    const decoded = jwt.decode(token);
    if (decoded?.id) {
      await User.findByIdAndUpdate(decoded.id, { refreshToken: null });
    }
  }

  res.clearCookie("refreshToken");

  res.json({
    success: true,
    message: "Logged out",
  });
};

export const refresh = async (req, res) => {
  const refreshToken = req.cookies.refreshToken;

  if (!refreshToken) {
    return res.status(401).json({
      success: false,
      message: "No refresh token",
    });
  }

  try {
    const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);

    const user = await User.findById(decoded.id);

    if (!user || user.refreshToken !== refreshToken) {
      return res.status(403).json({
        success: false,
        message: "Invalid refresh token",
      });
    }

    const newAccessToken = generateAccessToken({
      id: user._id,
      role: user.role,
    });

    return res.status(200).json({
      success: true,
      accessToken: newAccessToken,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        role: user.role,
        status: user.status,
        preferredCity: user.preferredCity,
        phone: user.phone,
      },
    });
  } catch (error) {
    return res.status(403).json({
      success: false,
      message: error.message,
    });
  }
};
