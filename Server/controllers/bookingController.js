import mongoose from "mongoose";
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

      expiresAt: new Date(Date.now() + 5 * 60 * 1000),
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

export const getAllBookings = async (req, res) => {
  try {
    const {
      page = 1,

      limit = 10,

      status,
    } = req.query;

    let query = {};

    if (status) {
      query.bookingStatus = status;
    }

    const skip = (page - 1) * limit;

    const bookings = await Booking.find(query)

      .populate({
        path: "user",

        select: "name email avatar",
      })

      .populate({
        path: "show",

        populate: [
          {
            path: "movieId",

            select: "title poster",
          },

          {
            path: "theatreId",

            select: "name city",
          },

          {
            path: "screenId",

            select: "name",
          },
        ],
      })

      .sort({
        createdAt: -1,
      })

      .skip(Number(skip))

      .limit(Number(limit));

    const totalBookings = await Booking.countDocuments(query);

    return res.status(200).json({
      success: true,

      message: "Bookings fetched successfully",

      bookings,

      currentPage: Number(page),

      totalPages: Math.ceil(totalBookings / limit),

      totalBookings,
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      success: false,

      message: error.message,
    });
  }
};

export const getBookingsByOwner = async (req, res) => {
  try {
    const ownerId = req.user.id;

    const bookings = await Booking.aggregate([
      {
        $lookup: {
          from: "shows",

          localField: "show",

          foreignField: "_id",

          as: "show",
        },
      },

      {
        $unwind: "$show",
      },

      {
        $lookup: {
          from: "theatres",

          localField: "show.theatreId",

          foreignField: "_id",

          as: "theatre",
        },
      },

      {
        $unwind: "$theatre",
      },

      {
        $match: {
          "theatre.ownerId": new mongoose.Types.ObjectId(ownerId),
        },
      },

      {
        $lookup: {
          from: "users",

          localField: "user",

          foreignField: "_id",

          as: "user",
        },
      },

      {
        $unwind: "$user",
      },

      {
        $lookup: {
          from: "movies",

          localField: "show.movieId",

          foreignField: "_id",

          as: "movie",
        },
      },

      {
        $unwind: "$movie",
      },
      {
        $lookup: {
          from: "screens",

          localField: "show.screenId",

          foreignField: "_id",

          as: "screen",
        },
      },

      {
        $unwind: "$screen",
      },

      {
        $project: {
          seats: 1,

          totalSeats: 1,

          totalAmount: 1,

          bookingStatus: 1,

          paymentStatus: 1,

          isScanned: 1,

          bookedAt: 1,

          createdAt: 1,

          user: {
            _id: "$user._id",

            name: "$user.name",

            email: "$user.email",

            avatar: "$user.avatar",
          },

          movie: {
            _id: "$movie._id",

            title: "$movie.title",

            poster: "$movie.poster",
          },

          theatre: {
            _id: "$theatre._id",

            name: "$theatre.name",

            city: "$theatre.city",
          },

          screen: {
            _id: "$screen._id",

            name: "$screen.name",

            screenType: "$screen.screenType",
          },

          show: {
            _id: "$show._id",

            showDate: "$show.showDate",

            startTime: "$show.startTime",

            endTime: "$show.endTime",
          },
        },
      },

      {
        $sort: {
          createdAt: -1,
        },
      },
    ]);

    return res.status(200).json({
      success: true,
      message: "Owner bookings fetched successfully",
      count: bookings.length,
      bookings,
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      success: false,

      message: error.message,
    });
  }
};

export const getBookingById = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)

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
      });

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found",
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

export const getMyBookings = async (req, res) => {
  try {
    const userId = req.user.id;

    const bookings = await Booking.find({
      user: userId,

      bookingStatus: "CONFIRMED",
    })

      .populate({
        path: "show",

        populate: [
          {
            path: "movieId",

            select: "title poster duration language",
          },

          {
            path: "theatreId",

            select: "name city address",
          },

          {
            path: "screenId",

            select: "name screenType",
          },
        ],
      })

      .sort({
        createdAt: -1,
      });

    return res.status(200).json({
      success: true,

      count: bookings.length,

      bookings,
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      success: false,

      message: error.message,
    });
  }
};
