import express from "express";
import { login } from "../controllers/authControllers";
import {
  checkSession,
  teacherLogin,
} from "../controllers/teacherAuthControllers";

import TeacherAuthMiddleware from "../middleware/teacherAuthMiddleware";

const router = express.Router();

router.post("/login", login);

router.post("/teacher-login", teacherLogin);
router.get("/check-session", TeacherAuthMiddleware, checkSession);

export default router;
