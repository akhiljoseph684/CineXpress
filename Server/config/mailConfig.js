import nodemailer from "nodemailer";

import dotenv from "dotenv";

dotenv.config();

const transporter = nodemailer.createTransport({
  service: "gmail",

  auth: {
    user: process.env.EMAIL_USER,

    pass: process.env.EMAIL_PASS,
  },
});

export default transporter;

transporter.verify((error) => {
  if (error) {
    console.log(error);
  } else {
    console.log("Mail Ready ✅");
  }
});
