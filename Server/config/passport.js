import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import User from "../models/userModel.js";
import dotenv from "dotenv";
dotenv.config();


passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: "/api/auth/google/callback",
}, async (accessToken, refreshToken, profile, done) => {
  try {
    const email = profile.emails[0].value;
    const avatar = profile.photos?.[0] ?.value || "";

    let user = await User.findOne({ email });

    if (user && user.provider === "local") {
      user.googleId = profile.id;
      user.provider = "google";
      user.avatar = avatar
      await user.save();

      return done(null, user);
    }

    if (user) {
      if (!user.googleId) {
        user.googleId = profile.id;
        await user.save();
      }
    } else {
      user = await User.create({
        name: profile.displayName,
        email,
        googleId: profile.id,
        provider: "google",
        avatar,
        role: "user"
      });
    }

    done(null, user);
  } catch (err) {
    done(err, null);
  }
}));