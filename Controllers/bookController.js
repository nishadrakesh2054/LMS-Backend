const Book = require("../Models/bookModel");
const Joi = require("joi");

const bookValidationSchema = Joi.object({
  date: Joi.date().required(),
  accessionNumber: Joi.number().required(),
  isbnNo: Joi.string().trim().required(),
  sourceOfAcquisition: Joi.string().trim().required(),
  language: Joi.string().trim().required(),
  bookNumber: Joi.number().min(1).required(),
  classNumber: Joi.number().min(1).required(),
  personalAuthor: Joi.string().trim().allow(""),
  corporateAuthor: Joi.string().trim().allow(""),
  conferenceAuthor: Joi.string().trim().allow(""),
  title: Joi.string().trim().required(),
  statementOfResponsibility: Joi.string().trim().allow(""),
  editionStatement: Joi.string().trim().allow(""),
  publisherName: Joi.string().trim().required(),
  dateOfPublication: Joi.number()
    .min(1000)
    .max(new Date().getFullYear())
    .required(),
  physicalDescription: Joi.string().trim().allow(""),
  seriesTitle: Joi.string().trim().allow(""),
  seriesNo: Joi.number().min(1).allow(""),
  notes: Joi.string().trim().allow(""),
  subjectAddedEntry: Joi.string().trim().allow(""),
  addedEntryPersonalName: Joi.string().trim().allow(""),
  source: Joi.string().trim().required(),
  noOfCopies: Joi.number().min(1).required(),
  price: Joi.number().min(0).required(),
  callNo: Joi.string().trim().required(),
  barCode: Joi.string().trim().required(),
});

const sendResponse = (res, status, message, data = null) => {
  res.status(status).json({
    status,
    message,
    data,
  });
};

// Validation Handler
const validateBook = (bookData) => {
  const { error } = bookValidationSchema.validate(bookData);
  if (error) {
    throw new Error(error.details[0].message);
  }
};

// Create a new book
const createBook = async (req, res) => {
  try {
    validateBook(req.body);
    const newBook = new Book(req.body);

    await newBook.save();
    sendResponse(res, 201, "Book created successfully", newBook);
  } catch (error) {
    sendResponse(res, 400, error.message);
  }
};

// Get all books
const getAllBooks = async (req, res) => {
  try {
    const books = await Book.find();
    sendResponse(res, 200, "Books retrieved successfully", {
      Total_Books: books.length,
      books,
    });
  } catch (error) {
    sendResponse(res, 500, "Error fetching books", null);
  }
};

// Get a single book by ID
const getBookById = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) return sendResponse(res, 404, "Book not found");
    // const totalCopies = book.copies.reduce((acc, copy) => acc + copy.count, 0);

    sendResponse(res, 200, "Book retrieved successfully", { book });
  } catch (error) {
    sendResponse(res, 500, "Error fetching book", null);
  }
};

// Update a book by ID
const updateBook = async (req, res) => {
  try {
    validateBook(req.body);
    const updatedBook = await Book.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    // const { copies, ...bookData } = req.body;
    // const updatedBook = await Book.findByIdAndUpdate(
    //   req.params.id,
    //   {
    //     ...bookData,
    //     copies: copies.map((copy) => ({
    //       barCode: copy.barCode,
    //       count: copy.count,
    //     })),
    //   },
    //   { new: true, runValidators: true }
    // );
    if (!updatedBook) return sendResponse(res, 404, "Book not found");
    sendResponse(res, 200, "Book updated successfully", updatedBook);
  } catch (error) {
    sendResponse(res, 400, error.message);
  }
};

// Delete a book by ID
const deleteBook = async (req, res) => {
  try {
    const deletedBook = await Book.findByIdAndDelete(req.params.id);
    if (!deletedBook) return sendResponse(res, 404, "Book not found");
    sendResponse(res, 200, "Book deleted successfully");
  } catch (error) {
    sendResponse(res, 500, "Error deleting book", null);
  }
};

module.exports = {
  getAllBooks,
  createBook,
  getBookById,
  updateBook,
  deleteBook,
};
