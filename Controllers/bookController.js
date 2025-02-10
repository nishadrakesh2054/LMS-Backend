const Book = require("../Models/bookModel");
const xlsx = require("xlsx");
const fs = require("fs");
const path = require("path");
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
  placeOfPublication:Joi.string().trim().allow(""),
  corporateAuthor: Joi.string().trim().allow(""),
  conferenceAuthor: Joi.string().trim().allow(""),
  title: Joi.string().trim().required(),
  statementOfResponsibility: Joi.string().trim().allow(""),
  editionStatement: Joi.string().trim().allow(""),
  publisherName: Joi.string().trim().required(),
  dateOfPublication:Joi.date().required(),
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
  barCodes: Joi.array().items(Joi.string().trim()).min(1).required()});

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



// create books 
const createBook = async (req, res) => {
    try {
      let { noOfCopies, barCodes } = req.body;
  
      // Ensure barCodes is an array
      if (!Array.isArray(barCodes)) {
        return sendResponse(res, 400, "barCodes should be an array.");
      }
  
      // Validate number of copies and barcode length
      if (barCodes.length > noOfCopies) {
        return sendResponse(
          res,
          400,
          "Number of barcodes cannot be more than the number of copies."
        );
      }
  
      // If only one barcode is provided but multiple copies exist, generate the rest
      if (barCodes.length === 1 && noOfCopies > 1) {
        let baseBarcode = parseInt(barCodes[0]); 
        for (let i = 1; i < noOfCopies; i++) {
          barCodes.push((baseBarcode + i).toString().padStart(8, "0")); 
        }
      }
  
      // Ensure barcodes count matches copies
      if (barCodes.length !== noOfCopies) {
        return sendResponse(
          res,
          400,
          "Mismatch between number of copies and barcodes."
        );
      }
  
      req.body.barCodes = barCodes; // Assign updated barcodes list
  
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
  
      // Format barCodes as comma-separated strings
      const formattedBooks = books.map(book => {
        return {
          ...book.toObject(),
          barCodes: book.barCodes.join(", "),  // Convert array to a comma-separated string
        };
      });
  
      sendResponse(res, 200, "Books retrieved successfully", {
        Total_Books: books.length,
        books: formattedBooks,
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

    sendResponse(res, 200, "Book retrieved successfully", { book });
  } catch (error) {
    sendResponse(res, 500, "Error fetching book", null);
  }
};


const updateBook = async (req, res) => {
    try {
        // Exclude _id from validation
        const { _id,_v, ...bookData } = req.body;

       // Validate the remaining book data
        validateBook(bookData);

        let { noOfCopies, barCodes } = bookData;

        if (!Array.isArray(barCodes)) {
            return sendResponse(res, 400, "barCodes should be an array.");
        }

        if (barCodes.length === 1 && noOfCopies > 1) {
            let baseBarcode = parseInt(barCodes[0]);
            let generatedBarcodes = [barCodes[0]];

            for (let i = 1; i < noOfCopies; i++) {
                generatedBarcodes.push((baseBarcode + i).toString().padStart(8, "0"));
            }
            barCodes = generatedBarcodes;
        }

        if (barCodes.length !== noOfCopies) {
            return sendResponse(res, 400, "Mismatch between copies and barcodes.");
        }

        bookData.barCodes = barCodes; // Assign updated barcodes

        // Update the book document
        const updatedBook = await Book.findByIdAndUpdate(req.params.id, bookData, {
            new: true,
            runValidators: true,
        });

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



// excell file upload
// const UploadExcelBook = async (req, res) => {
//   try {
//     // Check if a file was uploaded
//     if (!req.file) {
//       return res.status(400).json({ message: "No file uploaded" });
//     }

//     // Read the uploaded Excel file
//     const workbook = xlsx.readFile(req.file.path);
//     const sheetName = workbook.SheetNames[0]; // Get the first sheet
//     const worksheet = workbook.Sheets[sheetName];

//     // Convert Excel sheet to JSON
//     const jsonData = xlsx.utils.sheet_to_json(worksheet);

//     // Validate and save each student to the database
//     const savedStudents = [];
//     const errors = [];

//     for (const row of jsonData) {
//       const { name, phone, email, roll, grade, age, rollNo } = row;

//       // Validate required fields
//       if (!name || !phone || !email || !rollNo || !grade || !age) {
//         errors.push({ row, error: "Missing required fields" });
//         console.warn("Skipping invalid row:", row);
//         continue;
//       }

//       // Check if a student with the same roll number already exists
//       const existingStudent = await Student.findOne({ rollNo });
//       if (existingStudent) {
//         errors.push({
//           row,
//           error: "Student with this roll number already exists",
//         });
//         console.warn("Skipping duplicate row:", row);
//         continue;
//       }

//       // Create a new student instance
//       const newStudent = new Student({
//         name,
//         phone,
//         email,
//         rollNo,
//         grade,
//         age,
//       });

//       // Save the student to the database
//       await newStudent.save();
//       savedStudents.push(newStudent);
//     }

//     // Respond with success and any errors encountered
//     res.status(201).json({
//       message: "Students saved successfully",
//       savedStudents,
//       errors,
//     });
//   } catch (error) {
//     console.error("Error processing Excel file:", error);
//     res
//       .status(500)
//       .json({ message: "Error processing Excel file", error: error.message });
//   }
// };

// Export all students to Excel
// const exportBooksToExcel = async (req, res) => {
//   try {
//     const students = await Student.find();

//     if (students.length === 0) {
//       return res.status(404).json({ message: "No students found" });
//     }

//     // Convert data to an array of objects
//     const studentData = students.map((student) => ({
//       Name: student.name,
//       Phone: student.phone,
//       Email: student.email,
//       RollNo: student.rollNo,
//       Grade: student.grade,
//       Age: student.age,
//     }));

//     // Create a new workbook and worksheet
//     const workbook = xlsx.utils.book_new();
//     const worksheet = xlsx.utils.json_to_sheet(studentData);
//     xlsx.utils.book_append_sheet(workbook, worksheet, "Students");

//     // Define file path
//     const filePath = path.join(__dirname, "../exports/students.xlsx");

//     // Ensure the exports folder exists
//     if (!fs.existsSync(path.join(__dirname, "../exports"))) {
//       fs.mkdirSync(path.join(__dirname, "../exports"));
//     }

//     // Write the Excel file
//     xlsx.writeFile(workbook, filePath);

//     // Send the file as response
//     res.download(filePath, "students.xlsx", (err) => {
//       if (err) {
//         console.error("Error downloading file:", err);
//         res.status(500).json({ message: "Error downloading file" });
//       }
//     });
//   } catch (error) {
//     console.error("Error exporting students:", error);
//     res
//       .status(500)
//       .json({ message: "Error exporting students", error: error.message });
//   }
// };



module.exports = {
  getAllBooks,
  createBook,
  getBookById,
  updateBook,
  deleteBook,
//   UploadExcelBook,
//   exportBooksToExcel
};
