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
        type: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: "Language",
        }],
        default: []
    },
    genre: {
        type: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: "Genre",
        }],
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
    reviews: [{
          
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User"
        },
      
        comments: {
          type: String
        },
      
        stars: {
          type: Number,
          min: 1,
          max: 5
        },
      
        createdAt: {
          type: Date,
          default: Date.now
        }
      
      }],
    director: {
      type: String,
      required: true,
      trim: true,
    },
    
    producer: {
      type: String,
      trim: true,
    },
    trailer: {
        type: String,
        trim: true
    },
    isDeleted: {
        type: Boolean,
        default: false
    },
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