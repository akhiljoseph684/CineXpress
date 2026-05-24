import express from "express";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { createPaymentOrder, paymentFailed, verifyPayment } from "../controllers/paymentOrderController.js";

const router = express.Router();

router.post("/create-order", authMiddleware, createPaymentOrder);

router.post("/verify-payment", authMiddleware, verifyPayment);

router.post("/payment-failed", authMiddleware, paymentFailed);


export default router;