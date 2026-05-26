import express from "express";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { verifyTheatreOwner } from "../middleware/verifyTheatreOwner.js";
import { verifyAdmin } from "../middleware/verifyAdmin.js";
import { createTheatre, deleteTheatre, editTheatre, getAllTheatre, getTheatreById, getTheatresByOwner, updateTheatreStatus } from "../controllers/theatreController.js";

const router = express.Router();

router.post("/", authMiddleware, verifyAdmin, createTheatre);
router.patch("/status", authMiddleware, verifyAdmin, updateTheatreStatus);
router.get("/", authMiddleware, verifyAdmin, getAllTheatre);
router.get("/owner", authMiddleware, verifyTheatreOwner, getTheatresByOwner)
router.get("/:id", authMiddleware, verifyAdmin, getTheatreById);
router.put("/:id", authMiddleware, verifyAdmin, editTheatre);
router.delete("/:id", authMiddleware, verifyAdmin, deleteTheatre);

export default router;