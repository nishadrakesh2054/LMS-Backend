const Student = require("../Models/Students");
const xlsx = require("xlsx");
const fs = require("fs");
const path = require("path");
// Fetch all students
const getAllStudents = async (req, res) => {
  try {
    const students = await Student.find();
    res.status(200).json(students);
  } catch (error) {
    res.status(500).json({ message: "Error fetching students", error });
  }
};

// Save a new student
const addStudent = async (req, res) => {
  try {
    const { name, rollNo, grade, age, email, phone } = req.body;

    // Validate required fields
    if (!name || !rollNo || !grade || !age || !email || !phone) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Check if a student with the same rollNo number already exists
    const existingStudent = await Student.findOne({ rollNo });
    if (existingStudent) {
      return res
        .status(400)
        .json({ message: "Student with this rollNo number already exists" });
    }

    // Create a new student
    const newStudent = new Student({
      name,
      grade,
      age,
      rollNo,
      email,
      phone,
    });

    // Save the student to the database
    await newStudent.save();
    res
      .status(201)
      .json({ message: "Student add successfully", student: newStudent });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error saving student", error: error.message });
  }
};

// Update student details
const updateStudent = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, rollNo, grade, age, email, phone } = req.body;

    const updatedStudent = await Student.findByIdAndUpdate(
      id,
      { name, rollNo, grade, age, email, phone },
      { new: true, runValidators: true }
    );

    if (!updatedStudent) {
      return res.status(404).json({ message: "Student not found" });
    }

    res
      .status(200)
      .json({
        message: "Student updated successfully",
        student: updatedStudent,
      });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error updating student", error: error.message });
  }
};

// Delete a student
const deleteStudent = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedStudent = await Student.findByIdAndDelete(id);

    if (!deletedStudent) {
      return res.status(404).json({ message: "Student not found" });
    }

    res
      .status(200)
      .json({
        message: "Student deleted successfully",
        student: deletedStudent,
      });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error deleting student", error: error.message });
  }
};

// excell file upload
const UploadExcelStudent = async (req, res) => {
  try {
    // Check if a file was uploaded
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    // Read the uploaded Excel file
    const workbook = xlsx.readFile(req.file.path);
    const sheetName = workbook.SheetNames[0]; // Get the first sheet
    const worksheet = workbook.Sheets[sheetName];

    // Convert Excel sheet to JSON
    const jsonData = xlsx.utils.sheet_to_json(worksheet);

    // Validate and save each student to the database
    const savedStudents = [];
    const errors = [];

    for (const row of jsonData) {
      const { name, phone, email, roll, grade, age, rollNo } = row;

      // Validate required fields
      if (!name || !phone || !email || !rollNo || !grade || !age) {
        errors.push({ row, error: "Missing required fields" });
        console.warn("Skipping invalid row:", row);
        continue;
      }

      // Check if a student with the same roll number already exists
      const existingStudent = await Student.findOne({ rollNo });
      if (existingStudent) {
        errors.push({
          row,
          error: "Student with this roll number already exists",
        });
        console.warn("Skipping duplicate row:", row);
        continue;
      }

      // Create a new student instance
      const newStudent = new Student({
        name,
        phone,
        email,
        rollNo,
        grade,
        age,
      });

      // Save the student to the database
      await newStudent.save();
      savedStudents.push(newStudent);
    }

    // Respond with success and any errors encountered
    res.status(201).json({
      message: "Students saved successfully",
      savedStudents,
      errors,
    });
  } catch (error) {
    console.error("Error processing Excel file:", error);
    res
      .status(500)
      .json({ message: "Error processing Excel file", error: error.message });
  }
};

// Export all students to Excel
const exportStudentsToExcel = async (req, res) => {
  try {
    const students = await Student.find();

    if (students.length === 0) {
      return res.status(404).json({ message: "No students found" });
    }

    // Convert data to an array of objects
    const studentData = students.map((student) => ({
      Name: student.name,
      Phone: student.phone,
      Email: student.email,
      RollNo: student.rollNo,
      Grade: student.grade,
      Age: student.age,
    }));

    // Create a new workbook and worksheet
    const workbook = xlsx.utils.book_new();
    const worksheet = xlsx.utils.json_to_sheet(studentData);
    xlsx.utils.book_append_sheet(workbook, worksheet, "Students");

    // Define file path
    const filePath = path.join(__dirname, "../exports/students.xlsx");

    // Ensure the exports folder exists
    if (!fs.existsSync(path.join(__dirname, "../exports"))) {
      fs.mkdirSync(path.join(__dirname, "../exports"));
    }

    // Write the Excel file
    xlsx.writeFile(workbook, filePath);

    // Send the file as response
    res.download(filePath, "students.xlsx", (err) => {
      if (err) {
        console.error("Error downloading file:", err);
        res.status(500).json({ message: "Error downloading file" });
      }
    });
  } catch (error) {
    console.error("Error exporting students:", error);
    res
      .status(500)
      .json({ message: "Error exporting students", error: error.message });
  }
};

module.exports = {
  getAllStudents,
  addStudent,
  UploadExcelStudent,
  deleteStudent,
  updateStudent,
  exportStudentsToExcel,
};
