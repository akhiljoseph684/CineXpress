import mongoose from "mongoose";

const bookedSeatSchema = new mongoose.Schema(
  {
    seatNumber: {
      type: String,
      required: true,
    },

    row: {
      type: Number,
      required: true,
    },

    col: {
      type: Number,
      required: true,
    },

    type: {
      type: String,

      enum: ["regular", "vip", "recliner"],

      required: true,
    },

    price: {
      type: Number,
      required: true,
    },
  },

  {
    _id: false,
  },
);

const bookingSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,

      ref: "User",

      required: true,
    },

    show: {
      type: mongoose.Schema.Types.ObjectId,

      ref: "Show",

      required: true,
    },

    seats: {
      type: [bookedSeatSchema],

      required: true,

      validate: {
        validator: function (value) {
          return value.length > 0;
        },

        message: "At least one seat is required",
      },
    },

    totalSeats: {
      type: Number,
      min: 1,
    },

    totalAmount: {
      type: Number,

      required: true,

      min: 0,
    },

    bookingStatus: {
      type: String,

      enum: ["PENDING", "CONFIRMED", "CANCELLED", "EXPIRED"],

      default: "PENDING",
    },

    paymentStatus: {
      type: String,

      enum: ["PENDING", "PAID", "FAILED", "REFUNDED"],

      default: "PENDING",
    },

    paymentMethod: {
      type: String,
      default: null,
    },

    paymentId: {
      type: String,
      default: null,
    },
    
    ticketId: {
      type: String,
      unique: true,
      default: null,
    },

    qrCode: {
      type: String,
      default: null,
    },

    isScanned: {
      type: Boolean,
      default: false,
    },

    scannedAt: {
      type: Date,
      default: null,
    },

    reservedAt: {
      type: Date,
      default: Date.now,
    },

    expiresAt: {
      type: Date,

      default: () => new Date(Date.now() + 5 * 60 * 1000),
    },

    bookedAt: {
      type: Date,
      default: null,
    },

    cancelledAt: {
      type: Date,
      default: null,
    },
  },

  {
    timestamps: true,
  },
);


bookingSchema.index({
  show: 1,
});

bookingSchema.index({
  user: 1,
});

bookingSchema.index({
  bookingStatus: 1,
});

bookingSchema.index({
  expiresAt: 1,
});

bookingSchema.index({
  ticketId: 1,
});

bookingSchema.pre(
  "save",

  function () {
    this.totalSeats = this.seats.length;
  },
);

const Booking = mongoose.model("Booking", bookingSchema);

export default Booking;
