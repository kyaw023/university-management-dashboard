import {
  createLibraryResource,
  deleteLibraryResource,
  getAllLibraryResources,
  getSingleLibraryResource,
  importLibrary,
  updateLibraryResource,
} from "../controllers/libraryController";
import express from "express";
const router = express.Router();

const multer = require("multer");
const upload = multer({ dest: "uploads/" });

// Student routes

// create library
router.post("/library-register", createLibraryResource);

// get all library
router.get("/get-all-library", getAllLibraryResources);

// get single student
router.get("/get-single-library/:id", getSingleLibraryResource);

// update student
router.put("/update-library/:id", updateLibraryResource);

// delete student
router.delete("/delete-library/:id", deleteLibraryResource);

// import csv students
router.post("/import-library", upload.single("file"), importLibrary);

export default router;
