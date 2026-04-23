import express from "express";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { verifyAdmin } from "../middleware/verifyAdmin.js";
import { createActor, getActorById, getActors } from "../controllers/actorController.js";

const router = express.Router();

router.post("/", authMiddleware, verifyAdmin, createActor);
router.get("/", authMiddleware, verifyAdmin, getActors);
router.get("/:id", authMiddleware, verifyAdmin, getActorById);

export default router;