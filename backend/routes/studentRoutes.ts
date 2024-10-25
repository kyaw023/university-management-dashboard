import {
  deleteStudent,
  getAllStudents,
  getSingleStudent,
  importStudents,
  studentRegister,
  updateStudent,
} from "../controllers/studentControllers";
import express from "express";
const router = express.Router();
const multer = require("multer");
const upload = multer({ dest: "uploads/" });

// Student routes

// create student
router.post("/student-register", studentRegister);
// get all students
router.get("/get-all-students", getAllStudents);

// get single student
router.get("/get-single-student/:id", getSingleStudent);

// update student
router.put("/update-student/:id", updateStudent);

// delete student
router.delete("/delete-student/:id", deleteStudent);

// import csv students
router.post("/import-students", upload.single("file"), importStudents);

export default router;
