const mongoose = require("mongoose");

const bookTransactionSchema = new mongoose.Schema({
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Student",
    required: true,
  },
  book: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Catalogue",
    required: true,
  },
  issueDate: {
    type: Date,
    default: Date.now,
  },
  dueDate: {
    type: Date,
    required: true,
  },
  returnDate: {
    type: Date,
  },
  isReturned: {
    type: Boolean,
    default: false,
  },
  lateFee: {
    type: Number,
    default: 0,
  },
});

module.exports = mongoose.model("BookTransaction", bookTransactionSchema);
