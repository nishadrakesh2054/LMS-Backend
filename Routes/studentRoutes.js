const express = require("express");
const router = express.Router();
const studentController = require("../Controllers/studentController");
const { excelUpload } = require("../multerconfig/Storageconfig");
// const { verifyToken, checkRole } = require('../middleware/AuthMiddleware');

// Fetch all students
router.get("/students", studentController.getAllStudents);

// Save a new student
router.post("/students", studentController.addStudent);

// router.post('/create-student', verifyToken, checkRole(['admin', 'staff', 'hr', 'counselor']), createStudent);



// edit student
router.put("/students/:id", studentController.updateStudent);

// delete student
router.delete("/students/:id", studentController.deleteStudent);

// import  and save students from Excel
router.post(
  "/students/import",
  excelUpload.single("file"),
  studentController.UploadExcelStudent
);

// export  and save students from Excel
router.get("/students/export",studentController.exportStudentsToExcel
);

module.exports = router;
