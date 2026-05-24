import Booking from "../models/bookingModel.js";
import Show from "../models/showModel.js";

export const reserveSeats = async (req, res) => {
  try {
    const { showId, seats, totalAmount } = req.body;

    if (!showId || !seats?.length || !totalAmount) {
      return res.status(400).json({
        success: false,
        message: "Show, Total Amount and seats are required",
      });
    }

    // CHECK SHOW
    const show = await Show.findById(showId);

    if (!show) {
      return res.status(404).json({
        success: false,
        message: "Show not found",
      });
    }

    const existingSeats = await Booking.aggregate([
      {
        $match: {
          show: show._id,

          $or: [
            {
              bookingStatus: "CONFIRMED",
            },

            {
              bookingStatus: "PENDING",

              expiresAt: {
                $gt: new Date(),
              },
            },
          ],
        },
      },

      {
        $unwind: "$seats",
      },

      {
        $match: {
          $or: seats.map((seat) => ({
            "seats.row": seat.row,
            "seats.col": seat.col,
          })),
        },
      },

      {
        $replaceRoot: {
          newRoot: "$seats",
        },
      },
    ]);

    if (existingSeats.length > 0) {
      return res.status(409).json({
        success: false,

        message: "Some seats are already booked",

        seats: existingSeats,
      });
    }

    const booking = await Booking.create({
      user: req.user.id,

      show: showId,

      seats,

      totalAmount,

      bookingStatus: "PENDING",

      paymentStatus: "PENDING",

      expiresAt: new Date(
        Date.now() + 5 * 60 * 1000
      ),
    });

    return res.status(201).json({
      success: true,
      message: "Seats reserved successfully",
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