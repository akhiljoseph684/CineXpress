import express from "express";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { verifyTheatreOwner } from "../middleware/verifyTheatreOwner.js";
import { createTheatre } from "../controllers/theatreController.js";

const router = express.Router();

router.post("/", authMiddleware, verifyTheatreOwner, createTheatre)

export default router;