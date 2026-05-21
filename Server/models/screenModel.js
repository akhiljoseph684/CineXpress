import mongoose from "mongoose"

const seatSchema = new mongoose.Schema({

  seatNumber: String,

  type: {
    type: String,
    enum: [
      "regular",
      "vip",
      "recliner",
      "couple"
    ],
    default: "regular"
  },

  price: {
    type: Number,
    default: 200
  },

  status: {
    type: String,
    enum: [
      "available",
      "booked",
      "blocked"
    ],
    default: "available"
  }

});

const screenSchema = new mongoose.Schema({

  theatreId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Theatre"
  },

  name: String,

  screenType: String,

  prices: {

    regular: {
      type: Number,
      default: 150
    },

    vip: {
      type: Number,
      default: 300
    },

    recliner: {
      type: Number,
      default: 500
    },

    couple: {
      type: Number,
      default: 700
    }

  },

  seatLayout: [[seatSchema]],

  isDeleted: {
    type: Boolean,
    default: false
  }

});

const Screen = mongoose.model(
  "Screen",
  screenSchema,
);

export default Screen;
