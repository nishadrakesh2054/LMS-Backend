const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  phone: { type: Number, required: true },
  email: { type: String, required: true },
  rollNo: { type: String, required: true, unique: true },
  grade: { type: String, required: true },
  age: { type: Number, required: true },
});

module.exports = mongoose.model("Student", studentSchema);
