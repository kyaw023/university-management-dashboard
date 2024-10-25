import {
  deleteSubject,
  getAllSubjects,
  getSingleSubject,
  getSubjectLists,
  importSubject,
  subjectsRegister,
  updateSubject,
} from "../controllers/subjectControllers";
import express from "express";
const router = express.Router();
const multer = require("multer");
const upload = multer({ dest: "uploads/" });

router.post("/subject-register", subjectsRegister);

// get all subjects
router.get("/get-all-subjects", getAllSubjects);

// get single subject
router.get("/get-single-subject/:id", getSingleSubject);

// update subject
router.put("/update-subject/:id", updateSubject);

// delete subject
router.delete("/delete-subject/:id", deleteSubject);

// import subject
router.post("/import-subject", upload.single("file"), importSubject);

router.get("/get-subject-lists", getSubjectLists);

export default router;
