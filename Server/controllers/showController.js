import mongoose from "mongoose";

import Movie from "../models/movieModel.js";
import Theatre from "../models/theatreModel.js";
import Screen from "../models/screenModel.js";
import Show from "../models/showModel.js";
import User from "../models/userModel.js";

import { geocodeCity } from "../utils/geocodeCity.js";
import Booking from "../models/bookingModel.js";

export const createShow = async (req, res) => {
  try {
    const { movieId, theatreId, screenId, startDate, endDate, showTimes } =
      req.body;

    if (!movieId) {
      return res.status(400).json({
        success: false,
        message: "Movie is required",
      });
    }

    if (!theatreId) {
      return res.status(400).json({
        success: false,
        message: "Theatre is required",
      });
    }

    if (!screenId) {
      return res.status(400).json({
        success: false,
        message: "Screen is required",
      });
    }

    if (!startDate || !endDate) {
      return res.status(400).json({
        success: false,
        message: "Start date and end date are required",
      });
    }

    if (!showTimes || !showTimes.length) {
      return res.status(400).json({
        success: false,
        message: "Show times required",
      });
    }

    const movie = await Movie.findById(movieId).select("duration");

    if (!movie) {
      return res.status(404).json({
        success: false,
        message: "Movie not found",
      });
    }

    const duration = movie.duration;

    const now = new Date();

    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    const startDateObj = new Date(startDate);

    const endDateObj = new Date(endDate);

    if (startDateObj < today) {
      return res.status(400).json({
        success: false,
        message: "Cannot create shows for past dates",
      });
    }

    if (endDateObj < startDateObj) {
      return res.status(400).json({
        success: false,
        message: "End date must be greater than or equal to start date",
      });
    }

    const currentDate = now.toISOString().split("T")[0];

    const currentTime = `${String(now.getHours()).padStart(2, "0")}:${String(
      now.getMinutes(),
    ).padStart(2, "0")}`;

    if (startDate === currentDate) {
      const hasPastTime = showTimes.some((time) => time <= currentTime);

      if (hasPastTime) {
        return res.status(400).json({
          success: false,
          message: "Cannot create shows for past time",
        });
      }
    }

    const dates = [];

    const lastDate = new Date(endDate);

    for (
      let date = new Date(startDate);
      date <= lastDate;
      date.setDate(date.getDate() + 1)
    ) {
      dates.push(new Date(date).toISOString().split("T")[0]);
    }

    const existingShows = await Show.find({
      screenId,

      showDate: {
        $gte: startDate,
        $lte: endDate,
      },
    }).select("showDate startTime endTime");

    const showMap = new Map();

    existingShows.forEach((show) => {
      if (!showMap.has(show.showDate)) {
        showMap.set(show.showDate, []);
      }

      showMap.get(show.showDate).push(show);
    });

    const shows = [];

    for (const showDate of dates) {
      const dayShows = showMap.get(showDate) || [];

      for (const startTime of showTimes) {
        const start = new Date(`${showDate}T${startTime}`);

        const end = new Date(start.getTime() + (duration + 15) * 60000);

        const hasConflict = dayShows.some((existingShow) => {
          const existingStart = new Date(
            `${showDate}T${existingShow.startTime}`,
          );

          const existingEnd = new Date(`${showDate}T${existingShow.endTime}`);

          return start < existingEnd && end > existingStart;
        });

        if (hasConflict) {
          return res.status(400).json({
            success: false,
            message: `Time conflict detected on ${showDate} at ${startTime}`,
          });
        }

        shows.push({
          movieId,
          theatreId,
          screenId,
          showDate,
          startTime,

          endTime: end.toTimeString().slice(0, 5),
        });
      }
    }

    if (!shows.length) {
      return res.status(400).json({
        success: false,
        message: "No shows available to create",
      });
    }

    await Show.insertMany(shows);

    return res.status(201).json({
      success: true,
      message: "Shows created successfully",
      totalShows: shows.length,
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const cancelShow = async (req, res) => {
  try {
    const { id } = req.params;

    const ownerId = req.user.id;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid show ID",
      });
    }

    const show = await Show.findById(id);

    if (!show) {
      return res.status(404).json({
        success: false,
        message: "Show not found",
      });
    }

    const theatre = await Theatre.findById(show.theatreId);

    if (!theatre) {
      return res.status(404).json({
        success: false,
        message: "Theatre not found",
      });
    }

    if (theatre.ownerId.toString() !== ownerId.toString()) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized access",
      });
    }

    const existingBookings = await Booking.findOne({
      show: show._id,

      bookingStatus: {
        $in: ["CONFIRMED", "PENDING"],
      },
    });

    if (existingBookings) {
      return res.status(400).json({
        success: false,
        message: "Cannot cancel show with active bookings",
      });
    }

    await Show.findByIdAndDelete(id);

    return res.status(200).json({
      success: true,
      message: "Show cancelled successfully",
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getMovieShows = async (req, res) => {
  try {
    const { movieId, showDate } = req.query;

    if (!movieId || !showDate) {
      return res.status(400).json({
        success: false,
        message: "Movie and date required",
      });
    }

    const user = await User.findById(req.user.id);

    if (!user || !user.preferredCity) {
      return res.status(400).json({
        success: false,
        message: "Preferred city not found",
      });
    }

    const coordinates = await geocodeCity(user.preferredCity);

    if (!coordinates) {
      return res.status(400).json({
        success: false,

        message: "Unable to get city coordinates",
      });
    }

    const shows = await Show.aggregate([
      {
        $match: {
          movieId: new mongoose.Types.ObjectId(movieId),
          showDate,
        },
      },

      {
        $lookup: {
          from: "theatres",

          localField: "theatreId",

          foreignField: "_id",

          as: "theatre",
        },
      },

      {
        $unwind: "$theatre",
      },

      {
        $match: {
          "theatre.status": "approved",

          "theatre.isDeleted": false,
        },
      },

      {
        $addFields: {
          distance: {
            $sqrt: {
              $add: [
                {
                  $pow: [
                    {
                      $subtract: [
                        {
                          $arrayElemAt: ["$theatre.location.coordinates", 0],
                        },

                        coordinates.longitude,
                      ],
                    },

                    2,
                  ],
                },

                {
                  $pow: [
                    {
                      $subtract: [
                        {
                          $arrayElemAt: ["$theatre.location.coordinates", 1],
                        },

                        coordinates.latitude,
                      ],
                    },

                    2,
                  ],
                },
              ],
            },
          },
        },
      },

      {
        $lookup: {
          from: "screens",

          localField: "screenId",

          foreignField: "_id",

          as: "screen",
        },
      },

      {
        $unwind: "$screen",
      },

      {
        $sort: {
          distance: 1,

          startTime: 1,
        },
      },

      {
        $group: {
          _id: "$theatre._id",

          theatre: {
            $first: "$theatre",
          },

          distance: {
            $first: "$distance",
          },

          shows: {
            $push: {
              _id: "$_id",

              startTime: "$startTime",

              endTime: "$endTime",

              showDate: "$showDate",

              screen: "$screen.name",
            },
          },
        },
      },
    ]);

    return res.status(200).json({
      success: true,
      shows,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

export const getShowById = async (req, res) => {
  try {
    const { showId } = req.params;

    const show = await Show.findById(showId)
      .populate("movieId")

      .populate("theatreId")

      .populate("screenId");

    if (!show) {
      return res.status(404).json({
        success: false,
        message: "Show not found",
      });
    }

    const bookedSeats = await Booking.aggregate([
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
        $replaceRoot: {
          newRoot: "$seats",
        },
      },
    ]);

    return res.status(200).json({
      success: true,
      show,
      bookedSeats,
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getAllShows = async (req, res) => {
  try {
    const { search, type, page = 1, limit = 12 } = req.query;

    let query = {};

    const now = new Date();

    const today = now.toISOString().split("T")[0];

    const currentTime = `${String(now.getHours()).padStart(2, "0")}:${String(
      now.getMinutes(),
    ).padStart(2, "0")}`;

    if (type === "upcoming") {
      query.$or = [
        {
          showDate: {
            $gt: today,
          },
        },
        {
          showDate: today,
          startTime: {
            $gt: currentTime,
          },
        },
      ];
    }

    if (type === "ended") {
      query.$or = [
        {
          showDate: {
            $lt: today,
          },
        },
        {
          showDate: today,
          endTime: {
            $lt: currentTime,
          },
        },
      ];
    }

    if (type === "running") {
      query.showDate = today;

      query.startTime = {
        $lte: currentTime,
      };

      query.endTime = {
        $gte: currentTime,
      };
    }

    if (search) {
      query.$or = [
        {
          startTime: {
            $regex: search,
            $options: "i",
          },
        },
        {
          endTime: {
            $regex: search,
            $options: "i",
          },
        },
        {
          showDate: {
            $regex: search,
            $options: "i",
          },
        },
      ];
    }

    const skip = (page - 1) * limit;

    let shows = await Show.find(query)
      .populate({
        path: "movieId",
        select: "title poster",
      })
      .populate({
        path: "theatreId",
        select: "name city status",
        match: {
          isDeleted: false,
        },
      })
      .populate({
        path: "screenId",
        select: "name screenType",
        match: {
          isDeleted: false,
        },
      })
      .sort({
        showDate: 1,
        startTime: 1,
      });

    shows = shows.filter((show) => show.theatreId && show.screenId);

    const totalShows = shows.length;

    const paginatedShows = shows.slice(skip, skip + Number(limit));

    const totalPages = Math.ceil(totalShows / limit);

    return res.status(200).json({
      success: true,
      message: "Shows fetched successfully",
      shows: paginatedShows,
      currentPage: Number(page),
      totalPages,
      totalShows,
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getShowsByOwner = async (req, res) => {
  try {
    const ownerId = req.user.id;

    const {
      type,

      page = 1,

      limit = 12,
    } = req.query;

    const now = new Date();

    const today = now.toISOString().split("T")[0];

    const currentTime = `${String(now.getHours()).padStart(2, "0")}:${String(
      now.getMinutes(),
    ).padStart(2, "0")}`;

    let query = {
      theatreId: {
        $in: await Theatre.find({
          ownerId,

          isDeleted: false,
        }).distinct("_id"),
      },
    };

    if (type === "upcoming") {
      query.$or = [
        {
          showDate: {
            $gt: today,
          },
        },

        {
          showDate: today,

          startTime: {
            $gt: currentTime,
          },
        },
      ];
    }

    if (type === "running") {
      query.showDate = today;

      query.startTime = {
        $lte: currentTime,
      };

      query.endTime = {
        $gte: currentTime,
      };
    }

    if (type === "ended") {
      query.$or = [
        {
          showDate: {
            $lt: today,
          },
        },

        {
          showDate: today,

          endTime: {
            $lt: currentTime,
          },
        },
      ];
    }

    const skip = (page - 1) * limit;

    const shows = await Show.aggregate([
      {
        $match: query,
      },

      {
        $lookup: {
          from: "screens",

          localField: "screenId",

          foreignField: "_id",

          as: "screen",
        },
      },

      {
        $unwind: "$screen",
      },

      {
        $match: {
          "screen.isDeleted": false,
        },
      },

      {
        $lookup: {
          from: "movies",

          localField: "movieId",

          foreignField: "_id",

          as: "movieId",
        },
      },

      {
        $unwind: "$movieId",
      },

      {
        $lookup: {
          from: "theatres",

          localField: "theatreId",

          foreignField: "_id",

          as: "theatreId",
        },
      },

      {
        $unwind: "$theatreId",
      },

      {
        $sort: {
          showDate: 1,

          startTime: 1,
        },
      },

      {
        $skip: Number(skip),
      },

      {
        $limit: Number(limit),
      },
    ]);

    const totalShows = await Show.countDocuments(query);

    const totalPages = Math.ceil(totalShows / limit);

    return res.status(200).json({
      success: true,

      message: "Shows fetched successfully",

      shows,

      currentPage: Number(page),

      totalPages,

      totalShows,
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      success: false,

      message: error.message,
    });
  }
};

export const editShow = async (req, res) => {
  try {
    const { id } = req.params;

    const oldShow = await Show.findById(id);

    if (!oldShow) {
      return res.status(404).json({
        success: false,

        message: "Show not found",
      });
    }

    await Show.deleteMany({
      movieId: oldShow.movieId,

      screenId: oldShow.screenId,
    });

    req.body.theatreId = oldShow.theatreId;

    req.body.screenId = oldShow.screenId;

    return createShow(req, res);
  } catch (error) {
    return res.status(500).json({
      success: false,

      message: error.message,
    });
  }
};
