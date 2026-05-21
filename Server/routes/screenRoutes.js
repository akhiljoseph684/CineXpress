import express from "express";

import { createScreen, deleteScreen, getScreenById, getScreensByOwner, updateScreen } from "../controllers/screenController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { verifyTheatreOwner } from "../middleware/verifyTheatreOwner.js";

const router = express.Router();

router.post("/", authMiddleware, verifyTheatreOwner, createScreen);
router.get("/", authMiddleware, verifyTheatreOwner, getScreensByOwner);
router.get("/:id", authMiddleware, verifyTheatreOwner, getScreenById);
router.put("/:id", authMiddleware, verifyTheatreOwner, updateScreen);
router.delete("/:id", authMiddleware, verifyTheatreOwner, deleteScreen);

export default router;