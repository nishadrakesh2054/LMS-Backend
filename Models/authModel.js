const mongoose = require("mongoose");
const validator = require("validator");

const authSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Enter your name"],
  },
  email: {
    type: String,
    required: [true, "Enter your email"],
    unique: true,
    validate: [validator.isEmail, "enter valid email"],
  },
  password: {
    type: String,
    required: [true, "Enter your password"],
  },
  roles: {
    type: [String], 
    enum: ["admin", "teacher", "student", "librarian", "HR", "counselor"],
    default: ["admin"],
  },
});

const authentications = mongoose.model("auth", authSchema);
module.exports = authentications;
