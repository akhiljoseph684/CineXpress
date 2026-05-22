import mongoose from "mongoose";

import Movie from "../models/movieModel.js";
import Theatre from "../models/theatreModel.js";
import Screen from "../models/screenModel.js";
import Show from "../models/showModel.js";
import User from "../models/userModel.js";

import { geocodeCity } from "../utils/geocodeCity.js";


export const createShow = async (req, res) => {
  try {
    const { movieId, theatreId, screenId, showDate, startTime, endTime } =
      req.body;

    if (
      !movieId ||
      !theatreId ||
      !screenId ||
      !showDate ||
      !startTime ||
      !endTime
    ) {
      return res.status(400).json({
        success: false,

        message: "All fields are required",
      });
    }

    const movie = await Movie.findById(movieId);

    if (!movie) {
      return res.status(404).json({
        success: false,

        message: "Movie not found",
      });
    }

    const theatre = await Theatre.findById(theatreId);

    if (!theatre) {
      return res.status(404).json({
        success: false,
        message: "Theatre not found",
      });
    }

    const screen = await Screen.findById(screenId);

    if (!screen) {
      return res.status(404).json({
        success: false,

        message: "Screen not found",
      });
    }

    if (!screen.theatreId.equals(theatreId)) {
      return res.status(400).json({
        success: false,

        message: "Screen does not belong to this theatre",
      });
    }

    const start = new Date(`${showDate}T${startTime}`);

    const end = new Date(`${showDate}T${endTime}`);

    const now = new Date();

    if (start.getTime() < now.getTime()) {
      return res.status(400).json({
        success: false,
        message: "Cannot create show for past date or time",
      });
    }

    if (end.getTime() <= start.getTime()) {
      return res.status(400).json({
        success: false,
        message: "End time must be after start time",
      });
    }

    const overlappingShow = await Show.aggregate([
  
      {
        $match: {
      
          screenId:
            new mongoose.Types.ObjectId(
              screenId
            ),
          
          showDate,
          
        },
      },
  
      {
        $addFields: {
      
          existingStart: {
          
            $dateFromString: {
          
              dateString: {
              
                $concat: [
                  "$showDate",
                  "T",
                  "$startTime",
                ],
              
              },
          
            },
          
          },
      
          existingEnd: {
          
            $dateFromString: {
          
              dateString: {
              
                $concat: [
                  "$showDate",
                  "T",
                  "$endTime",
                ],
              
              },
          
            },
          
          },
      
          newStart: {
          
            $dateFromString: {
          
              dateString:
                `${showDate}T${startTime}`,
          
            },
          
          },
      
          newEnd: {
          
            $dateFromString: {
          
              dateString:
                `${showDate}T${endTime}`,
          
            },
          
          },
      
        },
      
      },
  
      {
        $match: {
      
          $expr: {
          
            $and: [
          
              {
                $lt: [
              
                  "$newStart",
              
                  "$existingEnd",
              
                ],
              },
          
              {
                $gt: [
              
                  "$newEnd",
              
                  "$existingStart",
              
                ],
              },
          
            ],
          
          },
      
        },
      
      },
  
      {
        $limit: 1,
      },
  
    ]);
    if (overlappingShow.length > 0) {
      return res.status(400).json({
        success: false,
        message: "Show timing overlaps with another show",
      });
    }

    const show = await Show.create({
      movieId,

      theatreId,

      screenId,

      showDate,

      startTime,

      endTime,
    });

    return res.status(201).json({
      success: true,

      message: "Show created successfully",

      show,
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      success: false,

      message: "Server error",
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
