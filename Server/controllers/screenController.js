import mongoose from "mongoose";

import Screen from "../models/screenModel.js";
import Theatre from "../models/theatreModel.js";

export const createScreen = async (req, res) => {
  try {
    const { theatreId, name, screenType, seatLayout, prices } = req.body;

    if (!theatreId || !name || !screenType || !seatLayout) {
      return res.status(400).json({
        success: false,
        message: "Please fill all required fields",
      });
    }

    const theatre = await Theatre.findById(theatreId);

    if (!theatre) {
      return res.status(404).json({
        success: false,
        message: "Theatre not found",
      });
    }

    if (!theatre.ownerId.equals(req.user.id)) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized access",
      });
    }

    const screen = await Screen.create({
      theatreId,
      name,
      screenType,
      seatLayout,
      prices,
    });

    return res.status(201).json({
      success: true,
      message: "Screen created successfully",
      screen,
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getScreenById = async (req, res) => {
  try {
    const { id } = req.params;

    const screen = await Screen.aggregate([
      {
        $match: {
          _id: new mongoose.Types.ObjectId(id),
          isDeleted: false,
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
        $addFields: {
          totalSeats: {
            $size: {
              $filter: {
                input: {
                  $reduce: {
                    input: "$seatLayout",
                    initialValue: [],
                    in: {
                      $concatArrays: ["$$value", "$$this"],
                    },
                  },
                },
                as: "seat",
                cond: {
                  $ne: ["$$seat", null],
                },
              },
            },
          },
        },
      },
    ]);

    if (!screen || !screen.length) {
      return res.status(404).json({
        success: false,
        message: "Screen not found",
      });
    }

    return res.status(200).json({
      success: true,
      screen: screen[0],
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const updateScreen = async (req, res) => {
  try {
    const { id } = req.params;

    const { name, screenType, seatLayout, prices } = req.body;

    const screen = await Screen.findOne({
      _id: id,
      isDeleted: false,
    });

    if (!screen) {
      return res.status(404).json({
        success: false,
        message: "Screen not found",
      });
    }

    screen.name = name || screen.name;

    screen.screenType = screenType || screen.screenType;

    screen.seatLayout = seatLayout || screen.seatLayout;

    screen.prices = prices || screen.prices;

    await screen.save();

    return res.status(200).json({
      success: true,
      message: "Screen updated successfully",
      screen,
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const deleteScreen = async (req, res) => {
  try {
    const { id } = req.params;

    const screen = await Screen.findOne({
      _id: id,
      isDeleted: false,
    });

    if (!screen) {
      return res.status(404).json({
        success: false,
        message: "Screen not found",
      });
    }

    screen.isDeleted = true;

    await screen.save();

    return res.status(200).json({
      success: true,
      message: "Screen deleted successfully",
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getScreensByOwner = async (req, res) => {
  try {
    const ownerId = req.user.id;

    const screens = await Screen.aggregate([
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
          "theatre.ownerId": new mongoose.Types.ObjectId(ownerId),

          isDeleted: false,
        },
      },
      {
        $addFields: {
          totalSeats: {
            $size: {
              $filter: {
                input: {
                  $reduce: {
                    input: "$seatLayout",

                    initialValue: [],

                    in: {
                      $concatArrays: ["$$value", "$$this"],
                    },
                  },
                },

                as: "seat",

                cond: {
                  $ne: ["$$seat", null],
                },
              },
            },
          },
        },
      },
      {
        $project: {
          name: 1,
          screenType: 1,
          prices: 1,
          totalSeats: 1,
          createdAt: 1,
          theatre: {
            _id: 1,
            name: 1,
            location: 1,
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
      count: screens.length,
      screens,
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      success: false,

      message: error.message,
    });
  }
};

export const getAllScreens = async (req, res) => {
  try {
    const screens = await Screen.aggregate([
      {
        $match: {
          isDeleted: false,
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
        $lookup: {
          from: "users",
          localField: "theatre.ownerId",
          foreignField: "_id",
          as: "owner",
        },
      },

      {
        $unwind: {
          path: "$owner",

          preserveNullAndEmptyArrays: true,
        },
      },

      {
        $addFields: {
          totalSeats: {
            $size: {
              $filter: {
                input: {
                  $reduce: {
                    input: "$seatLayout",

                    initialValue: [],

                    in: {
                      $concatArrays: ["$$value", "$$this"],
                    },
                  },
                },

                as: "seat",

                cond: {
                  $ne: ["$$seat", null],
                },
              },
            },
          },
        },
      },

      {
        $project: {
          name: 1,

          screenType: 1,

          prices: 1,

          totalSeats: 1,

          createdAt: 1,

          theatre: {
            _id: "$theatre._id",

            name: "$theatre.name",

            location: "$theatre.location",
          },

          owner: {
            _id: "$owner._id",

            name: "$owner.name",

            email: "$owner.email",
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

      count: screens.length,

      screens,
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      success: false,

      message: error.message,
    });
  }
};
