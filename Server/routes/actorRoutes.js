import express from "express";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { verifyAdmin } from "../middleware/verifyAdmin.js";
import { createActor, deleteActor, editActor, getActorById, getActors, getMoviesByActor, searchActors } from "../controllers/actorController.js";

const router = express.Router();

router.post("/", authMiddleware, verifyAdmin, createActor);
router.get("/", authMiddleware, verifyAdmin, getActors);
router.get("/:id", authMiddleware, verifyAdmin, getActorById);
router.put("/:id", authMiddleware, verifyAdmin, editActor);
router.delete("/:id", authMiddleware, verifyAdmin, deleteActor);
router.get("/search", authMiddleware, searchActors);
router.get("/actors/:id/movies", authMiddleware, getMoviesByActor);

export default router;