import express from "express";
import { verifyAdmin } from "../middleware/verifyAdmin.js";
import { createMovie, getAllMovies, getMovieById } from "../controllers/movieController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", authMiddleware, verifyAdmin, createMovie);
router.get("/", authMiddleware, getAllMovies);
router.get("/:id", authMiddleware, getMovieById);

export default router;