import express from "express";

import {
  getTicketById,
  scanTicket,
  getMyTickets,
  verifyTicketEntry,
} from "../controllers/ticketController.js";

import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/:ticketId", authMiddleware, getTicketById);
router.get("/my-tickets", authMiddleware, getMyTickets);
router.post("/scan/:ticketId", authMiddleware, scanTicket);
router.put("/verify/:ticketId", authMiddleware, verifyTicketEntry);

export default router;
