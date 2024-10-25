import {
  createEvent,
  deleteEvent,
  getAllEvents,
  getEventById,
  importEvents,
  updateEvent,
} from "../controllers/eventControllers";
import express from "express";
const router = express.Router();
const multer = require("multer");
const upload = multer({ dest: "uploads/" });

router.get("/get-all-events", getAllEvents);
router.get("/getEventById/:id", getEventById);
router.post("/create-event", createEvent);
router.put("/update-event/:id", updateEvent);

router.delete("/delete-event/:id", deleteEvent);

router.post("/import-events", upload.single("file"), importEvents);

export default router;
