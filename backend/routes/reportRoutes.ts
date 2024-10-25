import express from "express";
import {
  getClassCapacity,
  getStudentPerformance,
  getTeacherWorkload,
} from "../controllers/reportControllers";

const router = express.Router();

router.get("/student-performance", getStudentPerformance);

router.get("/teacher-workload", getTeacherWorkload);

router.get("/class-capacity", getClassCapacity);

export default router;
