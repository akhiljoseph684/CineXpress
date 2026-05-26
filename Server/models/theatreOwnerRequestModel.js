// import mongoose from "mongoose";

// const theatreOwnerSchema = new mongoose.Schema(
//   {
//     email: {
//       type: String,

//       required: true,

//       unique: true,

//       lowercase: true,

//       trim: true,
//     },

//     addedBy: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "User",
//     },

//     status: {
//       type: String,

//       enum: ["APPROVED", "USED"],

//       default: "APPROVED",
//     },
//     isDeleted: {
//         type:Boolean,
//         default: false
//     }
//   },
//   {
//     timestamps: true,
//   },
// );

// const TheatreOwnerEmail = mongoose.model(
//   "TheatreOwnerEmail",
//   theatreOwnerSchema,
// );

// export default TheatreOwnerEmail;
