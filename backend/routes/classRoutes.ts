import {
  classesRegister,
  deleteClass,
  getAllClasses,
  getSingleClass,
  importClass,
  updateClass,
  getClassLists,
} from "../controllers/classControllers";
import express from "express";
const router = express.Router();
const multer = require("multer");
const upload = multer({ dest: "uploads/" });

// create class
router.post("/class-register", classesRegister);

// get all classes
router.get("/get-all-classes", getAllClasses);

// get single class
router.get("/get-single-class/:id", getSingleClass);

// update class
router.put("/update-class/:id", updateClass);

// delete class
router.delete("/delete-class/:id", deleteClass);

// import class
router.post("/import-class", upload.single("file"), importClass);

router.get("/get-class-lists", getClassLists);

export default router;
