const mongoose = require("mongoose");





const copySchema = new mongoose.Schema({
    barCode: { type: String, required: true, unique: true, trim: true },
    count: { type: Number, required: true, min: 1 },
  });
const bookSchema = new mongoose.Schema({
  date: { type: Date, required: true },
  accessionNumber: { type: Number, required: true, unique: true },
  isbnNo: { type: String, required: true, trim: true },
  sourceOfAcquisition: { type: String, required: true, trim: true },
  language: { type: String, required: true, trim: true },
  bookNumber: { type: Number, required: true, min: 1 },
  classNumber: { type: Number, required: true, min: 1 },
  personalAuthor: { type: String, trim: true },
  corporateAuthor: { type: String, trim: true },
  conferenceAuthor: { type: String, trim: true },
  title: { type: String, required: true, trim: true },
  statementOfResponsibility: { type: String, trim: true },
  editionStatement: { type: String, trim: true },
  publisherName: { type: String, required: true, trim: true },
  dateOfPublication: { type: Number, required: true, min: 1000, max: new Date().getFullYear() },
  physicalDescription: { type: String, trim: true },
  seriesTitle: { type: String, trim: true },
  seriesNo: { type: Number, min: 1 },
  notes: { type: String, trim: true },
  subjectAddedEntry: { type: String, trim: true },
  addedEntryPersonalName: { type: String, trim: true },
  source: { type: String, required: true, trim: true },
  noOfCopies: { type: Number, required: true, min: 1 },
  price: { type: Number, required: true, min: 0 },
  callNo: { type: String, required: true, trim: true },
  copies: [copySchema], 
}, { timestamps: true });

module.exports = mongoose.model("Catalogue", bookSchema);
