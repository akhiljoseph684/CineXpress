import Theatre from "../models/theatreModel.js";
import transporter from "../config/mailConfig.js";
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

    const registerLink = `${process.env.FRONTEND_URL}/signup?email=${ownerEmail}&code=${secretCode}`;

    await transporter.sendMail({
      from: process.env.EMAIL_USER,

      to: ownerEmail,

      subject: "CineXpress Theatre Owner Invitation 🎬",

      html: `

    <div
      style="
        font-family: Arial;
        background: #0f0f0f;
        padding: 40px;
        color: white;
      "
    >

      <div
        style="
          max-width: 600px;
          margin: auto;
          background: #1a1a1a;
          border-radius: 20px;
          overflow: hidden;
          border: 1px solid #2a2a2a;
        "
      >

        <div
          style="
            padding: 40px;
            text-align: center;
          "
        >

          <h1
            style="
              color: #d6a7c1;
              margin-bottom: 10px;
            "
          >

            CineXpress 🎭

          </h1>

          <p
            style="
              color: #aaa;
              font-size: 15px;
            "
          >

            Theatre Owner Invitation

          </p>

        </div>

        <div
          style="
            padding: 0 40px 40px;
          "
        >

          <h2
            style="
              margin-bottom: 20px;
            "
          >

            Hello 👋
          </h2>

          <p
            style="
              color: #ccc;
              line-height: 1.8;
            "
          >

            You have been invited
            as a theatre owner on
            CineXpress.

          </p>

          <p
            style="
              color: #ccc;
              line-height: 1.8;
            "
          >

            Click the button below
            to create your account.

          </p>

          <div
            style="
              text-align: center;
              margin: 35px 0;
            "
          >

            <a
              href="${registerLink}"

              style="
                display: inline-block;
                padding: 14px 28px;
                background: linear-gradient(
                  to right,
                  #8b5c76,
                  #6f4660
                );
                color: white;
                text-decoration: none;
                border-radius: 12px;
                font-weight: bold;
              "
            >

              Create Account

            </a>

          </div>

          <div
            style="
              background: #111;
              border-radius: 14px;
              padding: 20px;
              margin-top: 30px;
            "
          >

            <p
              style="
                margin: 0 0 10px;
                color: #888;
              "
            >

              Secret Code

            </p>

            <h2
              style="
                margin: 0;
                color: #facc15;
                letter-spacing: 5px;
              "
            >

              ${secretCode}

            </h2>

          </div>

          <p
            style="
              margin-top: 30px;
              color: #777;
              font-size: 14px;
              line-height: 1.8;
            "
          >

            If the button does not work,
            copy and paste this link:

          </p>

          <p
            style="
              word-break: break-all;
              color: #d6a7c1;
              font-size: 13px;
            "
          >

            ${registerLink}

          </p>

        </div>

      </div>

    </div>
  `,
    });

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

    await User.findOneAndUpdate({email: theatre.ownerEmail} , { role: "user" });

    return res.status(200).json({ 
      success: true, 
      message: "Theatre deleted successfully" 
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
