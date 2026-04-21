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
        type: String
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
        enum: ["active", "blocked", "pending"],
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
    ownerDetails: {
      businessName: {
        type: String
      },
      address: {
        type: String
      }
    },
    preferredCity: {
        type: String,
        default: ""
    }
},{ timestamps: true })

userSchema.index({ email: 1 });

const User = mongoose.model("User", userSchema);
export default User