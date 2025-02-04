const mongoose = require("mongoose");

const pdfSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "enter title"],
    },

    filePath: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const pdfModel = mongoose.model("pdf", pdfSchema);
module.exports = pdfModel;
