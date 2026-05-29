import Booking from "../models/bookingModel.js";
import Screen from "../models/screenModel.js";
import Show from "../models/showModel.js";
import Theatre from "../models/theatreModel.js";

export const getOwnerDashboard = async (req, res) => {
  try {
    const ownerId = req.user.id;

    const theatreIds = await Theatre.find({
      ownerId,
      isDeleted: false,
    }).distinct("_id");

    const totalTheatres = theatreIds.length;

    const totalScreens = await Screen.countDocuments({
      theatreId: {
        $in: theatreIds,
      },
      isDeleted: false,
    });

    const totalShows = await Show.countDocuments({
      theatreId: {
        $in: theatreIds,
      },
    });

    const totalBookings = await Booking.aggregate([
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
        $match: {
          "show.theatreId": {
            $in: theatreIds,
          },
          bookingStatus: "CONFIRMED",
        },
      },
      {
        $count: "count",
      },
    ]);

    const totalRevenue = await Booking.aggregate([
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
        $match: {
          "show.theatreId": {
            $in: theatreIds,
          },
          paymentStatus: "PAID",
        },
      },
      {
        $group: {
          _id: null,
          revenue: {
            $sum: "$totalAmount",
          },
        },
      },
    ]);

    const today = new Date().toISOString().split("T")[0];

    const todayBookings = await Booking.aggregate([
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
        $match: {
          "show.theatreId": {
            $in: theatreIds,
          },
          createdAt: {
            $gte: new Date(`${today}T00:00:00`),
          },
        },
      },
      {
        $count: "count",
      },
    ]);

    return res.status(200).json({
      success: true,

      dashboard: {
        totalTheatres,

        totalScreens,

        totalShows,

        totalBookings: totalBookings[0]?.count || 0,

        todayBookings: todayBookings[0]?.count || 0,

        totalRevenue: totalRevenue[0]?.revenue || 0,
      },
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
