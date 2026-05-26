import express from "express";
import dotenv from "dotenv";
dotenv.config({
  path: "./.env",
});
import passport from "passport";
import "./utils/expireBookings.js";
import { connectDB } from "./config/connectDB.js";
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import movieRoutes from "./routes/movieRoutes.js";
import actorRoutes from "./routes/actorRoutes.js";
import theatreRoutes from "./routes/theatreRoutes.js";
import screenRoutes from "./routes/screenRoutes.js";
import showsRoutes from "./routes/showsRoutes.js";
import bookingRoutes from "./routes/bookingRoutes.js";
import paymentRoutes from "./routes/paymentRoutes.js";
// import theatreOwnerEmailRoutes from "./routes/theatreOwnerEmailRoutes.js";
import languageRoutes from "./routes/languageRoutes.js";
import genreRoutes from "./routes/genreRoutes.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import "./config/passport.js";

connectDB();
const app = express();

app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
  }),
);
app.use(passport.initialize());
app.use(express.json());
app.use(cookieParser());

const port = process.env.PORT || 5000;

app.get("/", (req, res) => {
  res.end("API Running");
});

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/movies", movieRoutes);
app.use("/api/actors", actorRoutes);
app.use("/api/theatre", theatreRoutes);
app.use("/api/language", languageRoutes);
app.use("/api/genre", genreRoutes);
app.use("/api/screens", screenRoutes);
app.use("/api/shows", showsRoutes);
app.use("/api/booking", bookingRoutes);
app.use("/api/payment", paymentRoutes);
// app.use("/api/admin", theatreOwnerEmailRoutes);

app.listen(port, () => {
  console.log(`server started on port ${port}`);
});
