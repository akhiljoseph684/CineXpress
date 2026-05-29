import express from "express";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { verifyTheatreOwner } from "../middleware/verifyTheatreOwner.js";
import { getOwnerDashboard } from "../controllers/dashboardController.js";

const router = express.Router();

router.get("/", authMiddleware, verifyTheatreOwner, getOwnerDashboard);

export default router;
