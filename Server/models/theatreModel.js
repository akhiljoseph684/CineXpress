import mongoose from "mongoose";

const theatreSchema = new mongoose.Schema(
  {
    name: {
      type: String,

      required: true,

      trim: true,
    },

    ownerId: {
      type: mongoose.Schema.Types.ObjectId,

      ref: "User",

      default: null,
    },

    ownerEmail: {
      type: String,

      required: true,

      lowercase: true,

      trim: true,
    },

    secretCode: {
      type: String,

      required: true,
    },

    city: {
      type: String,

      required: true,

      trim: true,
    },

    address: {
      type: String,

      required: true,

      trim: true,
    },

    bannerImage: {
      type: String,

      required: true,
    },

    gallery: [
      {
        type: String,
      },
    ],

    // NEW LOCATION FORMAT

    location: {
      lat: {
        type: Number,

        required: true,
      },

      lng: {
        type: Number,

        required: true,
      },
    },

    status: {
      type: String,

      enum: ["pending", "approved", "rejected"],

      default: "approved",
    },

    isDeleted: {
      type: Boolean,

      default: false,
    },

    addedBy: {
      type: mongoose.Schema.Types.ObjectId,

      ref: "User",
    },
  },

  {
    timestamps: true,
  },
);

const Theatre = mongoose.model(
  "Theatre",

  theatreSchema,
);

export default Theatre;
