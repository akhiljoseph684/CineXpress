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
            type: "String",
            enum: ["point"],
            default: "point"
        },
        coordinates: [Number]
    },
    status: {
        type: String,
        enum: ["pending", "approved", "rejected",],
        default: "pending"
    },
    ownerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }
})

theatreSchema.index({location: "2dsphere"});

const Theatre = mongoose.model("Theatre",theatreSchema);
export default Theatre;
