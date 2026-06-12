import Theatre from "../models/theatreModel.js";
import apiInstance from "../config/mailConfig.js";
import User from "../models/userModel.js";

export const createTheatre = async (req, res) => {
  try {
    const {
      name,

      city,

      address,

      location,

      bannerImage,

      gallery,

      ownerEmail,
    } = req.body;

    if (!name || !city || !address || !location || !ownerEmail) {
      return res.status(400).json({
        success: false,

        message: "Please fill all required fields",
      });
    }

    if (!bannerImage) {
      return res.status(400).json({
        success: false,

        message: "Please upload banner image",
      });
    }

    const { lat, lng } = location;

    const longitude = Number(lng);

    const latitude = Number(lat);

    if (isNaN(longitude) || isNaN(latitude)) {
      return res.status(400).json({
        success: false,

        message: "Invalid latitude or longitude",
      });
    }

    const secretCode = Math.floor(100000 + Math.random() * 900000).toString();

    const geoLocation = {
      lat: latitude,
      lng: longitude,
    };

    const user = await User.findOne({ email: ownerEmail });

    if (user) {
      return res.status(409).json({
        success: false,
        message: "User is Already exists",
      });
    }

    const theatre = await Theatre.create({
      name,

      city: city.toLowerCase(),

      address,

      bannerImage,

      gallery: gallery || [],

      location: geoLocation,

      ownerEmail: ownerEmail.toLowerCase(),

      secretCode,

      status: "pending",

      isDeleted: false,
    });

    const registerLink = `${process.env.FRONTEND_URL}/signup?email=${ownerEmail}&code=${secretCode}`;

    await apiInstance.sendTransacEmail({
      sender: {
        name: "CineXpress",
        email: "yourverifiedemail@example.com",
      },
      to: [
        {
          email: ownerEmail,
        },
      ],
      subject: "CineXpress Theatre Owner Invitation 🎬",
      htmlContent: `
    <h1>Welcome to CineXpress</h1>
    <p>Create your account using the link below.</p>
    <a href="${registerLink}">Create Account</a>
  `,
    });

    return res.status(201).json({
      success: true,

      message: "Theatre created successfully",

      theatre,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,

      message: error.message,
    });
  }
};

export const getAllTheatre = async (req, res) => {
  try {
    const {
      status,

      search,

      page = 1,

      limit = 12,
    } = req.query;

    let query = {
      isDeleted: false,
    };

    if (status) {
      query.status = status;
    }

    if (search) {
      query.name = {
        $regex: search,

        $options: "i",
      };
    }

    const skip = (page - 1) * limit;

    const theatres = await Theatre.find(query)

      .populate({
        path: "ownerId",

        select: "name email avatar",
      })

      .skip(Number(skip))

      .limit(Number(limit))

      .sort({
        createdAt: -1,
      });

    const totalTheatres = await Theatre.countDocuments(query);

    const totalPages = Math.ceil(totalTheatres / limit);

    return res.status(200).json({
      success: true,

      message: "Theatres fetched successfully",

      theatres,

      currentPage: Number(page),

      totalPages,

      totalTheatres,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,

      message: error.message,
    });
  }
};

export const editTheatre = async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({
        success: false,

        message: "Unauthorized",
      });
    }

    const { id } = req.params;

    const {
      name,

      city,

      address,

      bannerImage,

      gallery,

      location,

      ownerEmail,
    } = req.body;

    const theatre = await Theatre.findOne({
      _id: id,

      isDeleted: false,
    });

    if (!theatre) {
      return res.status(404).json({
        success: false,

        message: "Theatre not found",
      });
    }

    let geoLocation = theatre.location;

    if (location) {
      const latitude = Number(location.lat);

      const longitude = Number(location.lng);

      if (isNaN(latitude) || isNaN(longitude)) {
        return res.status(400).json({
          success: false,

          message: "Invalid location",
        });
      }

      geoLocation = {
        lat: latitude,

        lng: longitude,
      };
    }

    theatre.name = name || theatre.name;

    theatre.city = city || theatre.city;

    theatre.address = address || theatre.address;

    theatre.bannerImage = bannerImage || theatre.bannerImage;

    theatre.gallery = gallery || theatre.gallery;

    theatre.location = geoLocation;

    theatre.ownerEmail = ownerEmail || theatre.ownerEmail;

    await theatre.save();

    return res.status(200).json({
      success: true,

      message: "Theatre updated successfully",

      theatre,
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      success: false,

      message: error.message,
    });
  }
};

export const getTheatreById = async (req, res) => {
  try {
    const { id } = req.params;

    const theatre = await Theatre.findOne({
      _id: id,

      isDeleted: false,
    })

      .populate({
        path: "ownerId",

        select: "name email avatar",
      });

    if (!theatre) {
      return res.status(404).json({
        success: false,

        message: "Theatre not found",
      });
    }

    return res.status(200).json({
      success: true,

      theatre,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,

      message: error.message,
    });
  }
};

export const getTheatresByOwner = async (req, res) => {
  try {
    const { id } = req.user;

    if (!id) {
      return res.status(404).json({
        success: false,

        message: "Id not found",
      });
    }

    const theatres = await Theatre.find({
      ownerId: id,
      isDeleted: false,
    });

    if (!theatres.length) {
      return res.status(404).json({
        success: false,
        message: "No theatre is found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Theatres fetched successfully",
      theatres,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const deleteTheatre = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(404).json({
        success: false,
        message: "Id is not found",
      });
    }

    const theatre = await Theatre.findOneAndUpdate(
      {
        _id: id,
        isDeleted: false,
      },
      {
        isDeleted: true,
      },
      {
        returnDocument: "after",
      },
    );

    if (!theatre) {
      return res.status(404).json({
        success: false,
        message: "Theatre is not found",
      });
    }

    await User.findOneAndUpdate(
      { email: theatre.ownerEmail },
      { role: "user" },
    );

    return res.status(200).json({
      success: true,
      message: "Theatre deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const updateTheatreStatus = async (req, res) => {
  try {
    const {
      theatreId,

      status,
    } = req.body;

    if (!theatreId || !status) {
      return res.status(400).json({
        success: false,

        message: "Theatre ID and status are required",
      });
    }

    if (
      status !== "pending" &&
      status !== "approved" &&
      status !== "rejected"
    ) {
      return res.status(400).json({
        success: false,

        message: "Invalid status",
      });
    }

    const theatre = await Theatre.findOne({
      _id: theatreId,

      isDeleted: false,
    });

    if (!theatre) {
      return res.status(404).json({
        success: false,

        message: "Theatre not found",
      });
    }

    theatre.status = status;

    if (theatre.ownerId && status === "approved") {
      theatre.secretCode = null;
    }

    await theatre.save();

    return res.status(200).json({
      success: true,

      message: "Theatre status updated successfully",

      theatre,
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      success: false,

      message: error.message,
    });
  }
};
