import express from "express";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { verifyTheatreOwner } from "../middleware/verifyTheatreOwner.js";
import { createShow, getMovieShows, getShowById } from "../controllers/showController.js";

const router = express.Router();

router.post("/", authMiddleware, verifyTheatreOwner, createShow);
router.get("/movie-shows", authMiddleware, getMovieShows);
router.get("/:showId", authMiddleware, getShowById);

export default router;
