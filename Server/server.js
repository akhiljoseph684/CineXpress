import express from 'express';
import passport from "passport";
import {connectDB} from './config/connectDB.js'
import authRoutes from './routes/authRoutes.js'
import movieRoutes from './routes/movieRoutes.js'
import actorRoutes from './routes/actorRoutes.js'
import theatreRoutes from './routes/theatreRoutes.js'
import cookieParser from 'cookie-parser';
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();

import "./config/passport.js";

connectDB()
const app = express();

app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true
}));
app.use(passport.initialize());
app.use(express.json())
app.use(cookieParser())
const port = process.env.PORT || 5000;

app.get('/', (req, res) => {
    res.end("API Running");
})

app.use("/api/auth", authRoutes)
app.use("/api/movies", movieRoutes)
app.use("/api/actors", actorRoutes)
app.use("/api/theatre", theatreRoutes)

app.listen(port, () => {
    console.log(`server started on port ${port}`)
})