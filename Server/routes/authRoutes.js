import express from 'express';
import passport from 'passport';
import jwt from 'jsonwebtoken';
import { login, logout, refresh, register } from '../controllers/authController.js';
import { generateAccessToken, generateRefreshToken } from "../utils/token.js";
import User from '../models/userModel.js';
import { authMiddleware } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get("/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);
router.get("/google/callback",
  passport.authenticate("google", { 
    session: false,
    failureRedirect: "http://localhost:5173/login"
   }),
  async (req, res) => {

    const accessToken = generateAccessToken(req.user);
    const refreshToken = generateRefreshToken(req.user);

    await User.findByIdAndUpdate(req.user._id, { refreshToken });

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000
    });

    res.redirect(process.env.FRONTEND_URL);
  }
);
router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout);
router.post('/refresh', refresh)
router.get("/me", authMiddleware, (req, res) => {
  res.json({
    success: true,
    user: req.user
  });
});

export default router;