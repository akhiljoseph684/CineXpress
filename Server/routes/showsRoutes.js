import express from "express";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { verifyTheatreOwner } from "../middleware/verifyTheatreOwner.js";
import {
  createShow,
  getAllShows,
  getMovieShows,
  getShowById,
  getShowsByOwner,
} from "../controllers/showController.js";
import { verifyAdmin } from "../middleware/verifyAdmin.js";

const router = express.Router();

router.post("/", authMiddleware, verifyTheatreOwner, createShow);
router.get("/all", authMiddleware, verifyAdmin, getAllShows);
router.get("/movie-shows", authMiddleware, getMovieShows);
router.get("/owner", authMiddleware, verifyTheatreOwner, getShowsByOwner);
router.get("/:showId", authMiddleware, getShowById);

export default router;
