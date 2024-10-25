import express from "express";
import {
  adminLogin,
  adminLogout,
  checkSession,
  getCurrentAdmin,
  updateCurrentAdmin,
} from "../controllers/adminAuthController";
import authMiddleware from "../middleware/authMiddleware";
import adminMiddleware from "../middleware/adminMiddleware";

const router = express.Router();

router.post("/login", adminLogin);
router.get("/check-session", authMiddleware, checkSession);
router.post("/logout", authMiddleware, adminMiddleware, adminLogout);
router.get("/me", authMiddleware, adminMiddleware, getCurrentAdmin);
router.put(
  "/update-profile/:id",
  authMiddleware,
  adminMiddleware,
  updateCurrentAdmin
);

export default router;
