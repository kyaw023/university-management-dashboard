import { getTeacherClasses } from "../controllers/userTeacherControllers";
import express from "express";

const router = express.Router();

router.get("/classes/:id", getTeacherClasses);

export default router;
