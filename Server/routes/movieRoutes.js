import express from "express";
import { verifyAdmin } from "../middleware/verifyAdmin.js";
import { createMovie, deleteMovie, editMovie, getAllMovies, getMovieById, searchMovies, updateMovieStatus } from "../controllers/movieController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", authMiddleware, verifyAdmin, createMovie);
router.get("/", authMiddleware, getAllMovies);
router.get("/:id", authMiddleware, getMovieById);
router.get("/search",authMiddleware, searchMovies);
router.put("/:id", authMiddleware, verifyAdmin, editMovie);
router.delete("/:id", authMiddleware, verifyAdmin, deleteMovie);
router.patch("/status/:id", authMiddleware, verifyAdmin, updateMovieStatus);

export default router;