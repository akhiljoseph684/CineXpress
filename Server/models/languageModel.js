import mongoose from "mongoose";

const languageSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    isDeleted: {
        type: Boolean,
        default: false
    }
  },
  {
    timestamps: true,
  }
);

const Language = mongoose.model("Language", languageSchema);

export default Language;