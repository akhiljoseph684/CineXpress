import Booking from "../models/bookingModel.js";
import crypto from "crypto";
import getRazorpayInstance from "../config/razorpay.js";

export const createPaymentOrder = async (req, res) => {
  try {
    const { bookingId } = req.body;

    const booking = await Booking.findById(bookingId);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found",
      });
    }

    if (booking.bookingStatus !== "PENDING") {
      return res.status(400).json({
        success: false,
        message: "Booking already processed",
      });
    }

    const razorpay = getRazorpayInstance();

    const order = await razorpay.orders.create({
      amount: booking.totalAmount * 100,

      currency: "INR",

      receipt: booking._id.toString(),
    });

    return res.status(200).json({
      success: true,

      order,
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const verifyPayment = async (req, res) => {
  try {
    const {
      bookingId,

      razorpay_order_id,

      razorpay_payment_id,

      razorpay_signature,
    } = req.body;

    const generatedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_SECRET)

      .update(`${razorpay_order_id}|${razorpay_payment_id}`)

      .digest("hex");

    // INVALID SIGNATURE
    if (generatedSignature !== razorpay_signature) {
      await Booking.findByIdAndUpdate(
        bookingId,

        {
          bookingStatus: "CANCELLED",

          paymentStatus: "FAILED",
        },
      );

      return res.status(400).json({
        success: false,
        message: "Payment verification failed",
      });
    }

    // SUCCESS
    const booking = await Booking.findByIdAndUpdate(
      bookingId,

      {
        bookingStatus: "CONFIRMED",

        paymentStatus: "PAID",

        paymentId: razorpay_payment_id,

        paymentMethod: "RAZORPAY",

        bookedAt: new Date(),
      },

      {
        new: true,
      },
    );

    return res.status(200).json({
      success: true,

      message: "Payment successful",

      booking,
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const paymentFailed = async (req, res) => {
  try {
    const { bookingId } = req.body;

    await Booking.findByIdAndUpdate(
      bookingId,

      {
        bookingStatus: "CANCELLED",

        paymentStatus: "FAILED",
      },
    );

    return res.status(200).json({
      success: true,
      message: "Booking cancelled",
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
