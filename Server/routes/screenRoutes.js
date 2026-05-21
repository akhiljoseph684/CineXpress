import express from "express";

import { createScreen, deleteScreen, getAllScreens, getScreenById, getScreensByOwner, updateScreen } from "../controllers/screenController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { verifyTheatreOwner } from "../middleware/verifyTheatreOwner.js";
import { verifyAdmin } from "../middleware/verifyAdmin.js";

const router = express.Router();

router.post("/", authMiddleware, verifyTheatreOwner, createScreen);
router.get("/", authMiddleware, verifyTheatreOwner, getScreensByOwner);
router.get("/all", authMiddleware, verifyAdmin, getAllScreens);
router.get("/:id", authMiddleware, verifyTheatreOwner, getScreenById);
router.put("/:id", authMiddleware, verifyTheatreOwner, updateScreen);
router.delete("/:id", authMiddleware, verifyTheatreOwner, deleteScreen);

export default router;