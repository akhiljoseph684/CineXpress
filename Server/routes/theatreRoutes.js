import express from "express";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { verifyTheatreOwner } from "../middleware/verifyTheatreOwner.js";
import { verifyAdmin } from "../middleware/verifyAdmin.js";
import { createTheatre, deleteTheatre, editTheatre, getAllTheatre, getTheatreById, getTheatresByOwner } from "../controllers/theatreController.js";

const router = express.Router();

router.post("/", authMiddleware, verifyTheatreOwner, createTheatre);
router.get("/", authMiddleware, verifyAdmin, getAllTheatre);
router.get("/owner", authMiddleware, verifyTheatreOwner, getTheatresByOwner)
router.get("/:id", authMiddleware, verifyTheatreOwner, getTheatreById);
router.put("/:id", authMiddleware, verifyTheatreOwner, editTheatre);
router.delete("/:id", authMiddleware, verifyTheatreOwner, deleteTheatre);

export default router;