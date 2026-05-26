// import TheatreOwnerEmail from "../models/theatreOwnerRequestModel.js";
// import User from "../models/userModel.js";

// export const addTheatreOwnerEmail = async (req, res) => {
//   try {
//     const { email } = req.body;

//     const existsUser = await User.findOne({ email });

//     if (existsUser) {
//       return res.status(400).json({
//         success: false,
//         message: "Email exsit as a " + existsUser.role,
//       });
//     }

//     const exists = await TheatreOwnerEmail.findOne({ email });

//     if (exists && !exists.isDeleted) {
//       return res.status(400).json({
//         success: false,
//         message: "Email already added",
//       });
//     }

//     if(exists && exists.isDeleted){
//       exists.isDeleted = false;
//       await exists.save();
//       return res.status(201).json({
//         success: true,
//         exists,
//       });
      
//     }

//     const ownerEmail = await TheatreOwnerEmail.create({
//       email,
//       addedBy: req.user.id,
//     });

//     return res.status(201).json({
//       success: true,
//       ownerEmail,
//     });
//   } catch (error) {
//     return res.status(500).json({
//       success: false,
//       message: error.message,
//     });
//   }
// };

// export const getTheatreOwnerEmails = async (req, res) => {
//   try {
//     const emails = await TheatreOwnerEmail.find({
//       isDeleted: false
//     })

//       .sort({
//         createdAt: -1,
//       });

//     return res.status(200).json({
//       success: true,

//       emails,
//     });
//   } catch (error) {
//     return res.status(500).json({
//       success: false,

//       message: error.message,
//     });
//   }
// };

// export const deleteTheatreOwnerEmail = async (req, res) => {
//   try {
//     const { id } = req.params;

//     let email = await TheatreOwnerEmail.findById(id);

//     email.isDeleted = !email.isDeleted;

//     await email.save();

//     return res.status(200).json({
//       success: true,

//       message: "Email deleted",
//     });
//   } catch (error) {
//     return res.status(500).json({
//       success: false,

//       message: error.message,
//     });
//   }
// };
