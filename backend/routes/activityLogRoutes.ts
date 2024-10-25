import { Router } from "express";
import { getActivityLogs } from "../controllers/activityLogControllers"; // Adjust the import path as needed

const router = Router();

router.get("/", getActivityLogs);


export default router;

