import express from "express";

import {
  getNotifications,
  getUnreadNotificationCount,
} from "../controllers/notificationController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", authMiddleware, getNotifications);

router.get("/count", authMiddleware, getUnreadNotificationCount);

export default router;
