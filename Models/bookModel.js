const mongoose = require("mongoose");

const bookSchema = new mongoose.Schema(
  {
    date: { type: Date },
    title: { type: String, required: true, trim: true },
    accessionNumber: { type: Number, required: true, unique: true },
    isbnNo: { type: String, required: true, trim: true },
    sourceOfAcquisition: { type: String, required: true, trim: true },
    language: { type: String, required: true, trim: true },
    bookNumber: { type: Number, required: true, min: 1 },
    classNumber: { type: Number, required: true, min: 1 },
    personalAuthor: { type: String, trim: true },
    corporateAuthor: { type: String, trim: true },
    conferenceAuthor: { type: String, trim: true },
    statementOfResponsibility: { type: String, trim: true },
    editionStatement: { type: String, trim: true },
    publisherName: { type: String, required: true, trim: true },
    dateOfPublication: {
      type: Date,

    },
    physicalDescription: { type: String, trim: true },
    subjectAddedEntry: { type: String, trim: true },
    addedEntryPersonalName: { type: String, trim: true },
    notes: { type: String, trim: true },
    price: { type: Number, required: true, min: 0 },
    source: { type: String, required: true, trim: true },
    seriesTitle: { type: String, trim: true },
    seriesNo: { type: Number, min: 1 },
    barCodes: {
      type: [String], // Store multiple barcodes
      required: true,
      umique: true,
      validate: {
        validator: function (v) {
          return v.length > 0;
        },
        message: "At least one barcode is required.",
      },
    },
    callNo: { type: String, required: true, trim: true },
    noOfCopies: { type: Number, required: true, min: 1 },
  },
 
);

module.exports = mongoose.model("Catalogue", bookSchema);
