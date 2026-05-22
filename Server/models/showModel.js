import mongoose from "mongoose";

const showSchema = new mongoose.Schema(
    {
      movieId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Movie",
        required: true,
      },

      theatreId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Theatre",
        required: true,
      },

      screenId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Screen",
        required: true,
      },

      showDate: {
        type: String,
        required: true,
      },

      startTime: {
        type: String,
        required: true,
      },

      endTime: {
        type: String,
        required: true,
      },

    },
    {
      timestamps: true,
    }

  );

const Show = mongoose.model("Show", showSchema);

export default Show;