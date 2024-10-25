import {
  deleteTeacher,
  getAllTeachers,
  getSingleTeacher,
  getTeacherLists,
  importTeachers,
  teacherRegister,
  updateTeacher,
} from "../controllers/teacherControllers";
import express from "express";
const router = express.Router();
const multer = require("multer");
const upload = multer({ dest: "uploads/" });
// Teacher routes
// create teacher
router.post("/teacher-register", teacherRegister);

// get all teachers
router.get("/get-all-teachers", getAllTeachers);

// update teacher
router.put("/update-teacher/:id", updateTeacher);

// delete teacher
router.delete("/delete-teacher/:id", deleteTeacher);

// get single teacher
router.get("/get-single-teacher/:id", getSingleTeacher);

// import teacher
router.post("/import-teacher", upload.single("file"), importTeachers);

// get teacher lists
router.get("/get-teacher-lists", getTeacherLists);



export default router;
