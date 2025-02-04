const mongoose = require("mongoose");
const validator = require("validator");

const userOtpSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, "Enter your email"],
    unique: true,
    validate: [validator.isEmail, "enter valid email"],
  },
  otp: {
    type: String,
    required: [true, "Enter your otp"],
  },
});

const userOtp = mongoose.model("UserOtp", userOtpSchema);
module.exports = userOtp;
