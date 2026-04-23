import mongoose from "mongoose";

const movieSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        default: ""
    },
    duration: {
        type: Number,
        required: true
    },
    language: {
        type: [String],
        default: []
    },
    genre: {
        type: [String],
        default: []
    },
    releaseDate: {
        type: Date
    },
    poster: {
        card: {
            type: String,
            required: true
        },
        banner: {
            type: String,
            required: true
        },
        thumbnail: {
            type: String,
            required: true
        }
    },
    status: {
        type: String,
        enum: ["upcoming", "now_showing", "Off-Screen"],
        default: "upcoming"
    },
    cast: [{
        actorId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Actor",
            default: null
        },
        name: {
            type: String,
            default: "",
            trim: true
        }
    }],
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    }
}, { timestamps: true });

movieSchema.index({ title: 1 });
movieSchema.index({ status: 1 });
movieSchema.index({ releaseDate: -1 });

const Movie = mongoose.model("Movie", movieSchema);
export default Movie