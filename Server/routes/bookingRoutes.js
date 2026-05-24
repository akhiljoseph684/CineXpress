import express from "express";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { reserveSeats } from "../controllers/bookingController.js";

const router = express.Router();

router.post("/reserve-seats", authMiddleware, reserveSeats);

export default router;