import Booking from "../models/bookingModel.js";

export const getTicketById = async (req, res) => {
  try {
    const { ticketId } = req.params;

    const booking = await Booking.findOne({
      ticketId,
    })

      .populate({
        path: "show",

        populate: [
          {
            path: "movieId",
          },

          {
            path: "theatreId",
          },

          {
            path: "screenId",
          },
        ],
      })

      .populate("user", "name email avatar");

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Ticket not found",
      });
    }

    return res.status(200).json({
      success: true,
      booking,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getMyTickets = async (req, res) => {
  try {
    const bookings = await Booking.find({
      user: req.user.id,

      bookingStatus: "CONFIRMED",
    })

      .populate({
        path: "show",

        populate: [
          {
            path: "movieId",
          },

          {
            path: "theatreId",
          },

          {
            path: "screenId",
          },
        ],
      })

      .sort({
        createdAt: -1,
      });

    return res.status(200).json({
      success: true,
      bookings,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const scanTicket = async (req, res) => {
  try {
    const { ticketId } = req.params;

    const booking = await Booking.findOne({
      ticketId,
    })
      .populate({
        path: "show",
        populate: [
          {
            path: "movieId",
          },
          {
            path: "theatreId",
          },
          {
            path: "screenId",
          },
        ],
      })
      .populate("user", "name email avatar");

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Invalid ticket",
      });
    }

    if (booking.bookingStatus !== "CONFIRMED") {
      return res.status(400).json({
        success: false,
        message: "Ticket not confirmed",
      });
    }

    return res.status(200).json({
      success: true,
      booking,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const verifyTicketEntry = async (req, res) => {
  try {
    const { ticketId } = req.params;

    const booking = await Booking.findOne({
      ticketId,
    });

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Invalid ticket",
      });
    }

    if (booking.isScanned) {
      return res.status(400).json({
        success: false,
        message: "Ticket already used",
      });
    }

    booking.isScanned = true;

    booking.scannedAt = new Date();

    await booking.save();

    return res.status(200).json({
      success: true,
      message: "Entry allowed",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
