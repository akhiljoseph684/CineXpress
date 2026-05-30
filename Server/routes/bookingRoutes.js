import express from "express";
import { authMiddleware } from "../middleware/authMiddleware.js";
import {
  getAllBookings,
  getBookingById,
  getBookingsByOwner,
  getMyBookings,
  reserveSeats,
} from "../controllers/bookingController.js";
import { verifyTheatreOwner } from "../middleware/verifyTheatreOwner.js";
import { verifyAdmin } from "../middleware/verifyAdmin.js";

const router = express.Router();

router.post("/reserve-seats", authMiddleware, reserveSeats);
router.get("/", authMiddleware, verifyAdmin, getAllBookings);
router.get("/owner", authMiddleware, verifyTheatreOwner, getBookingsByOwner);
router.get("/my-bookings", authMiddleware, getMyBookings);
router.get("/:id", authMiddleware, getBookingById);

export default router;
