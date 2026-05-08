import express from "express";
import { createGenre, deleteGenre, getGenres } from "../controllers/genreController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { verifyAdmin } from "../middleware/verifyAdmin.js";

const router = express.Router();

router.get("/", authMiddleware, getGenres);
router.post("/", authMiddleware, verifyAdmin, createGenre);
router.delete("/:id", authMiddleware, verifyAdmin, deleteGenre);

export default router;