import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        default: null
    },
    phone: {
        type: String,
        default: ""
    },
    role: {
        type: String,
        enum: ["user", "theatre_owner", "admin"],
        default: "user"
    },
    avatar:{
        type: String,
        default: ""
    },
    status: {
        type: String,
        enum: ["active", "blocked", "pending", "rejected"],
        default: "active"
    },
    googleId: {
      type: String,
      default: null,
    },
    provider: {
      type: String,
      enum: ["local", "google"],
      default: "local",
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    preferredCity: {
        type: String,
        default: ""
    },
    refreshToken: {
        type: String,
        default: null
    },
    isDeleted: {
        type:Boolean,
        default: false
    }
},{ timestamps: true })


const User = mongoose.model("User", userSchema);
export default User