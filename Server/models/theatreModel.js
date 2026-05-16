import mongoose from "mongoose";

const theatreSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    city: {
        type: String,
        required: true 
    },
    address: {
        type: String,
        required: true
    },
    location: {
        type: {
            type: String,
            enum: ["Point"],
            default: "Point"
        },
        coordinates: [Number]
    },
    status: {
        type: String,
        enum: ["pending", "approved", "rejected",],
        default: "pending"
    },
    bannerImage: {
        type: String,
        required: true
    },
    gallery: [
        {
            type: String
        }
    ],
    ownerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    isDeleted: {
        type: Boolean,
        default: false
    }
})

theatreSchema.index({location: "2dsphere"});

const Theatre = mongoose.model("Theatre",theatreSchema);
export default Theatre;
