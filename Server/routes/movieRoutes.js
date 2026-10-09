import express from "express";
import { verifyAdmin } from "../middleware/verifyAdmin.js";
import { addReview, bannerFetch, createMovie, deleteMovie, editMovie, getAllMovies, getMovieById, updateMovieStatus } from "../controllers/movieController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", authMiddleware, verifyAdmin, createMovie);
router.get("/", getAllMovies);
router.get("/banners", bannerFetch);
router.get("/:id", getMovieById);
router.put("/:id", authMiddleware, verifyAdmin, editMovie);
router.delete("/:id", authMiddleware, verifyAdmin, deleteMovie);
router.patch("/status/:id", authMiddleware, verifyAdmin, updateMovieStatus);
router.post("/:id/review", authMiddleware, addReview);

export default router;