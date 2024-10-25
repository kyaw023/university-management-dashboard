import express from "express";
import {
  createExam,
  getExams,
  getExamById,
  updateExam,
  deleteExam,
  importExams,
} from "../controllers/examController";
const multer = require("multer");
const upload = multer({ dest: "uploads/" });

const router = express.Router();

// Route to create a new exam
router.post("/create-exam", createExam);

// Route to get all exams
router.get("/get-all-exams", getExams);

// Route to get a single exam by ID
router.get("/single-exam/:id", getExamById);

// Route to update an exam by ID
router.put("/update-exam/:id", updateExam);

// Route to delete an exam by ID
router.delete("/delete-exam/:id", deleteExam);

router.post("/import-exam", upload.single("file"), importExams);

export default router;
