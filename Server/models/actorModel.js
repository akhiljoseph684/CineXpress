import mongoose from "mongoose";

const actorSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  profileImage: {
    type: String,
    default: ""
  },
  bio: {
    type: String,
    default: ""
  }
}, { timestamps: true });

actorSchema.index({ name: 1 });

const Actor = mongoose.model("Actor", actorSchema);
export default Actor;